import { injectable } from "tsyringe";
import { XiaoContainer } from "@containers/xiao.container";

export function Controller(): ClassDecorator {
	return (target: any) => {
		injectable()(target);
		XiaoContainer.container.registerSingleton(target);
		XiaoContainer.controllers.add(target);
	}
}