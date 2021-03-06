import {easyHandler} from "./data_handler.js";
import {getCurrentUser} from "./usr.js";

const user = getCurrentUser()
const userID = user[0]

class Cards {
	constructor() {
		this.newItemField = document.querySelectorAll('.newItem');
		this.allColumnsContainer = document.querySelector('#allColumnsContainer');
		this.modalConfirmDeleteBtn = document.querySelector('#modalConfirmDelete');
		this.addNewColumn = document.querySelector('#addNewColumnBtn');
		this.editFields = []

	}

	static cardItemMenu = `<span class="dropdown-toggle" data-mdb-toggle="dropdown" id="dropDownCardItem-1"></span>
			<div class="dropdown-menu" aria-labelledby="dropDownCardTitle-1">
				<span class="editCardItem dropdown-item">Edit</span>
				<span class="deleteCardItem dropdown-item" data-mdb-toggle="modal" data-mdb-target="#deleteModal">Delete</span>
			</div>`

	init() {
		this.initColumns();
		this.initAddColumnListener();
		this.addNewCardToColumn()
		this.initChangeNameListener();
		this.initAddNewItemToCardListener();
		this.initClickListener();
		this.initDropdownMenuListener();
	}

	initDropdownMenuListener() {
		this.editFields.forEach(field => field.addEventListener('mouseenter', this.createDropdownMenu));
		this.editFields.forEach(field => field.addEventListener('mouseleave', this.hideDropdownMenu()));
	}

	initAddNewItemToCardListener() {
		this.newItemField.forEach(item => item.addEventListener('keydown', this.addNewCardToColumn.bind(this)))

	}

	initClickListener() {
		this.allColumnsContainer.addEventListener('click', (event) => {
			const target = event.target
			this.initDragAndDrop();

			if ((target.classList.contains('delete-column'))) {
				let elementToDelete = event.path[3]
				let idToDetete = target.getAttribute('id')
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
		event.target.insertAdjacentHTML('beforeend', Cards.cardItemMenu);
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


	addNewCardToColumn() {
		document.addEventListener('keydown', (event) => {
			const target = event.target;
			if (event.key === 'Enter') {
				const column = target.parentNode.parentNode
				const cardDiv = column.querySelector(".cardBody")
				const columnId = cardDiv.getAttribute('id')
				const newCard = document.createElement('div')
				newCard.className = ('edit rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1')
				newCard.setAttribute('edit', 'true')
				newCard.setAttribute('id', columnId)
				newCard.innerText = target.value
				console.log(target.value)

				if (target.value !== '') {

					this.editFields.push(newCard)
					newCard.addEventListener('mouseenter', this.createDropdownMenu);
					newCard.addEventListener('mouseleave', this.hideDropdownMenu);
					const path = window.location.pathname;
					const board_id = path.split('/')[2];
					cardDiv.appendChild(newCard)
					target.value = ''

					easyHandler._postJson('POST', '/api/add-card', {
						'name': target.value, 'owner_id': userID, 'board_id': board_id, 'column_id': columnId,
					}, (response) => {
						// if (response === true) {
						//     document.location.href = path;
						// } else {
						//     document.location.href = path;
						//     alert('Failed')
						// }
					})


				}


			}
		})
	}


	initColumns() {
		const path = window.location.pathname;
		let board_id = path.split('/')[2];
		easyHandler._getData(`/api/get-cols/${board_id}`, (columns) => {
			if (columns) {
				this.insertColumns(columns);
			} else {
				document.location.href = "/";
				alert('Failed')
			}
		})

	}

	initAddColumnListener() {
		this.addNewColumn.addEventListener('click', (event) => {
			const path = window.location.pathname;
			let board_id = path.split('/')[2];
			event.preventDefault();
			easyHandler._postJson('POST', '/api/add-column', {
				'name': 'New Board', 'owner_id': userID, 'board_id': board_id
			}, (response) => {
				if (response === true) {
					document.location.href = path;
				} else {
					document.location.href = path;
					alert('Failed')
				}
			})

		})
	}

	insertColumns(columns) {
		for (let i = 0; i < columns.length; i++) {
			let outerHtml = `
    	<div class="col-md-auto rounded-3 p-1 alert-dark hover-shadow me-3 mb-3" id="${columns[i].id}" "><!-- start card  -->
    		<div class="bg-transparent border-0 list-group-item d-flex justify-content-between fw-bold mb-1 ">
    			${columns[i].name}<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
    			<div class="dropdown-menu handle">
    				<span class="dropdown-item edit-column-name">Edit</span>
    				<span class="dropdown-item delete-column" data-mdb-toggle="modal" data-mdb-target="#deleteModal" id="${columns[i].id}">Delete</span>
    			</div>
    		</div>
    		<div class="cardBody" id="${columns[i].id}">

    		</div>
    		<div class="newItem list-group-item list-group-item-action" id="newItem">
    			<input type="text" class='w-100' placeholder=" + new item"></div>
    	</div><!-- end of card  -->`

			let parent = document.getElementById("allColumnsContainer")
			parent.insertAdjacentHTML("beforeend", outerHtml);

			let columnId = columns[i].id

			easyHandler._getData(`/api/get-cards/${columnId}`, (cards) => {
				if (cards.length > 0) {
					this.initCards(cards, columnId);
				}
				// } else {
				//     document.location.href = "/";
				//     alert('Failed')
				// }
			})
		}
	}

	initCards(cards, columnId) {
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
		console.log(cardDiv)
		let cardId = cardDiv.getAttribute('itemId')

		easyHandler._postJson('POST', `/api/update-card-name/${cardId}`, {
			'name': newName
		}, (response) => {
			console.log(response)
		})
	}

}

const cards = new Cards();
cards.init()
