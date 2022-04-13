((global) => {
    let characterManager = {};
    characterManager.characters = [];
    characterManager.addCharacter = function (character) {
        let characterIndex = characterManager.characters.length;
        characterManager.characters.push({ });
        characterManager.characters[characterIndex] = characterManager.updateCharacter(character);
    }
    characterManager.updateCharacter = function (charData) {
        let logSuccess = function (name, successcodeObject) {
            if (successcodeObject.successcode) {
                console.log(name + " succeeds!");
            }
            else {
                console.log(name + " fails");
            }

        }
        let character = { };
        character.type = sessionsJSON.characterType(charData);
        let modifiers = sessionsJSON.modifiers(charData);
        let frontmatter = sessionsJSON.frontmatter(charData);
        logSuccess("Frontmatter", frontmatter);
        {
            character.name = frontmatter.name;
            character.id = frontmatter.id;
            character.archetype = frontmatter.archetype;
        }
        let characteristics = sessionsJSON.characteristics(charData);
        logSuccess("Characteristics", characteristics);
        {
            character.brawn = characteristics.brawn + modifiers.brawn;
            character.agility = characteristics.agility + modifiers.agility;
            character.intellect = characteristics.intellect + modifiers.intellect;
            character.cunning = characteristics.cunning + modifiers.cunning;
            character.willpower = characteristics.willpower + modifiers.willpower;
            character.presence = characteristics.presence + modifiers.presence;
        }
        let derived = sessionsJSON.derived(charData);
        logSuccess("Derived", derived);
        {
            character.soak = derived.soak + modifiers.soak;
            character.rDefense = derived.rDefense + modifiers.rDefense + modifiers.defense;
            character.mDefense = derived.mDefense + modifiers.mDefense + modifiers.defense;
            character.cWounds = derived.cWounds + modifiers.cWounds;
            character.tWounds = derived.tWounds + modifiers.tWounds;
            character.cStrain = derived.cStrain + modifiers.cStrain;
            character.tStrain = derived.tStrain + modifiers.tStrain;
        }
        //BEGIN motivations
        let motivation;
        if (character.type === GENESYS)
        {
            // This means four motivations
            motivation = sessionsJSON.motivation(charData);
            // I have decided to manually copy values like this because 
            // it will let me change how it is stored in `character` without needing to change how 
            // it is stored in sessionsJSON. 
            logSuccess("Genesys Motivation", motivation);
            console.log(motivation);
            character.motivation = { };
            character.motivation.desire = marked.parse(motivation.motivation.desire);
            character.motivation.fear = marked.parse(motivation.motivation.fear);
            character.motivation.strength = marked.parse(motivation.motivation.strength);
            character.motivation.flaw = marked.parse(motivation.motivation.flaw);
        } else 
        if (character.type === STARWARS) {
            // This means one to three motivations
            motivation = sessionsJSON.motivation(charData);
            console.log(motivation);
        }
        //END motivations
        return character;
    }
    global.characterManager = characterManager;
})(window);
/*
// UPDATE: 03-08-2022 I don't know why I have this commented code here. 
// UPDATE: 03-11-2022 I think it specs out what the Character 'class'  
Character:
{
    "name":string
    "id":string
    "type":string
    "":string
}

*/
