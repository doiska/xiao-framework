import { XiaoContainer } from "@containers/xiao.container";
import { logger } from "@utils/logger";
import { injectable } from "tsyringe";

export function Controller(): ClassDecorator {
	return (target: any) => {
		injectable()(target);
		XiaoContainer.container.registerSingleton(target);
		XiaoContainer.controllers.add(target);
		return target;
	};
}