/*jshint smarttabs:true */

(function() {
	'use strict';
})();


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

var QrCode = (function(qrcodeApi, canvas) {
	var _reading = false;
	var _ctx = canvas ? canvas.getContext('2d') : null;

	function snapshot(video) {
		if (_ctx && video) {
			_ctx.drawImage(video, 0, 0);
			// "image/webp" works in Chrome.
			// Other browsers will fall back to image/png.
			document.getElementById("qr-image").src = canvas.toDataURL('image/webp');
		}
	}

	if(typeof(qrcodeApi) !== 'undefined') {
		qrcodeApi.callback = function() {
			console.log('qrcode.callback');
			console.log(arguments);
		};
	}

	return {
		read: function(video) {
			if(_reading) return null;

			_reading = true;
			try{
				snapshot(video); // would love to move this crap into the qrcode API
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
})(qrcode, document.getElementById("qr-canvas"));


function ScanController($scope, $log, identityProvider) {
	var _this = this;

// private variables
	var _video = null,
	    _localMediaStream = null;

// private methods
	function scanForBarcode(timestamp) {
		if(QrCode.read(_video)) {
			_this.stop();
			// _this.toggle();
		} else {
			_this.stop();
		}
	}

// public variables

// public methods
	this.start = function() {
		if(Snapshotter.scanning()) return;

		if(_video && _video.paused) {
			_video.play();
		}
		if(_localMediaStream && !_localMediaStream.started) {
			// doesn't work. // _localMediaStream.start(); // Doesn't do anything in Chrome.
		}

		Snapshotter.start(scanForBarcode);
	};
	this.stop = function() {
		if(_video) _video.pause();
		if(_localMediaStream) _localMediaStream.stop(); // Doesn't do anything in Chrome.

		Snapshotter.stop();
	};
	this.toggle = function(pause) {
		if(arguments.length && pause || this.scanning) {
			this.stop();
		} else {
			this.start();
		}
	};

// Constructor stuff

// Scopey bits
	$scope.webcamError = false;
	$scope.onError = function (err) {
		$scope.$apply(function() {
			$scope.webcamError = err;
		});
	};

	$scope.onSuccess = function (videoElem) {
		// The video element contains the captured camera data
		_video = videoElem;
		// $scope.$apply(function() {
		//     $scope.patOpts.w = _video.width;
		//     $scope.patOpts.h = _video.height;
		//     $scope.showDemos = true;
		// });

		_this.start();
	};

	$scope.onStream = function (stream, videoElem) {
		// You could do something manually with the stream.
		_localMediaStream = stream;
		_video = videoElem;
	};
}

