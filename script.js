

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

////TEMP console controller for testing

const playerOne = player("John", "X");
const playerTwo = player("Sarah", "O");
console.log(playerOne, playerTwo);

////endTEMP