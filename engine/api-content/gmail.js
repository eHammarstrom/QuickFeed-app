const google = require('googleapis');
const googleAuth = require('../api-auth/google.js');
const async = require('async');

const gmail = google.gmail('v1');
const authClient = googleAuth.getAuthorizedOAuth2Client();

let gmailState = {

    storedNextPageToken: null,

    getProfile: function(callback) {
        authClient.then(function(client) {
            gmail.users.getProfile({
                auth: client,
                userId: 'me'
            }, function(err, response) {
                if (err) {
                    console.error('getProfile > \n\t' + err);
                    return;
                }
                callback(response);
            })
        });
    },

    getMailLabelList: function(callback) {
        authClient.then(function(client) {
            gmail.users.labels.list({
                auth: client,
                userId: 'me'
            }, function(err, response) {
                if (err) {
                    console.error('getMailLabelList > \n\t' + err);
                    return;
                }
                callback(response.labels);
            });
        });
    },

    getMailMessageList: function(callback) {
        getMailMessageListPayloads(function(messages) {
            callback(messages);
        });
    }
};

function getMailMessageListIds(callback) {
    authClient.then(function(client) {
        gmail.users.messages.list({
            auth: client,
            userId: 'me',
            includeSpamTrash: false,
            maxResults: 25,
            pageToken: gmailState.storedNextPageToken
        }, function(err, response) {
            if (err) {
                console.error('getMailMessagsListIds > \n\t' + err);
                return;
            }
            gmailState.storedNextPageToken = response.nextPageToken;
            //console.log(gmailState.storedNextPageToken);
            callback(response.messages);
        });
    });
}

function getMailMessageListPayloads(finalCallback) {
    getMailMessageListIds(function(messages) {
        let acquiredMessages = {};
        async.forEachOf(messages, function(value, key, callback) {
            authClient.then(function(client) {
                gmail.users.messages.get({
                    auth: client,
                    userId: 'me',
                    id: value.id,
                    format: 'metadata'
                }, function(err, response) {
                    //console.log(response);
                    acquiredMessages[key] = response;
                    callback();
                });
            }).catch(function(err) {
                console.error(err);
            });
        }, function(err) {
            if (err) console.error(err.message);
            finalCallback(acquiredMessages);
        });
    });
}

module.exports = {

    instance: gmailState,

    getHeaders: function(message) {
        /*
        if (Object.prototype.toString.call(fields) !== '[object Array]') {
            throw 'fields must be passed as an array object';
        }
        */

        let headers = message.payload.headers;
        let parseData = {};

        for (let i = 0; i < headers.length; i++) {
            parseData[headers[i]['name']] = headers[i]['value'];
        }

        return parseData;
    }

};
