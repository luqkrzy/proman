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

class Boards {

    constructor() {
        this.user = currentUser

    }

    init() {
        const path = window.location.pathname;
        if (path === '/') {
            this.loadBoards()
            this.addBoard();
        }
    }

    loadBoards() {
        easyHandler._getData('/api/get-boards', (boards) => this.showBoards(boards))
    }

    showBoards(boards) {
        console.log(this.user)
        console.log(boards)
    }


    addBoard() {
        addNewBoardBtn.addEventListener('click', (event) => {
            // event.preventDefault();
            console.log(name.value)
            console.log(note.value)
            console.log(name.value)
            // event.stopPropagation();
            easyHandler.postJson('PUT', '/api/add_board', {
                'name': name.value, 'owner_id': 1, 'note': note.value
            }, (response) => console.log(response))

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

const boards = new Boards()

boards.init()


// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.needs-validation');

// Loop over them and prevent submission
Array.prototype.slice.call(forms).forEach((form) => {
    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    }, false);
});
