'use strict'
const gmail = require('./engine/api-content/gmail.js');
//const async = require('async');

let gmailInstance = gmail.instance;

module.exports = {

    printLabels: function() {
        gmailInstance.getMailLabelList(function(labels) {
            if (labels.length == 0) {
                console.error('No labels found, list is > \n\t' + labels);
            } else {
                for (let i = 0; i < labels.length; i++) {
                    let label = labels[i];
                    console.log(label.name);
                }
            }
            console.log('we got the label list');
        });
    },

    printMessages: function() {
        gmailInstance.getMailMessageList(function(messages) {
            for (let key in messages) {
                console.log(messages[key]);
            }
        });

        /* THIS IS JUST FOR TESTING
        async.series([
            function(callback) {
                gmailInstance.getMailMessageList(function(messages) {
                    for (let key in messages) {
                        console.log(messages[key]);
                    }
                    callback();
                });
            },
            function(callback) {
                gmailInstance.getMailMessageList(function(messages) {
                    for (let key in messages) {
                        console.log(messages[key]);
                    }
                    callback();
                });
            }
        ]);
        */
    },

    printProfile: function() {
        gmailInstance.getProfile(function(profile) {
            console.log(profile.emailAddress);
        });
    }
};

/*
module.exports = {

    printLabels: function() {
        gmail.getMailLabelList(function(labels) {
            if (labels.length == 0) {
                console.error('No labels found, list is > \n\t' + labels);
            } else {
                for (let i = 0; i < labels.length; i++) {
                    let label = labels[i];
                    console.log(label.name);
                }
            }
            console.log('we got the label list');
        });
    },

    printMessages: function() {
        gmail.getMailMessageList(function(messages) {
            for (let key in messages) {
                console.log(messages[key]);
            }
        });
    },

    printProfile: function() {
        gmail.getProfile(function(profile) {
            console.log(profile.emailAddress);
        });
    }

};
*/
