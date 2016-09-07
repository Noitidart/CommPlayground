## About
This is demo usage of the [jscFileWatcher submodule](https://github.com/Noitidart/jscFileWatcher/).

It will watch your Desktop (`OS.Constants.Path.desktopDir`). If Android, it will watch your profile directory (`OS.Constants.Path.profileDir`). Do any file changes there and you will see messages logged to the "Browse Console".

### How to install
1. Download `CommPlayground.xpi`
2. In Firefox, go to `about:debugging`
3. Click "Load Temporary Addon" and load the xpi
4. Open "Browser Console"
5. Go make files on your desktop and watch the events be logged

*On Android just install the XPI by opening the file, and make changes in your Firefox profile directory*
