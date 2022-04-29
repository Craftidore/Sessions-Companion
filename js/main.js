document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("AddCharacter").addEventListener("click", addCharacter);
    document.getElementById("AddGameTable").addEventListener("click", addGameTable);
    marked.use({
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    });
    if (location.hash === "#debug") {
        console.log("Debugging");
        sessionsAPI.addGameTable("https://app.rpgsessions.com/game/table/61e730ebf8a60e001103e800");
    }
    else {
        calcURLVars();
    }
});

var addCharacter = function() {
    let link = document.getElementById("CharacterLinkInput").value;
    updateURLVars('c', sessionsAPI.getIDFromLink(link));
    sessionsAPI.addCharacter(link);
    document.getElementById("CharacterLinkInput").value = "";
};

var addGameTable = function() {
    var link = document.getElementById("GameTableLinkInput").value;
    updateURLVars('g', sessionsAPI.getIDFromLink(link));
    sessionsAPI.addGameTable(link);
    document.getElementById("GameTableLinkInput").value = "";
}

var calcURLVars = function () {
    let varStr = location.search;
    let vars = new URLSearchParams(varStr);
    if (vars.has('g')) {
        let gametableStr = vars.get('g')
        let gametables = getStrArray(gametableStr);
        gametables.forEach(gt => {
            sessionsAPI.addGameTable(gt);
        });
    }
    if (vars.has('c')) {
        let charsStr = vars.get('c');
        let chars = getStrArray(charsStr);
        chars.forEach(char => {
            sessionsAPI.addCharacter(char);
        });
    }
}
var updateURLVars = function (name, newVar) {
    let urlParams = new URLSearchParams(location.search);
    currentStr = urlParams.get(name);
    currentArray = getStrArray(currentStr);
    currentArray.push(newVar);
    newStr = currentArray.join(',');
    urlParams.set(name, newStr);
    location.search = urlParams;
}

var getStrArray = function (str) {
    let items = str.split(',');
    if (items[0] === '') {
        return [];
    }
    else {
        return items;
    }
}