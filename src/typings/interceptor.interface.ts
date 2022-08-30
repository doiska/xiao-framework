import { Intercept } from "@interfaces/decorators";

export interface Interceptor<T = Intercept> extends Function {
	new (...args: any[]): T
}