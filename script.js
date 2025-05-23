

// Player factory function
function player(name, marker) {
    marker = marker.toUpperCase();
    if (marker !== "X" && marker !== "O")
        throw Error("Marker must be an 'X' or 'O'")
    
    function getName() {
        return name;
    }

    function changeName(newName) {
        name = newName;
    }

    function getMarker() {
        return marker;
    }
    
    return {getName, changeName, getMarker};
}

 // Gameboard factory function as IIFE module
const gameboard = (function() {
    const layout = [];
    
    // Get current board state
    function getLayout() {
        return layout;
    }

    // Create empty gameboard array
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

// Game Controller factory function to control flow + state of game as IIFE module
const game = (function gameController() {

    let currentPlayer = {};
    let openSpots = 9;
    let winner = "";
    let winningSpots = [];

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

    function setWinningSpots(spots) {
        winningSpots = spots;
    }

    function getWinner() {
        return winner;
    }

    function getWinningSpots() {
        return winningSpots;
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
            gameboard.getLayout().forEach((rowValue, rowNo) => {
                if (rowValue.filter((mark) => mark === playerMarker).length === 3) {
                    setWinner();
                    setWinningSpots([[rowNo, 0], [rowNo, 1], [rowNo, 2], "-"]);
                }
            });
        }
        
        function checkColumns() {
            //for every column (loop)
            for (let col = 0; col < 3; col++) {
                //for every row item (loop)
                for (let row = 0; row < 3; row++) {
                    // Check until 3 player marks or break;
                    if (gameboard.getLayout()[row][col] !== playerMarker)
                        break;
                    // If 3 player marks setWinner();
                    if (row === 2) {
                        setWinner();
                        setWinningSpots([[0, col], [1, col], [2, col], "|"]);
                    }
                }
            }  
        }
        
        function checkDiagonal() {
            // Only if playerMarker === to middle spot [1][1], since diagonal win only possible if currentPlayer controls that spot
            if (playerMarker === gameboard.getLayout()[1][1]) {
                // Check backward diagonal
                if (playerMarker === gameboard.getLayout()[0][0] && playerMarker === gameboard.getLayout()[2][2]) {
                    setWinner();
                    setWinningSpots([[0, 0], [1, 1], [2, 2], "\\"]);
                }
                // Check forward diagonal
                else if (playerMarker === gameboard.getLayout()[2][0] && playerMarker === gameboard.getLayout()[0][2]) {
                    setWinner();
                    setWinningSpots([[0, 2], [1, 1], [2, 0], "/"]);
                }
            }
        }
        
        // First check rows
        checkRows();
        // Only check Columns if not already found a winner
        if (!winner) checkColumns();
        // Only check diagonals if not already found a winner
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
            } // Else ignore input, as spot already taken or win state or tie state
        } else {
            throw Error("No further rounds when a winner has been declared!");
        }
    }
    
    function resetGame() {
        currentPlayer = {};
        openSpots = 9;
        winner = "";
        gameboard.resetBoard();
    }
     
    return {setInitialPlayer, getCurrentPlayer, getWinner, getWinningSpots, isTie, playRound, resetGame}; 
})();


// Display Controller factory function as IIFE to control GUI 
const display = (function displayController() {
    // Get outer container DOM reference
    const outerContainer = document.querySelector(".outer-container");
    // Get player name change button DOM references
    const buttonChangeNamePlayerOne = document.querySelector(".player-one button");
    const buttonChangeNamePlayerTwo = document.querySelector(".player-two button");
    // Get Start / Restart Game button DOM reference
    const buttonStartGame = document.querySelector(".start-game button")
    // Initial eventlisteners
    buttonChangeNamePlayerOne.addEventListener("click", changePlayerName);
    buttonChangeNamePlayerTwo.addEventListener("click", changePlayerName);
    buttonStartGame.addEventListener("click", startGame);
    
    function renderPlayerName(player) {
        let playerName;
        // Select correct player name tag on DOM
        if (player === playerOne) playerName = document.querySelector(`p.player-one-name`);
        else playerName = document.querySelector(`p.player-two-name`);
        // Change the player's name
        playerName.textContent = `Name: ${player.getName()}`;
    }
    
    function changePlayerName(event) {
        // Determine if player1 or player2 relevant change button pressed
        const player = event.target.classList.contains("player-one-name") ? playerOne : playerTwo;
        const newName = prompt(`What is the new name?`, `${player === playerOne ? "Player1" : "Player2"}`);
        // Only change the name if the return value is not Null (when cancel button is pressed)
        if (newName !== null) player.changeName(newName);
        renderPlayerName(player);
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
                // Label each spot with a two digit row and column number for later reference
                button.dataset.position = `${row}${col}`;
                button.textContent = gameboardLayout[row][col];
                // Add eventlisteners on all spots
                button.addEventListener("click", playRound)
                gameboardElement.appendChild(button);
            }
        }   
        return gameboardElement;
    }
    
    function renderGameboard() {
        const gameboardContainer = document.querySelector(".gameboard-container");
        // If winner, show winner's name, else show who's turn it is
        gameboardContainer.textContent = (game.getWinner()) ? `The winner is ${game.getWinner()}` : `${game.getCurrentPlayer().getName()}'s turn`;
        gameboardContainer.appendChild(createGameboard());
    }

    function showWinner() {
        //TODO change to call dialog modal stating winner
        alert(`The winner is: ${game.getWinner()}`);
    }

    // Draw a line through the three winning markers
    function renderWinningSpotsLine() {
        winningSpotsPosition = game.getWinningSpots();
        for (let i = 0; i < 3; i++) {
            const winningSpot = document.querySelector(`.gameboard-container .spot[data-position="${winningSpotsPosition[i][0].toString() + winningSpotsPosition[i][1].toString()}"`);
            switch (winningSpotsPosition[3]) {
                case "-" :
                    winningSpot.classList.add("horizontal-win");
                    break;
                case "|" :
                    winningSpot.classList.add("vertical-win");
                    break;
                case "/" :
                    winningSpot.classList.add("diagonal-forward-win");
                    break;
                case "\\" :
                    winningSpot.classList.add("diagonal-backward-win");
                    break;
            }
        }
    }

    function showTie() {
        //TODO change to call dialog modal stating winner
        alert("It's a tie!");
    }

    function playRound(event) {
        // Don't play a round if there's already a winner or the game is tied
        if (game.getWinner() || game.isTie()) alert("Winner or Tie declared.  Please reset the game to continue");
        // Don't place the marker if the spot is already taken
        else if (event.target.textContent === "") {
            game.playRound(event.target.dataset.position[0],event.target.dataset.position[1]);
            renderGameboard();
            if (game.getWinner()) {
                showWinner();
                renderWinningSpotsLine();
            }
            else if (game.isTie()) showTie();
        }
        else alert("Can't place marker on already occupied spot.\nPlease try again");
    }
    
    // Get the radio selection of which player starts the game and returns player
    function getWhoStarts() {
        const fieldsetWhoStarts = document.querySelector(".player-select > fieldset");
        if (fieldsetWhoStarts.elements["player-one-start"].checked) return playerOne;
        else if (fieldsetWhoStarts.elements["player-two-start"].checked) return playerTwo;
        else if (Math.random() < 0.5) return playerOne;
        else return playerTwo;
    }

    function startGame(event) {
        game.resetGame();
        game.setInitialPlayer(getWhoStarts());
        renderGameboard();
    } 
    //no return interface required
})();

// Create initial two player objects when script is first run
const playerOne = player("Player1", "X");
const playerTwo = player("Player2", "O");
