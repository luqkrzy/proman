// It uses data_handler.js to visualize elements
import {dataHandler, easyHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        this.loadBoards()
        console.log(this)
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
    // here comes more features
};
