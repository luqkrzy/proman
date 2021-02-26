// It uses data_handler.js to visualize elements
import {dataHandler, easyHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        this.loadBoards()
        console.log(this)
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        console.log(boards)
        //
        for (let board of boards) {

            const outerHtml = `
                <section class="board" id="boardSection${board.id}">

                    <div class="board-header" id="board${board.id}"><span class="board-title" id="title${board.id}">${board.name}</span>
                        <div>${board.note}</div>
                        <div>${board.owner_id}</div>
                        <button class="board-add" data-column-id="${board.id}">Add column</button>
                        <button class="board-add" data-board-id="${board.id}">Add Card</button>
                </div>
                </section>`;
            callback();
            let boardsContainer = document.querySelector('.table');
            boardsContainer.insertAdjacentHTML(boards.html, outerHtml);
        }

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
    // here comes more features
};
