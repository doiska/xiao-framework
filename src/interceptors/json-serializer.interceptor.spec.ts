import 'reflect-metadata'
import { JsonSerializerInterceptor } from "./json-serializer.interceptor";


describe('JsonSerializerInterceptor', () => {

	const interceptor = new JsonSerializerInterceptor();

	it('should parse date string to instance of date object', () => {
		expect(interceptor).toBeDefined();
		const input = '{"date": "2019-01-01T00:00:00"}'
		const parsed = interceptor.in(input);
		expect(parsed).toEqual([{ date: new Date('2019-01-01T00:00:00') }]);
	});
});