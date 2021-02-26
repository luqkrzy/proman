// It uses data_handler.js to visualize elements
import {easyHandler} from "./data_handler.js";

const name = document.getElementById('name')
const note = document.getElementById('note')
const addNewBoardBtn = document.getElementById('add_board')


function getCurrentUser() {
	let current = ''
	if (user.includes('AnonymousUser')) {
		current = 'AnonymousUser'
	} else {
		current = user
	}
	return current

}

export let dom = {

	init: function () {

		this.currentUser = getCurrentUser()
		this.loadBoards()
		this.addBoard()
	}, loadBoards: function () {
		// retrieves boards and makes showBoards called
		// dataHandler.getBoards(function (boards) {
		//     dom.showBoards(boards);
		// });
		console.log(this.currentUser)
		easyHandler._getData('/api/get-boards', (boards) => this.showBoards(boards))

	}, showBoards: function (boards) {
		// shows boards appending them to #boards div
		// it adds necessary event listeners also

		console.log(boards)

		//


		// let boardList = '';
		//
		// for(let board of boards){
		//     boardList += `
		//         <li>${board.title}</li>
		//     `;
		// }
		//
		// const outerHtml = `
		//     <ul class="board-container">
		//         ${boardList}
		//     </ul>
		// `;
		//
		// let boardsContainer = document.querySelector('#boards');
		// boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
	}, loadCards: function (boardId) {
		// retrieves cards and makes showCards called
	}, showCards: function (cards) {
		// shows the cards of a board
		// it adds necessary event listeners also
	}, addBoard: function () {

		addNewBoardBtn.addEventListener('click', (event) => {

			easyHandler.postJson('PUT', '/api/add_board', {
				'name': name.value, 'owner_id': 1, 'note': note.value
			}, (response) => console.log(response))
			if (response === true) {
				alert('Board Added')
			} else {
				alert('Failed')
			}
		})
	}

}
