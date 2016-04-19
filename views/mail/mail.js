const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');

let gmailInstance = gmail.instance;

function printMessages() {
    gmailInstance.getMailMessageList(function(messages) {
        let i = 1;
        for (let key in messages) {
            let headers = messages[key].payload.headers;

            let parsedHeaders =
                gmail.getHeaders(messages[key]);

            let dateObj = new Date(Date.parse(parsedHeaders['Date']));

            $('#mailTable>tbody').append(
                $('<tr class="' + messages[key].id + '">' +
                    '<td>' + parsedHeaders['From'] + '</td>' +
                    '<td>' + parsedHeaders['Subject'] + '</td>' +
                    '<td>' + dateObj.toISOString().slice(0, 10) + '</td>' +
                    '</tr>').hide().delay(100 * i).fadeIn(1000)
            );

            i++;
        }
    });
}

$('#getMail').click(function() {
    printMessages();
});
