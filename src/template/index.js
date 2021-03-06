
const fs = require('fs');
const spawn = require('child_process').spawn;
const createTests = require('./createTests');

const title = '{title}';
const appServerPath = '{appServerPath}';
const appServerConfig = '{appServerConfig}';
const cliOptions = '{cliOptions}';

const appTestPath = appServerPath + '/test';

const wait = (ms = 1000) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	})
};

describe(title, () => {
	let cp;

	before(async function() {
		if (cliOptions.wait > 1000) {
			this.timeout(cliOptions.wait + 1000);
			console.log(`  Wait for the server to be ready, about ${cliOptions.wait / 1000} seconds...`);
		}

		const options = cliOptions.logs ? {stdio: 'inherit'} : {};
		cp = spawn('node', [appServerPath], options);

		await wait(cliOptions.wait);
	});

	after(async () => {
		process.kill(cp.pid, 'SIGTERM');
	});

	const casesFiles = [];
	const files = fs.readdirSync(appTestPath);
	files.forEach(filename => {
		const filepath = appTestPath + '/' + filename;

		if (filename.substr(0, 1) === '.') return;
		if (!/\.js$/.test(filename)) return;
		if (fs.statSync(filepath).isDirectory()) return;

		casesFiles.push(filename);
	});

	createTests(appServerConfig, appTestPath, casesFiles);
});
