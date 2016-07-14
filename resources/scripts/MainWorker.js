// Import DirectoryWatcher
importScripts('chrome://comm/content/resources/scripts/watcher/DirectoryWatcherWorkerSubscript.js');

// Globals
var dummystartup = ()=>0;

// Addon functionalities
console.log('ok ready');
var watcher1 = new DirectoryWatcher(function(aFilePath, aEventType, aExtra) {
	console.log('in watcher1 handler:', 'aFilePath:', aFilePath, 'aEventType:', aEventType, 'aExtra:', aExtra);
});
watcher1.addPath(OS.Constants.Path.desktopDir);
