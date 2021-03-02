import {easyHandler} from "./data_handler.js";

const name = document.getElementById('name');
const note = document.getElementById('note');
const addNewBoardBtn = document.getElementById('add_board');
const deleteBoardButton = document.getElementById('deleteBoard')

function getCurrentUser() {
    let current = ''
    if (user.includes('AnonymousUser')) {
        current = 'AnonymousUser'
    } else {
        current = user
    }
    return current

}

const currentUser = getCurrentUser();
const testUser = 1

class Boards {


	constructor() {
		this.user = currentUser

	}

	init() {
		const path = window.location.pathname;
		// if (path === '/') {
		this.loadBoards()
		this.addBoard();
		// }
	}

	loadBoards() {
		easyHandler._getData(`/api/get-boards/${testUser}`, (boards) => this.showBoards(boards))
	}

  showBoards(boards) {
        console.log(this.user)
        console.log(boards)
        for (let i = 0; i < boards.length; i++) {
            let outerHtml =
                `
            <a href="/board/${boards[i].id}">
			<div class="col" id="${boards[i].id}" name="board_col"><!-- start board -->
				<div class="card hover-shadow border" >
					<img src="https://mdbootstrap.com/img/new/standard/city/041.jpg" class="card-img-top" alt="pic"/>
					<div class="card-body">
						<h5 class="card-title" name="${boards[i].name}">${boards[i].name}</h5>
						<p class="card-text" name="${boards[i].note}">${boards[i].note}</p>
					</div>
					<div class="card-footer text-muted  d-flex justify-content-between ">2 days ago

						<i class="fas fa-ellipsis-h" data-mdb-toggle="dropdown"></i>
						<div class="dropdown-menu">
							<span class="dropdown-item">Edit name</span>
							<span class="dropdown-item">Edit note</span>
							<span class="dropdown-item">Delete</span>
						</div>
					</div>
				</div>
			</div>
            </a>`
            let parent = document.getElementById("board_section")
            parent.insertAdjacentHTML("beforeend", outerHtml);
        }
    }

	addBoard() {
		addNewBoardBtn.addEventListener('click', (event) => {
			// event.preventDefault();
			// event.stopPropagation();
			easyHandler.postJson('PUT', '/api/add_board', {
				'name': name.value, 'owner_id': 1, 'note': note.value
			}, (response) => {
				console.log(response)
				if (response === true) {
					alert('Board Added')
				} else {
					alert('Failed')
				}

			})

		})
	}

	deleteBoard() {
		deleteBoardButton.addEventListener('click', (event) => {
			event.preventDefault();
			easyHandler.postJson('DELETE', '/api/delete_board', {
				'board_id': 1
			}, (response) => console.log(response))
			if (response === true) {
				alert('Board deleted')
			} else {
				alert('Failed')
			}
		})
	}



}

const
    boards = new Boards()

boards
    .init()


// Fetch all the forms we want to apply custom Bootstrap validation styles to
const
    forms = document.querySelectorAll('.needs-validation');

// Loop over them and prevent submission
Array
    .prototype
    .slice
    .call(forms)

    .forEach(
        (
            form
        ) => {
            form
                .addEventListener(
                    'submit'
                    , (
                        event
                    ) => {
                        if (

                            !
                                form
                                    .checkValidity()

                        ) {
                            event
                                .preventDefault();

                            event
                                .stopPropagation();
                        }

                        form.classList.add('was-validated');
                    },
                    false
                )
            ;
        })
;
