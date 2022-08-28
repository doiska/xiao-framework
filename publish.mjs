import util from 'util';
import chalk from 'chalk';
import { exec } from "child_process";

const execAsync = util.promisify(exec);

(async () => {

	execAsync('rd /s /q "dist"')
		.then(() => execAsync('tsup'))
		.then(() => execAsync('copy package.json dist'))
		.then(() => execAsync('cd dist && npm publish --registry http://51.81.86.237:4873/'))
		.then(() => console.log(chalk.green('Successfully build and sent to verdaccio.')))
		.catch(err => console.error(chalk.red(err)))
})();
