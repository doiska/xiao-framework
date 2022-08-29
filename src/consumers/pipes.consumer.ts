import { InjectionToken } from "tsyringe";
import { ExecutionContext } from "@context/execution-context";
import { XiaoContainer } from "@containers/xiao.container";
import { MaybePromise } from "@typings/utils";
import { IPipeTransform } from "@interfaces/decorators";

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

			return new ExecutionContext(args, executionContext.getClass(), executionContext.getHandler());
		}
	}

	static async pickResult<T>(result: MaybePromise<T>): Promise<T> {
		return result;
	}
}