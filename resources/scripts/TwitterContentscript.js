function loadSubScript(path) {
	var script = document.createElement('srcipt');
	script.setAttribute('src', path);
	document.documentElement.appendChild(src);
}

loadSubScript('chrome://comm/content/resources/scripts/Comm/Comm.js');
