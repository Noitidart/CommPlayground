var { utils:Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');

var gWhateverWorker;

function install() {}
function uninstall() {}

function startup(aData, aReason) {

	Services.scriptloader.loadSubScript('chrome://comm/content/resources/scripts/Comm/Comm.js');
	Services.scriptloader.loadSubScript('chrome://comm/content/resources/scripts/DirectoryWatcherPaths.js');
	Services.scriptloader.loadSubScript('chrome://comm/content/resources/scripts/watcher/DirectoryWatcherMainthread.js');

	// make sure gWhateverWorker is defined as global!
	gWhateverWorker = new Comm.server.worker('chrome://comm/content/resources/scripts/MainWorker.js', undefined, undefined, dwShutdownMT);

	dwMainthreadInit(gWhateverWorker);
	callInDWWorker('dummystartup');

}

function shutdown(aData, aReason) {

	// need to do this unregister even if browser is shutting down. because if a poll is going on, then it will keep the browser from closing
	console.log('unregistering gWhateverWorker');
	gWhateverWorker.unregister(); // or call `Comm.server.unregAll('worker')`

	if (aReason == APP_SHUTDOWN) { return }

}
