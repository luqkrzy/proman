import {easyHandler} from "./data_handler.js";
import {getCurrentUser} from "./usr.js";

const user = getCurrentUser()
const userID = user[0]


class Dom {
	constructor() {

	}

	initDropDownMenu() {
		return `<span class="dropdown-toggle" data-mdb-toggle="dropdown"></span>
			<div class="dropdown-menu" aria-labelledby="dropDownCardTitle">
				<span class="editCardItem dropdown-item">Edit</span>
				<span class="deleteCardItem dropdown-item" data-mdb-toggle="modal" data-mdb-target="#deleteModal">Delete</span>
			</div>`
	}

	initNewColumn(data) {
		return `
    	<div class="col-md-auto rounded-3 p-1 alert-dark hover-shadow me-3 mb-3" id="${data.id}"><!-- start column  -->
    		<div class="bg-transparent border-0 list-group-item d-flex justify-content-between fw-bold mb-1 ">
    			New Column<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
    			<div class="dropdown-menu handle">
    				<span class="dropdown-item edit-column-name">Edit</span>
    				<span class="dropdown-item delete-column" data-mdb-toggle="modal" data-mdb-target="#deleteModal" id="${data.id}">Delete</span>
    			</div>
    		</div>
    		<div class="cardBody" id="">
    		</div>
    		<div class="newItem list-group-item list-group-item-action" id="newItem">
    			<input type="text" class='w-100' placeholder=" + new item"></div>
    	</div><!-- end of column  -->`
	}

	initNewCard(value) {
		const newCard = document.createElement('div');
		newCard.className = ('edit rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1')
		newCard.setAttribute('edit', 'true')
		newCard.innerText = value
		newCard.addEventListener('mouseenter', cards.createDropdownMenu);
		newCard.addEventListener('mouseleave', cards.hideDropdownMenu);
		return newCard
	}

}


class Cards {
	constructor() {
		this.boardId = window.location.pathname.split('/')[2];
		this.allColumnsContainer = document.querySelector('#allColumnsContainer');
		this.modalConfirmDeleteBtn = document.querySelector('#modalConfirmDelete');
		this.addNewColumnBtn = document.querySelector('#addNewColumnBtn');
		this.editFields = [];

	}

	init() {
		this.initColumns();
		this.initAddColumnListener();
		this.initNewCardToColumnListener()
		this.initChangeNameListener();
		this.initClickListener();
		this.initDropdownMenuListener();
	}

	initAddColumnListener() {
		this.addNewColumnBtn.addEventListener('click', this.addNewColumn.bind(this))

	}


	initNewCardToColumnListener() {
		document.addEventListener('keydown', this.addNewCardToColumn.bind(this))

	}

	initDropdownMenuListener() {
		this.editFields.forEach(field => field.addEventListener('mouseenter', this.createDropdownMenu));
		this.editFields.forEach(field => field.addEventListener('mouseleave', this.hideDropdownMenu()));
	}


	initClickListener() {
		this.allColumnsContainer.addEventListener('click', (event) => {
			const target = event.target
			this.initDragAndDrop();

			if ((target.classList.contains('delete-column'))) {
				const elementToDelete = event.path[3]
				const idToDetete = target.getAttribute('id')
				this.deleteColumn(idToDetete, elementToDelete)
			}
			if ((target.classList.contains('edit-column-name'))) {
				let idToEdit = target.getAttribute('id')

				this.editColumn(idToEdit, newName)
			}
			if ((target.classList.contains('deleteCardItem'))) {
				let elementToDelete = event.path[2]
				this.deleteCard(elementToDelete)
			}

			if ((target.classList.contains('editCardItem'))) {
				const target = event.path[2]
				const oldValue = target.innerText.replace('Edit\nDelete', '');
				// console.log(oldValue)

				target.innerHTML = `<input class="w-100" type="text" placeholder=${oldValue}>`;
				target.childNodes[0].focus();
				target.removeEventListener('mouseleave', this.hideDropdownMenu);
				target.removeEventListener('mouseenter', this.createDropdownMenu);

				document.addEventListener('click', (secondEvent) => {
					target.addEventListener('mouseenter', this.createDropdownMenu)
					target.addEventListener('mouseleave', this.hideDropdownMenu)

					if (secondEvent.target === target) {
						//pass
					} else {
						const newValue = target.childNodes[0].value;

						if (newValue === '') {
							target.innerText = oldValue;
						} else {
							target.innerHTML = `${newValue}`;
						}
					}
				}, {once: true});
			}
		})
	}

	deleteColumn(columnId, element) {
		this.modalConfirmDeleteBtn.addEventListener('click', () => {
			easyHandler._postJson('DELETE', `/api/delete-column/${columnId}`, {}, (response) => {
				element.remove();
				console.log(response)
			}, {once: true})
		})
	}

	deleteCard(element) {
		this.modalConfirmDeleteBtn.addEventListener('click', () => {
			element.remove()
		}, {once: true})

	}

	createDropdownMenu(event) {
		event.target.insertAdjacentHTML('beforeend', dom.initDropDownMenu());
	}

	hideDropdownMenu(event) {
		const itemText = event.target.innerText;

		if (itemText.includes('Edit\nDelete')) {
			event.target.innerHTML = itemText.replace('Edit\nDelete', '');
		} else {
			event.target.innerHTML = itemText;
		}
	}

