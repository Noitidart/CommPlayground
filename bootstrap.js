// we need `Services` object
// var { ChromeWorker, Cu } = require('chrome'); // SDK
var { utils:Cu } = Components; // non-SDK
Cu.import('resource://gre/modules/Services.jsm');

// Globals
var gWkComm;
const TOOLKIT = Services.appinfo.widgetToolkit.toLowerCase(); // needed for Linux to detect if should use GTK2 or GTK3
const PATH_SCRIPTS = 'chrome://jscsystemhotkey-demo/content/resources/scripts/';

function startup() {
	// Imports
	Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'Comm/Comm.js');
	({ callInMainworker } = CommHelper.bootstrap);

	// Setup the worker
	gWkComm = new Comm.server.worker(PATH_SCRIPTS + 'MainWorker.js', ()=>({TOOLKIT}), undefined, onBeforeTerminate );

	// Register the hotkeys
	callInMainworker('hotkeysRegister', null, function(failed) {
	  console.error('Failed to register due to error registering "' + failed.hotkey.desc + '". Reason given was:', failed.reason);
	});

}

function onBeforeTerminate() {
  return new Promise(resolve =>
	  callInMainworker( 'onBeforeTerminate', null, ()=>resolve() )
  );
}
