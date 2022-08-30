import { IXiaoConfiguration } from "@interfaces/decorators";
import { XIAO_METADATA } from "@decorators/constants";
import { setMetadata } from "@utils/extend-metadata.utils";

export function Xiao(xiao: IXiaoConfiguration): ClassDecorator {
	return (target: any) => {
		setMetadata(XIAO_METADATA, xiao, target);
	};
}