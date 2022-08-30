module.exports = {
	env: {
		node: true,
		es6: true
	},
	parser: "@typescript-eslint/parser",
	plugins: [
		'@typescript-eslint',
		'eslint-plugin-import-helpers'
	],
	extends: [
		'eslint:recommended',
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended"
	],
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
	rules: {
		"@typescript-eslint/no-unused-vars": "off",
		'import-helpers/order-imports': [
			'warn',
			{
				newlinesBetween: 'never',
				groups: [
					'/^@application/',
					'/^@containers/',
					'/^@consumers/',
					'/^@services/',
					'/^@context/',
					[
						'/^@interfaces/',
						'/^@typings/'
					],
					'/^@decorators/',
					'/^@utils/',
					'module',
					[
						'parent',
						'sibling',
						'index'
					]
				],
				alphabetize: { order: 'asc', ignoreCase: true },
			},
		],
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
