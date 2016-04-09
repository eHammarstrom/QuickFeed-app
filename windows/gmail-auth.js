const googleAuth = require('../engine/api-auth/lama-risky-google.js');
const $ = require('jquery');

exports.startWindow = function(authWindow) {
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
            }
        });

        authWindow.show();
    });
}
