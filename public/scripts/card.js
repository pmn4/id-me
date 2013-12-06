var NOT_SO_SECRET_PASSPHRASE = "killer boots man";

var ViewHelpers = {
	months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	birthdateFormatted: function(date) {
		if(date instanceof Date) {
			if(date > 0) {
				return ViewHelpers.months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear();
			}

			return "";
		}

		return date;
	}
};


function renderIdentity(identityData){
	var cardTemplate = _.template(document.getElementById("template-id-card").innerHTML);

	for(var i in identityData.images) {
		if(identityData.images.hasOwnProperty(i)) {
			document.getElementById("current-card").innerHTML += cardTemplate({
				identity: identityData,
				imageKey: i
			});
		}
	}
}

function encryptIdentityForUrl(identityData) {
	var image = identityData.images.base64;
	var identityDataForUrl = {
		i: identityData.id,
		n: identityData.name,
		b: Math.floor(identityData.birthdate / 86400000),
		d: image.href,
		x: image.x,
		y: image.y,
		w: image.w,
		h: image.h
	};
	var encrypted = CryptoJS.AES.encrypt(JSON.stringify(identityDataForUrl), NOT_SO_SECRET_PASSPHRASE);
	// return encrypted.toString(CryptoJS.enc.Base64);
	return encrypted.toString();
}
function decryptIdentityFromUrl(dataString) {
	decrypted = CryptoJS.AES.decrypt(dataString, NOT_SO_SECRET_PASSPHRASE);
	if(!decrypted.sigBytes) return {};

	identityData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
	return {
		id: identityData.i,
		name: identityData.n,
		birthdate: new Date(identityData.b * 86400000),
		images: {
			base64: {
				protocol: "data:image/png;base64,",
				href: identityData.d,
				x: identityData.x,
				y: identityData.y,
				w: identityData.w,
				h: identityData.h
			}
		}
	};
}
function renderIdentityDataFromUrl() {
	renderIdentity(decryptIdentityFromUrl(window.location.hash.substring(1)));
}

renderIdentityDataFromUrl();





var video = document.getElementById("qr-video");
var canvas = document.getElementById("qr-canvas");
var ctx = canvas.getContext('2d');
var localMediaStream = null;

var errorCallback = function(e) {
	console.log('Reeeejected!', e);
};

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

qrcode.callback = function() {
	console.log('qrcode.callback');
	console.log(arguments);
};

function snapshot() {
	if (localMediaStream) {
		ctx.drawImage(video, 0, 0);
		// "image/webp" works in Chrome.
		// Other browsers will fall back to image/png.
		document.getElementById("qr-image").src = canvas.toDataURL('image/webp');

		readAsQrCode();
	}
}

var Snapshotter = (function() {
	var timeoutId;
	return {
		start: function() {
			if(timeoutId) return;
			timeoutId = setInterval(snapshot, 100);
		},
		stop: function() {
			if(timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = undefined;
		}
	};
})();

var readAsQrCode = (function() {
	var _reading = false;
	return function() {
		if(_reading) return null;

		_reading = true;
        try{
            qrcode.decode();
			document.getElementById("video-capture-end").onclick();
            return true;
        }
        catch(e){
            console.log(e);
			return false;
        }
        finally {
			_reading = false;
        }
	};
})();

var capturing = false;
document.getElementById("video-capture-begin").onclick = function(e) {
	if(e) e.preventDefault();

	if(capturing) return;

	navigator.getUserMedia({video: true}, function(stream) {
		video.src = window.URL.createObjectURL(stream);
		localMediaStream = stream;
	}, errorCallback);

	Snapshotter.start();

	capturing = true;
};
document.getElementById("video-capture-end").onclick = function(e) {
	if(e) e.preventDefault();

	video.pause();
	localMediaStream.stop(); // Doesn't do anything in Chrome.

	Snapshotter.stop();

	capturing = false;
};

var form = document.getElementById("form-create-identity");
function inputToObject(data, inputName, inputValue) {
	var ptr = data, tokens = inputName.split('[');
	for(var i=0, ct = tokens.length; i<ct; i++) {
		key = tokens[i].replace(/]$/, '');
		if(ptr[key] == null) { // == to account for both null and undefined
			ptr[key] = (i<ct-1) ? {} : inputValue;
		}

		ptr = ptr[key];
	}

	return ptr;
}
form.onsubmit = function() {
	var form = this,
	    inputs = form.getElementsByTagName("input"),
	    data = {};

	for(var i=0, ct=inputs.length; i<ct; i++) {
		inputToObject(data, inputs[i].name, inputs[i].value);
	}

	console.log(data);

	return false;
};



