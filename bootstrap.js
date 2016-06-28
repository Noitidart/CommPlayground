// Imports
const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu, Constructor: CC} = Components;
Cu.import('resource://gre/modules/Services.jsm');
Cu.importGlobalProperties(['Blob', 'URL']);

Services.scriptloader.loadSubScript('chrome://commplayground/content/resources/scripts/Comm/Comm.js', this);

var core = {
    addon: {
        name: 'CommPlayground',
        id: 'CommPlayground@jetpack',
        path: {
            content: 'chrome://commplayground/content/'
        }
    }
};

function main() {

}

function unmain() {

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
