import { EventEmitter } from "@services/event-emitter.service";

describe('EventEmitter', () => {

	describe('server-emitter', function () {

		const globals = global;
		let emitter: EventEmitter

		beforeAll(async () => {
			globals.IsDuplicityVersion = vi.fn(() => true);
			globals.emit = vi.fn((eventName: string, ...args: any[]) => {});
			globals.emitNet = vi.fn((eventName: string, ...args: any[]) => {});
		});

		beforeEach(async () => {
			emitter = new EventEmitter();
		})

		describe('emit', () => {
			it('should emit eventName from server-side', () => {
				const spy = vi.spyOn(globals, 'emit');
				emitter.emit('eventName', 1, 2, 3);
				expect(spy).toHaveBeenCalledWith('fighter:eventName', 1, 2, 3);
			});
		});

		describe('emitNet', () => {
			it('should emitNet eventName from server-side', () => {
				const spy = vi.spyOn(globals, 'emitNet');
				emitter.emitNet('eventName', 1, 2, 3);
				expect(spy).toHaveBeenCalledWith('fighter:eventName', 1, 2, 3);
			});
		});

		afterAll(() => {
			vi.restoreAllMocks();
		})
	});

	describe('client-emitter', () => {
		const globals: any = global;
		let emitter: EventEmitter;

		beforeAll(() => {
			globals.IsDuplicityVersion = vi.fn(() => false);
			globals.emit = vi.fn((eventName: string, ...args: any[]) => {});
			globals.emitNet = vi.fn((eventName: string, ...args: any[]) => {});
		})

		beforeEach(() => {
			emitter = new EventEmitter();
		})

		describe('emit', function () {
			it('should emit eventName from client-side', () => {
				const spy = vi.spyOn(globals, 'emit');
				emitter.emit('eventName', 1, 2, 3);
				expect(spy).toHaveBeenCalledWith('fighter:eventName', 1, 2, 3);
			});
		});

		describe('emitNet', function () {
			it('should emitNet eventName from client-side', () => {
				const spy = vi.spyOn(globals, 'emitNet');
				emitter.emitNet('eventName', 1, 2, 3);
				expect(spy).toHaveBeenCalledWith('fighter:eventName', 1, 2, 3);
			});
		});

		afterAll(() => {
			vi.restoreAllMocks();
		})
	})
});