import {easyHandler} from "./data_handler.js";

const addNewColumn = document.getElementById('add-new-card-button')

class Cards {

    constructor() {
        this.newItemField = document.getElementsByName('new-item');


    }

    static cardItemMenu = `<span class="dropdown-toggle" data-mdb-toggle="dropdown" id="dropDownCardItem-1"></span>
			<div class="dropdown-menu" aria-labelledby="dropDownCardTitle-1">
				<span class="dropdown-item">Edit</span>
				<span class="dropdown-item">Delete</span>
			</div>`

    init() {

        this.displayItems()
        this.initChangeNameListener();
        this.initDragAndDrop();
        this.initDropdownMenuListener();
        this.add_column()
        this.initAddNewItemToCardListener();
        this.addNewItemToCard()


    }

    initDropdownMenuListener() {
        this.getAllEditFields().forEach(field => field.addEventListener('mouseenter', this.createDropdownMenu));
        this.getAllEditFields().forEach(field => field.addEventListener('mouseleave', this.removeMenu))
    }

    initAddNewItemToCardListener() {
        this.newItemField.forEach(item => item.addEventListener('keydown', this.addNewItemToCard.bind(this)))

    }

    createDropdownMenu(event) {
        event.target.insertAdjacentHTML('beforeend', Cards.cardItemMenu)
    }

    getAllEditFields() {
        return document.querySelectorAll('div[edit="true"]');
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

    addNewItemToCard() {

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
                    'name': target.value, 'owner_id': 1, 'board_id': board_id,
                    'column_id': columnId,
                }, (response) => {
                    if (response == true) {
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
        addNewColumn.addEventListener('click', (event) => {
            const path = window.location.pathname;
            let board_id = path.split('/')[2];
            event.preventDefault();
            easyHandler.postJson('PUT', '/api/add_column', {
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


function showColumns(columns) {
    for (let i = 0; i < columns.length; i++) {
        let outerHtml =
            `
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

function showCards(cards){
    if(cards.length > 0){
    let cardBody = document.getElementsByClassName('.cardBody')
        console.log(cardBody)
    for(let elem of cardBody){
        let parent = elem.getAttribute('name')
        for(let i = 0; i < cards.length; i++){
            if(parent = cards[i].column_id){
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

