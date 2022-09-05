import { EXPORTS_METADATA } from "@decorators/constants";
import { extendArrayMetadata } from "@utils/extend-metadata.utils";

export function Export(name?: string): MethodDecorator {
	return (_target: any, _propertyKey?: string| symbol, descriptor?: TypedPropertyDescriptor<any>) => {
		extendArrayMetadata(EXPORTS_METADATA, [name], descriptor.value);
		return descriptor;
	};
}