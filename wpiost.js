IWalletJS.enable()
	.then(account => {
		const iwalletIOST = IWalletJS.newIOST(IOST);
		const ctx = iwalletIOST.callABI('token.iost', 'transfer', [
			'iost',
			account,
			account,
			'1',
			`Login to WordPress using WP IOST [${wpiostNonce}]`
		]);
    // TODO: Put a note in the transaction, and check it on the server.
		iwalletIOST
			.signAndSend(ctx)
			.on('pending', trx => {
				console.log(trx, 'trx');
			})
			.on('success', result => {
        setTimeout(() => {
          jQuery.post(ajaxurl, {
            account,
            transaction: result.tx_hash,
            action: 'wpiost_login',
          }, (response) => {
            alert('Got this from the server: ' + response);
          });
        }, 100)

			})
			.on('failed', failed => {
				console.log(failed, 'failed');
			});
	})
	.catch(error => {
		if (error.type === 'locked') {
			alert('Please sign into iWallet then reload the page!');
		} else {
			console.log(error);
		}
	});
