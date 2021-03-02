class Cards {
	constructor() {
		this.editFields = document.querySelectorAll('div[edit="true"]');
		this.newItemField = document.querySelectorAll('.new-item');

	}

	static cardItemMenu = `<span class="dropdown-toggle" data-mdb-toggle="dropdown" id="dropDownCardItem-1"></span>
			<div class="dropdown-menu" aria-labelledby="dropDownCardTitle-1">
				<span class="dropdown-item">Edit</span>
				<span class="dropdown-item">Delete</span>
			</div>`

	init() {
		this.initChangeNameListener();
		this.initDragAndDrop();
		this.initDropdownMenuListener();
		this.initRemoveMenuListener();
		this.initAddNewItemToCardListener();

	}

	initDropdownMenuListener() {
		this.editFields.forEach(field => field.addEventListener('mouseenter', this.createDropdownMenu))
	}

	initRemoveMenuListener() {
		this.editFields.forEach(field => field.addEventListener('mouseleave', this.removeMenu))
	}

	initAddNewItemToCardListener() {
		this.newItemField.forEach(item => item.addEventListener('keydown', this.addNewItemToCard))

	}

	createDropdownMenu(event) {
		event.target.insertAdjacentHTML('beforeend', Cards.cardItemMenu)
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
		const allCards = document.querySelector('.allCards');

		cardsBody.forEach(card => {
			new Sortable(card, {
				group: 'shared', animation: 150, ghostClass: 'bg-warning'
			});
		})

		new Sortable(allCards, {
			swapThreshold: 1, animation: 150, ghostClass: 'bg-warning'
		});
	}

	addNewItemToCard(event) {
		if (event.key === 'Enter') {
			const value = event.target.value
			const cardBody = event.path[1].previousElementSibling;
			const newItem = `<div edit="true" class="edit rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1">${event.target.value}</div>`;
			if (value !== '') {
				cardBody.insertAdjacentHTML('beforeend', newItem);
				event.target.value = '';
			}
		}
	}

}

const cards = new Cards();
cards.init()

