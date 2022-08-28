import { defineConfig } from "tsup";

import fg from 'fast-glob';
import { esbuildDecorators } from "@anatine/esbuild-decorators";

export default defineConfig({
	format: 'cjs',
	platform: 'node',
	entry: [
		'./src/index.ts',
		...fg.sync(['./src/**/*.ts'])
	],
	splitting: false,
	sourcemap: true,
	clean: true,
	dts: true,
	outDir: './dist',
	esbuildPlugins: [esbuildDecorators({ tsconfig: './tsconfig.json' })]
})