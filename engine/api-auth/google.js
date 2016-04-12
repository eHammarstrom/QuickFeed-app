'use strict'
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const SCOPES = ['https://mail.google.com/'];
const TOKEN_DIR = (process.env.HOME ||
    process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';

const secret = readSecret();

/** Working as currently intended **/
function readSecret() {
    let promise = new Promise(function(resolve, reject) {
        fs.readFile(__dirname + '/gmail_client_secret.json', function(err, content) {
            if (err) {
                reject(err);
            } else {
                let contentJson = JSON.parse(content);
                resolve(contentJson);
            }
        });
    });
    return promise;
}

function readToken() {
    let promise = new Promise(function(resolve, reject) {
        fs.readFile(TOKEN_DIR + 'test.json', function(err, token) {
            console.log(JSON.stringify(JSON.parse(token)));
            if (err) {
                reject(false);
            } else {
                resolve(JSON.parse(token));
            }
        });
    });
    return promise;
}

function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch(err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_DIR + 'test.json', JSON.stringify(token));
    console.log('storeToken > \n\t ' + TOKEN_DIR + 'test.json\n\t' + JSON.stringify(token));
}

function getOAuth2Client() {
    let promise = new Promise(function(resolve, reject) {
        secret.then(function(json) {
            console.log('secret json \t\t' + JSON.stringify(json));
            let clientSecret = json.installed.client_secret;
            let clientId = json.installed.client_id;
            let redirectUrl = json.installed.redirect_uris[0];
            let auth = new googleAuth();
            let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
            readToken().then(function(token) {
                oauth2Client.credentials = token;
                console.log('getOAuth2Client > \n\t created oauth2Client');
                console.log('\t\t' + JSON.stringify(oauth2Client));
                resolve(oauth2Client);
            }).catch(function() {
                reject(new Error('Could not assign token to oauth2client'));
            });
        }).catch(function(err) {
            reject(new Error('getOAuth2Client > Failed to get oauth2Client'));
        })
    });
    return promise;
}

module.exports = {

    requestAuthUrl: function(callback) {
        getOAuth2Client().then(function(oauth2Client) {
            let url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });

            console.log('url generated: ' + url);
            callback(url);
        }).catch(function(err) {
            return new Error('failed to generateAuthUrl');
        });
    },

    requestToken: function(code) {
        let promise = new Promise(function(resolve, reject) {
            getOAuth2Client().then(function(oauth2Client) {
                oauth2Client.getToken(code, function(err, token) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(token);
                    }
                });
            });
        });
        return promise;
    },

    writeToken: function(token) {
        storeToken(token);
    },

    readToken: function() {
        readToken.then(function(token) {
            return token;
        });
    },

    getAuthorizedOAuth2Client: function(callback) {
        return getOAuth2Client();
    }

};
