const $ = require('jquery');
const gmail = require('../../engine/api-content/gmail.js');
const path = require('path');

function messageToHtml(message, delay) {
    let parsedHeaders =
        gmail.parse.getHeaders(message);

    let dateObj = new Date(Date.parse(parsedHeaders['Date']));

    $('#mailTable>tbody').append(
        $('<tr class="' + message.id + '">' +
            '<td>' + parsedHeaders['From'] + '</td>' +
            '<td>' + parsedHeaders['Subject'] + '</td>' +
            '<td>' + dateObj.toISOString().slice(0, 10) + '</td>' +
            '</tr>').hide().delay(delay).fadeIn(1000)
    );
}

function printCache() {
    if (gmail.cache.length !== 0) {
        console.log('Cache is not empty!');
        for (let i = 0; i < gmail.cache.length; i++) {
            messageToHtml(gmail.cache[i], 100 * (i + 1));
        }
    }
}

function printMessages() {
    gmail.request.getMailMessageList(function(messages) {
        let i = 1;
        for (let key in messages) {
            messageToHtml(messages[key], 100 * i++);
        }
    });
}

/** Document specific JQUERY **/

$(document).ready(function() {
    printMessages();
});

// Catch the ajax call and print our email cache
$(document).ajaxComplete(function(e, xhr, settings) {
    if (settings.url === path.normalize(__dirname + '/mail.html')) {
        printCache();
    }
});

$(document).on('click', '#getMail', function(e) {
    e.preventDefault();
    printMessages();
});
