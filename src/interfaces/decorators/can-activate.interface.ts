import { ExecutionContext } from "@context/execution-context";

export interface ICanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}