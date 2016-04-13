const google = require('googleapis');
const googleAuth = require('../api-auth/google.js');
const async = require('async');

const gmail = google.gmail('v1');
const authClient = googleAuth.getAuthorizedOAuth2Client();

function getMailMessageListIds(callback) {
    authClient.then(function(client) {
        gmail.users.messages.list({
            auth: client,
            userId: 'me',
            includeSpamTrash: false,
            maxResults: 10,

        }, function(err, response) {
            if (err) {
                console.error('getMailMessagsListIds > \n\t' + err);
                return;
            }
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
                    format: 'minimal'
                }, function(err, response) {
                    console.log(response);
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
