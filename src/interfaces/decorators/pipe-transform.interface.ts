import { ExecutionContext } from "@context/execution-context";
import { MaybePromise } from "@typings/utils";

export interface IPipeTransform<Target = any, Result = any> {
	transform(context: ExecutionContext, value: Target): MaybePromise<Result>
}