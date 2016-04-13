const google = require('googleapis');
const googleAuth = require('../api-auth/google.js');

const gmail = google.gmail('v1');
const authClient = googleAuth.getAuthorizedOAuth2Client();

module.exports = {

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
        authClient.then(function(client) {
            gmail.users.messages.list({
                auth: client,
                userId: 'me',
                includeSpamTrash: false,
                maxResults: 100
            }, function(err, response) {
                if (err) {
                    console.error('getMailLabelList > \n\t' + err);
                    return;
                }
                console.log(JSON.stringify(response));
                callback(response.messages);
            });
        });
    }

};
