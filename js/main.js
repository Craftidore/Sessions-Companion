document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("AddCharacter").addEventListener("click", addCharacter);
    document.getElementById("AddGameTable").addEventListener("click", addGameTable);
    document.getElementById("UpdateOverview").addEventListener("click", updateOverview);
    marked.use({
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    });
});

var addCharacter = function() {
    let link = document.getElementById("CharacterLinkInput").value;
    sessionsAPI.addCharacter(link);
    document.getElementById("CharacterLinkInput").value = "";
};

var addGameTable = function() {
    var link = document.getElementById("GameTableLinkInput").value;
    sessionsAPI.addGameTable(link);
    document.getElementById("GameTableLinkInput").value = "";
}

var updateOverview = function() {
    charDisplay.updateOverview();
}