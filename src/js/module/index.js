//@todo
define(function(require) {	
	var angular = require('angular');
	var myApp = angular.module('MyModule', []);
	myApp.directive('hello', function() {
		return {
			restrict: 'E',
			template: '<div>Hi everybody!!!</div>',
			replace: true
		}
	});
});




