import { defineConfig } from 'vitest/config'
import { resolve } from "path";

const r = (p: string) => {
	const res = resolve(__dirname, p)
	console.log(res);
	return res;
}

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./setupTests.ts"],
	},
	resolve: {
		alias: {
			"@application": r("src/application"),
			"@consumers": r("src/consumers"),
			"@containers": r("src/containers"),
			"@context": r("src/context"),
			"@decorators": r("src/decorators"),
			"@hooks": r("src/hooks"),
			"@interfaces": r("src/interfaces"),
			"@services": r("src/services"),
			"@controllers": r("src/controllers"),
			"@interceptors": r("src/interceptors"),
			"@utils": r("src/utils"),
			"@typings": r("src/typings"),
		}
	}
})