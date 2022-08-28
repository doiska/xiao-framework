import { IRegisterCommandMetadata } from "@interfaces/decorators/register-command.interface";
import { extendArrayMetadata } from "@utils/extend-metadata.utils";
import { REGISTER_COMMANDS_METADATA } from "@decorators/constants";

export function RegisterCommand(commandName: string, restricted = false): MethodDecorator {
	return (_target: any, _key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
		const registerCommandsMetadata: IRegisterCommandMetadata = { commandName, restricted };
		extendArrayMetadata(REGISTER_COMMANDS_METADATA, [registerCommandsMetadata], descriptor.value);
		return descriptor;
	}
}