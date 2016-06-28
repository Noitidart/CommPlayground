const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu, Constructor: CC} = Components;

Cu.import('resource://gre/modules/Services.jsm');
Cu.importGlobalProperties(['Blob', 'URL']);

var core = {
    addon: {
        name: 'CommPlayground',
        id: 'CommPlayground@jetpack',
        path: {
            content: 'chrome://commplayground/content/',
            modules: 'chrome://commplayground/content/modules/modules/'
        }
    }
};

var gBootstrap;
function main() {
    Cu.import(core.addon.path.modules + 'Comm/Comm.js');
}

function unmain() {
    Cu.unload(core.addon.path.modules + 'Comm/Comm.js');
}

function install() {}
function uninstall() {}

function startup(aData, aReason) {

	main();

}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) { return }

	unmain();
}
