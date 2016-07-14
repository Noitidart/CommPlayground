// Globals
var core = {
	addon: {
		path: {
			scripts: 'chrome://comm/content/resources/scripts/'
		},
		cache_key: Math.random() // set to version on release
	},
	os: {
		name: OS.Constants.Sys.Name.toLowerCase()
	}
};

// Imports
importScripts('resource://gre/modules/osfile.jsm');
importScripts(core.addon.path.scripts + 'Comm/Comm.js');

// Import ostypes
importScripts(core.addon.path.scripts + 'ostypes/cutils.jsm');
importScripts(core.addon.path.scripts + 'ostypes/ctypes_math.jsm');
switch (core.os.name) {
	case 'winnt':
	case 'winmo':
	case 'wince':
		importScripts(core.addon.path.scripts + 'ostypes/ostypes_win.jsm');
		break
	case 'darwin':
		importScripts(core.addon.path.scripts + 'ostypes/ostypes_mac.jsm');
		break;
	default:
		// assume gtk based OR android
		importScripts(core.addon.path.scripts + 'ostypes/ostypes_x11.jsm');
}

// Addon functionalities
console.log('ok ready');

// start - common helper functions
function Deferred() {
	this.resolve = null;
	this.reject = null;
	this.promise = new Promise(function(resolve, reject) {
		this.resolve = resolve;
		this.reject = reject;
	}.bind(this));
	Object.freeze(this);
}
function genericReject(aPromiseName, aPromiseToReject, aReason) {
	var rejObj = {
		name: aPromiseName,
		aReason: aReason
	};
	console.error('Rejected - ' + aPromiseName + ' - ', rejObj);
	if (aPromiseToReject) {
		aPromiseToReject.reject(rejObj);
	}
}
function genericCatch(aPromiseName, aPromiseToReject, aCaught) {
	var rejObj = {
		name: aPromiseName,
		aCaught: aCaught
	};
	console.error('Caught - ' + aPromiseName + ' - ', rejObj);
	if (aPromiseToReject) {
		aPromiseToReject.reject(rejObj);
	}
}
function setTimeoutSync(aMilliseconds) {
	var breakDate = Date.now() + aMilliseconds;
	while (Date.now() < breakDate) {}
}
// end - common helper functions
