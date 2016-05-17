const google = require('googleapis');
const googleAuth = require('../api-auth/google.js');
const async = require('async');

const gmail = google.gmail('v1');

/* STRUCTURE OF FILE:
 * 1. Functions splitted into Object map categories for export
 * 2. Module exports
 * 3. Private functions
 */


/** HELPERS **/

function parseMultipartBody(parts) {
    let res = '';
    for (let i in parts) {
        if (parts[i].mimeType === 'text/html') {
            res += decodeURIComponent(
                escape(
                    atob(parts[i].body.data
                        .replace(/-/g, '+')
                        .replace(/_/g, '/')
                        .replace(/\s/g, ''))));
        } else {
            res += 'MIME: ' + parts[i].mimeType;
        }
    }
    return res;
}

/** object map exports **/

let cache = [];

let parse = {

    getHeaders: function(message) {
        let headers = message.payload.headers;
        let parseData = {};

        for (let i = 0; i < headers.length; i++) {
            parseData[headers[i]['name']] = headers[i]['value'];
        }

        return parseData;
    },

    getBody: function(message) {
        let mime = message.payload.mimeType;
        let data = message.payload.body.data;

        if (mime === 'text/html' || mime === 'text/plain') {
            return decodeURIComponent(
                escape(
                    atob(data
                        .replace(/-/g, '+')
                        .replace(/_/g, '/')
                        .replace(/\s/g, ''))));
        } else if (mime === 'multipart/alternative') {
            return parseMultipartBody(message.payload.parts);
        } else {
            return 'Mime was: ' + mime + ' and cannot currently be handled.';
        }
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
            if (typeof callback === 'function')
                callback(messages);
        });
    },

    getMailCachedContent: function(message_id, finalCallback) {
        async.each(cache, function(message, callback) {
            if (message.id === message_id) {
                finalCallback(message);
                callback(message);
            } else {
                callback();
            }
        });
    },

    sendMailMessage: function(from, to, subject, message, callback) {
        let base64mail = btoa(
            'Content-Type: text/plain; charset=\"UTF-8\"\n' +
            'Content-Length: 50000\n' +
            'Content-Transfer-Encoding: message/rfc2822\n' +
            'to: ' + to + '\n' +
            'from: ' + from + '\n' +
            'subject: ' + subject + '\n' +
            'date: ' + new Date().toUTCString() + '\n\n' +
            message
        ).replace(/\+/g, '-').replace(/\//g, '_');

        googleAuth.getAuthorizedOAuth2Client().then(function(client) {
            gmail.users.messages.send({
                auth: client,
                userId: 'me',
                resource: {
                    raw: base64mail
                }
            }, function(err, response) {
                if (err) console.error(err);
                else callback(response);
            });
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
            pageToken: request.storedNextPageToken,
            q: 'in:inbox'
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
    //let startTime = new Date().getTime();
    getMailMessageListIds(function(messages) {
        let acquiredMessages = {};
        let authClient = googleAuth.getAuthorizedOAuth2Client();
        async.forEachOf(messages, function(value, key, callback) {
            authClient.then(function(client) {
                let singleStartTime = new Date().getTime();
                gmail.users.messages.get({
                    auth: client,
                    userId: 'me',
                    id: value.id,
                    format: 'full'
                }, function(err, response) {
                    acquiredMessages[key] = response;
                    cache.push(response);
                    //console.log(
                    //'gmail.js > getMailMessageListPayloads > mail #' +
                    //key + ': '+
                    //(new Date().getTime() - singleStartTime) + 'ms');
                    callback();
                });
            }).catch(function(err) {
                console.error(err);
            });
        }, function(err) {
            if (err) console.error(err.message);
            //console.log(
            //'gmail.js > getMailMessageListPayloads: ' +
            //(new Date().getTime() - startTime) + 'ms');
            finalCallback(acquiredMessages);
        });
    });
}
