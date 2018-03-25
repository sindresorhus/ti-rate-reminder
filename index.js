'use strict';
module.exports = options => {
	if ((Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') && !options.appleAppId) {
		throw new Error('`appleAppId` option required');
	}

	if (!Ti.App.Properties.hasProperty('rate-reminder')) {
		Ti.App.Properties.setInt('rate-reminder', 0);
	}

	const interval = typeof options.interval === 'number' ? options.interval : 10;
	let launchCount = Ti.App.Properties.getInt('rate-reminder');

	if (launchCount === -1) {
		return;
	}

	if (++launchCount < interval) {
		Ti.App.Properties.setInt('rate-reminder', launchCount);
		return;
	}

	const alertDialog = Titanium.UI.createAlertDialog({
		title: L('rate_title', 'Rate this app'),
		message: L('rate_message', 'Would you mind taking a moment to rate this app?'),
		buttonNames: [
			L('rate_btn_ok', 'Rate this app'),
			L('rate_btn_remindlater', 'Remind me later'),
			L('rate_btn_never', 'No, thanks')
		],
		cancel: 2
	});

	alertDialog.addEventListener('click', event => {
		if (event.index === 0) {
			Ti.App.Properties.setInt('rate-reminder', -1);

			if (Ti.Platform.osname === 'android') {
				Ti.Platform.openURL(`market://details?id=${Ti.App.id}`);
			} else {
				Ti.Platform.openURL(`itms-apps://itunes.apple.com/app/id${options.appleAppId}`);
			}
		}

		if (event.index === 1) {
			// Reset the interval
			Ti.App.Properties.setInt('rate-reminder', 0);
		}

		if (event.index === 2) {
			// Never ask again
			Ti.App.Properties.setInt('rate-reminder', -1);
		}
	});

	alertDialog.show();
};
