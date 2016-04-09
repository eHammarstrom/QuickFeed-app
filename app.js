const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const Menu = require('electron').Menu;
const ipcMain = require('electron').ipcMain;

let mainWindow = null;
let authWindow = null;

const gmailAuthWindow = require('./windows/gmail-auth.js');

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 600,
		minHeight: 400
	});

	mainWindow.setMenu(null); // we design and set menu in main.js instead
	mainWindow.loadURL('file://' + __dirname + '/main.html');
	mainWindow.openDevTools(); // remove line from production

	authWindow = new BrowserWindow({
		width: 400,
		height: 300,
		minWidth: 400,
		minHeight: 300,
		show: false
	});

	authWindow.setMenu(null);
	authWindow.openDevTools();

	ipcMain.on('asynchronous-message', function(event, arg) {
		if (arg === 'show-auth-gmail') {
			gmailAuthWindow.startWindow(authWindow);
		}
	});

	mainWindow.on('closed', function() {
		// maybe store windows in array later and dereference all on mainWindow close.
		// depends on if program will become multi-windowed
		authWindow = null;
		mainWindow = null;
	});
});
