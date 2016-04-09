const App = require('app');
const BrowserWindow = require('browser-window');

let mainWindow = null;

App.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 600,
		minHeight: 400
	});

	mainWindow.setMenu(null); // no need for a menu bar atm
	mainWindow.loadURL('file://' + __dirname + '/main.html');
	mainWindow.openDevTools(); // remove line from production

	mainWindow.on('closed', function() {
		// maybe store windows in array later and dereference all on mainWindow close.
		// depends on if program will become multi-windowed
		mainWindow = null;
	});
});
