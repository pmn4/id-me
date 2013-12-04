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
	return encrypted.toString(CryptoJS.enc.Base64);
}
function dencryptIdentityFromUrl(dataString) {
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
	renderIdentity(dencryptIdentityFromUrl(window.location.hash.substring(1)));
}

renderIdentityDataFromUrl();
