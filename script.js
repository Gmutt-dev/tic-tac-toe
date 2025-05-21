

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

    function setInitialPlayer(player) {
        if (currentPlayer !== playerOne && currentPlayer !== playerTwo) currentPlayer = player;
            else throw Error("Initial player already set");
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
    
    function resetGame() {
        currentPlayer = {};
        winner = "";
        gameboard.resetBoard();
    }
     
    return {setInitialPlayer, getCurrentPlayer, getWinner, isTie, playRound, resetGame}; 
})();


// Display Controller
const display = (function displayController() {
    // Get outer container DOM reference
    const outerContainer = document.querySelector(".outer-container");
    // Initial eventlisteners?


    function updateDisplay() {

    }
    
    
    function createGameboard() {
        const gameboardLayout = gameboard.getLayout();
        const gameboardElement = document.createElement("div");
        gameboardElement.classList.add("gameboard");
        
        //for every outer row
        for (let row = 0; row < gameboardLayout.length; row++) {
            //loop over every inner column
            for (let col = 0; col < gameboardLayout[row].length; col++) {
                const button = document.createElement("button");
                button.classList.add("spot")
                button.dataset.position = `${row}${col}`;
                button.textContent = gameboardLayout[row][col];
                // add eventlisteners on all spots
                button.addEventListener("click", playRound)
                gameboardElement.appendChild(button);
            }
        }
       
        return gameboardElement;
    }

    function renderGameboard() {
        const gameboardContainer = document.querySelector(".gameboard-container");
        gameboardContainer.textContent = ""; // Clear current gameboard display;
        gameboardContainer.appendChild(createGameboard());
    }
    
    function playRound(event) {
        if (event.target.textContent === "") game.playRound(event.target.dataset.position[0],event.target.dataset.position[1]);
            else alert("Can't place marker on already occupied spot.\nPlease try again");
        renderGameboard();
    }

    return {renderGameboard};
})();


////TEMP console controller for testing

// create initial two player objects
const playerOne = player("Player1", "X");
const playerTwo = player("Player2", "O");

// set first to play
game.setInitialPlayer(playerOne);

// intitial render
// display.renderGameboard();

// if(!game.getWinner()) {
//     console.log(`${game.getCurrentPlayer().getName()}'s turn`);
//     game.playRound("1", "0");
    
// } else {
//     console.log(`The winner is ${game.getWinner()}`);
//     // game.reset();
// }
// if(!game.getWinner()) {
//     console.log(`${game.getCurrentPlayer().getName()}'s turn`);
//     game.playRound("1", "2");
    
// } else {
//     console.log(`The winner is ${game.getWinner()}`);
//     // game.reset();
// }
// if(!game.getWinner()) {
//     console.log(`${game.getCurrentPlayer().getName()}'s turn`);
//     game.playRound("1", "1");
    
// } else {
//     console.log(`The winner is ${game.getWinner()}`);
//     // game.reset();
// }
// if(!game.getWinner()) {
//     console.log(`${game.getCurrentPlayer().getName()}'s turn`);
//     game.playRound("0", "1");
    
// } else {
//     console.log(`The winner is ${game.getWinner()}`);
//     // game.reset();
// }
// if(!game.getWinner()) {
//     console.log(`${game.getCurrentPlayer().getName()}'s turn`);
//     game.playRound("2", "0");
    
// } else {
//     console.log(`The winner is ${game.getWinner()}`);
//     // game.reset();
// }
// if(!game.getWinner()) {
//     console.log(`${game.getCurrentPlayer().getName()}'s turn`);
//     game.playRound("2", "1");
    
// } else {
    
//     console.log(`The winner is ${game.getWinner()}`);
//     // game.reset();
// }

////endTEMP