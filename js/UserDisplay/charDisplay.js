((global) => {
    let charDisplay = { }; 
    charDisplay.updateOverview = function() {
        console.log(characterManager.characters);
        let mainbody = document.getElementById("mainbody");
        mainbody.innerHTML = "";
        for (let i = 0;i < characterManager.characters.length;i++) {
            let char = characterManager.characters[i]
            let renderChar = function () {
                snippetManager.getCharacter(mainbody, (characterHTML) => {
                    let replace = function (value, key) {
                        characterHTML = snippetManager.replace(characterHTML, value, key);
                    }
                    replace(char.name, "name");
                    replace(char.archetype, "archetype");
                    replace(char.agility, "agility");
                    replace(char.brawn, "brawn");
                    replace(char.cunning, "cunning");
                    replace(char.intellect, "intellect");
                    replace(char.willpower, "willpower");
                    replace(char.presence, "presence");
                    replace(char.soak, "soak");
                    replace(char.tWounds, "woundthreshold");
                    replace(char.cWounds, "woundcurrent");
                    replace(char.tStrain, "strainthreshold");
                    replace(char.cStrain, "straincurrent");
                    replace(char.rDefense, "defenseranged");
                    replace(char.mDefense, "defensemelee");
                    replace(renderMotivation(char), "motivations");
                    return characterHTML;
                });
            }
            let renderMotivation = function (char) {
                let html;
                if (char.type === GENESYS) {
                    html = '<div class="motivation desire">{{desire}}</div><div class="motivation fear">{{fear}}</div><div class="motivation strength">{{strength}}</div><div class="motivation flaw">{{flaw}}</div>';
                    let replace = function (value, key) {
                        html = snippetManager.replace(html, value, key);
                    }
                    replace(char.motivation.desire, "desire");
                    replace(char.motivation.fear, "fear");
                    replace(char.motivation.strength, "strength");
                    replace(char.motivation.flaw, "flaw");
                } else
                if (char.type === STARWARS) {
                    html = ''
                }
                return html;
            }
            renderChar(char);
        }
    }
    global.charDisplay = charDisplay;
})(window);