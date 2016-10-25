require.config({
	baseUrl: "/src/js/",
	paths: {
		// "Zepto": "common/zepto.min",
        "angular": "common/angular.min",
        "angular-route": "common/angular-route"
	},
	shim: {
		"angular-route": { exports: 'angular-route'},
		"angular": { exports: 'angular'}
	}
});
