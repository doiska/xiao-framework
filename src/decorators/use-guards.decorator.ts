import { extendArrayMetadata } from "@utils/extend-metadata.utils";
import { GUARDS_METADATA } from "@decorators/constants";
import { ICanActivate } from "@interfaces/decorators/can-activate.interface";

export function UseGuards(...guards: (ICanActivate | Function)[]): MethodDecorator & ClassDecorator {
	return (
		target: any,
		_key?: string | symbol,
		descriptor?: TypedPropertyDescriptor<any>
	) => {
		if(descriptor) {
			extendArrayMetadata(GUARDS_METADATA, guards, descriptor.value);
			return descriptor;
		}

		extendArrayMetadata(GUARDS_METADATA, guards, target);
		return target;
	}
}