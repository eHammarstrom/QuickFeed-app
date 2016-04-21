const remote = require('electron').remote;
const Menu = remote.Menu;
const ipcRenderer = require('electron').ipcRenderer;
const path = require('path');

let menu = Menu.buildFromTemplate([
	{
		label: 'Authentication',
		submenu: [
			{
				label: 'Gmail Account',
				click: function() {
					ipcRenderer.send('asynchronous-message','show-auth-gmail');
				}
			}
		]
	}
]);

Menu.setApplicationMenu(menu);

/* html interaction code */
const $ = require('jquery');

$('#mail').click(function(e) {
	e.preventDefault();
	contentLoadHtml('/views/mail/mail.html', addNavSelected('#mail'));
});

$('#messages').click(function(e) {
	e.preventDefault();
	contentLoadHtml('/views/messages/messages.html', addNavSelected('#messages'));
});

$('#settings').click(function(e) {
	e.preventDefault();
	contentLoadHtml('/views/settings/settings.html', addNavSelected('#settings'));
});

/**
* Remove existing .selected class and add to specified element
*/
function addNavSelected(navButtonClass) {
	$('#navigation>ul>li.selected').removeClass('selected');
	$(navButtonClass).addClass('selected');
}

/**
* Fill content pane with a html view
*/
function contentLoadHtml(htmlPath, callback) {
	// fade out content div and empty it.
	$('#content').fadeOut(500, function() {

		$('#content').empty();

		// now start loading html from views file via ajax
		$.ajax({
			url: path.normalize(__dirname + htmlPath),
			success: function(html) {

				// now we can put html back into #content and fade it in
				$('#content').html(html).promise().done(function() {
					$('#content').fadeIn(500);
				});

			}
		});
	});

	if (typeof callback == 'function') {
		callback();
	}
}
