'use strict';
module.exports = function (opts) {
	if ((Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') && !opts.appleAppId) {
		throw new Error('`appleAppId` option required');
	}

	if (!Ti.App.Properties.hasProperty('rate-reminder')) {
		Ti.App.Properties.setInt('rate-reminder', 0);
	}

	var interval = typeof opts.interval === 'number' ? opts.interval : 10;
	var launchCount = Ti.App.Properties.getInt('rate-reminder');

	if (launchCount === -1) {
		return;
	}

	if (++launchCount < interval) {
		Ti.App.Properties.setInt('rate-reminder', launchCount);
		return;
	}

	var alertDialog = Titanium.UI.createAlertDialog({
		title: L('rate_title', 'Rate this app'),
		message: L('rate_message', 'Would you mind taking a moment to rate this app?'),
		buttonNames: [
			L('rate_btn_ok', 'Rate this app'),
			L('rate_btn_remindlater', 'Remind me later'),
			L('rate_btn_never', 'No, thanks')
		],
		cancel: 2
	});

	alertDialog.addEventListener('click', function (e) {
		if (e.index === 0) {
			Ti.App.Properties.setInt('rate-reminder', -1);

			if (Ti.Platform.osname === 'android') {
				Ti.Platform.openURL('market://details?id=' + Ti.App.id);
			} else {
				Ti.Platform.openURL('itms-apps://itunes.apple.com/app/id' + opts.appleAppId);
			}
		}

		if (e.index === 1) {
			// reset the interval
			Ti.App.Properties.setInt('rate-reminder', 0);
		}

		if (e.index === 2) {
			// never ask again
			Ti.App.Properties.setInt('rate-reminder', -1);
		}
	});

	alertDialog.show();
};
