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

fs.readFile('gmail_client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.error('Error loading client secret file: ' + err);
        return;
    }

    authorize(JSON.parse(content), listLabels);
});

function authorize(credentials, callback) {
    let clientSecret = credentials.installed.client_secret;
    let clientId = credentials.installed.client_id;
    let redirectUrl = credentials.installed.redirect_uris[0];
    let auth = new googleAuth();
    let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

function getNewToken(oauth2Client, callback) {
    let authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize by visiting this url: ', authUrl);

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.error('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

function listLabels(auth) {
    let gmail = google.gmail('v1');
    gmail.users.labels.list({
        auth: auth,
        userId: 'me',
    }, function(err, response) {
        if (err) {
            console.error('The API returned and error: ' + err);
            return;
        }

        let labels = response.labels;
        if (labels.length == 0) {
            console.log('No labels found.');
        } else {
            console.log('Labels:');
            for (let i = 0; i < labels.length; i++) {
                let label = labels[i];
                console.log('- %s', label.name);
            }
        }
    });
}
