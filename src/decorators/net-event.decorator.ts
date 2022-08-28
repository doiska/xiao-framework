import { extendArrayMetadata } from "@utils/extend-metadata.utils";
import { EVENT_NET_METADATA } from "@decorators/constants";

export function NetEvent(eventName: string): MethodDecorator {
	return (_target: any, _propertyKey?: string| symbol, descriptor?: TypedPropertyDescriptor<any>) => {
		extendArrayMetadata(EVENT_NET_METADATA, [eventName], descriptor.value);
		return descriptor;
	}
}