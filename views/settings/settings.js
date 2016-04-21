const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');

let gmail = gmail.instance;

function printProfile() {
    gmail.request.getProfile(function(profiles) {
    });
  }
