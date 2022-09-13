import { XiaoApplication } from "@application/xiao";
import { InterceptorsConsumer } from "@consumers/interceptors.consumer";
import { EventCallback } from "@typings";
import { Injectable } from "@decorators/injectable.decorator";
import { isNativeEvent, isServer, isInteger } from "@utils/shared.utils";

@Injectable()
export class EventEmitter {
	private _callbacks = new Map<string, EventCallback>();

	/**
	 * Triggered on {@link EventRegisterService~onNet}
	 *
	 * @example
	 * this.eventListener.emitNet('eventName');
	 * this.eventListener.emitNet('eventName', arguments);
	 * this.eventListener.emitNet('eventName', args1, args2, args3);
	 *
	 * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emitNet-server/}
	 * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emitNet-client/}
	 *
	 * @param eventName
	 * @param args
	 */
	async emitNet(eventName: string, ...args: any[]): Promise<void> {

		console.log(`[XIAO | EVENT EMITTER] emitNet ${eventName} with args: ${args}`);

		if (isNativeEvent(eventName)) {
			throw new Error('Cannot use a native event.');
		}

		if (!args?.length) {
			args = [];
		}

		if (isServer()) {
			if (!args.length) {
				emitNet(`fighter:${eventName}`, -1);
				return;
			}

			// eslint-disable-next-line prefer-const
			let [target, ...params] = args;

			if (!isInteger(target)) {
				try {
					target = parseInt(target);
				} catch (e) {
					throw new Error('The first argument in server-side emitNet must be a number.');
				}
			}

			if (XiaoApplication.hasInterceptors()) {
				params = await InterceptorsConsumer.interceptOut(...params);
			}

			console.log('emitNet', `fighter:${eventName}`, target, ...params);
			emitNet(`fighter:${eventName}`, target, ...params);
		} else {
			if (!args.length) {
				emitNet(`fighter:${eventName}`);
				return;
			}

			if (XiaoApplication.hasInterceptors()) {
				args = await InterceptorsConsumer.interceptOut(...args);
			}

			console.log('emitNet', `fighter:${eventName}`, ...args);
			emitNet(`fighter:${eventName}`, ...args);
		}
	}

	/**
	 * Triggered on {@link EventRegisterService~on}
	 *
	 * @example
	 * this.eventListener.emit('eventName');
	 * this.eventListener.emit('eventName', arguments);
	 * this.eventListener.emit('eventName', args1, args2, args3);
	 *
	 * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emit-server/}
	 * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emit-client/}
	 *
	 * @param eventName
	 * @param args
	 */
	async emit(eventName: string, ...args: any[]): Promise<void> {
		if (InterceptorsConsumer.interceptOut) {
			args = await InterceptorsConsumer.interceptOut(...args);
		}

		console.log(`[XIAO | EVENT EMITTER] emit ${eventName} with args: ${args}`);
		emit(`fighter:${eventName}`, ...args);
	}
}