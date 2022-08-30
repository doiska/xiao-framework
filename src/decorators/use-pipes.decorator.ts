import { IPipeTransform } from "@interfaces/decorators";
import { PIPES_METADATA } from "@decorators/constants";
import { extendMapMetadata } from "@utils/extend-metadata.utils";

export function UsePipes(
	...pipes: (IPipeTransform | Function)[]
): ParameterDecorator {
	return (
		target: any,
		propertyKey: string | symbol,
		parameterIndex: number
	) => {
		extendMapMetadata(
			PIPES_METADATA,
			parameterIndex,
			pipes,
			target[propertyKey]
		);
		return target;
	};
}