/*jshint esversion: 6 */
const googleAuth = require('../engine/api-auth/lama-risky-google.js');
const BrowserWindow = require('electron').BrowserWindow;

exports.startAuthorization = function() {
    let authWindow = new BrowserWindow({
        'use-content-size': true,
        center: true,
        show: false,
        resizeable: false,
        'always-on-top': true,
        'standard-window': true,
        'auto-hide-menu-bar': true
    });
    authWindow.openDevTools();

    googleAuth.requestAuthUrl(function(url) {
        authWindow.loadURL(url);

        getAuthCode(authWindow).then(function(code) {
            console.log(code);
            googleAuth.requestToken(code).then(function(token) {
                console.log(token);
                googleAuth.writeToken(token);
            }).catch(function(data) {
                console.log(data);
            });
        }).catch(function(val) {
            console.log(code);
        });
    });
};

// solution heavily inspired by github.com/parro-it/electron-google-oauth
function getAuthCode(authWindow) {
    let promise = new Promise(function(resolve, reject) {
        authWindow.show();

        authWindow.on('closed', function() {
            reject(new Error('User closed window'));
        });

        authWindow.on('page-title-updated', function() {
            setImmediate(function() {
                const title = authWindow.getTitle();

                if (title.startsWith('Denied')) {
                    reject('denied');
                    authWindow.removeAllListeners('closed');
                    authWindow.close();
                } else if (title.startsWith('Success')) {
                    resolve(title.split(/[ =]/)[2]);
                    authWindow.removeAllListeners('closed');
                    authWindow.close();
                }
            });
        });
    });
    return promise;
}
