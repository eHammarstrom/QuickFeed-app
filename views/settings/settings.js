const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');



function printProfile() {
    gmail.request.getProfile(function(profile) {
      console.log(profile.emailAddress);
      $('#gmailSettings').append(
        ''
      );
    });
  }
  printProfile();
