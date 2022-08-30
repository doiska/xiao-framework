import { resolve } from "path";
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsPaths from './tsconfig.paths.json';

const toSrcPath = (p: string) => resolve(__dirname, 'src', p);

const paths = Object.entries(tsPaths.compilerOptions.paths);

const pathAsObject = paths.reduce((acc, [_key, value]) => {
	acc[_key.replace('/*', '')] = toSrcPath(value[0].replace('/*', ''));
	return acc;
}, {} as Record<string, string>);

export default defineConfig({
	plugins: [swc.vite()],
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./setupTests.ts"],
	},
	resolve: {
		alias: pathAsObject
	}
});