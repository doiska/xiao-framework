import 'reflect-metadata'
import { ExecutionContext } from "@context/execution-context";
import { ICanActivate } from "@interfaces/decorators";
import { GuardsConsumer } from "@consumers/guards.consumer";

describe('GuardsConsumer', () => {
	class IsTrue implements ICanActivate {
		canActivate(context: ExecutionContext): boolean | Promise<boolean> {
			return true;
		}
	}

	class IsFalse implements ICanActivate {
		canActivate(context: ExecutionContext): boolean | Promise<boolean> {
			return false;
		}
	}

	it('should return true', async () => {
		const context = new ExecutionContext(['eventName', 1, 'argument']);
		const result = GuardsConsumer.guardsFn([IsTrue]);
		expect(await result(context)).toBeTruthy();
	});

	it('should return false', async () => {
		const context = new ExecutionContext(['eventName', 1, 'argument']);
		const result = GuardsConsumer.guardsFn([IsFalse]);
		expect(await result(context)).toBeFalsy();
	});

	it('should pickResult from promise', async () => {
		const result = await GuardsConsumer.pickResult(Promise.resolve(true));
		expect(result).toBeTruthy();
	});

	it('should pickResult from boolean', async () => {
		const result = await GuardsConsumer.pickResult(true);
		expect(result).toBeTruthy();
	});
});