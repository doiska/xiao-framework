import { XiaoContainer } from "@containers/xiao.container";
import { injectable } from "tsyringe";

export function Injectable(): ClassDecorator {
	return (target: never) => {
		injectable()(target);
		XiaoContainer.container.registerSingleton(target);
		XiaoContainer.providers.add(target);
		return target;
	};
}