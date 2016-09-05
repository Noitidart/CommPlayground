var { utils:Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');

const TOOLKIT = Services.appinfo.widgetToolkit.toLowerCase(); // needed for Linux to detect if should use GTK2 or GTK3
const PATH_SCRIPTS = 'chrome://jscfilewatcher-demo/content/resources/scripts/';
var gWkComm;
var ostypes;
var callInMainworker;

function onBeforeMainworkerTerminate() {
	console.log('in onBeforeMainworkerTerminate');
	var promiseallarr = [];

	promiseallarr.push(new Promise(resolve =>
		callInMainworker('dwShutdown', null, ()=>resolve())
	));

	console.log('ok returning onBeforeMainworkerTerminate a promise');
	return Promise.all(promiseallarr);
}

function install() {}
function uninstall() {}

function startup(aData, aReason) {

	Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'Comm/Comm.js');
	callInMainworker = CommHelper.bootstrap.callInMainworker; // jscFileWatcher needs `callInMainworker`

	initOstypes(PATH_SCRIPTS); // must import ostypes before importing DirectoryWatcher

	Services.scriptloader.loadSubScript(PATH_SCRIPTS + 'watcher/dwMainthreadSubscript.js');

	// if you want to pass a string to dwMainthreadInit then make sure gWkComm is global. its good to make it global though, so on shutdown you can unregister it (which will terminate/clean up the workers)
	gWkComm = new Comm.server.worker(PATH_SCRIPTS + 'MainWorker.js', ()=>TOOLKIT, undefined, onBeforeMainworkerTerminate);

	callInMainworker('dummystartup');

}

function shutdown(aData, aReason) {

	// need to do this unregister even if browser is shutting down. because if a poll is going on, then it will keep the browser from closing
	console.log('unregistering gWkComm');
	gWkComm.unregister(); // or call `Comm.server.unregAll('worker')`

	if (aReason == APP_SHUTDOWN) { return }

}

// rev1 - https://gist.github.com/Noitidart/05f4d6e610538b1b05221943e9fb0531
function initOstypes(aPathToDirContainingOstypes) {
	if (typeof(ostypes) == 'undefined') {
		if (typeof(ctypes) == 'undefined') {
			Cu.import('resource://gre/modules/ctypes.jsm');
		}

		Services.scriptloader.loadSubScript(aPathToDirContainingOstypes + 'ostypes/cutils.jsm'); // need to load cutils first as ostypes_mac uses it for HollowStructure
		Services.scriptloader.loadSubScript(aPathToDirContainingOstypes + 'ostypes/ctypes_math.jsm');
		switch (Services.appinfo.OS.toLowerCase()) {
			case 'winnt':
			case 'winmo':
			case 'wince':
					Services.scriptloader.loadSubScript(aPathToDirContainingOstypes + 'ostypes/ostypes_win.jsm');
				break;
			case 'darwin':
					Services.scriptloader.loadSubScript(aPathToDirContainingOstypes + 'ostypes/ostypes_mac.jsm');
				break;
			default:
				// assume xcb (*nix/bsd)
				Services.scriptloader.loadSubScript(aPathToDirContainingOstypes + 'ostypes/ostypes_x11.jsm');
		}
	}
}
