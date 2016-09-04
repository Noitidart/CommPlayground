var { utils:Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');

const TOOLKIT = Services.appinfo.widgetToolkit.toLowerCase(); // needed for Linux to detect if should use GTK2 or GTK3
var gWhateverWorker;

function install() {}
function uninstall() {}

function startup(aData, aReason) {

	Services.scriptloader.loadSubScript('chrome://comm/content/resources/scripts/Comm/Comm.js');
	Services.scriptloader.loadSubScript('chrome://comm/content/resources/scripts/DirectoryWatcherPaths.js');
	Services.scriptloader.loadSubScript('chrome://comm/content/resources/scripts/watcher/DirectoryWatcherMainthreadSubscript.js');

	// if you want to pass a string to dwMainthreadInit then make sure gWhateverWorker is global. its good to make it global though, so on shutdown you can unregister it (which will terminate/clean up the workers)
	gWhateverWorker = new Comm.server.worker('chrome://comm/content/resources/scripts/MainWorker.js', TOOLKIT, undefined, dwShutdownMT);

	dwMainthreadInit(gWhateverWorker);
	callInDWWorker('dummystartup');

}

function shutdown(aData, aReason) {

	// need to do this unregister even if browser is shutting down. because if a poll is going on, then it will keep the browser from closing
	console.log('unregistering gWhateverWorker');
	gWhateverWorker.unregister(); // or call `Comm.server.unregAll('worker')`

	if (aReason == APP_SHUTDOWN) { return }

}
