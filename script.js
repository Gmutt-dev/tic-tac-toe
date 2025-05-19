

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
        layout[row][column] = marker;
    }

    // Create initial empty board state
    resetBoard();

    return {getLayout, resetBoard, placeMarker};
})();

////TEMP console controller for testing

const playerOne = player("John", "X");
const playerTwo = player("Sarah", "O");
console.log(playerOne, playerTwo);

gameboard.placeMarker(playerOne.getMarker(), 1, 0);
console.log(gameboard.getLayout());

////endTEMP