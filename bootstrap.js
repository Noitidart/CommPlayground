function install() {}
function uninstall(aData, aReason) {}

function startup(aData, aReason) {
    new ChromeWorker('chrome://comm/content/resources/scripts/MainWorker.js');
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) { return }
}
