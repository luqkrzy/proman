import {easyHandler} from "./data_handler.js";


class Cards {
	constructor() {
		this.newItemField = document.querySelectorAll('.new-item');
		this.allCardsContainer = document.querySelector('#allColumnsContainer');
		this.modalConfirmDeleteBtn = document.querySelector('#modalConfirmDelete');
		this.addNewColumn = document.getElementById('add-new-card-button');
	}

	static cardItemMenu = `<span class="dropdown-toggle" data-mdb-toggle="dropdown" id="dropDownCardItem-1"></span>
			<div class="dropdown-menu" aria-labelledby="dropDownCardTitle-1">
				<span class="editCardItem dropdown-item">Edit</span>
				<span class="deleteCardItem dropdown-item" data-mdb-toggle="modal" data-mdb-target="#deleteModal">Delete</span>
			</div>`

	init() {
		this.initChangeNameListener();
		this.initDragAndDrop();
		this.initDropdownMenuListener();
		this.initAddNewItemToCardListener();
		this.initClickListener();

		this.add_column();
		this.addNewItemToCard()

	}

	initDropdownMenuListener() {
		this.getAllEditFields().forEach(field => field.addEventListener('mouseenter', this.createDropdownMenu));
		this.getAllEditFields().forEach(field => field.addEventListener('mouseleave', this.hideDropdownMenu))
	}

	initAddNewItemToCardListener() {
		this.newItemField.forEach(item => item.addEventListener('keydown', this.addNewItemToCard.bind(this)))

	}


	initClickListener() {
		this.allCardsContainer.addEventListener('click', (event) => {
			const target = event.target

			if ((target.classList.contains('deleteColumn'))) {
				let elementToDelete = event.path[3]
				this.deleteColumn(elementToDelete)
			}

			if ((target.classList.contains('deleteCardItem'))) {
				let elementToDelete = event.path[2]
				this.deleteCard(elementToDelete)
			}

			if ((target.classList.contains('editCardItem'))) {
				const target = event.path[2]
				const oldValue = target.innerText.replace('Edit\nDelete', '');
				console.log(oldValue)

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

	getAllEditFields() {
		return document.querySelectorAll('div[edit="true"]');
	}

	deleteColumn(element) {
		console.log(this.modalConfirmDeleteBtn)
		this.modalConfirmDeleteBtn.addEventListener('click', () => {
			element.remove()
		}, {once: true})
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
		this.allCardsContainer.addEventListener('dblclick', (event) => {
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
							target.innerHTML = `${newValue}`;
						}
					}
				}, {once: true});
			}
		})
	}

	initDragAndDrop() {
		const cardsBody = document.querySelectorAll('.cardBody');

		cardsBody.forEach(card => {
			new Sortable(card, {
				group: 'shared', animation: 150, ghostClass: 'bg-warning'
			});
		})

		new Sortable(this.allCardsContainer, {
			swapThreshold: 1, animation: 150, ghostClass: 'bg-warning'
		});
	}

	addNewItemToCard(event) {
		if (event.key === 'Enter') {
			const value = event.target.value
			const cardBody = event.path[1].previousElementSibling;
			const newItem = document.createElement('div');
			newItem.className = "rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1";
			newItem.innerText = `${event.target.value}`;
			newItem.setAttribute('edit', 'true');
			newItem.addEventListener('mouseenter', this.createDropdownMenu);
			newItem.addEventListener('mouseleave', this.hideDropdownMenu);

			if (value !== '') {
				cardBody.appendChild(newItem);
				event.target.value = '';
			}
		}
	}

	addNewItemToCard2() {

		document.addEventListener('keydown', (event) => {
			const target = event.target;
			if (event.key === 'Enter') {
				let column = target.parentNode.parentNode
				let cardDiv = column.querySelector(".cardBody")
				let columnId = cardDiv.getAttribute('name')
				let addCard = document.createElement('div')
				addCard.className = ('edit rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1')
				addCard.setAttribute('edit', 'true')
				addCard.innerText = target.value
				const path = window.location.pathname;
				let board_id = path.split('/')[2];

				easyHandler.postJson('PUT', '/api/add_card', {
					'name': target.value, 'owner_id': 1, 'board_id': board_id, 'column_id': columnId,
				}, (response) => {
					if (response === true) {
						document.location.href = path;
					} else {
						document.location.href = path;
						alert('Failed')
					}
				})

				cardDiv.appendChild(addCard)
				target.value = ''
			}
		})
	}


	displayItems() {
		const path = window.location.pathname;
		let board_id = path.split('/')[2];
		easyHandler._getData(`/api/get-cols/${board_id}`, (columns) => {
			if (columns) {
				showColumns(columns);
			} else {
				document.location.href = "/";
				alert('Failed')
			}
		})

	}

	add_column() {
		this.addNewColumn.addEventListener('click', (event) => {
			const path = window.location.pathname;
			let board_id = path.split('/')[2];
			event.preventDefault();
			easyHandler._postJson('PUT', '/api/add_column', {
				'name': 'New Board', 'owner_id': 1, 'board_id': board_id
			}, (response) => {
				// if (response == true) {
				//     document.location.href = path;
				// } else {
				//     document.location.href = path;
				//     alert('Failed')
				// }
			})

		})
	}

	edit_column() {

	}


}

