import { Type, Callback } from '@typings';

export class ExecutionContext {
	constructor(
		private readonly eventName: string,
		private readonly args: unknown[],
		private readonly _constructorReference: Type = null,
		private readonly _handler: Callback = null) {}

	getEventName(): string {
		return this.eventName;
	}

	getClass<T = any>(): Type<T> {
		return this._constructorReference;
	}

	getHandler(): Callback {
		return this._handler;
	}

	getArgs<T extends Array<any> = any[]>(): T {
		return this.args as T;
	}

	getArgByIndex<T = any>(index: number): T {
		return this.args[index] as T;
	}
}