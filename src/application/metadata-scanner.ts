import { isConstructor, isFunction } from '@utils/shared.utils';
import { iterate } from 'iterare';

export class MetadataScanner {
	/**
	 * Retrieve class's metadata
	 * @param metadataKey
	 * @param prototype
	 * @returns
	 */
	static getClassMetadata<T>(metadataKey: string, prototype: object): T {
		return Reflect.getMetadata(metadataKey, prototype);
	}

	/**
	 * Retrieve method's metadata
	 * @param metadataKey
	 * @param prototype
	 * @param target
	 * @returns
	 */
	static getMethodMetadata<T>(
		metadataKey: string,
		prototype: object,
		target: string
	): T {
		// @ts-ignore
		return Reflect.getMetadata(metadataKey, prototype[target]);
	}

	/**
	 * Retreive all method's names of a prototype as an array
	 * @param prototype
	 * @returns
	 */
	static getMethodNames(prototype: object): string[] {
		return iterate(
			new Set(MetadataScanner.getAllFilteredMethodNames(prototype))
		).toArray();
	}

	/**
	 * IterableIterator to get all method's name
	 * @param prototype
	 */
	static *getAllFilteredMethodNames(
		prototype: object
	): IterableIterator<string> {
		const isMethod = (prop: string) => {
			const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
			if (descriptor.set || descriptor.get) {
				return false;
			}
			// @ts-ignore
			return !isConstructor(prop) && isFunction(prototype[prop]);
		};
		do {
			yield* iterate(Object.getOwnPropertyNames(prototype))
				.filter(isMethod)
				.toArray();
		} while (
			(prototype = Reflect.getPrototypeOf(prototype)) &&
			prototype !== Object.prototype
		);
	}
}