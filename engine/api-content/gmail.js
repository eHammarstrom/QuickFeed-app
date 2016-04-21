const google = require('googleapis');
const googleAuth = require('../api-auth/google.js');
const async = require('async');

const gmail = google.gmail('v1');

/* STRUCTURE OF FILE:
 * 1. Functions splitted into Object map categories for export
 * 2. Module exports
 * 3. Private functions
 */

let cache = [];

let parse = {

    getHeaders: function(message) {
        let headers = message.payload.headers;
        let parseData = {};

        for (let i = 0; i < headers.length; i++) {
            parseData[headers[i]['name']] = headers[i]['value'];
        }

        return parseData;
    }

};

let request = {

    storedNextPageToken: null,

    getProfile: function(callback) {
        googleAuth.getAuthorizedOAuth2Client().then(function(client) {
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
        googleAuth.getAuthorizedOAuth2Client().then(function(client) {
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

module.exports = {

    cache: cache,

    request: request,

    parse: parse

};

function getMailMessageListIds(callback) {
    googleAuth.getAuthorizedOAuth2Client().then(function(client) {
        gmail.users.messages.list({
            auth: client,
            userId: 'me',
            includeSpamTrash: false,
            maxResults: 50,
            pageToken: request.storedNextPageToken
        }, function(err, response) {
            if (err) {
                //console.error('getMailMessagsListIds > \n\t' + err);
                return;
            }
            request.storedNextPageToken = response.nextPageToken;
            //console.log(request.storedNextPageToken);
            callback(response.messages);
        });
    });
}

function getMailMessageListPayloads(finalCallback) {
    getMailMessageListIds(function(messages) {
        let acquiredMessages = {};
        async.forEachOf(messages, function(value, key, callback) {
            googleAuth.getAuthorizedOAuth2Client().then(function(client) {
                gmail.users.messages.get({
                    auth: client,
                    userId: 'me',
                    id: value.id,
                    format: 'metadata'
                }, function(err, response) {
                    //console.log(response);
                    acquiredMessages[key] = response;
                    cache.push(response);
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
