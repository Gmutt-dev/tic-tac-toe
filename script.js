

// Player factory function
function player(name, marker) {
    marker = marker.toUpperCase();
    if (marker !== "X" && marker !== "O")
        throw Error("Marker must be an 'X' or 'O'")
    
    function getName() {
        return name;
    }

    function getMarker() {
        return marker;
    }
    
    return {getName, getMarker};
}

 // Gameboard factory function as IIFE module
const gameboard = (function() {
    const layout = [];
    
    // Get current board state
    function getLayout() {
        return layout;
    }

    //create empty gameboard array
    function resetBoard() {
        layout.splice(0, layout.length);
        layout.push(["", "", ""]);
        layout.push(["", "", ""]);
        layout.push(["", "", ""]);
    }

    // Place player marker on the board
    function placeMarker(marker, row, column) {
        if (!layout[row][column]) {
            layout[row][column] = marker;
            return true;
        } else return false;
    }

    // Create initial empty board state
    resetBoard();

    return {getLayout, resetBoard, placeMarker};
})();

//Game Controller function to control flow + state of game as IIFE module
const game = (function gameController() {

    let currentPlayer = {};
    let winner = "";

    function setCurrentPlayer(player) {
        currentPlayer = player;
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function setWinner() {
        winner = currentPlayer.getName();
    }

    function getWinner() {
        return winner;
    }

    function changeTurn() {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }
        
    function checkForWin() {
        const marker = currentPlayer.getMarker();

        function checkRows() {
            gameboard.getLayout().forEach((row) => {
                if (row.filter((mark) => mark === marker).length === 3) setWinner(); //winner
            })
        }

        function checkColumns() {

        }

        function checkDiagonalForward() {

        }

        function checkDiagonalBackward() {

        }

        checkRows();
        checkColumns();
        checkDiagonalForward();
        checkDiagonalBackward();

    }

    // Play round
    function playRound(row, col) {

        if (currentPlayer !== playerOne && currentPlayer !== playerTwo) {
            throw Error("First player needs to be assigned first!")
        }
        else if (gameboard.placeMarker(currentPlayer.getMarker(), parseInt(row), parseInt(col))) {
                checkForWin();
                changeTurn();                
        }
    }

    function reset() {
        currentPlayer = {};
        winner = "";
        gameboard.resetBoard();
    }


    return {setCurrentPlayer, getCurrentPlayer, getWinner, playRound, reset}; 
}
    
)();





////TEMP console controller for testing

const playerOne = player("John", "X");
const playerTwo = player("Sarah", "O");
console.log(playerOne, playerTwo);

// gameboard.placeMarker(playerOne.getMarker(), 1, 0);
// console.log(gameboard.getLayout());

// set first to play
game.setCurrentPlayer(playerOne);
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("0", "0");

} else {
    console.log(`The winner is ${game.getWinner()}`);
    game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("1", "1");

} else {
    console.log(`The winner is ${game.getWinner()}`);
    game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("0", "1");

} else {
    console.log(`The winner is ${game.getWinner()}`);
    game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("2", "0");

} else {
    console.log(`The winner is ${game.getWinner()}`);
    game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("0", "2");

} else {
    console.log(`The winner is ${game.getWinner()}`);
    game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("2", "2");

} else {
    console.log(`The winner is ${game.getWinner()}`);
    game.reset();
}
console.log(gameboard.getLayout());

////endTEMP