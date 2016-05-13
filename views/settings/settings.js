const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');
const path = require('path');

let activeAccounts = [];
let currentAccount;

/**Loads the current profile and other active accounts
    to dropdown menu*/
function printProfiles() {
    let account = currentAccount;

    if (typeof account == 'undefined') {
        account = 'No accounts found';
    }

    $('#activeButton').append(
        account +
        '<span class="caret"></span>'
    );

    for (let i = 0; i < activeAccounts.length; i++) {
        console.log('Printing: ' + activeAccounts[i]);
        $('#dropElement').append(
            '<div class="dropdown-divider"></div>' +
            '<li id="user' + i + '"><a class="dropdown-item" href="#">' + activeAccounts[i] + '</a></li>'
        );
    }
}

function getProfile(callback) {
    gmail.request.getProfile(function(profile) {
        let address = profile.emailAddress;
        if (!activeAccounts.includes(address)) {
            console.log('Added: ' + address);
            activeAccounts.push(address);
            currentAccount = address;

            callback();
        }
    });
}

/** Document specific JQUERY **/

$(document).ajaxComplete(function(e, xhr, settings) {
    if (settings.url === path.normalize(__dirname + '/settings.html'))
        if (activeAccounts.length < 1)
            getProfile(printProfiles);
});
