/*jshint esversion: 6 */
const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const Menu = require('electron').Menu;
const ipcMain = require('electron').ipcMain;

const gmailAuth = require('./windows/gmail-auth.js');

let mainWindow = null;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 600,
        minHeight: 400
    });

    mainWindow.setMenu(null); // we design and set menu in main.js instead
    mainWindow.loadURL('file://' + __dirname + '/main.html');
    // mainWindow.openDevTools(); // remove line from production

    ipcMain.on('asynchronous-message', function(event, arg) {
        if (arg === 'show-auth-gmail') {
            gmailAuth.startAuthorization();
        }
    });

    mainWindow.on('closed', function() {
        // maybe store windows in array later and dereference all on mainWindow close.
        // depends on if program will become multi-windowed
        authWindow = null;
        mainWindow = null;
    });
});
