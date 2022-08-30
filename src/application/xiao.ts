import { MetadataScanner } from "@application/metadata-scanner";
import { XiaoContainer } from "@containers/xiao.container";
import { GuardsConsumer } from "@consumers/guards.consumer";
import { InterceptorsConsumer } from "@consumers/interceptors.consumer";
import { PipesConsumer } from "@consumers/pipes.consumer";
import { EventRegisterService } from "@services/event-register.service";
import { ExecutionContext } from "@context/execution-context";
import { IRegisterCommandMetadata } from "@interfaces/decorators/register-command.interface";
import { Controller, Type, Interceptor } from "@typings";
import {
	GUARDS_METADATA,
	EVENT_NET_METADATA,
	EVENT_METADATA,
	REGISTER_COMMANDS_METADATA,
	TICKS_METADATA,
	PIPES_METADATA
} from "@decorators/constants";
import { isFunction, isNativeEvent } from "@utils/shared.utils";
import { iterate } from "iterare";
import { InjectionToken } from "tsyringe";

export class XiaoApplication {

	private static instance: XiaoApplication;

	public static create(_bootstrap: Type): Promise<XiaoApplication> {
		if (!XiaoApplication.instance) {
			XiaoApplication.instance = new XiaoApplication();
		}

		return Promise.resolve(XiaoApplication.instance);
	}

	async intercept(interceptor: Interceptor): Promise<void> {
		XiaoContainer.interceptors.add(interceptor);
		return Promise.resolve();
	}

	async start(): Promise<void> {
		InterceptorsConsumer.generate();

		for (const controllerToken of iterate(XiaoContainer.controllers)) {
			const controller = XiaoContainer.container.resolve<Controller>(controllerToken);

			console.log(`[Xiao] Registering controller ${controller.constructor.name}`);

			if (isFunction(controller.beforeControllerInit)) {
				await controller.beforeControllerInit();
			}

			await this.generateController(controller);

			if (isFunction(controller.afterControllerInit)) {
				await controller.afterControllerInit();
			}

			if (isFunction(controller.onApplicationBootstrap)) {
				await controller.onApplicationBootstrap();
			}
		}
	}

	private async generateController(controller: Controller) {
		const eventRegisterService = XiaoContainer.container.resolve(EventRegisterService);

		for (const methodName of MetadataScanner.getMethodNames(controller)) {

			const classMetadata = MetadataScanner.getClassMetadata<InjectionToken[]>(GUARDS_METADATA, controller) || [];

			const guardsMetadata = MetadataScanner.getMethodMetadata<InjectionToken[]>(GUARDS_METADATA, controller, methodName) || [];
			const guardFn = GuardsConsumer.guardsFn([...classMetadata, ...guardsMetadata]);

			const pipesMetadata = MetadataScanner.getMethodMetadata<Map<number, InjectionToken[]>>(PIPES_METADATA, controller, methodName);
			const pipeFn = PipesConsumer.pipesFn(pipesMetadata);

			const processEvent = async (eventName: string, ...args: unknown[]) => {
				if (!isNativeEvent(eventName) && InterceptorsConsumer.interceptIn) {
					args = await InterceptorsConsumer.interceptIn(...args);
				}

				let executionContext = new ExecutionContext(
					[eventName, source || -1, ...args],
					controller,
					controller[methodName as keyof Controller]
				);

				executionContext = await this.prepareExecutionContext(executionContext, guardFn, pipeFn);

				controller[methodName as keyof Controller](...executionContext.getArgs());
			};

			const eventsMetadata = MetadataScanner.getMethodMetadata<string[]>(EVENT_METADATA, controller, methodName);
			eventsMetadata?.forEach((event) => eventRegisterService.on(event, async (...args: never[]) => processEvent(event, args)));

			const netEventsMetadata = MetadataScanner.getMethodMetadata<string[]>(EVENT_NET_METADATA, controller, methodName);
			netEventsMetadata?.forEach(event => eventRegisterService.onNet(event, async (...args: never[]) => processEvent(event, args)));

			const registerCommandsMetadata = MetadataScanner.getMethodMetadata<IRegisterCommandMetadata[]>(REGISTER_COMMANDS_METADATA, controller, methodName);
			if (registerCommandsMetadata) {
				for (const registerCommandMetadata of registerCommandsMetadata) {
					console.log(`[Xiao] Registering command ${registerCommandMetadata.commandName}`);
					RegisterCommand(
						registerCommandMetadata.commandName,
						async (source: number, ...args: any[]) => {
							let executionContext = new ExecutionContext(
								[registerCommandMetadata.commandName, source || -1, ...args],
								controller,
								controller[methodName]
							);

							if (guardsMetadata && !(await guardFn(executionContext))) {
								return;
							}

							if (pipesMetadata) {
								executionContext = await pipeFn(executionContext);
							}

							controller[methodName](...executionContext.getArgs());
						},
						registerCommandMetadata.restricted
					);
				}
			}

			const ticksMetadata = MetadataScanner.getMethodMetadata<string[]>(TICKS_METADATA, controller, methodName);
			if (ticksMetadata) {
				setTick(controller[methodName as keyof Controller].bind(controller));
			}
		}
	}

	private async prepareExecutionContext(
		context: ExecutionContext,
		guardFn: (executionContext: ExecutionContext) => Promise<boolean>,
		pipeFn: (executionContext: ExecutionContext) => Promise<ExecutionContext>
	) {
		if (guardFn && !(await guardFn(context))) {
			return;
		}

		if (pipeFn) {
			context = await pipeFn(context);
		}

		return context;
	}

	static hasInterceptIn(): boolean {
		return !!InterceptorsConsumer.interceptIn;
	}

	static hasInterceptOut(): boolean {
		return !!InterceptorsConsumer.interceptOut;
	}

	static hasInterceptors(): boolean {
		return XiaoApplication.hasInterceptIn() || XiaoApplication.hasInterceptOut();
	}
}