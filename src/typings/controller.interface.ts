import { Callback } from "@typings/five.interface";
import { MaybePromise } from "@typings/utils.type";

export interface Controller<T = any> extends Record<string, Callback<any>> {
	new (...args: never[]): T

	beforeControllerInit?(): MaybePromise<void>
	afterControllerInit?(): MaybePromise<void>
	onApplicationBootstrap?(): MaybePromise<void>
}