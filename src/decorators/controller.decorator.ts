import { XiaoContainer } from "@containers/xiao.container";
import { injectable } from "tsyringe";


export function Controller(): ClassDecorator {
	return (_target: never) => {
		injectable()(_target);
		XiaoContainer.container.registerSingleton(_target);
		XiaoContainer.controllers.add(_target);
	};
}