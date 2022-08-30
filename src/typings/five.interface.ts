// call back type with optional arguments and optional return type
import { MaybePromise } from "typings/utils.type";

export type Callback<T = never, R = void> = (arg?: T) => MaybePromise<R>;