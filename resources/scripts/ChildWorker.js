importScripts('chrome://comm/content/resources/scripts/Comm/Comm.js');
var {callInBootstrap, callInMainworker} = CommHelper.childworker;
var gWkComm = new Comm.client.worker();

function routine(aArg, aReportProgress, aComm) {
	console.log('in routine');
	aReportProgress({text:'step 1'});
	aReportProgress({text:'step 2'});
	return 'step 3 - done';
}
