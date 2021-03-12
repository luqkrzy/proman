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

	initNewColumn(data, name = null) {
		const column = document.createElement('div');
		column.className = 'col-md-auto rounded-3 p-1 alert-dark hover-shadow me-3 mb-3';
		column.setAttribute('id', data.id);
		column.innerHTML = `
		 <div class="bg-transparent border-0 list-group-item d-flex justify-content-between fw-bold mb-1 ">${name ? name : data.name}<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
		 	<div class="dropdown-menu handle">
		 		<span class="dropdown-item editColumnName">Edit</span>
		 		<span class="dropdown-item deleteColumn" data-mdb-toggle="modal" data-mdb-target="#deleteModal" id="${data.id}">Delete</span>
		 	</div>
		 </div>
		 <div class="columnBody" id="${data.id}"></div>`
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

	initNewBoard(board) {
			return `
			<div class="col" id="${board.id}" name="board-col"><!-- start board -->
				<div class="card hover-shadow border">
					<a href="/board/${board.id}"><img src="/static/img/board_01.jpg" class="card-img-top" alt="pic"/></a>
					<div class="card-body">
						 <a href="/board/${board.id}"><h5 class="card-title" name="${board.name}">${board.name}</h5></a>
						<p class="card-text" name="${board.note}">${board.note}</p>
					</div>
					<div class="card-footer text-muted  d-flex justify-content-between ">2 days ago
						<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
						<div id="${board.id}" class="dropdown-menu">
							<span class="editName dropdown-item">Edit name</span>
							<span class="editNote dropdown-item">Edit note</span>
							<span class="deleteBoard dropdown-item" data-mdb-toggle="modal" data-mdb-target="#deleteModal">Delete</span>
						</div>
					</div>
				</div>
			</div><!-- send board -->`
	}
}

export const dom = new Dom();
