import { Type } from '@typings/index';

export class ExecutionContext {
	constructor(
		private readonly args: unknown[],
		private readonly _constructorReference: Type<any> = null,
		private readonly _handler: Function = null) {}

	getEventName(): string {
		return this.getArgByIndex<string>(0);
	}

	getSource(): number {
		return this.getArgByIndex<number>(1);
	}

	getClass<T = any>(): Type<T> {
		return this._constructorReference;
	}

	getHandler(): Function {
		return this._handler;
	}

	getArgs<T extends Array<any> = any[]>(): T {
		return this.args as T;
	}

	getArgByIndex<T = any>(index: number): T {
		return this.args[index] as T;
	}
}