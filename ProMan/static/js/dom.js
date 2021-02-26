// It uses data_handler.js to visualize elements
import {dataHandler, easyHandler} from "./data_handler.js";

const name = document.getElementById('name')
const note = document.getElementById('note')
const button = document.getElementById('add_board')


export let dom = {
    init: function () {
        this.loadBoards()
        this.addBoard()
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        // dataHandler.getBoards(function (boards) {
        //     dom.showBoards(boards);
        // });
        easyHandler._getData('/api/get-boards', (boards) => this.showBoards)

    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        console.log(boards)
        //


        // let boardList = '';
        //
        // for(let board of boards){
        //     boardList += `
        //         <li>${board.title}</li>
        //     `;
        // }
        //
        // const outerHtml = `
        //     <ul class="board-container">
        //         ${boardList}
        //     </ul>
        // `;
        //
        // let boardsContainer = document.querySelector('#boards');
        // boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    addBoard: function () {

        button.addEventListener('click', (event) => {
            console.log(name.value)
            console.log(note.value)
            console.log('clicked')

            easyHandler.postJson('PUT','/api/add_board', {
                'name': name.value,
                'owner_id': 1,
                'note': note.value
            }, (response) => console.log(response))
        })


    }

}
