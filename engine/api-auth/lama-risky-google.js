'use strict';

const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];
const TOKEN_DIR = (process.env.HOME ||
    process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';

const TOKEN_PATH = TOKEN_DIR + 'lama-risky-gmail-compose.json';

function readSecret(callback) {
    fs.readFile(__dirname + '/gmail_client_secret.json', function(err, content) {
        if (err) {
            console.error('Error loading secret: ' + err);
            return;
        } else {
            let secret = JSON.parse(content);
            callback(secret);
        }
    });
}

module.exports = {

    tokenExists: function(callback) {
        fs.readFile(TOKEN_PATH, function(err, token) {
            if (err) {
                console.error('function tokenExists error: ' + err);
                return;
            } else {
                let json = JSON.parse(token);
                callback(json);
            }
        });
    },

    authUrl: function(callback) {
        readSecret(function(secret) {
            let clientSecret = secret.installed.client_secret;
            let clientId = secret.installed.client_id;
            let redirectUrl = secret.installed.redirect_uris[0];
            let auth = new googleAuth();
            let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

            let url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });

            callback(url);
        });
    }

};
