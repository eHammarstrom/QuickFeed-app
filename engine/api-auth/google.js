'use strict'
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const async = require('async');

const SCOPES = ['https://mail.google.com/'];
const TOKEN_DIR = (process.env.HOME ||
    process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';

/** Working as currently intended **/
function readSecret(callback) {
    fs.readFile(__dirname + '/gmail_client_secret.json', function(err, content) {
        if (err) {
            throw err;
        } else {
            console.log('\tREAD SECRET > ' + JSON.stringify(JSON.parse(content)));
            callback(null, JSON.parse(content));
        }
    });
}

function readToken(callback) {
    fs.readFile(TOKEN_DIR + 'test.json', function(err, token) {
        if (err) {
            if (err.code != 'ENOENT') {
                throw err;
            }
            console.log('\tREAD TOKEN > User has not authenticated a google account yet.');
            callback(err);
        } else {
            console.log('\tREAD TOKEN > ' + JSON.stringify(JSON.parse(token)));
            callback(null, JSON.parse(token));
        }
    });
}

function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_DIR + 'test.json', JSON.stringify(token));
    console.log('\tstoreToken > ' + TOKEN_DIR + 'test.json\t' + JSON.stringify(token));
}

function getOAuth2Client() {
    let promise = new Promise(function(resolve, reject) {
        async.series([
            (callback) => {
                readSecret(callback);
            },
            (callback) => {
                readToken(callback);
            }
        ], (err, results) => {
            let secret = results[0];
            let token = results[1];

            let auth = new googleAuth();
            let oauth2Client = new auth.OAuth2(
                secret.installed.client_id,
                secret.installed.client_secret,
                secret.installed.redirect_uris[0]
            );

            if (!err) {
                oauth2Client.credentials = token;
            }

            console.log('\tCREATED AUTH CLIENT > ' + JSON.stringify(oauth2Client));
            resolve(oauth2Client);
        });
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

            console.log('\tURL GENERATED > ' + url);
            callback(url);
        }).catch(function(err) {
            throw err;
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

    readToken: function() { },

    getAuthorizedOAuth2Client: function(callback) {
        return getOAuth2Client();
    }

};
