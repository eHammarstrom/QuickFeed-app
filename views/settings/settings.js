const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');

let gmailInstance = gmail.instance;

function printMessages() {
    gmailInstance.getMailMessageList(function(messages) {
        let i = 1;
        for (let key in messages) {
            let date = new Date(messages[key].internalDate * 1000);

            $('#mailTable>tbody').append(
                $('<tr class="' + messages[key].id + '">' +
                    '<td>' + messages[key].payload.headers['From'] + '</td>' +
                    '<td>' + messages[key].snippet + '</td>' +
                    '<td>' + date + '</td>' +
                '</tr>').hide().delay(100 * i).fadeIn(1000)
            );

            i++;
        }
    });
}

$('#mailTable>tbody').click(function() {
    printMessages();
});
