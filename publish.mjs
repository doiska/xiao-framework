import fs from 'fs';
import util from 'util';
import chalk from 'chalk';
import { exec } from "child_process";

const execAsync = util.promisify(exec);

(async () => {

	//does folder exit
	const folderExists = fs.existsSync('dist');

	//if folder exists, delete it
	if (folderExists) {
		await execAsync('rd /s /q dist');
	}

	const commandChain = [
		'tsc && resolve-tspaths',
		'copy package.json dist',
		'copy README.md dist',
		'cd dist && npm publish --registry http://51.81.86.237:4000/',
	];

	const command = commandChain.join(' && ');
	execAsync(command).then(({ stdout, stderr }) => {
		console.log(chalk.green(stdout));
		console.error(chalk.red(stderr));
	});

})();
