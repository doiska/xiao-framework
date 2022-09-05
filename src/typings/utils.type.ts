import { Controller } from "~/typings/controller.interface";

export type MaybePromise<T> = Promise<T> | PromiseLike<T> | T;

export interface IMetadataReader {
	read(target: unknown, controller: Controller, methodName: string): unknown;
}