import 'reflect-metadata'
import { Controller } from '@decorators/controller.decorator';
import { ICanActivate, IPipeTransform } from "@interfaces/decorators";
import { ExecutionContext } from "@context/execution-context";
import { Reflector } from "@services/reflector.service";
import { Injectable } from "@decorators/injectable.decorator";
import { UseGuards } from "@decorators/use-guards.decorator";
import { SetMetadata } from "@decorators/set-metadata.decorator";
import { AfterControllerInit } from "@hooks/afterControllerInit";
import { Tick } from "@decorators/tick.decorator";
import { NetEvent } from "@decorators/net-event.decorator";
import { UsePipes } from "@decorators/use-pipes.decorator";
import { OnApplicationBootstrap } from "@hooks/onApplicationBootstrap";
import { LocalEvent } from "@decorators/event.decorator";
import { RegisterCommand } from '@decorators/register-command.decorator'
import { Xiao } from "@decorators/xiao.decorator";
import { XiaoApplication } from "@application/xiao";
import { BeforeControllerInit } from "@hooks/beforeControllerInit";

describe('Implement Xiao Application', () => {

	class IsTrue implements ICanActivate {
		canActivate(context: ExecutionContext): boolean | Promise<boolean> {
			return true;
		}
	}

	@Injectable()
	class MultiplyPipe implements IPipeTransform<number, number> {
		constructor(private reflector: Reflector) {
		}

		transform(context: ExecutionContext, value: number): number {
			const multiplyBy: number = this.reflector.get<number>(
				'multiply-by',
				context.getHandler()
			);
			return value * multiplyBy;
		}
	}

	@Controller()
	class UserController
		implements
			BeforeControllerInit,
			AfterControllerInit,
			OnApplicationBootstrap {
		@UseGuards(IsTrue)
		@NetEvent('otherEvent')
		@SetMetadata('multiply-by', 2)
		async eventGuarded(
			eventName: string,
			source: number,
			@UsePipes(MultiplyPipe, MultiplyPipe) @UsePipes(MultiplyPipe) arg1: number
		): Promise<void> {
			console.log(arg1);
		}

		@LocalEvent('event')
		async event(
			eventName: string,
			source: number,
			@UsePipes(MultiplyPipe, MultiplyPipe) arg1: number
		): Promise<void> {
			console.log(arg1);
		}

		@RegisterCommand('commandName', false)
		async commandName(): Promise<void> {
		}

		@RegisterCommand('newCommand', true)
		async newCommand(): Promise<void> {
		}

		@Tick()
		async OnTick(): Promise<void> {
			console.log('OnTick called');
		}

		afterControllerInit(): void {
			console.log('afterControllerInit');
		}

		beforeControllerInit(): void {
			console.log('beforeControllerInit');
		}

		onApplicationBootstrap(): void {
			console.log('onApplicationBootstrap');
		}
	}

	@Xiao({
		controllers: [UserController],
		providers: [MultiplyPipe],
	})
	class App {
	}

	describe('Xiao Application', () => {
		it('should create a new application', async () => {
			XiaoApplication.create(App).then(async (magnetarise) => {
				expect(magnetarise).toBeDefined();
			});
		});
	});
});