/*jshint smarttabs:true */

"use strict";


// Declare app level module which depends on filters, and services
var module = angular.module("sprtId", [
  // "ngRoute",
  // "sprtId.filters",
  // "sprtId.services",
  // "sprtId.directives",
  // "sprtId.controllers"
])
// .config(["$routeProvider", function($routeProvider) {
//   $routeProvider.when("/view1", {templateUrl: "partials/partial1.html", controller: "MyCtrl1"});
//   $routeProvider.when("/view2", {templateUrl: "partials/partial2.html", controller: "MyCtrl2"});
//   $routeProvider.otherwise({redirectTo: "/view1"});
// }]);
	.directive("webcam", ["$log", Webcam])
	.factory("$identityProvider", ["$http", "$log", function($http, $log) {
		var URL_TOKEN_ID = "#{id}",
		    APP_ID_URL_PATTERN = "/app/id/" + URL_TOKEN_ID;

		return {
			fetch: fetch
		};

		function fetch(id, fnCallback) {
			var url = APP_ID_URL_PATTERN.replace(URL_TOKEN_ID, id);

			return $http.get(url).success(function(data) {
				if(typeof(fnCallback) === 'function') fnCallback(data);

				$log.log("identityProvider response: ", data);
			});
		}
	}])
	.factory("$scanDispatcher", ['$rootScope', function($rootScope) {
		var service = {
			EVENT_NAME: 'scanned-identity'
		};
		service.identity = null;
		service.scan = function(identity) {
			this.identity = identity;
			this.broadcast();
		};
		service.broadcast = function() {
			$rootScope.$broadcast(this.EVENT_NAME);
		};
		return service;
	}])
	.filter('ageFormatter', function() {               // filter is a factory function
		return function(unformattedDate, emptyStrText) { // first arg is the input, rest are filter params
			return ViewHelpers.age(unformattedDate);
		};
	})
	.filter('reverse', function() {
		return function(items) {
			return items.slice().reverse();
		};
	})
	// .controller("IdentityController", ["$scope", "$log", "$identityProvider", "$scanDispatcher", IdentityController])
	.controller("ScanController", ["$scope", "$log", "$identityProvider", "$scanDispatcher", ScanController])
	.controller("HistoryController", ["$scope", "$log", "$identityProvider", "$scanDispatcher", HistoryController])
	.controller("AppStatsController", ["$scope", "$log", "$scanDispatcher", StatsController])
	;
