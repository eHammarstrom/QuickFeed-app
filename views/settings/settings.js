const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');
const path = require('path');

let activeAccounts = [];

function printProfile() {
  for (let i = 0; i < activeAccounts.length; i++) {
      $('#gmailSettings').append(
        '<p id="active">' + activeAccounts[i] + '</p>'
      );
    }
  }

  function getProfile() {
    gmail.request.getProfile(function(profile) {
      console.log('Added ' + profile.emailAddress);
      activeAccounts.push(profile.emailAddress);
    });
  }

 /** Document specific JQUERY **/

  $(document).ajaxComplete(function(e, xhr, settings) {
      if (settings.url === path.normalize(__dirname + '/settings.html')) {
        console.log(activeAccounts.length);
          if (activeAccounts.length == 0)
            $.when(getProfile()).then(printProfile());
            else
            printProfile();
      }
  });
