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

	initNewColumn(data) {
		return `
    	<div class="col-md-auto rounded-3 p-1 alert-dark hover-shadow me-3 mb-3" id="${data.id}"><!-- start column  -->
    		<div class="bg-transparent border-0 list-group-item d-flex justify-content-between fw-bold mb-1 ">
    			New Column<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
    			<div class="dropdown-menu handle">
    				<span class="dropdown-item editColumnName">Edit</span>
    				<span class="dropdown-item deleteColumn" data-mdb-toggle="modal" data-mdb-target="#deleteModal" id="${data.id}">Delete</span>
    			</div>
    		</div>
    		<div class="cardBody" id="${data.id}">
    		</div>
    		<div class="newItem list-group-item list-group-item-action" id="newItem">
    			<input type="text" class='w-100' placeholder=" + new item"></div>
    	</div><!-- end of column  -->`
	}

	initNewCard(value) {
		const newCard = document.createElement('div');
		newCard.className = ('cardItem rounded-3 list-group-item list-group-item-action d-flex justify-content-between mb-1');
		newCard.setAttribute('edit', 'true');
		newCard.innerText = value;
		newCard.addEventListener('mouseenter', cards.createDropdownMenu);
		newCard.addEventListener('mouseleave', cards.hideDropdownMenu);
		return newCard;
	}
}