	initChangeNameListener() {
		this.allColumnsContainer.addEventListener('dblclick', (event) => {
			const target = event.target;
			if (target.getAttribute('edit') === "true") {
				const oldValue = target.innerText;
				target.innerHTML = `<input class="w-100" type="text" placeholder=${oldValue}>`;
				target.childNodes[0].focus();
				target.removeEventListener('mouseleave', this.hideDropdownMenu);
				target.removeEventListener('mouseenter', this.createDropdownMenu);
				document.addEventListener('click', (secondEvent) => {
					target.addEventListener('mouseenter', this.createDropdownMenu)
					target.addEventListener('mouseleave', this.hideDropdownMenu)

					if (secondEvent.target === target) {
						//pass
					} else {
						const newValue = target.childNodes[0].value;

						if (newValue === '') {
							target.innerText = oldValue;
						} else {
							target.innerHTML = `${newValue}`
							this.updateCardName(target, newValue)
						}
					}
				}, {once: true});
			}
		})
	}

	editColumn(column_id) {

	}

	initDragAndDrop() {
		let cardsBody = document.querySelectorAll('.cardBody')

		cardsBody.forEach(card => {
			new Sortable(card, {
				group: 'shared', animation: 150, ghostClass: 'bg-warning'
			});
			card.addEventListener('dragend', (event) => {
				event.preventDefault()
				let parentDiv = event.path[2]
				let columnId = parentDiv.getAttribute('id')
				let target = event.target
				console.log(target)
				let cardId = target.getAttribute('id')
				const path = window.location.pathname;
				easyHandler._postJson('POST', `/api/update-card/${cardId}`, {
					'column_id': columnId
				}, (response) => {
					if (response === true) {
						document.location.href = path;
					} else {
						document.location.href = path;
						alert('Failed')
					}
				})
			})
		})

		new Sortable(this.allColumnsContainer, {
			handle: '.bg-transparent', // handle's class
			animation: 150, ghostClass: 'bg-warning'
		});

	}

	addNewCardToColumn(event) {

		if (event.key === 'Enter') {
			const target = event.target;
			const column = event.path[2];
			const columnId = column.getAttribute('id');
			const cardBody = column.querySelector(".cardBody");
			const name = target.value

			if (name !== '') {
				const newCard = dom.initNewCard(target.value)
				const cardIndex = Array.prototype.indexOf.call(cardBody.children, newCard)
				cardBody.appendChild(newCard)
				target.value = ''
				easyHandler._postJson('POST', '/api/card', {
					'name': name, 'owner_id': userID, 'board_id': this.boardId, 'column_id': columnId, 'index': cardIndex,
				}, (response) => {
					if (response.id) {
						// console.log('jest')

					} else {
						alert('Failed')
					}
				})
			}
		}
	}


	initColumns() {
		easyHandler._getData(`/api/columns/${this.boardId}`, (columns) => {
			if (columns) {
				this.insertColumns(columns);
			} else {
				alert('Failed')
			}
		})

	}

	addNewColumn(event) {
		event.preventDefault();
		easyHandler._postJson('POST', '/api/columns', {
			'name': 'New Column', 'owner_id': userID, 'board_id': this.boardId
		}, (newColumn) => {

			if (newColumn.id) {
				this.allColumnsContainer.insertAdjacentHTML("beforeend", dom.initNewColumn(newColumn));

			} else {
				alert('Failed')
			}
		})
	}

	insertColumns(columns) {
		columns.forEach(column => {
			this.allColumnsContainer.insertAdjacentHTML('beforeend', dom.initNewColumn(column))
		})


		// for (let i = 0; i < columns.length; i++) {
		// 	const outerHtml = `
		// <div class="col-md-auto rounded-3 p-1 alert-dark hover-shadow me-3 mb-3" id="${columns[i].id}" "><!-- start card  -->
		// 	<div class="bg-transparent border-0 list-group-item d-flex justify-content-between fw-bold mb-1 ">
		// 		${columns[i].name}<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
		// 		<div class="dropdown-menu handle">
		// 			<span class="dropdown-item edit-column-name">Edit</span>
		// 			<span class="dropdown-item delete-column" data-mdb-toggle="modal" data-mdb-target="#deleteModal" id="${columns[i].id}">Delete</span>
		// 		</div>
		// 	</div>
		// 	<div class="cardBody" id="${columns[i].id}">
		//
		// 	</div>
		// 	<div class="newItem list-group-item list-group-item-action" id="newItem">
		// 		<input type="text" class='w-100' placeholder=" + new item"></div>
		// </div><!-- end of card  -->`
		//
		// 	const parent = document.getElementById("allColumnsContainer")
		// 	parent.insertAdjacentHTML("beforeend", outerHtml);
		//
		// 	const columnId = columns[i].id
		//
		// 	easyHandler._getData(`/api/get-cards/${columnId}`, (cards) => {
		// 		if (cards.length > 0) {
		// 			this.insertCards(cards, columnId);
		// 		}
		// } else {
		//     document.location.href = "/";
		//     alert('Failed')
		// }
		// })
		// }
	}

	insertCards(cards, columnId) {
		let cardBody = document.querySelectorAll('.cardBody')
		for (let i = 0; i < cardBody.length; i++) {
			let currentCardBody = cardBody[i].getAttribute('id')
			if (columnId === currentCardBody) {
				for (let j = 0; j < cards.length; j++) {
					let outerHtml = `<div edit="true"  class="rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1" itemId="${cards[j].id}" id="${columnId}">${cards[j].name}</div>`
					cardBody[i].insertAdjacentHTML("beforeend", outerHtml);
				}
			}
		}
	}

	updateCardName(cardDiv, newName) {
		let cardId = cardDiv.getAttribute('itemId')

		easyHandler._postJson('POST', `/api/update-card-name/${cardId}`, {
			'name': newName
		}, (response) => {
			console.log(response)
		})
	}

}

const dom = new Dom()
const cards = new Cards();
cards.init()
