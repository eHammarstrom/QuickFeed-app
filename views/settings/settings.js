const gmail = require('../../engine/api-content/gmail.js');
const $ = require('jquery');
const path = require('path');
const ipcRenderer = require('electron').ipcRenderer;

let activeAccounts = [];
let currentAccount;

/**Loads the current profile and other active accounts
    to dropdown menu*/
function printProfiles() {
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
    }
}

  function cleanPrint(callback){
    $('#dropElement').empty();
    $('#activeButton').empty();

    callback();
  }

  function getProfile(callback) {
      gmail.request.getProfile(function(profile) {
        let address = profile.emailAddress;
        if(!activeAccounts.includes(address)){
          console.log('Added ' + address);
          activeAccounts.unshift(address);
          currentAccount = address;
        }

        if(callback.name == 'cleanPrint')
          callback(printProfiles);
        else
          callback();

      });
  }

/*Loads the authentication window and executes cleanPrint*/
  function loadAuth(){
    $('#authLink').click(function(){
      ipcRenderer.send('asynchronous-message','show-auth-gmail');

      ipcRenderer.on('asynchronous-reply', function(event, arg) {
        console.log(arg);
        if(arg === 'auth-complete')
        getProfile(cleanPrint);
      });
    });
  }

/** Document specific JQUERY **/
  $(document).ajaxComplete(function(e, xhr, settings) {
    if (settings.url === path.normalize(__dirname + '/settings.html')) {
          loadAuth();
          getProfile(printProfiles);
        }
  });
