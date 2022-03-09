((global) => {
    let charDisplay = { }; 
    charDisplay.updateOverview = function() {
        console.log(characterManager.characters);
    }
    global.charDisplay = charDisplay;
})(window);