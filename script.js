

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
    let openSpots = 9;
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

    function isTie() {
        return openSpots === 0;
    }
        
    function checkForWin() {
        const playerMarker = currentPlayer.getMarker();
        
        function checkRows() {
            gameboard.getLayout().forEach((row) => {
                if (row.filter((mark) => mark === playerMarker).length === 3)
                    setWinner();
            });
        }
        
        function checkColumns() {
            //for every column (loop)
            for (let col = 0; col < 3; col++) {
                //for every row item (loop)
                for (let row = 0; row < 3; row++) {
                    //check until 3 player marks or break;
                    if (gameboard.getLayout()[row][col] !== playerMarker)
                        break;
                    // if 3 player marks setWinner();
                    if (row === 2)
                        setWinner();
                }
            }  
        }
        
        function checkDiagonal() {
            //only if playerMarker === to middle spot [1][1], since diagonal win only possible if currentPlayer controls that spot
            if (playerMarker === gameboard.getLayout()[1][1]) {
                if (
                    playerMarker === gameboard.getLayout()[0][0] && playerMarker === gameboard.getLayout()[2][2] || //backward diagonal
                    playerMarker === gameboard.getLayout()[2][0] && playerMarker === gameboard.getLayout()[0][2]    //forward diagonal
                )
                setWinner();
            }
        }
            
        checkRows();
        if (!winner) checkColumns();
        if (!winner) checkDiagonal();
    }
            
    function playRound(row, col) {
        
        if (currentPlayer !== playerOne && currentPlayer !== playerTwo) {
            throw Error("First player needs to be assigned first!")
        } else if (!winner && !isTie()) {
            if (gameboard.placeMarker(currentPlayer.getMarker(), parseInt(row), parseInt(col))) {
                openSpots--;
                checkForWin();
                changeTurn();                
            } // else ignore input, as spot already taken or win state or tie state
        } else {
            throw Error("No further rounds when a winner has been declared!");
        }
    }
    
    function reset() {
        currentPlayer = {};
        winner = "";
        gameboard.resetBoard();
    }
     
    return {setCurrentPlayer, getCurrentPlayer, getWinner, isTie, playRound, reset}; 
})();


// Display Controller
const display = (function displayController() {
    // Initial eventlisteners


    function updateDisplay() {

    }


})();


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
    game.playRound("1", "0");
    
} else {
    console.log(`The winner is ${game.getWinner()}`);
    // game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("1", "2");
    
} else {
    console.log(`The winner is ${game.getWinner()}`);
    // game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("1", "1");

} else {
    console.log(`The winner is ${game.getWinner()}`);
    // game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("0", "1");
    
} else {
    console.log(`The winner is ${game.getWinner()}`);
    // game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("2", "0");
    
} else {
    console.log(`The winner is ${game.getWinner()}`);
    // game.reset();
}
if(!game.getWinner()) {
    console.log(`${game.getCurrentPlayer().getName()}'s turn`);
    game.playRound("2", "1");
    
} else {
    
    console.log(`The winner is ${game.getWinner()}`);
    // game.reset();
}

////endTEMP