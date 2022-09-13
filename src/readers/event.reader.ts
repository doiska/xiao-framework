import { MetadataScanner } from "@application/metadata-scanner";
import { InterceptorsConsumer } from "@consumers/interceptors.consumer";
import { ExecutionContext } from "@context/execution-context";
import { Controller } from "@typings";
import { NET_EVENT_METADATA, LOCAL_EVENT_METADATA } from "@decorators";
import { isNativeEvent, isServer } from "@utils/shared.utils";
import { EventRegisterService } from "~/services";

export class EventReader {

	static read(controller: Controller, methodName: string, listener: EventRegisterService) {

		const netEventsMetadata = MetadataScanner.getMethodMetadata<string[]>(
			NET_EVENT_METADATA,
			controller,
			methodName
		) || [];

		const localEventsMetadata = MetadataScanner.getMethodMetadata<string[]>(
			LOCAL_EVENT_METADATA,
			controller,
			methodName
		) || [];

		const handler = async (_source: string, eventName: string, ...args: never[]) => {
			if (!isNativeEvent(eventName) && InterceptorsConsumer.interceptIn) {
				args = await InterceptorsConsumer.interceptIn(...args);
			}

			const eventParams = [...args] as any[];

			if (isServer()) {
				console.log(`[XIAO | SERVER | EVENT READER] ${eventName} event from ${_source} with args: ${args}`);
				eventParams.unshift(Number(_source));
			} else {
				console.log(`[XIAO | CLIENT | EVENT READER] triggered ${eventName} with args: ${args}`);
			}

			const executionContext = new ExecutionContext(
				eventName,
				eventParams,
				controller,
				controller[methodName]
			);

			await controller[methodName](...executionContext.getArgs());
		};

		for (const eventName of localEventsMetadata) {
			listener.on(eventName, async (...args: never[]) => handler(global.source as unknown as string, eventName, ...args));
		}

		for (const eventName of netEventsMetadata) {
			listener.onNet(eventName, async (...args: never[]) => handler(global.source as unknown as string, eventName, ...args));
		}
	}
}