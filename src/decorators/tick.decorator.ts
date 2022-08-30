import { TICKS_METADATA } from "@decorators/constants";
import { setMetadata } from "@utils/extend-metadata.utils";

export function Tick(): MethodDecorator {
	return (
		_target: any,
		_key?: string | symbol,
		descriptor?: TypedPropertyDescriptor<any>
	) => {
		setMetadata(TICKS_METADATA, true, descriptor.value);
		return descriptor;
	};
}