async function build() {
	const chalk = (await import('chalk')).default;
	const path = await import('path');

	const buildPath = path.resolve(__dirname, './dist');
	const { esbuildDecorators } = require('@anatine/esbuild-decorators');

	require('esbuild')
		.build({
			entryPoints: ['./resources/client/client.ts'],
			bundle: true,
			outfile: buildPath + '/client/client.js',
			target: ['chrome58'],
			minify: false,
			format: 'iife',
		})
		.then(() => console.log(chalk.green('[CLIENT]: Built successfully!')))
		.catch(() => process.exit(1));

	require('esbuild')
		.build({
			entryPoints: ['./resources/server/server.ts'],
			bundle: true,
			outfile: buildPath + './server/server.js',
			format: 'cjs',
			minify: false,
			platform: 'node',
			external: ['typeorm'],
			plugins: [
				esbuildDecorators({ tsconfig: './resources/server/tsconfig.json' }),
			],
		})
		.then(() => console.log(chalk.green('[SERVER]: Built successfully!')))
		.catch(() => process.exit(1));
}

build();
