((global) => {
    let charDisplay = { }; 
    charDisplay.updateOverview = function() {
        console.log(characterManager.characters);
    }
    window.charDisplay = charDisplay;
})(window);