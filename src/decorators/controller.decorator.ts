import { XiaoContainer } from "@containers/xiao.container";
import { logger } from "@utils/logger";
import { injectable } from "tsyringe";

export function Controller(): ClassDecorator {
	return (target: any) => {
		injectable()(target);
		try {
			console.log(`REGISTERING CONTROLLER: ${target.name}`);
			const containerRes = XiaoContainer.container.registerSingleton(target);

			console.dir(containerRes);

			const currSet = XiaoContainer.controllers.add(target);
			console.dir(currSet);
		} catch (error) {
			logger.error(`[Xiao] Failed to register controller.`, target?.name, target?.constructor?.name);
		}

		console.log(XiaoContainer.controllers);

		return target;
	};
}