import { Intercept } from "@interfaces/decorators";
import { Injectable } from "@decorators/injectable.decorator";

@Injectable()
export class JsonSerializerInterceptor implements Intercept {
	private isDate = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

	in(...args: any[]): any[] {

		const parseValueWithDate = (_key: any, value: any) => {
			if(typeof value === 'string' && this.isDate.test(value)) {
				return new Date(value);
			}

			return value;
		};

		return args.map((value: any) => JSON.parse(value, parseValueWithDate));
	}

	out(...args: any[]): any[] {
		return args.map(kv => JSON.stringify(kv));
	}
}