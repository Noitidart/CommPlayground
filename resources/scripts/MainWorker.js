// Globals
const PATH_SCRIPTS = 'chrome://jscsystemhotkey-demo/content/resources/scripts/';
var TOOLKIT; // dont use `const` otherwise `ostypes_x11.js` will not be able to see this // needed for ostypes for linux to know if should use GTK2 or GTK3

// Imports
importScripts(PATH_SCRIPTS + 'Comm/Comm.js');
var { callInBootstrap } = CommHelper.mainworker;

importScripts(PATH_SCRIPTS + 'jscSystemHotkey/shtkMainworkerSubscript.js');

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
		  importScripts(PATH_SCRIPTS + 'ostypes/ostypes_darwn.jsm');
	  break;
  default:
	  // we assume it is a GTK based system. All Linux/Unix systems are GTK for Firefox. Even on Qt based *nix systems.
	  importScripts(PATH_SCRIPTS + 'ostypes/ostypes_x11.jsm');
}

// Setup communication layer with bootstrap
var gBsComm = new Comm.client.worker();

function onBeforeTerminate() {
  var promiseall_arr = [];
  promiseall_arr.push(hotkeysUnregister()); // on mac its a promise, on others its not, but `Promise.all` works fine with non-promise entries in its array
  // any other things you want to do before terminate, push it to promiseall_arr
  return Promise.all(promiseall_arr);
}

function init(aArg) {
	({ TOOLKIT } = aArg);

    setTimeout(hotkeysUnregister, 10000);
}

// THE WORKER CODE FROM "STEP 1" FROM ABOVE
var gHKI = { // stands for globalHotkeyInfo
	path_pollworker: PATH_SCRIPTS + 'jscSystemHotkey/shtkPollWorker.js',
    loop_interval_ms: 200, // only for windows and xcb - you can think of this as "if a user hits the hotkey, it will not be detected until `loop_interval_ms`ms later".
    min_time_between_repeat: 1000, // if a the user holds down the hotkey, it will not trigger. the user must release the hotkey and wait `min_time_between_repeat`ms before being able to trigger the hotkey again
    hotkeys: undefined, // array of objects we set based on platform below
    callbacks: { // `key` is any string, and value is a function, you will use the `key` in the `callback` field of each hotkey, see `hotkeys` array below
        blah: function() {
            console.log('blah triggered by hotkey!')
        }
    }
};

// we set the hotkeys based on the platform
switch (OS.Constants.Sys.Name.toLowerCase()) {
    case 'winnt':
    case 'winmo':
    case 'wince':
            gHKI.hotkeys = [
                {
                    code: ostypes.CONST.VK_SPACE, // can use any `ostypes.CONST.VK_***` or `ostypes.CONST.vk_***`, see `ostypes_win.jsm` for list of values
                    mods: {
                        /* List of boolean keys
                         *   shift
                         *   ctrl
                         *   alt
                         *   meta
                         *   capslock - xcb (*nix/bsd) only
                         *   numlock - xcb (*nix/bsd) only
                         */
                        shift: true
                    },
                    desc: 'Shift + Space Bar', // this is the description in english (or whatever language) of the key combination described by `code` and `mods`. this is used when teling which hotkey failed to register
                    callback: 'blah' // string - key of the callback in the `gHKI.callbacks` object
                }
            ];
        break;
    case 'darwin':
            gHKI.hotkeys = [
                {
                    code: ostypes.CONST.KEY_Space,  // can use any `ostypes.CONST.KEY_***` or `ostypes.CONST.NX_***`, see `ostypes_mac.jsm` for list of values. See section "About mac_method" to see which method supports which keys, I haven't fully studied this, so please your knowledge/experiences with it
                    mods: {
                        shift: true
                    },
                    desc: 'Shift + Space Bar',
                    callback: 'blah',
                    mac_method: 'carbon' // this key is only available to macs, see the section "About mac_method" to learn about this // other possible values are 'corefoundation' and 'objc'
                }
            ];
        break;
    default:
        // xcb (*nix/bsd)
        gHKI.hotkeys = [
            {
                code: ostypes.CONST.XK_Space, // can use any `ostypes.CONST.XK_***`, see `ostypes_x11.jsm` for list of values
                mods: {
                    shift: true
                },
                desc: 'Shift + Space Bar',
                callback: 'blah'
            },
            // because xcb (*nix/bsd) count capslock and numlock, we need to add three more combos just for these
            {
                code: ostypes.CONST.XK_Space,
                mods: {
                    shift: true,
                    capslock: true
                },
                desc: 'Shift + Space Bar',
                callback: 'blah'
            },
            {
                code: ostypes.CONST.XK_Space,
                mods: {
                    shift: true,
                    numlock: true
                },
                desc: 'Shift + Space Bar',
                callback: 'blah'
            },
            {
                code: ostypes.CONST.XK_Space,
                mods: {
                    shift: true,
                    capslock: true,
                    numlock: true
                },
                desc: 'Shift + Space Bar',
                callback: 'blah'
            }
        ];
}
