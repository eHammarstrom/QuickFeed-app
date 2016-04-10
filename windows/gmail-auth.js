/*jshint esversion: 6 */
const googleAuth = require('../engine/api-auth/lama-risky-google.js');
const BrowserWindow = require('electron').BrowserWindow;

exports.startAuthorization = function() {
    let authWindow = new BrowserWindow({
        width: 400,
        height: 300,
        minWidth: 400,
        minHeight: 300,
        show: false
    });
    authWindow.setMenu(null);
    authWindow.openDevTools();
    //authWindow.setMaxListeners(50);

    // This is the first state where we load gmail auth page
    // if done correctly we enter next callback function to catch token post
    // if done incorrectly we exit out and throw the httpResponseCode *FOR NOW*
    googleAuth.authUrl(function(url, secret) {
        authWindow.loadURL(url);

        console.log(JSON.stringify(secret));

        getAuthCode(authWindow).then(function(code) {
            console.log(code);
            getToken(code, secret).then(function(data) {
                console.log(data);
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

function getToken(code, secret) {
    let promise = new Promise(function(resolve, reject) {
        console.log('doing ajax call');
        let request = JSON.stringify({
            'code': code,
            'client_id': secret.installed.client_id,
            'client_secret': secret.installed.client_secret,
            'redirect_uri': secret.installed.redirect_uris[1],
            'grant_type': 'authorization_code'
        });

        /*** Here we need to make a http request like the one in ajax below ***/
        // We will use the node package REQUEST, seems optimal

        /*
        $.ajax({
            type: 'POST',
            url: 'https://accounts.google.com/o/oauth2/token',
            data: {
                'code': code,
                'client_id': secret.installed.client_id,
                'client_secret': secret.installed.client_secret,
                'redirect_uri': secret.installed.redirect_uris[1],
                'grant_type': 'authorization_code'
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
                resolve(data);
            },
            error: function(data) {
                console.error(data);
                reject(data);
            }
        });
        */
    })
    return promise;
}
