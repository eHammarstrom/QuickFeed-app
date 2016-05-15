const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');
const path = require('path');
const ipcRenderer = require('electron').ipcRenderer;

let activeAccounts = [];
let currentAccount;

/**Loads the current profile and other active accounts
    to dropdown menu*/
function printProfiles() {
<<<<<<< HEAD
  return $.ajax({});

  console.log(activeAccounts.length);
  let account = currentAccount;
  if(typeof account == 'undefined'){
    account = 'No accounts found';
  }

  $('#activeButton').append(
    account + '<span class="caret"></span>'
  );

  for (let i = 0; i < activeAccounts.length; i++) {
      let account = activeAccounts[i];
      if(i == 0){
        account = '<b>' + activeAccounts[i] + '</b>';
      }
      $('#dropElement').append(
        '<div class="dropdown-divider"></div>' +
        '<li id="user' + i + '"><a class="dropdown-item" href="#">' + account + '</a></li>'
      );
=======
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
>>>>>>> cbcc5768c5a7552b8fe68327059ff19de7999969
    }
}

<<<<<<< HEAD
  function getProfile() {
      gmail.request.getProfile(function(profile) {
        let address = profile.emailAddress;
        if(!activeAccounts.includes(address)){
          console.log('Added ' + address);
          activeAccounts.unshift(address);
          currentAccount = address;
        }
      });
  }

  function loadAuth(){
    $('#authLink').click(function(){
      ipcRenderer.send('asynchronous-message','show-auth-gmail');
=======
function getProfile(callback) {
    gmail.request.getProfile(function(profile) {
        let address = profile.emailAddress;
        if (!activeAccounts.includes(address)) {
            console.log('Added: ' + address);
            activeAccounts.push(address);
            currentAccount = address;

            callback();
        }
>>>>>>> cbcc5768c5a7552b8fe68327059ff19de7999969
    });
}

/** Document specific JQUERY **/

<<<<<<< HEAD
  $(document).ajaxComplete(function(e, xhr, settings) {
    if (settings.url === path.normalize(__dirname + '/settings.html')) {
          loadAuth();
          //console.log(activeAccounts.length);
          printProfiles().done(getProfile);
        }
  });
=======
$(document).ajaxComplete(function(e, xhr, settings) {
    if (settings.url === path.normalize(__dirname + '/settings.html'))
        if (activeAccounts.length < 1)
            getProfile(printProfiles);
});
>>>>>>> cbcc5768c5a7552b8fe68327059ff19de7999969
