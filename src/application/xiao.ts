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
import { logger } from "@utils/logger";
import { isFunction, isNativeEvent } from "@utils/shared.utils";
import { iterate } from "iterare";
import { InjectionToken } from "tsyringe";

export class XiaoApplication {
	private static instance: XiaoApplication;

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	/**
	 * Create an instance of XiaoApplication
	 *
	 * @returns {XiaoApplication}
	 */
	public static create(_bootstrap: Type): Promise<XiaoApplication> {

		logger.info(`Creating XiaoApplication...`);

		if (!XiaoApplication.instance) {
			logger.info(`Creating XiaoApplication instance...`);
			XiaoApplication.instance = new XiaoApplication();
		}

		logger.info(`Returning XiaoApplication instance...`, XiaoApplication.instance);

		return Promise.resolve(XiaoApplication.instance);
	}

	/**
	 * Add a global interceptor to the application
	 *
	 * @param interceptor An interceptor to be added to the application
	 * @returns void
	 */
	async intercept(interceptor: Interceptor): Promise<void> {
		XiaoContainer.interceptors.add(interceptor);

		return Promise.resolve();
	}

	async start(): Promise<void> {
		InterceptorsConsumer.generate();

		logger.info(`Registering controllers...`, JSON.stringify(XiaoContainer.controllers));

		for (const controllerToken of iterate(XiaoContainer.controllers)) {
			const controller = XiaoContainer.container.resolve(controllerToken);

			logger.info(`Registering controller: ${controller.constructor.name}`);

			if (isFunction(controller.beforeControllerInit)) {
				await controller.beforeControllerInit();
			}

			await this.generateController(controller);

			if (isFunction(controller.afterControllerInit)) {
				await controller.afterControllerInit();
			}
		}

		for (const controllerToken of iterate(XiaoContainer.controllers)) {
			const controller =
				XiaoContainer.container.resolve(controllerToken);
			if (isFunction(controller.onApplicationBootstrap)) {
				controller.onApplicationBootstrap();
			}
		}
	}

	private async generateController(controller: Controller) {
		const eventRegistrar =
			XiaoContainer.container.resolve(EventRegisterService);

		for (const methodName of MetadataScanner.getMethodNames(controller)) {
			const classMetadata = MetadataScanner.getClassMetadata<InjectionToken[]>(
				GUARDS_METADATA,
				controller
			);
			const guardsMetadata = MetadataScanner.getMethodMetadata<InjectionToken[]>(GUARDS_METADATA, controller, methodName);
			const guardFn = GuardsConsumer.guardsFn([
				...(classMetadata || []),
				...(guardsMetadata || []),
			]);

			const pipesMetada = MetadataScanner.getMethodMetadata<Map<number, InjectionToken[]>>(PIPES_METADATA, controller, methodName);
			const pipeFn = PipesConsumer.pipesFn(pipesMetada);

			const netEventsMetadata = MetadataScanner.getMethodMetadata<string[]>(
				EVENT_NET_METADATA,
				controller,
				methodName
			);
			if (netEventsMetadata) {
				for (const eventName of netEventsMetadata) {
					eventRegistrar.onNet(eventName, async (...args: any[]) => {
						if (!isNativeEvent(eventName) && InterceptorsConsumer.interceptIn) {
							args = await InterceptorsConsumer.interceptIn(...args);
						}

						let executionContext = new ExecutionContext(
							[eventName, source || -1, ...args],
							controller,
							controller[methodName]
						);

						if (guardsMetadata && !(await guardFn(executionContext))) {
							return;
						}

						if (pipesMetada) {
							executionContext = await pipeFn(executionContext);
						}

						await controller[methodName](...executionContext.getArgs());
					});
				}
			}

			const eventNames = MetadataScanner.getMethodMetadata<string[]>(
				EVENT_METADATA,
				controller,
				methodName
			);
			if (eventNames) {
				for (const eventName of eventNames) {
					eventRegistrar.on(eventName, async (...args: any[]) => {
						if (!isNativeEvent(eventName) && InterceptorsConsumer.interceptIn) {
							args = await InterceptorsConsumer.interceptIn(...args);
						}

						let executionContext = new ExecutionContext(
							[eventName, source || -1, ...args],
							controller,
							controller[methodName]
						);

						if (guardsMetadata && !(await guardFn(executionContext))) {
							return;
						}

						if (pipesMetada) {
							executionContext = await pipeFn(executionContext);
						}

						await controller[methodName](...executionContext.getArgs());
					});
				}
			}

			const registerCommandsMetadata = MetadataScanner.getMethodMetadata<IRegisterCommandMetadata[]>(REGISTER_COMMANDS_METADATA, controller, methodName);
			if (registerCommandsMetadata) {
				for (const registerCommandMetadata of registerCommandsMetadata) {
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

							if (pipesMetada) {
								executionContext = await pipeFn(executionContext);
							}

							controller[methodName](...executionContext.getArgs());
						},
						registerCommandMetadata.restricted
					);
				}
			}

			const ticksMetadata = MetadataScanner.getMethodMetadata<string[]>(
				TICKS_METADATA,
				controller,
				methodName
			);
			if (ticksMetadata) {
				setTick(controller[methodName].bind(controller));
			}
		}
	}

	static hasInterceptIn(): boolean {
		return !!InterceptorsConsumer.interceptIn;
	}

	static hasInterceptOut(): boolean {
		return !!InterceptorsConsumer.interceptIn;
	}

	static hasInterceptors(): boolean {
		return XiaoApplication.hasInterceptIn() || XiaoApplication.hasInterceptOut();
	}
}