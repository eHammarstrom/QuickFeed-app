'use strict'
const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const Menu = require('electron').Menu;
const ipcMain = require('electron').ipcMain;
const gmailAuthWindow = require('./windows/gmail-auth.js');

const debug = require('./debugger.js'); // debug code

let mainWindow = null;

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 800,
		minWidth: 800,
		minHeight: 400
	});

	mainWindow.setMenu(null); // we design and set menu in main.js instead
	mainWindow.loadURL('file://' + __dirname + '/main.html');
	// mainWindow.openDevTools(); // remove line from production

    ipcMain.on('asynchronous-message', function(event, arg) {
        if (arg === 'show-auth-gmail') {
            gmailAuthWindow.startAuthorization();
        }
    });

    /** DEBUG CODE IS RAN BEFORE APP STARTUP **/
    debug.printLabels();
	debug.printMessages();
	debug.printProfile();
    /** END **/

    mainWindow.on('closed', function() {
        // maybe store windows in array later and dereference all on mainWindow close.
        // depends on if program will become multi-windowed
        mainWindow = null;
    });
});
