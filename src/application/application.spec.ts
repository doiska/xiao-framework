import { XiaoApplication } from "@application/xiao";
import { Reflector } from "@services/reflector.service";
import { ExecutionContext } from "@context/execution-context";
import { ICanActivate, IPipeTransform } from "@interfaces/decorators";
import { Callback } from "@typings";
import {
	Xiao,
	Controller,
	Injectable,
	ClientEvent,
	ServerEvent,
	RegisterCommand,
	SetMetadata,
	Tick,
	UseGuards,
	UsePipes
} from '@decorators';
import { AfterControllerInit } from "@hooks/afterControllerInit";
import { BeforeControllerInit } from "@hooks/beforeControllerInit";
import { OnApplicationBootstrap } from "@hooks/onApplicationBootstrap";
import { beforeAll, expect } from "vitest";
import { EventEmitter } from "@services/event-emitter.service";
import { Export } from "@decorators/exports.decorator";

describe('Implement Xiao Application', () => {
	const globals: any = global;
	let emitter: EventEmitter;

	globals.IsDuplicityVersion = vi.fn(() => true);

	beforeAll(() => {
		emitter = new EventEmitter();

		globals.on = vi.fn((eventName: string, listener: Callback) =>
			console.log('on', eventName, listener));

		globals.onNet = vi.fn((eventName: string, listener: Callback) =>
			console.log('onNet', eventName, listener));

		globals.RegisterCommand = vi.fn((commandName: string, handler: Callback, restricted: boolean) =>
			console.log('RegisterCommand', commandName, handler, restricted));

		globals.setTick = vi.fn((handler: Callback) => console.log('setTick', handler));

		globals.emit = vi.fn((eventName: string, ...args: any[]) => {
			console.log('emit', eventName, args);
		});

		globals.emitNet = vi.fn((eventName: string, ...args: any[]) => {
			console.log('emitNet', eventName, ...args);
		});

	})

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
	class UserController implements BeforeControllerInit, AfterControllerInit, OnApplicationBootstrap {

		@UseGuards(IsTrue)
		@ServerEvent('otherEvent')
		@SetMetadata('multiply-by', 2)
		async eventGuarded(
			eventName: string,
			source: number,
			@UsePipes(MultiplyPipe, MultiplyPipe) @UsePipes(MultiplyPipe) arg1: number
		): Promise<void> {
			console.log(`event ${eventName} called with ${arg1}`);
		}

		@ClientEvent('event')
		async event(eventName: string, source: number, @UsePipes(MultiplyPipe, MultiplyPipe) arg1: number): Promise<void> {
			console.log(`event ${eventName} called`);
		}

		@RegisterCommand('commandName', false)
		async commandName(): Promise<void> {
			console.log('commandName called');
		}

		@RegisterCommand('newCommand', true)
		async newCommand(): Promise<void> {
			console.log('newCommand called');
		}

		@Tick()
		async OnTick(): Promise<void> {
			console.log('OnTick called');
		}

		@Export('test')
		expoTest() {
			console.log(`invoke exp`)
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
			XiaoApplication.create(App).then(x => x.start())
		});

		it('should emitNet: "otherEvent"', () => {
			const spy = vi.spyOn(emitter, 'emitNet');
			emitter.emitNet('otherEvent', 1, 2, 3);
			expect(spy).toHaveBeenCalledWith('otherEvent', 1, 2, 3);
		});

		it('should emit: "event"', () => {
			const spy = vi.spyOn(emitter, 'emit');
			emitter.emit('event', 1, 2, 3);
			expect(spy).toHaveBeenCalledWith('event', 1, 2, 3);
		});

		it('should export method', () => {
			console.log(globals.exports);
		});
	});

	afterAll(() => {
		vi.restoreAllMocks();
	})
});