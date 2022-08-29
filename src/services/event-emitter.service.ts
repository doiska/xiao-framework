import { Injectable } from "@decorators/injectable.decorator";
import { EventCallback } from "@typings/event-callback.interface";
import { isNativeEvent, isServer, isInteger } from "@utils/shared.utils";
import { XiaoApplication } from "@application/xiao";
import { InterceptorsConsumer } from "@consumers/interceptors.consumer";

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

			let [target, ...params] = args;

			if (!isInteger(target)) {
				throw new Error('The first argument of emitNet must be an integer server-side.');
			}

			if (XiaoApplication.hasInterceptors()) {
				params = await InterceptorsConsumer.interceptOut(...params);
			}

			emitNet(`fighter:${eventName}`, target, ...params);
		} else {
			if (!args.length) {
				emitNet(`fighter:${eventName}`);
				return;
			}

			if (XiaoApplication.hasInterceptors()) {
				args = await InterceptorsConsumer.interceptOut(...args);
			}

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
		emit(`fighter:${eventName}`, ...args);
	}
}