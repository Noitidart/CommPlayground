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
	gWhateverWorker = new Comm.server.worker('chrome://comm/content/resources/scripts/MainWorker.js');

	DirectoryWatcherMainthreadInit('gWhateverWorker');
	callInDirectoryWatcherWorker('dummystartup');

}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) { return }

	gWhateverWorker.unregister(); // or call `Comm.server.unregAll('worker')`

}
