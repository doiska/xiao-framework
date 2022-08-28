async function build() {
	const chalk = (await import('chalk')).default;
	const path = await import('path');

	const buildPath = path.resolve(__dirname, './dist');

	const { esbuildDecorators } = require('@anatine/esbuild-decorators');

	require('esbuild')
		.build({
			entryPoints: ['./src'],
			bundle: true,
			outfile: buildPath + './server.js',
			format: 'cjs',
			minify: false,
			platform: 'node',
			external: ['typeorm'],
			plugins: [esbuildDecorators]
		})
		.then(() => console.log(chalk.green('Built successfully!')))
		.catch(() => process.exit(1));
}

build();
