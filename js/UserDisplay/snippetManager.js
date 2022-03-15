((global) => {
    let snippetManager = { };
    // manager for html snippets which one needs to input into the dom
    // get snippet from Ajax
    snippetManager.getCharacter = function (element, func) {
        $ajaxUtils.sendGetRequest("html/character.html", (output) => {
            html = func(output.response);
            element.innerHTML += html;
        });
    }
    snippetManager.getMotivation = function (type, func) {
        // Get the right snippet
        let filename = "html/";
        if (type === GENESYS) { filename =+ "gen" }
        else if (type === STARWARS) { filename =+ "sw" }
        filename += "Motiv.html";
        // ajax
        $ajaxUtils.sendGetRequest(filename, func);
    }
    // input value into snippet function (exposed to dom)
    snippetManager.replace = function (original, value, expression) {
        let y = original.replace(new RegExp(`{{${expression}}}`, "g"), value);
        return y;
    }
    // 
    global.snippetManager = snippetManager;
})(window);