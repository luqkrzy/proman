
export const easyHandler = {

	async _returnData(url) {
		try {
			let data = await fetch(url);
			let response = await data.json();

			if (response !== undefined) {
				return response
			}

		} catch (err) {
			console.log(err)
		}

	},

	async _getData(url, callback) {
		try {
			let data = await fetch(url);
			let response = await data.json();

			if (response !== undefined) {
				callback(response)
			}

		} catch (err) {
			console.log(err)
		}
	},

	async _postJson(type, url, data, callback) {

		const settings = {
			'method': type, 'headers': {
				'Content-Type': 'application/json', 'Accept': 'application/json'
			},

			body: JSON.stringify(data),
		};

		try {
			let post = await fetch(url, settings);
			let response = await post.json();

			if (response !== undefined) {
				callback(response)
			}

		} catch (err) {
			console.log('my new wrror')
		}
	}

}
