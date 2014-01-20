"use strict";

function ClientStorage(clientStorage, namespace){
	this.enabled = typeof(Storage) !== "undefined";
	this.clientStorage = clientStorage;
	this.namespace = namespace;
}

ClientStorage.prototype = (function(){
	return {
		key: function(key) {
			return this.namespace + '>' + key ;
		},

		get: function(key) {
			if(!this.enabled) return undefined;

			key = this.key(key);

			return JSON.parse(this.clientStorage.getItem(key));
		},

		set: function(key, val) {
			if(!this.enabled) return undefined;

			key = this.key(key);
			this.clientStorage.setItem(key, JSON.stringify(val));

			return val;
		},

		remove: function(key) {
			if(!this.enabled) return undefined;

			var val;

			key = this.key(key);
			val = this.clientStorage.getItem(key);
			this.clientStorage.removeItem(key);

			return val;
		},

		iterate: function(fn, scope) {
			if(!this.enabled) return undefined;

			var cs = this.clientStorage, key, keys, ct = 0;
			for (var i=0; i<cs.length; i++) {
				key = cs.key(i);
				keys = key.split('>');
				if ((keys.length == 2) && (keys[0] == this.namespace)) {
					fn.call(scope || this, keys[1], JSON.parse(cs.getItem(key)));
					ct++;
				}
			}
			return ct;
		}
	};
})();

function LocalStorage(namespace){
	this.namespace = namespace;
	ClientStorage.call(this, window.localStorage, namespace);
}
LocalStorage.prototype = new ClientStorage();
LocalStorage.prototype.constructor = LocalStorage;

function SessionStorage(namespace){
	this.namespace = namespace;
	ClientStorage.call(this, window.sessionStorage, namespace);
}
SessionStorage.prototype = new ClientStorage();
SessionStorage.prototype.constructor = SessionStorage;
