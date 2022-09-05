import { MetadataScanner } from "@application/metadata-scanner";
import { Controller } from "@typings";
import { TICKS_METADATA } from "@decorators";
import { EventRegisterService } from "~/services";

export class TickReader {
	static read(controller: Controller, methodName: string) {
		const ticksMetadata = MetadataScanner.getMethodMetadata<string[]>(
			TICKS_METADATA,
			controller,
			methodName
		);

		if (ticksMetadata) {
			setTick(controller[methodName].bind(controller));
		}
	}
}