const cards = new Cards();
cards.init()

const new_item = document.getElementById('new-item')

document.addEventListener('keydown', (event) => {
	const target = event.target;
	console.log(target)
	if (event.key === 'Enter') {

		let addCard = document.createElement('div')
		addCard.className = ('edit rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1')
		addCard.setAttribute('edit', 'true')
		addCard.innerText = target.value

		let event_id = event.target
		console.log(event_id.id)
		let sp2 = document.getElementById(event_id.id).parentElement
		// let sp2 = document.getElementById(sp1).parentElement
		console.log('halooo')
		let parentDiv = sp2.parentNode
		console.log(sp2)
		console.log(parentDiv)
		parentDiv.insertBefore(addCard, sp2)
		target.value = ''


	}
})

function showColumns(columns) {
	for (let i = 0; i < columns.length; i++) {
		let outerHtml = `
    	<div class="col-md-auto rounded-3 p-1 alert-dark hover-shadow me-3 mb-3" name="${columns[i].id}" "><!-- start card  -->
    		<div class="bg-transparent border-0 list-group-item d-flex justify-content-between fw-bold mb-1">
    			${columns[i].name}<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
    			<div class="dropdown-menu">
    				<span class="dropdown-item">Edit</span>
    				<span class="dropdown-item" onclick="return this.parentNode.parentNode.parentNode.remove();">Delete</span>
    			</div>
    		</div>
    		<div class="cardBody" name="${columns[i].id}">

    		</div>
    		<div class="new-item list-group-item list-group-item-action" name="new-item">
    			<input type="text" class='w-100' placeholder=" + new item"></div>
    	</div><!-- end of card  -->`

		let parent = document.getElementById("columns_section")
		parent.insertAdjacentHTML("beforeend", outerHtml);

		easyHandler._getData(`/api/get-cards${columns[i].id}`, (cards) => {
			if (cards) {
				showCards(cards);
			} else {
				document.location.href = "/";
				alert('Failed')
			}
		})
	}
}

function showCards(cards) {
	if (cards.length > 0) {
		let cardBody = document.getElementsByClassName('.cardBody')
		console.log(cardBody)
		for (let elem of cardBody) {
			let parent = elem.getAttribute('name')
			for (let i = 0; i < cards.length; i++) {
				if (parent === cards[i].column_id) {
					let addCard = document.createElement('div')
					addCard.className = ('edit rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1')
					addCard.setAttribute('edit', 'true')
					addCard.setAttribute('id', parent)
					addCard.innerText = cards[i].name

				}

			}

		}


	}
}

