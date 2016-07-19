// Import DirectoryWatcher
importScripts('chrome://comm/content/resources/scripts/watcher/DirectoryWatcherWorkerSubscript.js');
importScripts('chrome://comm/content/resources/scripts/DirectoryWatcherPaths.js');

// Globals
var dummystartup = ()=>0;

// Addon functionalities
console.log('ok ready');
var watcher1 = new DirectoryWatcher(function(aFilePath, aEventType, aExtra) {
	console.log('in watcher1 handler:', 'aFilePath:', aFilePath, 'aEventType:', aEventType, 'aExtra:', aExtra);
});
watcher1.addPath(OS.Path.join(OS.Constants.Path.desktopDir, 'dist'));
watcher1.addPath(OS.Path.join(OS.Constants.Path.desktopDir, 'bin'));

// setTimeout(function() {
// 	console.log('triggering remove path from mainworker');
// 	watcher1.removePath(OS.Path.join(OS.Constants.Path.desktopDir)).then(val=>console.log('mainworker removed:', val)).catch(caught=>console.error('caught:', err));
// }, 10000);
