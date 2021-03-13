import {dom} from "./dom.js";
import {easyHandler} from "./data_handler.js";
import {getCurrentUser} from "./usr.js";

const user = getCurrentUser();
const userID = user[0];


class Cards {
	constructor(id) {
		this.boardId = window.location.pathname.split('/')[2];
		this.boardName = document.querySelector('#boardName');
		this.columnNameInput = document.querySelector('#columnName')
		this.allColumnsContainer = document.querySelector('#allColumnsContainer');
		this.modalConfirmDeleteBtn = document.querySelector('#modalConfirmDelete');
		this.addNewColumnBtn = document.querySelector('#addNewColumnBtn');
		this.editFields = [];
		this.target = ''
		this.oldValue = ''
		this.userId = id
	}

	init() {
		this.initBoardName();
		this.initColumns();
		this.initAddColumnListener();
		this.initChangeNameListener();
		this.initClickListener();
		this.initDropdownMenuListener();
		this.initDragAndDrop();
	}

	initBoardName() {
		easyHandler._getData(`/api/board/${this.boardId}/name`, board => {
			this.boardName.innerText = board.name
		})
	}

	initAddColumnListener() {


		this.addNewColumnBtn.addEventListener('click', this.addNewColumn.bind(this));
		this.columnNameInput.addEventListener('keydown', this.addNewColumn.bind(this));
	}


	initDropdownMenuListener() {
		this.editFields.forEach(field => field.addEventListener('mouseenter', this.createDropdownMenu));
		this.editFields.forEach(field => field.addEventListener('mouseleave', this.hideDropdownMenu()));
	}

	initClickListener() {
		this.allColumnsContainer.addEventListener('click', (event) => {
			const target = event.target;
			this.initDragAndDrop();

			if (target.classList.contains('deleteColumn')) {
				const elementToDelete = event.path[3];
				const idToDetete = target.getAttribute('id');
				this.deleteColumn(idToDetete, elementToDelete);
			}

			if (target.classList.contains('editColumnName')) {
				const idToEdit = event.path[3].getAttribute('id');
				const columnToEdit = event.path[2];
				this.changeColumnName(idToEdit, columnToEdit);

			}
			if (target.classList.contains('deleteCardItem')) {
				const elementToDelete = event.path[2];
				const cardId = elementToDelete.getAttribute('id');
				this.deleteCard(elementToDelete, cardId);
			}

			if (target.classList.contains('editCardItem')) {
				const editTarget = event.path[2];
				this.initClickOutListener(editTarget);
			}

		},)

	}

	initClickOutListener(target) {
		const oldValue = target.innerText.replace('Edit\nDelete', '');
		target.innerHTML = `<input type="text" class="w-100" onclick="${target.childNodes[0].value}" placeholder=${oldValue}>`;
		target.childNodes[0].focus();
		target.removeEventListener('mouseleave', this.hideDropdownMenu);
		target.removeEventListener('mouseenter', this.createDropdownMenu);
		const that = this;
		document.addEventListener('click', function clickOut(secondEvent) {
			if (secondEvent.target === target) {
				//	pass
			} else {
				const newValue = target.childNodes[0].value;
				if (newValue !== '') {
					const cardId = target.getAttribute('id');
					target.innerHTML = newValue;
					that.updateCardName(cardId, newValue);
					document.removeEventListener("click", clickOut, false);
					target.addEventListener('mouseenter', that.createDropdownMenu);
					target.addEventListener('mouseleave', that.hideDropdownMenu);
				}
			}
		}, false);
	}

	changeColumnName(id, columnToEdit) {
		const oldName = columnToEdit.innerText.replace('Edit\nDelete', '');
		columnToEdit.innerHTML = `<input class="w-100" type="text" placeholder=${oldName}>`;
		document.addEventListener('click', function out(event) {

			if (event.target === columnToEdit.childNodes[0]) {
				//	pass
			} else {
				const newName = columnToEdit.childNodes[0].value;
				if (newName !== '') {
					columnToEdit.innerHTML = dom.initColumnMenu(newName, id);
					easyHandler._postJson('PATCH', `/api/columns/${id}/name`, {
						'name': newName
					}, response => {

					})
					document.removeEventListener('click', out, false);
				}
			}

		}, false)
	}

	deleteColumn(columnId, element) {
		this.modalConfirmDeleteBtn.addEventListener('click', () => {
			easyHandler._postJson('DELETE', `/api/columns/${columnId}`, {}, () => {
				element.remove();
			}, {once: true})
		})
	}

