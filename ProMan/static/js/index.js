import {easyHandler} from "./data_handler.js";
import {getCurrentUser} from "./usr.js";


const currentUser = getCurrentUser();
const userID = user[0]

class Boards {
	constructor() {
		this.boardName = document.querySelector('#boardName');
		this.boardNoteArea = document.querySelector('#boardNoteArea');
		this.addNewBoardBtn = document.querySelector('#addNewBoardBtn');
		this.boardSection = document.querySelector("#boardSection");
		this.confirmDeleteModalBtn = document.querySelector('#modalConfirmDelete')
	}

	init() {
		const path = window.location.pathname;
		if (path === '/') {
			this.loadBoards()
			this.addBoard();
			this.initClickListener();
		}
	}

	initClickListener() {
		this.boardSection.addEventListener('click', (event) => {
			const eventTargetClassList = event.target.classList
			const target = event.path[1]
			if (eventTargetClassList.contains('deleteBoard')) {
				const boardID = target.getAttribute('id');
				this.deleteBoard(boardID)
			}
		},)
	}


	loadBoards() {
		easyHandler._getData(`/api/user/${userID}/boards`, (boards) => this.showBoards(boards))
	}

	showBoards(boards) {
		for (let i = 0; i < boards.length; i++) {
			let boardBody = `
			<div class="col" id="${boards[i].id}" name="board-col"><!-- start board -->
				<div class="card hover-shadow border">
					<a href="/board/${boards[i].id}"><img src="/static/img/board_01.jpg" class="card-img-top" alt="pic"/></a>
					<div class="card-body">
						 <a href="/board/${boards[i].id}"><h5 class="card-title" name="${boards[i].name}">${boards[i].name}</h5></a>
						<p class="card-text" name="${boards[i].note}">${boards[i].note}</p>
					</div>
					<div class="card-footer text-muted  d-flex justify-content-between ">2 days ago
						<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
						<div id="${boards[i].id}" class="dropdown-menu">
							<span class="editName dropdown-item">Edit name</span>
							<span class="editNote dropdown-item">Edit note</span>
							<span class="deleteBoard dropdown-item" data-mdb-toggle="modal" data-mdb-target="#deleteModal">Delete</span>
						</div>
					</div>
				</div>
			</div>
            `
			this.boardSection.insertAdjacentHTML("beforeend", boardBody);
		}
	}

	addBoard() {
		this.addNewBoardBtn.addEventListener('click', (event) => {
			let text = this.boardName.value
			if (text === '') {
				console.log('name = null')
			} else {
				event.preventDefault();
				easyHandler._postJson('POST', `/api/user/${userID}/boards`, {
					'name': this.boardName.value, 'note': this.boardNoteArea.value
				}, (response) => {
					console.log(response)
					if (response === true) {
						document.location.href = "/";
					} else {
						document.location.href = "/";
						alert('Failed')
					}
				})
			}
		})
	}

	deleteBoard(boardID) {
		this.confirmDeleteModalBtn.addEventListener('click', () => {
			easyHandler._postJson('DELETE', `/api/user/${userID}/boards/${boardID}`, {}, (response) => {

				if (response === 'unauthorized') {
					console.log('unauthorized')
				}

				if (response === true) {
					document.location.href = "/";

				} else {
					console.log('can\'t delete')

				}

			})

		}, {once: true})

	}

}

const boards = new Boards()
boards.init()
