
const expect = require('chai').expect;
const test = require('./test');

const fn = (serverPath, serverConfig, testCases) => {
	const apis = Object.keys(testCases).filter(key => key.substr(0, 1) === '/');

	const serverInfo = {
		host: serverConfig.host,
		port: serverConfig.port,
		path: serverPath,
	};

	for (let i = 0; i < apis.length; i ++) {
		const api = apis[i];
		const testCase = testCases[api];

		it(api, async () => {
			const result = await test(serverInfo, api, testCase);
			expect(result).to.be.true;
		});
	}
};

module.exports = fn;
