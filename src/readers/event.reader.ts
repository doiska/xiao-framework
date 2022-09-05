import { MetadataScanner } from "@application/metadata-scanner";
import { InterceptorsConsumer } from "@consumers/interceptors.consumer";
import { ExecutionContext } from "@context/execution-context";
import { Controller } from "@typings";
import { EVENT_NET_METADATA, EVENT_METADATA } from "@decorators";
import { isNativeEvent } from "@utils/shared.utils";
import { EventRegisterService } from "~/services";

export class EventReader {

	static read(controller: Controller, methodName: string, listener: EventRegisterService) {

		const netEventsMetadata = MetadataScanner.getMethodMetadata<string[]>(
			EVENT_NET_METADATA,
			controller,
			methodName
		) || [];

		const localEventsMetadata = MetadataScanner.getMethodMetadata<string[]>(
			EVENT_METADATA,
			controller,
			methodName
		) || [];

		const handler = async (isNet: boolean, eventName: string, ...args: never[]) => {
			if (!isNativeEvent(eventName) && InterceptorsConsumer.interceptIn) {
				args = await InterceptorsConsumer.interceptIn(...args);
			}

			const executionContext = new ExecutionContext(
				[eventName, source || -1, ...args],
				controller,
				controller[methodName]
			);

			console.log("executionContext", executionContext);

			await controller[methodName](...executionContext.getArgs());
		};

		for (const eventName of localEventsMetadata) {
			listener.on(eventName, async (...args: never[]) => handler(false, eventName, ...args));
		}

		for (const eventName of netEventsMetadata) {
			listener.onNet(eventName, async (...args: never[]) => handler(true, eventName,...args));
		}
	}
}