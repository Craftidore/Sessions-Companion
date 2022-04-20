((global) => {
    let sessionsAPI = new Object();
    sessionsAPI.updateOverview = function (link) {
        var self = this;
        $ajaxUtils.sendGetRequest("",
            function (request) {
            self.result = request.responseText;
            console.log(JSON.parse(self.result));
        });
    }
    sessionsAPI.getIDFromLink = function (link) {
        // the links follow one of the following forms:
        // https://app.rpgsessions.com/char/{CHARACTER ID}
        // https://app.rpgsessions.com/char/ffg-sw/player/{CHARACTER ID}
        // https://app.rpgsessions.com/char/ffg-gen/player/{CHARACTER ID}
        // https://app.rpgsessions.com/char/{CHARACTER ID}
        // https://app.rpgsessions.com/game/table/{CHARACTER ID}
        // test link for one of these patterns
        // if none, check for 24-character hex ID
        // in any case, removing any spare slashes, just in case there was a trailing slash
        let charactergen = /^https:\/\/app\.rpgsessions\.com\/char\/ffg-gen\/player\//ig;
        let charactersw = /^https:\/\/app\.rpgsessions\.com\/char\/ffg-sw\/player\//ig;
        let characternds = /^https:\/\/app\.rpgsessions\.com\/char\/nds\//ig;
        let characterfromtable = /^https:\/\/app\.rpgsessions\.com\/char\//ig;
        let characterfromoldapi = /^https:\/\/api\.rpgsessions\.com\/character2\//ig;
        let characterfromapi = /^https:\/\/api\.rpgsessions\.com\/character\//ig;
        let table = /^https\:\/\/app\.rpgsessions\.com\/game\/table\//ig;
        let hexLength24 = /^[a-fA-F0-9]{24}$/g;
        console.log(link);
        noSlashes = function (link) {
            // in case there is a trailing `/` at the end of the url
            return link.replaceAll(/\//g, "");
        }
        if (charactergen.exec(link)) {
            console.log("gen exec");
            return noSlashes(link.replace(charactergen, ""));
        } else 
        if (charactersw.exec(link)) {
            console.log("sw exec");
            return noSlashes(link.replace(charactersw, ""));
        } else
        if (characternds.exec(link)) {
            console.log("nds exec");
            return noSlashes(link.replace(characternds, ""));
        } else
        if (characterfromtable.exec(link)) {
            console.log("from table exec");
            return noSlashes(link.replace(characterfromtable, ""));
        } else
        if (characterfromoldapi.exec(link)) {
            console.log("from old api");
            return noSlashes(link.replace(characterfromoldapi, ""));
        } else
        if (characterfromapi.exec(link)) {
            console.log("from api");
            return noSlashes(link.replace(characterfromapi, ""));
        } else
        if (table.exec(link)) {
            console.log("from table");
            return noSlashes(link.replace(table, ""));
        } else
        if (hexLength24.exec(link)){// this doesn't do what I want :(
            console.log("from hex id");
            return link;
        } else {
            console.log("invalid link: " + link);
            return "invalid link";
        }
    }
    sessionsAPI.addGameTable = function (link) {
        id = sessionsAPI.getIDFromLink(link);
        if (id === "invalid link") {
            // may need to send the user a message
            return;
        }
        $ajaxUtils.sendGetRequest(gameTableURL(id), (request) => {
            arrayOfChars = JSON.parse(request.response);
            arrayOfChars.forEach(character => {
                characterManager.addCharacter(character);
            });
            charDisplay.updateOverview();
        });
    }
    sessionsAPI.addCharacter = function (link) {
        id = sessionsAPI.getIDFromLink(link);
        if (id === "invalid link") {
            // may need to send the user a message
            return;
        }
        $ajaxUtils.sendGetRequest(characterURL(id), (request) => {
            character = JSON.parse(request.response);
            characterManager.addCharacter(character);
            charDisplay.updateOverview();
        });
    }
    gameTableURL = function (id) {
        return "https://api.rpgsessions.com/game-table/" + id + "/characters";
    }
    /* 
    // redundant code -- sw and gen characters both follow the same pattern
    swCharacterURL = function (id) {
        return "https://api.rpgsessions.com/character2/" + id;
    }
    genCharacterURL = function (id) {
        return "https://api.rpgsessions.com/character2/" + id;
    }
    */
    characterURL = function (id) {
        return "https://api.rpgsessions.com/character/" + id;
    }
    global.sessionsAPI = sessionsAPI;
})(window);
