// we need `Services` object
// var { ChromeWorker, Cu } = require('chrome'); // SDK
var { utils:Cu } = Components; // non-SDK
Cu.import('resource://gre/modules/Services.jsm');

// Globals
var gWkComm;
var ostypes;
const TOOLKIT = Services.appinfo.widgetToolkit.toLowerCase(); // needed for Linux to detect if should use GTK2 or GTK3
const PATH_SCRIPTS = 'chrome://jscsystemhotkey-demo/content/resources/scripts/';

function startup() {
	// Imports
	Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'Comm/Comm.js');
	({ callInMainworker } = CommHelper.bootstrap); // jscSystemHotkey needs `callInMainworker`

	Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'jscSystemHotkey/shtkMainthreadSubscript.js');
	initOstypes(); // import ostypes

	// Setup the worker
	gWkComm = new Comm.server.worker(PATH_SCRIPTS + 'MainWorker.js', ()=>({TOOLKIT}), undefined, onBeforeTerminate );

	// Register the hotkeys
	callInMainworker('hotkeysRegister', null, function(failed) {
		if (failed) {
			console.error('Failed to register due to error registering "' + failed.hotkey.desc + '". Reason given was:', failed.reason);
		} else {
			console.log('succesfully registered hotkeys');
		}
	});

}
function shutdown() {
	Comm.server.unregAll('worker');
}
function install() {}
function uninstall() {}

function onBeforeTerminate() {
  return new Promise(resolve =>
	  callInMainworker( 'onBeforeTerminate', null, ()=>resolve() )
  );
}

function initOstypes() {
	if (!ostypes) {
		if (typeof(ctypes) == 'undefined') {
			Cu.import('resource://gre/modules/ctypes.jsm');
		}

		Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'ostypes/cutils.jsm'); // need to load cutils first as ostypes_mac uses it for HollowStructure
		Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'ostypes/ctypes_math.jsm');
		switch (Services.appinfo.OS.toLowerCase()) {
			case 'winnt':
			case 'winmo':
			case 'wince':
					Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'ostypes/ostypes_win.jsm');
				break;
			case 'darwin':
					Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'ostypes/ostypes_mac.jsm');
				break;
			default:
				// assume xcb (*nix/bsd)
				Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'ostypes/ostypes_x11.jsm');
		}
	}
}
