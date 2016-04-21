const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');

let gmailInstance = gmail.instance;

function printProfile() {
    gmailInstance.request.getProfile(function(profiles) {
    });
  }
