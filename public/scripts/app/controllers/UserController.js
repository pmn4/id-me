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


function UserController($scope, $log) {
	var STORAGE_NAMESPACE = "history-controller",
	    STORAGE_KEY = "identities";

	// this.parent.constructor.apply?
	IdentityController.apply(this, arguments);

	var _this = this;

	$scope.tiles = [
		new Tile('Name', 'Patrick Newell'),
		new Tile('Age', '33'),
		new Tile('Phone', '215.901.8451')
	];
}
UserController.prototype = new IdentityController();
UserController.prototype.constructor = UserController;
