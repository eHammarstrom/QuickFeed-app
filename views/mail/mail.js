const $ = require('jquery');
const gmail = require('../../engine/api-content/gmail.js');
const path = require('path');

const messageSpawnDelay = 100;
const messageSpawnDelayPerMessage = 0.25;
const messageContentDelay = 250;

let scrollPrint = true;

function messageToHtml(message, delay) {
    let parsedHeaders =
        gmail.parse.getHeaders(message);

    let dateObj = new Date(Date.parse(parsedHeaders['Date']));

    $('#mailTable>tbody').append(
        $('<tr id="' + message.id + '">' +
            '<td>' + parsedHeaders['From'] + '</td>' +
            '<td>' + parsedHeaders['Subject'] + '</td>' +
            '<td>' + dateObj.toISOString().slice(0, 10) + '</td>' +
            '</tr>').hide().fadeIn(delay)
    );
}

function printCache() {
    if (gmail.cache.length !== 0) {
        console.log('Cache is not empty!');
        for (let i = 0; i < gmail.cache.length; i++) {
            messageToHtml(
                gmail.cache[i]
                , messageSpawnDelay *
                ((i + 1) * messageSpawnDelayPerMessage));
        }
        return true;
    } else {
        return false;
    }
}

function printMessages() {
    gmail.request.getMailMessageList(function (messages) {
        let i = 1;
        for (let key in messages) {
            messageToHtml(
                messages[key]
                , messageSpawnDelay *
                (i++ * messageSpawnDelayPerMessage));
        }
        scrollPrint = true;
    });
}

function printMessageContent(message_id) {
    gmail.request.getMailCachedContent(message_id, function (message) {
        let content = gmail.parse.getBody(message);

        $('.mail-display').hide();

        $('#mailTable>tbody>tr#' + message.id).after(
            $('<tr class="mail-display">' +
                '<td colspan="3"><iframe frameborder="0" id="' +
                message.id +
                '_iframe"></iframe></td>' +
                '</tr>').hide().fadeIn(messageContentDelay)
        );

        // scroll to focus of content
        $('html,body').animate({
            scrollTop: $('#' + message.id).offset().top - 100
        }, 'slow');

        // get the spawned iframe, fill the contents and expand the view of it
        let $iframe = $('#' + message.id + '_iframe');
        $iframe.ready(function () {
            let body = $iframe.contents().find('body');

            body.append(content);

            let bodyHeight = body.height();

            console.log('HEIGHT ' + bodyHeight);

            /*
            if (bodyHeight < 500)
                $iframe.height(bodyHeight + 'px');
            else
                $iframe.height(500 + 'px');
            */

            $iframe.height(500 + 'px');
        });
    });
}

/** Document specific JQUERY **/

// Catch the ajax call and print our email cache or grab new messages!
$(document).ajaxComplete(function (e, xhr, settings) {
    //console.log(settings.url);
    //console.log(path.normalize(__dirname + '/mail.html'));
    if (settings.url === path.normalize(__dirname + '/mail.html')) {
        if (printCache() === false) {
            printMessages();
        }
    }
});

$(window).scroll(function () {
    if (($(window).scrollTop() + $(window).height() >
            $(document).height() - $(document).height() / 3) &&
        scrollPrint === true) {
        scrollPrint = false;
        printMessages();
    }
});

$(document).on('click', '#emailModel', function (e) {
    e.preventDefault();
    
    // Here we will toggle an overlayed 'window' and prepare for mail to be sent

    var button = $(e.relatedTarget)
    var emailModal = $(this)

});

$(document).on('click', '#mailTable>tbody>tr', function (e) {
    e.preventDefault();
    //console.log(this.id);
    printMessageContent(this.id);
});

//$('#emailModel').on('show.bs.modal', function (event) {
//  var button = $(event.relatedTarget) 
//  var subject;
//  var recipient = button.data('whatever') 
//  
//  var modal = $(this)
//  modal.find('.modal-title').text('New Email ' + recipient)
//  modal.find('.modal-body input').val(recipient)
//})