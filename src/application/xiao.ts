import { Type, Interceptor } from "@typings/index";
import { XiaoContainer } from "@containers/xiao.container";
import { InterceptorsConsumer } from "@consumers/interceptors.consumer";
import { iterate } from "iterare";
import { isFunction, isNativeEvent } from "@utils/shared.utils";
import { Controller } from "@typings/controller.interface";
import { EventRegisterService } from "@services/event-register.service";
import { MetadataScanner } from "@application/metadata-scanner";
import { InjectionToken } from "tsyringe";
import { GUARDS_METADATA, EVENT_NET_METADATA, EVENT_METADATA, REGISTER_COMMANDS_METADATA, TICKS_METADATA, PIPES_METADATA } from "@decorators/constants";
import { ExecutionContext } from "@context/execution-context";
import { IRegisterCommandMetadata } from "@interfaces/decorators/register-command.interface";
import { GuardsConsumer } from "@consumers/guards.consumer";
import { PipesConsumer } from "@consumers/pipes.consumer";

export class XiaoApplication {

	private static instance: XiaoApplication;

	private constructor() {
	}

	public static create(bootstrap: Type): Promise<XiaoApplication> {
		if (!XiaoApplication.instance) {
			XiaoApplication.instance = new XiaoApplication();
		}

		return Promise.resolve(XiaoApplication.instance)
	}

	async intercept(interceptor: Interceptor): Promise<void> {
		XiaoContainer.interceptors.add(interceptor)
		return Promise.resolve();
	}

	async start(): Promise<void> {
		InterceptorsConsumer.generate();

		for (const controllerToken of iterate(XiaoContainer.controllers)) {
			const controller = XiaoContainer.container.resolve(controllerToken);

			if (isFunction(controller)) {
				await controller.beforeControllerInit();
			}

			await this.generateController(controller);
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

			const processEvent = async (eventName: string, ...args: any[]) => {
				if (!isNativeEvent(eventName) && InterceptorsConsumer.interceptIn) {
					args = await InterceptorsConsumer.interceptIn(...args);
				}

				let executionContext = new ExecutionContext(
					[eventName, source || -1, ...args],
					controller,
					controller[methodName as keyof Controller]
				)

				if(guardsMetadata && !(await guardFn(executionContext))) {
					return;
				}

				if(pipesMetadata) {
					executionContext = await pipeFn(executionContext);
				}

				await controller[methodName as keyof Controller](...executionContext.getArgs());
			}

			const netEventsMetadata = MetadataScanner.getMethodMetadata<string[]>(EVENT_NET_METADATA, controller, methodName);
			netEventsMetadata?.forEach(event => eventRegisterService.onNet(event, async (...args: any[]) => processEvent(event, args)));

			const eventsMetadata = MetadataScanner.getMethodMetadata<string[]>(EVENT_METADATA, controller, methodName);
			eventsMetadata?.forEach((event) => eventRegisterService.on(event, async (...args: any[]) => processEvent(event, args)));

			const commandsMetadata = MetadataScanner.getMethodMetadata<IRegisterCommandMetadata[]>(REGISTER_COMMANDS_METADATA, controller, methodName);
			commandsMetadata?.forEach(command => {
				RegisterCommand(command.commandName, async (source: number, ...args: any[]) => {

					let executionContext = new ExecutionContext(
						[command.commandName, source || -1, ...args],
						controller,
						controller[methodName as keyof Controller]
					);

					if(guardsMetadata && !(await guardFn(executionContext))) {
						return;
					}

					if(pipesMetadata) {
						executionContext = await pipeFn(executionContext);
					}

					await controller[methodName as keyof Controller](...executionContext.getArgs());
				}, command.restricted ?? false);
			});

			const ticksMetadata = MetadataScanner.getMethodMetadata<string[]>(TICKS_METADATA, controller, methodName);
			if (ticksMetadata) {
				setTick(controller[methodName as keyof Controller].bind(controller));
			}
		}
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