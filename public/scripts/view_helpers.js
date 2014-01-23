var ViewHelpers = {
	months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	birthdateFormatted: function(date) {
		var tmp;
		if(date instanceof Date) {
			if(date > 0) {
				return ViewHelpers.months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear();
			}

			return "";
		} else if((tmp = Date.parse(date)) && !isNaN(tmp)) {
			return ViewHelpers.birthdateFormatted(new Date(tmp));
		}

		return date;
	},
	age: function(date) {
		var tmp;
		if(date instanceof Date) {
			if(date > 0) {
				return ~~((Date.now() - date) / (31557600000));
			}

			return "";
		} else if((tmp = Date.parse(date)) && !isNaN(tmp)) {
			return ViewHelpers.age(new Date(tmp));
		} else if((tmp = new Date(date)) && !isNaN(tmp)) {
			return ViewHelpers.age(tmp);
		}
	}
};
