// call back type with optional arguments and optional return type
export type Callback<T = never, R = void> = (arg?: T) => R;