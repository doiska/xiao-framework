import { Intercept } from "@interfaces/decorators";
import { XiaoContainer } from "@containers/xiao.container";
import { InterceptorsConsumer } from "@consumers/interceptors.consumer";

describe('InterceptorsConsumer', () => {

	class MultiplyByTwo implements Intercept {
		in?(...args: any[]): any[] {
			return args.map(arg => arg * 2);
		}

		out?(...args: any[]): any[] {
			return args.map(arg => arg / 2);
		}
	}

	class RemoveOne implements Intercept {
		in?(...args: any[]): any[] {
			return args.map(arg => arg - 1);
		}

		out?(...args: any[]): any[] {
			return args.map(arg => arg - 1);
		}
	}

	beforeAll(() => {
		XiaoContainer.interceptors.add(MultiplyByTwo);
		XiaoContainer.interceptors.add(RemoveOne);
	})

	describe('in-func', function () {
		it('should create a new in-function', () => {

			const interceptors = [MultiplyByTwo];

			const inFunc = InterceptorsConsumer.inFn(interceptors);
			expect(inFunc).toBeDefined();
		});

		it('should call returns 4', async () => {
			const interceptors = [MultiplyByTwo];
			const inFunc = InterceptorsConsumer.inFn(interceptors);
			expect(await inFunc([2])).toEqual([4]);
		});

		it('should call returns 8', async () => {
			const interceptors = [MultiplyByTwo, MultiplyByTwo];
			const inFunc = InterceptorsConsumer.inFn(interceptors);
			expect(await inFunc([2])).toEqual([8]);
		});
	});

	describe('out-func', () => {
		it('should create a new out-function', () => {
			const interceptors = [MultiplyByTwo];
			const outFunc = InterceptorsConsumer.outFn(interceptors);
			expect(outFunc).toBeDefined();
		});

		it('should call returns 2', async () => {
			const interceptors = [MultiplyByTwo];
			const outFunc = InterceptorsConsumer.outFn(interceptors);
			expect(await outFunc([4])).toEqual([2]);
		});

		it('should call returns 1', async () => {
			const interceptors = [MultiplyByTwo, MultiplyByTwo];
			const outFunc = InterceptorsConsumer.outFn(interceptors);
			expect(await outFunc([4])).toEqual([1]);
		});
	});

	it('should pick from promise', async () => {
		const result = await InterceptorsConsumer.pickResult(Promise.resolve([1]));
		expect(result).toEqual([1]);
	});

	it('should pick from array', async () => {
		const result = await InterceptorsConsumer.pickResult([1]);
		expect(result).toEqual([1]);
	});

	it('should generate interceptors', async () => {
		const inFuncSpy = vi.spyOn(InterceptorsConsumer, 'inFn');
		const outFuncSpy = vi.spyOn(InterceptorsConsumer, 'outFn');

		InterceptorsConsumer.generate();

		expect(inFuncSpy).toHaveBeenCalledWith([RemoveOne, MultiplyByTwo]);
		expect(outFuncSpy).toHaveBeenCalledWith([MultiplyByTwo, RemoveOne]);

		expect(InterceptorsConsumer.interceptIn).toBeDefined();
		expect(InterceptorsConsumer.interceptOut).toBeDefined();
	})
});