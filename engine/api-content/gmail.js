const google = require('googleapis');
const googleAuth = require('../api-auth/google.js');

const gmail = google.gmail('v1');
const authClient = googleAuth.getAuthorizedOAuth2Client();

module.exports = {

    getMailLabelList: function(callback) {
        authClient.then(function(client) {
            console.log(JSON.stringify(client));
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
    }

};
