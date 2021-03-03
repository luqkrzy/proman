// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
	_data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
	_api_get: function (url, callback) {
		// it is not called from outside
		// loads data from API, parses it and calls the callback with it

		fetch(url, {
			method: 'GET', credentials: 'same-origin'
		})
			.then(response => response.json())
			.then(json_response => callback(json_response))
			.catch(error => console.log(error));  // Call the `callback` with the returned object
	}, _api_post: function (url, data, callback) {
		// it is not called from outside
		// sends the data to the API, and calls callback function
		const settings = {
			'method': 'POST', 'headers': {
				'Content-Type': 'application/json', 'Accept': 'application/json'
			},

			body: JSON.stringify(data),
		};


	}, init: function () {
	}, getBoards: function (callback) {
		// the boards are retrieved and then the callback function is called with the boards

		// Here we use an arrow function to keep the value of 'this' on dataHandler.
		//    if we would use function(){...} here, the value of 'this' would change.
		this._api_get('/api/get-boards', (response) => {
			this._data['boards'] = response;
			callback(response);
		});
	}, getBoard: function (boardId, callback) {
		// the board is retrieved and then the callback function is called with the board
	}, getStatuses: function (callback) {
		// the statuses are retrieved and then the callback function is called with the statuses
	}, getStatus: function (statusId, callback) {
		// the status is retrieved and then the callback function is called with the status
	}, getCardsByBoardId: function (boardId, callback) {
		// the cards are retrieved and then the callback function is called with the cards
	}, getCard: function (cardId, callback) {
		// the card is retrieved and then the callback function is called with the card
	}, createNewBoard: function (boardTitle, callback) {
		// creates new board, saves it and calls the callback function with its data
	}, createNewCard: function (cardTitle, boardId, statusId, callback) {
		// creates new card, saves it and calls the callback function with its data
	}
	// here comes more features
};


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
