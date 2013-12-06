/*

http://sportsid.com/
{
	i: 10100100, // 9+3  : db record
	n: "25 25",  // 97+3 : first, last name
	b: 41600,    // 5+3  : days since 1/1/1900
	x: 10,
	y: 10,
	h: 55,
	w: 75,
	d: "hex..."  // 2000 - (sum(12, 100, 8, 2)) => 1880
}

{
	name: "Nailed It!",
	birthdate: new Date(1989, 2, 3),
	images: {
		base64: {
			protocol: "data:image/png;base64,",
			href: "iVBORw0KGgoAAAANSUhEUgAAAAgAAAALCAYAAABCm8wlAAABTklEQVQYVx2PPU8TcRyAn9/dtfe/l/aKhaMNkxRlMUpiDA6SEMLEiokrC6vxI+AMpCyszITEOBFcNNHduBgTBmIYGkkEGqDX9q7H/UC/wPMiX44+arvd5qzzB8uy0KLAtm08z2NzewtZePFMXR3RCFwiU6KX5NQiQy4lfnX+Iq/mZnXpcUyIEDllXONT5EOu01uOb4bI8ss5XXxYJ2KE53i4vk/WT+gVOecZyMrzJzo/HdNNc1pxTLNW4dP3H0xEdYxXRtYWnuqjmSl+n3ZpTcV42RWJU8N1yxgrRzZeL2szCnADQ/eyC2mKqYaE/1R5gbx/s6KVyOKBbegng/+RthRYolxkGbKz8U4HJz/xSw7p/aKWDJKljNUDznop8vXwQD/v7zFhylx1EhrVOhfDc8LJCv1wHPl2dKAfdrdpjAX4Yt2jDWqN6KnD6vpb7gA+F3fQ/zPS+QAAAABJRU5ErkJggg==",
			x: 20,
			y: 10,
			w: 55,
			h: 75
		},
		orig: {
			protocol: "http:",
			href: "//images.ussportscamps.com/coaches/TonyLowe1.JPG"
		}
	}
}
*/

(function imgToData(jsImage, maxChars) {
	var imgData, scale = 1;

	if(!maxChars) maxChars = 1778;

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