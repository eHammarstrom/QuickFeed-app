'use strict'
const gmail = require('./engine/api-content/gmail.js');

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
        })
    }

};
