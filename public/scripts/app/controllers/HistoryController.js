/*jshint smarttabs:true */

"use strict";

// write to local storage queue
//  - on scan
//  - on delete [x]
//  - on fetch history from server
// read from local storage


function HistoryController($scope, $log, $identityProvider, $scanDispatcher) {
	var STORAGE_NAMESPACE = "history-controller",
	    STORAGE_KEY = "identities";

	IdentityController.apply(this, arguments);

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
		$scope.displayHistory();
	};
	$scope.save = function(identity) {
		_saveIdentity(this._storage, identity);
		$scope.displayHistory();
	};
	$scope.remove = function(identity) {
		_removeIdentity(this._storage, identity);
		$scope.displayHistory();
	};

	$scope.displayHistory = function() {
		$scope.identities = _getIdentities($scope._storage);
	};
	$scope.displayHistory();

	$scope.$on($scanDispatcher.EVENT_NAME, function() {
		$scope.save($scanDispatcher.identity);
	});
}
HistoryController.prototype = new IdentityController();
HistoryController.prototype.constructor = HistoryController;
