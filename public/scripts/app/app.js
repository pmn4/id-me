/*jshint smarttabs:true */

(function() {
	"use strict";
})();


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
	// .controller("IdentityController", ["$scope", "$log", "$identityProvider", IdentityController])
	.controller("ScanController", ["$scope", "$log", "$identityProvider", ScanController]);
