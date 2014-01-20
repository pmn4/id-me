/*jshint smarttabs:true */

'use strict';

function IdentityController($scope, $log, $identityProvider) {
// private static variables
	var _cardTemplateMarkup, _errorsTemplateMarkup;
	var _testIdentity = {"_id":"52dcaa192504f3002b000001","version":"1.0","_type":"SprtId::Models::FullIdentity","name":"Patrick Newell","external_id":"aau123","birthdate":"1980-10-07T00:00:00Z","graduation_year":2029,"sport":"Hockey","image":{"_id":"52b4d7e0bcd7ac6d89000002","_type":"SprtId::Models::CloudinaryImage","public_id":"wkos9rpk9akznysidyl2","version":1387583456,"signature":"5c3ee6d068a94fefaf8676aaa183fdaf44c1317d","width":124,"height":166,"format":"jpg","resource_type":"image","created_at":"2013-12-20T00:00:00Z","bytes":9034,"type":"upload","etag":"2107977bb9d0cd60d3ed3cd9e20dbc1b","url":"http://res.cloudinary.com/sprtid/image/upload/v1387583456/wkos9rpk9akznysidyl2.jpg","secure_url":"https://res.cloudinary.com/sprtid/image/upload/v1387583456/wkos9rpk9akznysidyl2.jpg"}};
	var _cardContainerId = "id-card-container";

// private methods
	function _cardTemplate() {
		if(typeof(_cardTemplateMarkup) === "undefined")
			_cardTemplateMarkup = document.getElementById("template-scanned-identity").innerHTML;

		return _cardTemplateMarkup;
	}
	function _errorsTemplate() {
		if(typeof(_errorsTemplateMarkup) === "undefined")
			_errorsTemplateMarkup = document.getElementById("template-id-card-errors").innerHTML;

		return _errorsTemplateMarkup;
	}
	function _renderIdentity(identityData, imageKey){
		var cardTemplate = _.template(_cardTemplate());

		return cardTemplate({
			identity: identityData,
			imageKey: imageKey
		});
	}
	function _renderIdentityErrors(identityErrors){
		var errorsTemplate = _.template(_errorsTemplate());

		return errorsTemplate({
			errors: identityErrors
		});
	}
	function _render(identityResponse) {
		var markup;
		if(identityResponse.success) {
			markup = _renderIdentity(identityResponse.content, "orig");
		} else {
			markup = _renderIdentityErrors(identityResponse.errors);
		}
		document.getElementById(_cardContainerId).innerHTML = markup;
	}

// public methods
	if($scope) {
		$scope.render = function(_id) {
			if(arguments.length) {
				$scope.identityId = _id;
			}
			$identityProvider.fetch($scope.identityId, _render);
		};
	}

// Contructor
	if($scope) {
		$scope.identityId = _testIdentity["_id"];
	}
}