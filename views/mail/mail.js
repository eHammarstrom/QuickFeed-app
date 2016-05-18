const $ = require('jquery');
const gmail = require('../../engine/api-content/gmail.js');
const path = require('path');

const messageSpawnDelay = 100;
const messageSpawnDelayPerMessage = 0.25;
const messageContentDelay = 250;

let scrollPrint = true;

function sendMail(to, subject, message) {
    gmail.request.getProfile(function(profile) {
        gmail.request.sendMailMessage(
            profile.emailAddress,
            to,
            subject,
            message,
            function(response) {
                //console.log(response);
            });
    });
}

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
        for (let i = 0; i < gmail.cache.length; i++) {
            messageToHtml(
                gmail.cache[i], messageSpawnDelay *
                ((i + 1) * messageSpawnDelayPerMessage));
        }
        return true;
    } else {
        return false;
    }
}

function printMessages() {
    gmail.request.getMailMessageList(function(messages) {
        let i = 1;
        for (let key in messages) {
            messageToHtml(
                messages[key], messageSpawnDelay *
                (i++ * messageSpawnDelayPerMessage));
        }
        scrollPrint = true;
    });
}

function printMessageContent(message_id) {
    gmail.request.getMailCachedContent(message_id, function(message) {
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
            scrollTop: $('#' + message.id).offset().top - 50
        }, 'slow');

        // get the spawned iframe, fill the contents and expand the view of it
        let $iframe = $('#' + message.id + '_iframe');
        $iframe.ready(function() {
            let head = $iframe.contents().find('head');
            let body = $iframe.contents().find('body');

            head.append('<meta charset=\"UTF-8\">');
            body.append(content);

            //let bodyHeight = body.height();

            //console.log('HEIGHT ' + bodyHeight);

            /*
            if (bodyHeight < 500)
                $iframe.height(bodyHeight + 'px');
            else
                $iframe.height(500 + 'px');
            */

            let contentDivHeight = $('#content').height() - 50;

            $iframe.height(contentDivHeight + 'px');
        });
    });
}

/** Document specific JQUERY **/

// Catch the ajax call and print our email cache or grab new messages!
$(document).ajaxComplete(function(e, xhr, settings) {
    //console.log(settings.url);
    //console.log(path.normalize(__dirname + '/mail.html'));
    if (settings.url === path.normalize(__dirname + '/mail.html')) {
        if (printCache() === false) {
            printMessages();
        }
    }
});

$(window).scroll(function() {
    if (($(window).scrollTop() + $(window).height() >
            $(document).height() - $(document).height() / 3) &&
        scrollPrint === true) {
        scrollPrint = false;
        printMessages();
    }
});

$(document).on('click', '#sendEmail', function(e) {
    e.preventDefault();

    let error = false;
    let recipient = $('#recipient-name')[0].value;
    let subject = $('#subject-name')[0].value;
    let message = $('#message-text')[0].value;

    // thanks to www.emailregex.com for saving lives
    if (recipient.length == 0 ||
        !recipient.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
)) {
        $('#recipient-name').parent().addClass('has-error');
        error = true;
    }

    if (subject.length == 0) {
        $('#subject-name').parent().addClass('has-error');
        error = true;
    }

    if (message.length == 0) {
        $('#message-text').parent().addClass('has-error');
        error = true;
    }

    if (error === false) {
        sendMail(recipient, subject, message);
        $('#emailModal').modal('hide');
        $('.form-group').removeClass('has-error');
        $('#recipient-name').val('');
        $('#subject-name').val('');
        $('#message-text').val('');
    }
});

$(document).on('click', '#mailTable>tbody>tr', function(e) {
    e.preventDefault();
    //console.log(this.id);
    printMessageContent(this.id);
});
