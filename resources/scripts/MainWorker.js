// Globals
var TOOLKIT;
var dummystartup = ()=>0;
const PATH_SCRIPTS = 'chrome://jscfilewatcher-demo/content/resources/scripts/';

// import Comm
importScripts(PATH_SCRIPTS + 'Comm/Comm.js');
var { callInBootstrap } = CommHelper.mainworker; // jscFileWatcher needs `callInBootstrap`

var gBsComm = new Comm.client.worker();

// import ostypes
importScripts(PATH_SCRIPTS + 'ostypes/cutils.jsm');
importScripts(PATH_SCRIPTS + 'ostypes/ctypes_math.jsm');

switch (OS.Constants.Sys.Name.toLowerCase()) {
  case 'winnt':
  case 'winmo':
  case 'wince':
		  importScripts(PATH_SCRIPTS + 'ostypes/ostypes_win.jsm');
	  break;
  case 'darwin':
		  importScripts(PATH_SCRIPTS + 'ostypes/ostypes_mac.jsm');
	  break;
  default:
	  // we assume it is a GTK based system. All Linux/Unix systems are GTK for Firefox. Even on Qt based *nix systems.
	  importScripts(PATH_SCRIPTS + 'ostypes/ostypes_x11.jsm');
}

// Import DirectoryWatcher
var dwPathWatcherDir = PATH_SCRIPTS + 'watcher/';
importScripts(PATH_SCRIPTS + 'watcher/dwMainworkerSubscript.js');

function init(aArg) {
	TOOLKIT = aArg;
	console.log('TOOLKIT set to:', TOOLKIT); // need TOOLKIT before doing addPath because

}

// Addon functionalities
var watcher1 = new DirectoryWatcher(function(aFilePath, aEventType, aExtra) {
	console.log('in watcher1 handler:', 'aFilePath:', aFilePath, 'aEventType:', aEventType, 'aExtra:', aExtra);
});
watcher1.addPath(OS.Constants.Path.desktopDir);
// watcher1.addPath(OS.Path.join(OS.Constants.Path.desktopDir, 'dist'));
// watcher1.addPath(OS.Path.join(OS.Constants.Path.desktopDir, 'bin'));

// setTimeout(function() {
// 	console.log('triggering remove path from mainworker');
// 	watcher1.removePath(OS.Path.join(OS.Constants.Path.desktopDir)).then(val=>console.log('mainworker removed:', val)).catch(caught=>console.error('caught:', err));
// }, 10000);
