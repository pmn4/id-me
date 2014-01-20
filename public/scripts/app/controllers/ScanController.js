/*jshint smarttabs:true */

'use strict';

var Snapshotter = (function(interval) {
	var _timeoutId, _fnSnapshot;
	return {
		scanning: function() {
			return !!_timeoutId;
		},
		start: function(fnSnapshot) {
			if(arguments.length) {
				_fnSnapshot = fnSnapshot;
			}

			if(_fnSnapshot) {
				_timeoutId = setInterval(function() {
					requestAnimationFrame(_fnSnapshot);
				}, interval);
			}
		},
		stop: function() {
			if(_timeoutId) {
				clearTimeout(_timeoutId);
			}
			_timeoutId = undefined;
		}
	};
})(100);

var QrCode = (function(qrcodeApi) {
	var _reading = false;

	function snapshot(video, canvas, canvasCtx, image) {
		if (canvasCtx && video) {
			canvasCtx.drawImage(video, 0, 0);
			// "image/webp" works in Chrome.
			// Other browsers will fall back to image/png.
			image.src = canvas.toDataURL('image/webp');
		}
	}

	if(typeof(qrcodeApi) !== 'undefined') {
		qrcodeApi.callback = function() {
			console.log('qrcode.callback');
			console.log(arguments);
		};
	}

	return {
		callback: function(fn) {
			qrcodeApi.callback = fn;
		},
		read: function(video, canvas, canvasCtx, image) {
			if(_reading) return null;

			_reading = true;
			try{
				snapshot(video, canvas, canvasCtx, image); // would love to move this crap into the qrcode API
				qrcodeApi.decode();
				return true;
			}
			catch(e){
				console.log(e);
				return false;
			}
			finally {
				_reading = false;
			}
		}
	};
})(qrcode);

var State = {
	init: 0,
	error: -1,
	pause: 1,
	play: 2
};
function _state(currentState) {
	var states = {};
	for(var s in State) {
		states[s] = State[s] == currentState;
	}
	return states;
}
function state($scope, currentState) {
	$scope.state = $scope.state || {};

	$scope.$apply(function() {
		$scope.state = _state(currentState);
		$scope._state = currentState;
	});
}

function ScanController($scope, $log, $identityProvider, $scanDispatcher) {
	var _this = this;

	IdentityController.apply(this, arguments);
	ScanController.prototype = new IdentityController();
	ScanController.prototype.constructor = ScanController;

// private variables
	var _video = null,
	    _localMediaStream = null;

	var _canvas = document.getElementById("qr-canvas"),
	    _ctx = _canvas ? _canvas.getContext('2d') : null,
	    _img = document.getElementById("qr-image");

// private methods
	function scanForBarcode(timestamp) {
		if(QrCode.read(_video, _canvas, _ctx, _img)) {
			_this.stop();
			// _this.toggle();
		} /* else {
			_this.stop();
		} */
	}

// public variables

// public methods
	this.start = function() {
		if(Snapshotter.scanning()) return;

		if(_video) {
			if(_video.paused) {
				_video.play();
			}
			_canvas.height = _img.height = _video.videoHeight;
			_canvas.width  = _img.width  = _video.videoWidth;
		}
		if(_localMediaStream && !_localMediaStream.started) {
			// doesn't work. // _localMediaStream.start(); // Doesn't do anything in Chrome.
		}

		QrCode.callback(function() {
			_this.renderId(arguments);
		});
		Snapshotter.start(scanForBarcode);
		state($scope, State.play);
	};
	this.stop = function() {
		if(_video) _video.pause();
		if(_localMediaStream) _localMediaStream.stop(); // Doesn't do anything in Chrome.

		Snapshotter.stop();
		state($scope, State.pause);
	};
	this.toggle = function(pause) {
		if(arguments.length && pause || this.scanning) {
			this.stop();
		} else {
			this.start();
		}
	};
	this.renderId = function(data) {
		$log.info('renderId...', data);
		if(!data || !data.length) return;

		var url = data[0];

		$scope.render(url.replace(/http:\/\/.*\/(.*)(\?.*)?/i, '$1'));
	};

// Constructor stuff

// Scopey bits
	$scope.state = _state(State.init);
	$scope.onError = function (err) {
		state($scope, State.error);
	};

	$scope.onSuccess = function (videoElem) {
		_video = videoElem;

		_this.start();
	};

	$scope.onStream = function (stream, videoElem) {
		_localMediaStream = stream;
		_video = videoElem;
	};
}

