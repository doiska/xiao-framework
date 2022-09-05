import { MetadataScanner } from "@application/metadata-scanner";
import { ExecutionContext } from "@context/execution-context";
import { IRegisterCommandMetadata } from "@interfaces/decorators";
import { IExportMetadata } from "@interfaces/decorators/export.interface";
import { Controller } from "@typings";
import { EXPORTS_METADATA } from "@decorators";
import { logger } from "@utils/logger";

export class ExportReader {
	static read(controller: Controller, methodName: string) {

		const metadata = MetadataScanner.getMethodMetadata<IExportMetadata[]>(EXPORTS_METADATA, controller, methodName);

		if (!metadata) return;

		for (const customMethodName of metadata) {
			if (global.exports) {
				logger.info(`Added new export ${name}`);
				global.exports(customMethodName, controller[methodName].bind(controller));
			}
		}
	}
}