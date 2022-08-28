import 'reflect-metadata'
import { IPipeTransform } from "@interfaces/decorators";
import { ExecutionContext } from "@context/execution-context";
import { MaybePromise } from "@typings/utils";
import { InjectionToken } from "tsyringe";
import { PipesConsumer } from "@consumers/pipes.consumer";

describe('PipesConsumer', () => {

	class MultiplyByTwo implements IPipeTransform {
		transform(context: ExecutionContext, value: any): MaybePromise<any> {
			return value * 2;
		}
	}

	class MultiplyByTwenty implements IPipeTransform {
		transform(context: ExecutionContext, value: any): MaybePromise<any> {
			return value * 20;
		}
	}

	class PromiseZero implements IPipeTransform {
		transform(context: ExecutionContext, value: any): MaybePromise<any> {
			return Promise.resolve(0);
		}
	}

	it('should create a new pipesFn', () => {
		const pipesMetadata = new Map<number, InjectionToken[]>([[0, [MultiplyByTwo, MultiplyByTwenty]]]);
		const pipesFn = PipesConsumer.pipesFn(pipesMetadata);
		expect(pipesFn).toBeDefined();
	});

	it('should return 4 as result', async () => {
		const pipesMetadata = new Map<number, InjectionToken[]>([[2, [MultiplyByTwo, MultiplyByTwo]]]);
		const pipesFn = PipesConsumer.pipesFn(pipesMetadata);

		const context = new ExecutionContext(['eventName', 1, 1]);
		const result = await pipesFn(context);

		expect(result.getArgByIndex(2)).toBe(4);
	});

	it('should return 0 as result', async () => {
		const pipesMetadata = new Map<number, InjectionToken[]>([[2, [PromiseZero]]]);
		const pipesFn = PipesConsumer.pipesFn(pipesMetadata);

		const context = new ExecutionContext(['eventName', 1, 1]);
		const result = await pipesFn(context);

		expect(result.getArgByIndex(2)).toBe(0);
	});

	it('should return 40 as result', async () => {
		const pipesMetadata = new Map<number, InjectionToken[]>([[2, [MultiplyByTwo, MultiplyByTwenty]]]);
		const pipesFn = PipesConsumer.pipesFn(pipesMetadata);

		const context = new ExecutionContext(['eventName', 1, 1]);
		const result = await pipesFn(context);

		expect(result.getArgByIndex(2)).toBe(40);
	});

	it('should pick from promise', async () => {
		const result = await PipesConsumer.pickResult(Promise.resolve(1));
		expect(result).toBe(1);
	});

	it('should pick from value', async () => {
		const result = await PipesConsumer.pickResult(3);
		expect(result).toBe(3);
	});
});