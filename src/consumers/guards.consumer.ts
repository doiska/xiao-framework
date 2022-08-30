
import { XiaoContainer } from "@containers/xiao.container";
import { ExecutionContext } from "@context/execution-context";
import { ICanActivate } from "@interfaces/decorators";
import { MaybePromise } from "@typings";
import { InjectionToken } from "tsyringe";

export class GuardsConsumer {
	static guardsFn(metadata: InjectionToken[]) {
		return async (executionContext: ExecutionContext) => {
			for(const guard of metadata) {
				const activationInstance = XiaoContainer.container.resolve<ICanActivate>(guard);
				const result = await GuardsConsumer.pickResult(activationInstance.canActivate(executionContext));

				if(!result) {
					return false;
				}
			}
			return true;
		};
	}

	static async pickResult(result: MaybePromise<boolean>) {
		return result;
	}
}