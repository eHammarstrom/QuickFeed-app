const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');
const path = require('path');

let activeAccounts = [];
let currentAccount;

/**Loads the current profile and other active accounts
    to dropdown menu*/
function printProfiles() {
  $('#activeButton').append(
    currentAccount +
    '<span class="caret"></span>'
  );

  for (let i = 0; i < activeAccounts.length; i++) {
      $('#dropElement').append(
        '<div class="dropdown-divider"></div>' +
        '<li id="user' + i + '"><a class="dropdown-item" href="#">' + activeAccounts[i] + '</a></li>'
      );
    }
  }

  function getProfile() {
    gmail.request.getProfile(function(profile) {
      let address = profile.emailAddress;
      if(!activeAccounts.includes(address)){
        console.log('Added ' + address);
        activeAccounts.push(address);
        currentAccount = address;
      }
    });
  }

 /** Document specific JQUERY **/

  $(document).ajaxComplete(function(e, xhr, settings) {
      if (settings.url === path.normalize(__dirname + '/settings.html')) {
        console.log(activeAccounts.length);
        if(activeAccounts.length < 1){
          getProfile();
        }
          printProfiles();
      }
  });
