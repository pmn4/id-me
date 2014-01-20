/*jshint smarttabs:true */

'use strict';

function IdentityController($scope, $log, $identityProvider, $scanDispatcher) {
// private static variables
	var _cardTemplateMarkup, _errorsTemplateMarkup;
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
			$identityProvider.fetch($scope.identityId, function(identityResponse) {
				_render.call(this, identityResponse);
				if(identityResponse.success) {
					$scanDispatcher.scan(identityResponse.content);
				}
			});
		};
	}
}