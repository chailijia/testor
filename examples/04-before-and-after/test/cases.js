
const me = [

	// Step 2
	'/user/login?username=owen&password=123',
	{
		// Step 1
		before: [
			'/user/register?username=owen&password=123',
		],

		// Step 3
		after: [
			'/user/kill?username=owen',
		],

		// Step 4: use the result returned from step 2
		verify(result) {
			return result.data === true;
		}
	},

	// Step 2
	'/user/logout?username=owen',
	{
		// Step 1
		before: [
			'/user/register?username=owen&password=123',
			'/user/login?username=owen&password=123',
		],

		// Step 3: use this url to get the result
		resultUrl: '/user/get?username=owen',

		// Step 4
		after: [
			'/user/kill?username=owen',
		],

		// Step 5: use the result returned from step 3 instead of step 2
		verify(result) {
			return result.data.isOnline === 0;
		}
	},
];

module.exports = me;
