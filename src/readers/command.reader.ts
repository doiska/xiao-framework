import { MetadataScanner } from "@application/metadata-scanner";
import { ExecutionContext } from "@context/execution-context";
import { IRegisterCommandMetadata } from "@interfaces/decorators";
import { Controller } from "@typings";
import { REGISTER_COMMANDS_METADATA } from "@decorators";

export class CommandReader {
	static read(controller: Controller, methodName: string) {

		const metadata = MetadataScanner.getMethodMetadata<IRegisterCommandMetadata[]>(REGISTER_COMMANDS_METADATA, controller, methodName);

		if(!metadata) return;

		for(const { commandName, restricted } of metadata) {
			RegisterCommand(
				commandName,
				async (source: number, ...args: never[]) => {
					const executionContext = new ExecutionContext(
						[commandName, source || -1, ...args],
						controller,
						controller[methodName]
					);

					controller[methodName](...executionContext.getArgs());
				},
				restricted
			);
		}
	}
}