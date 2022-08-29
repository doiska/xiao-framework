import { extendArrayMetadata } from "@utils/extend-metadata.utils";
import { EVENT_METADATA } from "@decorators/constants";

export function LocalEvent(eventName: string): MethodDecorator {
	return (_target: any, _propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
		extendArrayMetadata(EVENT_METADATA, [eventName], descriptor.value);
		return descriptor;
	}
}