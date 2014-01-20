/*jshint smarttabs:true */

"use strict";

// write to local storage queue
//  - on scan
//  - on delete [x]
//  - on fetch history from server
// read from local storage


function HistoryController($scope, $log, $scanDispatcher) {
	var STORAGE_NAMESPACE = "history-controller",
	    STORAGE_KEY = "identities";
	var _testIdentity = {"_id":"52dcaa192504f3002b000001","version":"1.0","_type":"SprtId::Models::FullIdentity","name":"Patrick Newell","external_id":"aau123","birthdate":"1980-10-07T00:00:00Z","graduation_year":2029,"sport":"Hockey","image":{"_id":"52b4d7e0bcd7ac6d89000002","_type":"SprtId::Models::CloudinaryImage","public_id":"wkos9rpk9akznysidyl2","version":1387583456,"signature":"5c3ee6d068a94fefaf8676aaa183fdaf44c1317d","width":124,"height":166,"format":"jpg","resource_type":"image","created_at":"2013-12-20T00:00:00Z","bytes":9034,"type":"upload","etag":"2107977bb9d0cd60d3ed3cd9e20dbc1b","url":"http://res.cloudinary.com/sprtid/image/upload/v1387583456/wkos9rpk9akznysidyl2.jpg","secure_url":"https://res.cloudinary.com/sprtid/image/upload/v1387583456/wkos9rpk9akznysidyl2.jpg"}};

	var _this = this;

	function _getIdentities(storage) {
		return storage.get(STORAGE_KEY) || [];
	}

	function _setIdentities(storage, data) {
		storage.set(STORAGE_KEY, data);
	}

	function _saveIdentity(storage, identity) {
		var data = _getIdentities(storage);
		if(!data) return;

		data.push(identity);
		_setIdentities(storage, data);
	}

	function _removeIdentity(storage, identity) {
		var data = _getIdentities(storage);
		if(!data) return;

		data = data.filter(function(id) {
			return id && id["_id"] !== identity["_id"];
		});
		_setIdentities(storage, data);
	}

	$scope._storage = new LocalStorage(STORAGE_NAMESPACE);
	$scope.init = function(identity) {
		$scope.render();
	};
	$scope.save = function(identity) {
		_saveIdentity(this._storage, identity);
		$scope.render();
	};
	$scope.remove = function(identity) {
		_removeIdentity(this._storage, identity);
		$scope.render();
	};

	$scope.render = function() {
		$scope.identities = _getIdentities($scope._storage);
	};
	$scope.render();

	$scope.$on($scanDispatcher.EVENT_NAME, function() {
		$scope.save($scanDispatcher.identity);
	});
}