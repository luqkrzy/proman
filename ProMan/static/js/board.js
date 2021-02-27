//  In progress
// const editFields = document.querySelectorAll('a[edit="true"]')
// editCardTitleLink.addEventListener('click', changeCardName)
//
// function changeCardName() {
// 	const editCartTitleName = editCardTitleLink.getAttribute('name');
// 	const cardTitleTag = document.getElementById(editCartTitleName);
// 	cardTitleTag.innerHTML = `<input type="text" placeholder="">`
// }


document.addEventListener('dblclick', (event) => {
	const target = event.target;
	if (target.getAttribute('edit') === "true") {
		const oldValue = target.innerText
		target.innerHTML = `<input class="w-100" type="text" placeholder=${oldValue}>`;
		target.childNodes[0].focus()

		document.addEventListener('click', (secondEvent) => {

			if (secondEvent.target === target) {
				//pass
			} else {
				const newValue = target.childNodes[0].value

				if (newValue === '') {
					target.innerText = oldValue
				} else {
					target.innerHTML = `${newValue}<span class="dropdown-toggle" data-mdb-toggle="dropdown"></span>
						<div class="dropdown-menu">
							<span class="dropdown-item">Edit</span>
							<span class="dropdown-item">Delete</span>`
				}

			}

		}, {once: true})
	}
})

initDragAndDrop()

let parentDivOnDragStart;

function initDragAndDrop() {
    let boards = document.querySelectorAll('.list-group');
    let cards = document.getElementsByName('card')

    initBoards(boards)
    initCards(cards)
}

function initBoards(boards) {
    for (let board of boards) {
        board.classList.add('drop-zone')
        board.addEventListener('drop', onDrop);
        board.addEventListener('dragover', onDragOver);
        board.addEventListener('dragleave', onDragLeave);
    }
    console.log(boards)
}

function initCards(cards) {
    console.log(cards)
    for (let card of cards) {
        card.setAttribute('draggable', 'true');
        card.addEventListener("dragstart", onDragStart);
        card.addEventListener("dragend", onDragEnd);
    }
    console.log(cards)
}

function onDragStart(event) {
    this.classList.add('dragged')
    event.dataTransfer.setData('type/dragged', this);
    event.dataTransfer.setData('type/dragged-card', this);
    parentDivOnDragStart = this.parentNode;
    console.log(this)
}

function onDragEnd(event) {
    event.preventDefault();
    setDropZones(false);
    this.classList.remove('dragged');
}

function onDrop(event) {
    let draggedElement = document.querySelector(".dragged");
    event.currentTarget.appendChild(draggedElement);
}

function onDragOver(event) {
        event.preventDefault();
}

function onDragLeave(event) {
    if (event.dataTransfer.types.includes(`type/dragged-card`) &&
        event.relatedTarget !== null &&
        event.currentTarget !== event.relatedTarget.closest('.drop-zone')) {
        this.classList.remove("over-zone");
        this.classList.add("active-zone");
    }
}

function setDropZones(highlighted = true) {
    let dropZones = document.querySelectorAll(".drop-zone");
    for (let dropZone of dropZones) {
        if (highlighted) {
            dropZone.classList.add("active-zone");
        } else {
            dropZone.classList.remove("active-zone");
        }
    }
}