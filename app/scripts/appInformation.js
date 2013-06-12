angular.module("appInformation", [])

.constant("appInformation", {
	"name": "angular-scenario-sample",
	"version": "1.0.0",
	"dependencies": {
		"angular": "~1.0.7",
		"bootstrap.css": "~2.1.1"
	},
	"devDependencies": {
		"angular-mocks": "~1.0.7",
		"angular-scenario": "~1.0.7"
	}
})

.constant("buildDate", "1371072615195")

;