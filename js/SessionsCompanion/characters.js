((global) => {
    let characterManager = {};
    characterManager.characters = [];
    characterManager.addCharacter = function (character) {
        let characterIndex = characterManager.characters.length;
        characterManager.characters.push({ });
        characterManager.characters[characterIndex] = characterManager.updateCharacter(character);
        console.log(characterManager);
    }
    characterManager.updateCharacter = function (charData) {
        let character = { };
        character.type = sessionsJSON.characterType(charData);
        let frontmatter = sessionsJSON.frontmatter(charData);
        {
            character.name = frontmatter.name;
            character.archetype = frontmatter.archetype;
        }
        let characteristics = sessionsJSON.characteristics(charData);
        {
            character.brawn = characteristics.brawn;
            character.ability = characteristics.ability;
            character.intellect = characteristics.intellect;
            character.cunning = characteristics.cunning;
            character.willpower = characteristics.willpower;
            character.presence = characteristics.presence;
        }
        let derived = sessionsJSON.derived(charData);
        {
            character.soak = derived.soak;
            character.rDefense = derived.rDefense;
            character.mDefense = derived.mDefense;
            character.cWounds = derived.cWounds;
            character.tWounds = derived.tWounds;
            character.cStrain = derived.cStrain;
            character.tStrain = derived.tStrain;
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
            character.motivation = { };
            character.motivation.desire = motivation.desire;
            character.motivation.fear = motivation.fear;
            character.motivation.strength = motivation.strength;
            character.motivation.flaw = motivation.flaw;
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
Character:
{
    "name":string
    "id":string
    "type":string
    "":string
}

*/