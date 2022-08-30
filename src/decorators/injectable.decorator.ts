import { XiaoContainer } from "@containers/xiao.container";
import { logger } from "@utils/logger";
import { injectable } from "tsyringe";

export function Injectable(): ClassDecorator {
	return (target: never) => {
		injectable()(target);
		logger.info(`[Xiao] Registering injectable.`);
		XiaoContainer.container.registerSingleton(target);
		XiaoContainer.providers.add(target);
		return target;
	};
}