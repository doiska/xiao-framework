import { Injectable } from "@decorators/injectable.decorator";
import { EventCallback } from "@typings/event-callback.interface";
import { isNativeEvent } from "@utils/shared.utils";

@Injectable()
export class EventRegisterService {
	private _eventCallbacks: Map<string, EventCallback> = new Map<string, EventCallback>();

	/**
	 * This declares a net event to be called over the network with {@link EventEmitter~emitNet}.
	 *
	 * @example
	 * this.eventListener.onNet('eventName', () => console.log('eventTriggered over network'));
	 *
	 * @see {@link EventEmitter~emitNet} to emit a networked event
	 * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/onNet-server/}
	 * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/onNet-client/}
	 *
	 * @param eventName eventName to register the callback
	 * @param callback callback triggered
	 */
	onNet(eventName: string, callback: EventCallback): void {
		if(isNativeEvent(eventName)) {
			onNet(eventName, callback);
		} else {
			onNet(`fighter:${eventName}`, callback);
		}
	}

	/**
	 * @example
	 * this.eventListener.on('eventName', () => console.log('eventTriggered'));
	 *
	 * @see {@link EventEmitter~emit} to Emit a local event
	 * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/on-server/}
	 * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/on-client/}
	 *
	 * @param eventName eventName to register the callback
	 * @param callback callback triggered
	 */
	on(eventName: string, callback: EventCallback): void {
		if(isNativeEvent(eventName)) {
			on(eventName, callback);
        } else {
			on(`fighter:${eventName}`, callback);
		}
	}
}