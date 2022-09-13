import { LOCAL_EVENT_METADATA, NET_EVENT_METADATA } from "@decorators/constants";
import { extendArrayMetadata } from "@utils/extend-metadata.utils";
import { isServer } from "@utils/shared.utils";

export function ClientEvent(eventName: string): MethodDecorator {
	return (_target: any, _propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
		extendArrayMetadata(isServer() ? NET_EVENT_METADATA : LOCAL_EVENT_METADATA, [eventName], descriptor.value);
		return descriptor;
	};
}