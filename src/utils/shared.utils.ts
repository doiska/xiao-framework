import { NATIVE_EVENTS } from "../events";

export const isConstructor = (val: any): boolean => val === 'constructor';
export const isFunction = (val: any): boolean => typeof val === 'function';
export const isServer = (): boolean => IsDuplicityVersion ? IsDuplicityVersion() : true;
export const isClient = (): boolean => !isServer();
export const isInteger = (val: any): boolean => typeof val === 'number';
export const isNativeEvent = (val: string): boolean => typeof val === 'string' && NATIVE_EVENTS.includes(val);
export const isObject = (val: any): boolean => typeof val === 'object' && val !== null;
export const isEmpty = (val: any): boolean => val === undefined || val === null || val === '';