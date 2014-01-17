/*jshint smarttabs:true */

'use strict';

(function() {
	// GetUserMedia is not yet supported by all browsers
	// Until then, we need to handle the vendor prefixes
	navigator.getMedia = (navigator.getUserMedia ||
	                      navigator.webkitGetUserMedia ||
	                      navigator.mozGetUserMedia ||
	                      navigator.msGetUserMedia);

	// Checks if getUserMedia is available on the client browser
	window.hasUserMedia = function hasUserMedia() {
		return navigator.getMedia ? true : false;
	};
})();

function Webcam($log) {
	return {
		template: '<div class="webcam" ng-transclude></div>',
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			onError: '&',
			onStream: '&',
			onStreaming: '&'
		},
		link: function postLink($scope, element) {
			var videoElem, videoStream;

			$scope.$on('$destroy', function() {
				if (!!videoStream && typeof videoStream.stop === 'function') {
					videoStream.stop();
				}
				if (!!videoElem) {
					videoElem.src = null;
				}
			});

			// called when camera stream is loaded
			var onSuccess = function onSuccess(stream) {
				videoStream = stream;

				// Firefox supports a src object
				if (navigator.mozGetUserMedia) {
					videoElem.mozSrcObject = stream;
				} else {
					var vendorURL = window.URL || window.webkitURL;
					videoElem.src = vendorURL.createObjectURL(stream);
				}

				/* Start playing the video to show the stream from the webcam*/
				videoElem.play();

				/* Call custom callback */
				if ($scope.onStream) {
					$scope.onStream({stream: stream, video: videoElem});
				}
			};

			// called when any error happens
			var onFailure = function onFailure(err) {
				$log.error('Webcam Error: ', err);

				/* Call custom callback */
				if ($scope.onError) {
					$scope.onError({err:err});
				}

				return;
			};

			videoElem = document.createElement('video');
			videoElem.setAttribute('class', 'webcam-live');
			videoElem.setAttribute('autoplay', '');
			element.append(videoElem);

			// Default variables
			var isStreaming = false,
			    width = element.width = 320,
			    height = element.height = 0;

			// Check the availability of getUserMedia across supported browsers
			if (!window.hasUserMedia()) {
				onFailure({code:-1, msg: 'Browser does not support getUserMedia.'});
				return;
			}

			navigator.getMedia (
				// ask only for video
				{
					video: true,
					audio: false
				},
				onSuccess,
				onFailure
			);

			/* Start streaming the webcam data when the video element can play
			 * It will do it only once
			 */
			videoElem.addEventListener('canplay', function() {
				if (!isStreaming) {
					height = (videoElem.videoHeight / ((videoElem.videoWidth/width))) || 250;
					videoElem.setAttribute('width', width);
					videoElem.setAttribute('height', height);
					isStreaming = true;
					// console.log('Started streaming');

					/* Call custom callback */
					if ($scope.onStreaming) {
						$scope.onStreaming({video:videoElem});
					}
				}
			}, false);
		}
	};
}