/*jshint smarttabs:true */

"use strict";

// write to local storage queue
//  - on scan
//  - on delete [x]
//  - on fetch history from server
// read from local storage

function Tile(title, content, exposure) {
	this.title = title;
	this.content = content;
	this.exposure = exposure || (['public', 'protected', 'private'][Math.floor(Math.random() * 3)]);
}

function TileController($scope, $log, $http) {
	var URL_TOKEN_ID = "#{id}",
	    APP_ID_URL_PATTERN = "/app/tile/" + URL_TOKEN_ID;
	var _this = this;

	$scope.editing = false;

	$scope.save = function(id, fnCallback) {
		var url = APP_ID_URL_PATTERN.replace(URL_TOKEN_ID, id);

		return $http.get(url).success(function(data) {
			if(typeof(fnCallback) === 'function') fnCallback(data);

			$log.log("identityProvider response: ", data);
		});
	};

	$scope.edit = function(editing) {
		if(!arguments.length) editing = true;

		$scope.editing = editing;
	};
}

function UserController($scope, $log) {
	var _this = this;

	$scope.tiles = [
		new Tile('Name', 'Patrick Newell'),
		new Tile('Age', '33'),
		new Tile('Phone', '215.901.8451'),
		new Tile('Team', 'Tigers')
	];
}