	deleteCard(element, cardId) {
		this.modalConfirmDeleteBtn.addEventListener('click', () => {
			easyHandler._postJson('DELETE', `/api/cards/${cardId}`, {}, () => {
				element.remove();
			}, {once: true})
		})
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
			const oldValue = target.innerText;
			if (target.classList.contains('edit')) {

				target.innerHTML = `<input class="w-100" type="text" placeholder=${oldValue}>`;
				target.childNodes[0].focus();
				target.removeEventListener('mouseleave', this.hideDropdownMenu);
				target.removeEventListener('mouseenter', this.createDropdownMenu);
				this.target = target;
				this.oldValue = oldValue;
				document.addEventListener('click', this.clickOutChangeName.bind(this), {once: true})
			}
		})
	}


	clickOutChangeName(secondEvent) {
		const target = this.target
		target.addEventListener('mouseenter', this.createDropdownMenu);
		target.addEventListener('mouseleave', this.hideDropdownMenu);

		if (secondEvent.target === target) {
			//	pass
		} else {
			const newValue = target.childNodes[0].value;

			if (newValue === '') {
				target.innerText = this.oldValue;
			} else {
				const cardId = target.getAttribute('id');
				target.innerHTML = newValue;
				this.updateCardName(cardId, newValue);
			}
		}

	}

	initDragAndDrop() {
		const columnBody = document.querySelectorAll('.columnBody');
		const columns = this.allColumnsContainer.children
		columnBody.forEach(card => {
			new Sortable(card, {
				group: 'shared', animation: 150, ghostClass: 'bg-warning'
			});
			card.addEventListener('dragend', this.moveCardUpdateIndex);
		})

		new Sortable(this.allColumnsContainer, {
			handle: '.bg-transparent', animation: 150, ghostClass: 'bg-warning'
		});

		this.allColumnsContainer.addEventListener('dragend', this.moveColumnUpdateIndex.bind(this));

	}

	moveColumnUpdateIndex(event) {
		event.preventDefault();
		this.allColumnsContainer.children.forEach(column => {
			const columnId = column.getAttribute('id');
			const columnIndex = Array.prototype.indexOf.call(this.allColumnsContainer.children, column);
			easyHandler._postJson('PATCH', `/api/columns/${columnId}/index`, {
				index: columnIndex
			}, (response) => {
				if (response === true) {
					//	pass
				} else {
					// pass
				}
			})
		})

	}

	moveCardUpdateIndex(event) {
		event.preventDefault();
		const columnId = event.path[2].getAttribute('id');
		const allCardsCollection = event.target.parentNode.children;
		allCardsCollection.forEach(card => {
			const cardId = card.getAttribute('id');
			const cardIndex = Array.prototype.indexOf.call(allCardsCollection, card);
			easyHandler._postJson('PATCH', `/api/card/${cardId}/column`, {
				'column_id': columnId, index: cardIndex
			}, (response) => {
				if (response === true) {
					//	pass
				} else {
					// pass
				}
			})
		})
	}


	addNewCardToColumn(event) {
		if (event.key === 'Enter') {
			const target = event.target;
			const column = event.path[2];
			const columnId = column.getAttribute('id');
			const columnBody = column.querySelector(".columnBody");
			const name = target.value;

			if (name !== '') {
				const newCard = dom.initNewCard(target.value);
				columnBody.appendChild(newCard);
				const cardIndex = Array.prototype.indexOf.call(columnBody.children, newCard);
				target.value = ''
				easyHandler._postJson('POST', '/api/card', {
					'name': name, 'owner_id': this.userId, 'board_id': this.boardId, 'column_id': columnId, 'index': cardIndex,
				}, (response) => {
					if (response.id) {
						newCard.setAttribute('id', response.id);
					} else {
						alert('Failed');
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
				alert('Failed');
			}
		})
	}


	insertColumns(columns) {
		columns.forEach(column => {
			this.allColumnsContainer.appendChild(dom.initNewColumn(column));
		})
		this.insertCards(columns);

	}

	insertCards(columns) {
		const allColumnsBody = document.querySelectorAll('.columnBody');
		columns.forEach(column => {
			easyHandler._getData(`/api/cards/${column.id}`, (cardsData) => {
				cardsData.forEach(card => {
					allColumnsBody.forEach(body => {
						const columnBodyId = parseInt(body.getAttribute('id'));
						const newCard = dom.initNewCard(card.name);
						newCard.setAttribute('id', card.id)
						if (card.column_id === columnBodyId) {
							body.appendChild(newCard);
						}
					})
				})
			})
		})
	}

	addNewColumn(event) {
		if (event.type === 'click' || event.key === 'Enter') {
			easyHandler._postJson('POST', '/api/columns', {
				'name': this.columnNameInput.value, 'owner_id': this.userId, 'board_id': this.boardId
			}, (newColumn) => {
				if (newColumn.id) {
					this.allColumnsContainer.appendChild(dom.initNewColumn(newColumn, this.columnNameInput.value));
					columnName.value = ''
				} else {
					alert('Failed');
				}
			})

		}
	}

	updateCardName(cardId, newName) {

		easyHandler._postJson('PATCH', `/api/card/${cardId}/name`, {
			'name': newName
		}, (response) => {
			// console.log(response)
		})
	}

}

export const cards = new Cards(userID);
cards.init();

