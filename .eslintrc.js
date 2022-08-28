module.exports = {
	env: {
		node: true,
		es6: true
	},
	plugins: ['eslint-plugin-import-helpers'],
	extends: ['eslint:recommended'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	rules: {
		'import-helpers/order-imports': [
			'warn',
			{
				newlinesBetween: 'always',
				groups: [
					'module',
					'/^@application/',
					'/^@containers/',
					'/^@consumers/',
					'/^@services/',
					'/^@context/',
					'/^@interfaces/',
					'/^@typings/',
					'/^@utils/',
					[
						'parent',
						'sibling',
						'index'
					]
				],
				alphabetize: { order: 'asc', ignoreCase: true },
			},
		]
	}
}
