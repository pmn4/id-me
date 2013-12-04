/*

http://sportsid.com/
{
	i: 10100100, // 9+3  : db record
	n: "25 25",  // 97+3 : first, last name
	b: 41600,    // 5+3  : days since 1/1/1900
	x: 10,
	y: 10,
	d: "hex..."  // 2000 - (sum(12, 100, 8, 2)) => 1880
}

*/

(function imgToData(jsImage, maxChars) {
	var imgData, scale = 1;

	if(!maxChars) maxChars = 1778

	do {
		var canvas = document.createElement("canvas"),
			w = 55, //jsImage.width, //
			h = 75; //jsImage.height; //

		canvas.width = scale * w;
		canvas.height = scale * h;

		var ctx = canvas.getContext("2d");
		ctx.scale(scale, scale);
		ctx.drawImage(jsImage, 20, 10, w, h, 0, 0, w, h);
//		ctx.drawImage(jsImage, 0, 0, w, h, 0, 0, w, h);

		imgData = canvas.toDataURL("image/gif", 0.2);

		console.log(scale, imgData.length);

		scale -= 0.01; // - 1%
	} while (scale > 0 && imgData.length > maxChars);  // make this a recursive bsearch

	return imgData;
})(img, 500)