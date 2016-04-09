const googleAuth = require('../engine/api-auth/lama-risky-google.js');
const $ = require('jquery');

exports.startWindow = function(authWindow) {
    // This is the first state where we load gmail auth page
    // if done correctly we enter next callback function to catch token post
    // if done incorrectly we exit out and throw the httpResponseCode *FOR NOW*
    googleAuth.authUrl(function(url) {
        authWindow.loadURL(url);

        let webC = authWindow.webContents;

        webC.on('did-get-response-details', function(event,
            status,
            newURL,
            originalURL,
            httpResponseCode) {
            event.preventDefault();

            if (httpResponseCode !== 200) {
                console.error('Tried retrieving: ' + originalURL);
                console.error('Redirected to: ' + newURL);
                console.error('Error could not reach auth page, http response: ' + httpResponseCode);
                authWindow.close();
            } else {
                authWindow.show();
                catchTokenPost(authWindow);
            }
        });
    });
}

// This is the second stage, not for export as it is dependent on first stage
function catchTokenPost(authWindow) {
    authWindow.on('page-title-updated', function() {
        console.log('Page title updated');
        return;
    });

    authWindow.on('close', function() {
        console.error('User closed window, could not catch token post');
        return;
    });
}
