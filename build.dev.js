async function watch() {
	const chalk = (await import('chalk')).default;
	const exec = (await import('child_process')).exec;
	const path = await import('path');

	const buildPath = path.resolve(__dirname, './dist');

	const { esbuildDecorators } = require('@anatine/esbuild-decorators');

	const onRebuild = (target, err, res) => {
		if(err) {
			console.error(chalk.red('Rebuild failed :('), err);
			return;
		}

		console.log(chalk.green('Rebuild succeeded :), warnings:'), res.warnings);
		console.log(chalk.yellow('Checking types...'));

		const p = exec('tsc -p ' + target);

		p.on('error', (err) => console.error(chalk.red('Typechecking failed :('), err))
		p.on('data', (d) => console.log(chalk.yellow(`${d.toString()}`)))
	}

	require('esbuild')
		.build({
			entryPoints: ['./resources/client/client.ts'],
			bundle: true,
			outfile: buildPath + '/client/client.js',
			target: ['chrome58'],
			format: 'iife',
			watch: {
				onRebuild: (err, res) => onRebuild('resources/client', err, res)
			}
		})
		.then((r) => console.log(chalk.green('[client]: Watching...')))
		.catch((err) => {
			console.log(err);
			process.exit(1);
		});

	require('esbuild')
		.build({
			entryPoints: ['./resources/server/server.ts'],
			bundle: true,
			outfile: buildPath + '/server/server.js',
			format: 'cjs',
			platform: 'node',
			external: ['typeorm'],
			plugins: [
				esbuildDecorators({ tsconfig: './resources/server/tsconfig.json' }),
			],
			watch: {
				onRebuild: (err, res) => onRebuild('resources/server', err, res)
			},
		})
		.then(() => console.log(chalk.green('[server]: Watching...')))
		.catch((err) => {
			console.log(err);
			process.exit(1);
		});
}

watch();
