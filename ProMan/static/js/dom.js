import {cards} from "./board.js";

export class Dom {
	constructor() {

	}

	initDropDownMenu() {
		return `<span class="dropdown-toggle" data-mdb-toggle="dropdown"></span>
			<div class="dropdown-menu" aria-labelledby="dropDownCardTitle">
				<span class="editCardItem dropdown-item">Edit</span>
				<span class="deleteCardItem dropdown-item" data-mdb-toggle="modal" data-mdb-target="#deleteModal">Delete</span>
			</div>`
	}

	initColumnMenu(name, id) {
		return `${name}<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
		 	<div class="dropdown-menu handle">
		 		<span class="dropdown-item editColumnName">Edit</span>
		 		<span class="dropdown-item deleteColumn" data-mdb-toggle="modal" data-mdb-target="#deleteModal" id="${id}">Delete</span>
		 	</div>`;
	}


	initNewColumn(data) {
		const column = document.createElement('div');
		column.className = 'col-md-auto rounded-3 p-1 alert-dark hover-shadow me-3 mb-3';
		column.setAttribute('id', data.id);
		column.innerHTML = `
		 <div class="bg-transparent border-0 list-group-item d-flex justify-content-between fw-bold mb-1 ">${data.name}<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
		 	<div class="dropdown-menu handle">
		 		<span class="dropdown-item editColumnName">Edit</span>
		 		<span class="dropdown-item deleteColumn" data-mdb-toggle="modal" data-mdb-target="#deleteModal" id="${data.id}">Delete</span>
		 	</div>
		 </div>
		 <div class="cardBody" id="${data.id}"></div>`

		const newItem = document.createElement('div');
		newItem.className = 'newItem list-group-item list-group-item-action';
		newItem.setAttribute('id', 'newItem');
		const inputItem = document.createElement('input');
		inputItem.setAttribute('type', 'text');
		inputItem.setAttribute('class', 'w-100');
		inputItem.setAttribute('placeholder', ' + new item');
		inputItem.addEventListener('keydown', cards.addNewCardToColumn.bind(cards))
		newItem.appendChild(inputItem);
		column.appendChild(newItem);
		return column
	}

	initNewCard(value) {
		const newCard = document.createElement('div');
		newCard.className = 'edit cardItem rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1';
		newCard.innerText = value;
		newCard.addEventListener('mouseenter', cards.createDropdownMenu);
		newCard.addEventListener('mouseleave', cards.hideDropdownMenu);
		return newCard;
	}
}
