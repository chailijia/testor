
const expect = require('chai').expect;
const parse = require('url').parse;
const test = require('./test');
const _ = require('lodash');

const getTestCases = (testCasesDefs) => {
	let urls = testCasesDefs.filter((item, index) => index % 2 === 0);
	let defs = testCasesDefs.filter((item, index) => index % 2 === 1);

	const testCases = [];

	for (let i = 0; i < urls.length; i ++) {
		const url = urls[i];
		const def = defs[i];

		let testCase = {};

		// {
		//		...
		// 		result: {
		// 			success: true,
		// 			data: {
		// 				msg: "Hi, I am owen, 100 years old."
		// 			}
		// 		}
		// }

		// {
		//		...
		// 		verify(result) {
		// 			return result.data.msg === 'Hi, I am owen, 100 years old.';
		// 		}
		// },

		if (typeof def.verify === 'function' || _.isPlainObject(def.result)) {
			testCase = def;
		}
		else {
			if (typeof def === 'function') {
				testCase.verify = def;
			}
			else {
				testCase.result = def;
			}
		}

		testCase.originalUrl = url;
		testCases.push(testCase);
	}

	return testCases;
};

const parseUrls = (serverConfig, testCases) => {
	let {protocol, host, port} = serverConfig;

	if (!/:$/.test(protocol)) {
		protocol = protocol + ':';
	}

	if (port) { // localhost:3000
		host = host + ":" + port;
	}

	testCases.forEach(testCase => {
		let url = testCase.originalUrl;

		// /say/hi?name=owen&age=100 =>
		// http://localhost:3000/say/hi?name=owen&age=100
		if (url.substr(0, 1) === '/') {
			url = protocol + '//' + host + url;
		}

		const myUrl = parse(url);

		testCase.protocol = myUrl.protocol; // http:
		testCase.host = myUrl.host; // localhost:3000
		testCase.api = myUrl.pathname; // /say/hi
		testCase.query = myUrl.query; // name=owen&age=100
	});
};

const fn = (serverConfig, testCasesDefs) => {
	const testCases = getTestCases(testCasesDefs);
	parseUrls(serverConfig, testCases);

	for (let i = 0; i < testCases.length; i ++) {
		const testCase = testCases[i];

		it(testCase.originalUrl, async () => {
			const result = await test(testCase);
			expect(result).to.be.true;
		});
	}
};

module.exports = fn;
