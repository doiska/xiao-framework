
import { XiaoContainer } from "@containers/xiao.container";
import { ExecutionContext } from "@context/execution-context";
import { IPipeTransform } from "@interfaces/decorators";
import { MaybePromise } from "@typings";
import { InjectionToken } from "tsyringe";

export class PipesConsumer {

	static pipesFn(pipesMetadata: Map<number, InjectionToken[]>) {
		return async (executionContext: ExecutionContext) => {

			const args = executionContext.getArgs();

			for (const [index, values] of pipesMetadata) {
				for (const pipe of values) {
					const pipeInstance = XiaoContainer.container.resolve<IPipeTransform>(pipe);

					args[index] = await PipesConsumer.pickResult(
						pipeInstance.transform(args[index], executionContext.getArgByIndex(index))
					);
				}
			}

			return new ExecutionContext(executionContext.getEventName(), args, executionContext.getClass(), executionContext.getHandler());
		};
	}

	static async pickResult<T>(result: MaybePromise<T>): Promise<T> {
		return result;
	}
}