import { IXiaoConfiguration } from "@interfaces/decorators";
import { setMetadata } from "@utils/extend-metadata.utils";
import { XIAO_METADATA } from "@decorators/constants";

export function Xiao(xiao: IXiaoConfiguration): ClassDecorator {
	return (target: any) => {
		setMetadata(XIAO_METADATA, xiao, target);
	}
}