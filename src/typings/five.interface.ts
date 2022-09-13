import { MaybePromise } from "@typings/utils.type";

export type Callback<T = never, R = void> = (arg?: T) => MaybePromise<R>;