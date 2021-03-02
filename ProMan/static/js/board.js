// import {Dom} from "./new-dom.js";


class Cards {
	constructor() {
		this.newItemField = document.querySelectorAll('.new-item');
		this.allCardsContainer = document.querySelector('.allCards');

	}

	static confirmDeleteBtn = document.getElementById('confirmDelete');

	static cardItemMenu = `<span class="dropdown-toggle" data-mdb-toggle="dropdown" id="dropDownCardItem-1"></span>
			<div class="dropdown-menu" aria-labelledby="dropDownCardTitle-1">
				<span class="dropdown-item">Edit</span>
				<span class="deleteCardItem dropdown-item" data-mdb-toggle="modal" data-mdb-target="#deleteModal">Delete</span>
			</div>`

	init() {
		this.initChangeNameListener();
		this.initDragAndDrop();
		this.initDropdownMenuListener();
		this.initAddNewItemToCardListener();
		this.initDeleteCardBtnListener();
		// this.initDeleteCardItemBtnListener();

	}

	initDropdownMenuListener() {
		this.getAllEditFields().forEach(field => field.addEventListener('mouseenter', this.createDropdownMenu.bind(this)));
		this.getAllEditFields().forEach(field => field.addEventListener('mouseleave', this.removeMenu))
	}

	initAddNewItemToCardListener() {
		this.newItemField.forEach(item => item.addEventListener('keydown', this.addNewItemToCard.bind(this)))

	}

	initDeleteCardBtnListener() {
		this.getDeleteCardBtns().forEach(card => card.addEventListener('click', this.deleteCard));

	}


	getDeleteCardBtns() {
		return document.querySelectorAll('.delete-card')

	}

	getAllEditFields() {
		return document.querySelectorAll('div[edit="true"]');
	}

	createDropdownMenu(event) {
		event.target.insertAdjacentHTML('beforeend', Cards.cardItemMenu);
		const deleteCardBtn = document.querySelector('.deleteCardItem');
		deleteCardBtn.addEventListener('click', this.deleteCardItem)
	}

	removeMenu(event) {
		const itemText = event.target.innerText;

		if (itemText.includes('Edit\nDelete')) {
			event.target.innerHTML = itemText.replace('Edit\nDelete', '');
		} else {
			event.target.innerHTML = itemText;
		}
	}

	initChangeNameListener() {
		document.addEventListener('dblclick', (event) => {
			const target = event.target;
			if (target.getAttribute('edit') === "true") {
				const oldValue = target.innerText;
				target.innerHTML = `<input class="w-100" type="text" placeholder=${oldValue}>`;
				target.childNodes[0].focus();
				target.removeEventListener('mouseleave', this.removeMenu);
				target.removeEventListener('mouseenter', this.createDropdownMenu);

				document.addEventListener('click', (secondEvent) => {
					target.addEventListener('mouseenter', this.createDropdownMenu)
					target.addEventListener('mouseleave', this.removeMenu)

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
			newItem.setAttribute('delete', 'true');
			newItem.addEventListener('mouseenter', this.createDropdownMenu);
			newItem.addEventListener('mouseleave', this.removeMenu);
			newItem.addEventListener('click', this.deleteCardItem);

			if (value !== '') {
				cardBody.appendChild(newItem);
				event.target.value = '';
			}
		}
	}

	deleteCard(event) {
		const target = event.path[3];
		Cards.confirmDeleteBtn.addEventListener('click', () => {
			target.remove()
		}, {once: true})
	}

	deleteCardItem(event) {
		const target = event.path[2];
		Cards.confirmDeleteBtn.addEventListener('click', () => {
			target.remove();
		}, {once: true})
	}
}

const cards = new Cards();
cards.init()

