import 'reflect-metadata';
import { EventRegisterService } from "@services/event-register.service";

describe('EventRegister', () => {

	const globals: any = global;
	let eventRegister: EventRegisterService;

	beforeAll(() => {
		globals.on = vi.fn((eventName: string, listener: Function) => {});
		globals.onNet = vi.fn((eventName: string, listener: Function) => {})
	})

	beforeEach(() => {
		eventRegister = new EventRegisterService();
	})

	describe('on', function () {
		it('should register event', () => {
			const spy = vi.spyOn(globals, 'on');
			const listener = (eventName: string, source: number, argument: number) => {};
			eventRegister.on('eventName', listener);
			expect(spy).toHaveBeenCalledWith(`fighter:${'eventName'}`, listener);
		})

		it('should register native event', () => {
			const spy = vi.spyOn(globals, 'on');
			const listener = (eventName: string, source: number, argument: number) => {};
			eventRegister.on('onResourceStop', listener);
			expect(spy).toHaveBeenCalledWith(`onResourceStop`, listener);
		})
	});

	describe('onNet', () => {
		it('should register eventName', () => {
			const spy = vi.spyOn(globals, 'onNet');
			const listener = (eventName: string, source: number, argument: number) => {};
			eventRegister.onNet('eventName', listener);
			expect(spy).toHaveBeenCalledWith(`fighter:${'eventName'}`, listener);
		})

		it('should register native event', () => {
			const spy = vi.spyOn(globals, 'onNet');
			const listener = (eventName: string, source: number, argument: number) => {};

			eventRegister.onNet('onResourceStop', listener);
			expect(spy).toHaveBeenCalledWith(`onResourceStop`, listener);
		})
	})

	afterAll(() => {
		vi.restoreAllMocks();
	})
});