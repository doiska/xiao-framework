import { MetadataScanner } from "@application/metadata-scanner";
import { XiaoContainer } from "@containers/xiao.container";
import { InterceptorsConsumer } from "@consumers/interceptors.consumer";
import { EventRegisterService } from "@services/event-register.service";
import { Controller, Type, Interceptor } from "@typings";
import { logger } from "@utils/logger";
import { isFunction } from "@utils/shared.utils";
import { CommandReader } from "~/readers/command.reader";
import { EventReader } from "~/readers/event.reader";
import { ExportReader } from "~/readers/export.reader";
import { TickReader } from "~/readers/tick.reader";
import { iterate } from "iterare";

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
		if (!XiaoApplication.instance) {
			XiaoApplication.instance = new XiaoApplication();
		}

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

		for (const controllerToken of iterate(XiaoContainer.controllers)) {
			const controller = XiaoContainer.container.resolve(controllerToken);

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
		const eventRegistrar = XiaoContainer.container.resolve(EventRegisterService);

		for (const methodName of MetadataScanner.getMethodNames(controller)) {
			// const classMetadata = MetadataScanner.getClassMetadata<InjectionToken[]>(
			// 	GUARDS_METADATA,
			// 	controller
			// );
			//
			// const guardsMetadata = MetadataScanner.getMethodMetadata<InjectionToken[]>(GUARDS_METADATA, controller, methodName);
			// const guardFn = GuardsConsumer.guardsFn([
			// 	...(classMetadata || []),
			// 	...(guardsMetadata || []),
			// ]);
			//
			// const pipesMetadata = MetadataScanner.getMethodMetadata<Map<number, InjectionToken[]>>(PIPES_METADATA, controller, methodName);
			// const pipeFn = PipesConsumer.pipesFn(pipesMetadata);

			EventReader.read(controller, methodName, eventRegistrar);
			CommandReader.read(controller, methodName);
			TickReader.read(controller, methodName);
			ExportReader.read(controller, methodName);
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