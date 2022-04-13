((global) => {
    let sessionsJSON = new Object();
    // this should work with the JSON, but it *shouldn't* store the characters themselves.
    // it's meant as a funtion library only
    // This should contain
    // - parse json
    // - get Desire/Fear/Strength/Flaw
    // - get Derived Attr
    // - get Characteristics
    // - get skills with ranks (expanded)
    // - get talent names (expanded)
    // - get all weapons & their stats (expanded plus)
    // - get notes at end of sheet (expanded plus)
    // While the JSON may look different at different times 
    /*
    sessionsJSON.get = function (JSONstring) {
        try {
            return success(JSON.parse(JSONstring));
        } catch (error) {
            console.error(error);
            return failure({ });
        }
    }
    */
    sessionsJSON.characterType = function (character) {
        return GENESYS;
        if (/^[game theme] genesys/.exec(character.configuration.gameTheme)) {
            return GENESYS;
        } else
        if (/^[game theme] star wars/.exec(character.configuration.gameTheme)) {
            return STARWARS;
        } else {
            console.log("Invalid Game Type");
            return "None";
        }
    }

    let characterType = sessionsJSON.characterType;
    success = function (object) {
        object.successcode = 1;
        return object;
    }
    successIf = function(object) {
        // success if not already a failure. 
        if ('successcode' in object) {
            if (!object.successcode === 0) {
                object.successcode = 1;
            }
        }
        return object;
    }
    failure = function (object) {
        object.successcode = 0;
        return object;
    }
    findInArray = function (array, value, succeeds) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].type === value) {
                successIf(succeeds);
                return array[i];
            }
        }
        return failure(succeeds);
    }
    sessionsJSON.modifiers = function (character){
        returnModifier = success({
            soak:0,
            tWounds:0,
            cWounds:0,
            tStrain:0,
            cStrain:0,
            defense:0,
            mDefense:0,
            rDefense:0,
            brawn:0,
            agility:0,
            intellect:0,
            cunning:0,
            willpower:0,
            presence:0
        });
        try {
            let modifiers = new Array();
            // check if automod
            automod = character.configuration.automations;
            // set list to mods
            modifiers = character.modifiers;
            // for armor
            character.armor.forEach((armor) => {
                // { if equiped, (for armor mods, add to list) (for soak/defense, if automod, add to soak mod) }
                if (armor.equipped) {
                    armor.modifiers.forEach((armormod) => {
                        modifiers.concat(armormod);
                    });
                    if (automod) {
                        // If multiple armors are equipped, only one soak should apply.
                        // And that soak should be the higher one, hence the ? :
                        returnModifier.soak = returnModifier.soak < armor.soak ? armor.soak : returnModifier.soak;
                        returnModifier.defense = returnModifier.defense < armor.defense ? armor.defense : returnModifier.defense;
                    }
                }
            });
            // for weapon
            character.weapons.forEach((weapon) => {
                // {if equiped, (for weapon mods, add to list) }
                if (weapon.equipped) {
                    weapon.modifiers.forEach((weaponmod) => {
                        modifiers.concat(weaponmod);
                    });
                }
            });
            // for equipment
            character.equipment.forEach((item) => {
                // {if carried, (for item mods, add to list)}
                if (item.carrying) {
                    item.modifiers.forEach((itemmod) => {
                        modifiers.concat(itemmod);
                    });
                }
            });
            // for talents
            character.talents.talents.forEach((talent) => {
                if (talent.purchased) {
                    talent.modifiers.forEach((talentmod) => {
                        modifiers.concat(talentmod);
                    });
                }
            });
            // run through list
            modifiers.forEach((modifier) => {
                switch (modifier.type) {
                    case "[nds character modifier type] narrative":
                        //do nothing
                        break;
                    case "[nds character modifier type] attribute":
                        //test for which attribute
                        switch (modifier.attribute) {
                            case "[nds character attribute] soak":
                                returnModifier.soak += modifier.modifierAmount;
                                break;
                            case "[nds character attribute] wounds current":
                                returnModifier.cWounds += modifier.modifierAmount;
                                break;
                            case "[nds character attribute] wounds threshold":
                                returnModifier.tWounds += modifier.modifierAmount;
                                break;
                            case "[nds character attribute] strain current":
                                returnModifier.cStrain += modifier.modifierAmount;
                                break;
                            case "[nds character attribute] strain threshold":
                                returnModifier.tStrain += modifier.modifierAmount;
                                break;
                            case "[nds character attribute] defense melee":
                                returnModifier.mDefense += modifier.modifierAmount;
                                break;
                            case "[nds character attribute] defense ranged":
                                returnModifier.rDefense += modifier.modifierAmount;
                                break;
                        }
                        break;
                    case "[nds character modifier type] characteristic":
                        switch (modifier.characteristic){
                            case "[nds character characteristic] brawn":
                                returnModifier.brawn += modifier.modifierAmount;
                                break;
                            case "[nds character characteristic] agility":
                                returnModifier.agility += modifier.modifierAmount;
                                break;
                            case "[nds character characteristic] cunning":
                                returnModifier.cunning += modifier.modifierAmount;
                                break;
                            case "[nds character characteristic] intellect":
                                returnModifier.intellect += modifier.modifierAmount;
                                break;
                            case "[nds character characteristic] willpower":
                                returnModifier.willpower += modifier.modifierAmount;
                                break;
                            case "[nds character characteristic] presence":
                                returnModifier.presence += modifier.modifierAmount;
                                break;
                        }
                        break;
                    case "[nds character modifier type] skill":
                        //do nothing
                        break;
                    case "[nds character modifier type] weapon":
                        //do nothing
                        break;
                }
            });
            return returnModifier;
        }
        catch (error) {
            console.log(error);
            return failure({ });
        }
    }
    sessionsJSON.frontmatter = function (character) {// UPDATED
        let returnFrontmatter = success({ });
        try {
            succeeds = { successcode:1 };
            returnFrontmatter.id = character._id; 
            returnFrontmatter.name = character.name;
            returnFrontmatter.archetype = findInArray(character.details, "[nds character detail] archetype", succeeds).value;
            if (succeeds.successcode === 0) {
                returnFrontmatter.successcode = 0;
            }
            return returnFrontmatter;
        }
        catch (error) {
            console.log("Frontmatter Error:");
            console.log(error);
            return failure({ });
        }
    }
    sessionsJSON.characteristics = function (character) {// UPDATED
        let characteristics = character.characteristics;
        let returnCharacteristics = { };
        let succeeds = { };
        try {
            let check = function (characteristic, stringToMatch) {
                if (characteristic.type === stringToMatch) {
                    succeeds = successIf(succeeds);
                } else {
                    succeeds = failure(succeeds);
                }
                return characteristic.value;
            }
            //the code below assumes that characteristics follow the order of BR, AG, INT, CUN, WILL, PRE
            //Failure to follow this order will result in a failure successcode
            returnCharacteristics.brawn = check(characteristics[0], "[nds character characteristic] brawn");
            returnCharacteristics.agility = check(characteristics[1], "[nds character characteristic] agility");
            returnCharacteristics.intellect = check(characteristics[2], "[nds character characteristic] intellect");
            returnCharacteristics.cunning = check(characteristics[3], "[nds character characteristic] cunning");
            returnCharacteristics.willpower = check(characteristics[4], "[nds character characteristic] willpower");
            returnCharacteristics.presence = check(characteristics[5], "[nds character characteristic] presence");
            if (succeeds === 0) {
                return failure(returnCharacteristics);
            }
            return success(returnCharacteristics);
        }
        catch (error) {
            console.log(error);
            return failure({ });
        }
    }
    sessionsJSON.derived = function (character) {// UPDATED
        let attributes = character.attributes;
        let returnAttributes = { };
        let succeeds = { };
        returnAttributes.soak = findInArray(attributes, "[nds character attribute] soak", succeeds).value;
        returnAttributes.rDefense = findInArray(attributes, "[nds character attribute] defense ranged", succeeds).value;
        returnAttributes.mDefense = findInArray(attributes, "[nds character attribute] defense melee", succeeds).value;
        returnAttributes.cWounds = findInArray(attributes, "[nds character attribute] wounds current", succeeds).value;
        returnAttributes.tWounds = findInArray(attributes, "[nds character attribute] wounds threshold", succeeds).value;
        returnAttributes.cStrain = findInArray(attributes, "[nds character attribute] strain current", succeeds).value;
        returnAttributes.tStrain = findInArray(attributes, "[nds character attribute] strain threshold", succeeds).value;
        if (succeeds.successcode === 0) {
            return failure(returnAttributes);
        }
        return success(returnAttributes);
    }
    sessionsJSON.motivation = function (character) {// TODO Finish this
        let details = character.details;
        let config = character.configuration;
        let returnDetails = { };

        // get whether oblig, duty, etc. will be used
        let returnConfig = {};
        try {
            returnConfig.useMotiv = true;// TODO fix this
            returnConfig.useOblig = config.obligationEnabled;
            returnConfig.useDuty = config.dutyEnabled;
            returnConfig.useMoral = config.moralityEnabled;
        }
        catch {
            let returnConfig = failure({
                useMotiv : true,
                useOblig : true,
                useDuty : true,
                useMoral : true
            });
        }
        returnDetails.config = returnConfig;
        // get those actual things, *regardless* of their use
        // get motivation (desire/flaw/strength/fear)
        let returnMotiv = {};
        try {
            let succeeds = { successcode:1 };
            returnMotiv.desire = findInArray(details, "[nds character detail] desire", succeeds).value;
            returnMotiv.fear = findInArray(details, "[nds character detail] fear", succeeds).value;
            returnMotiv.strength = findInArray(details, "[nds character detail] strength", succeeds).value;
            returnMotiv.flaw = findInArray(details, "[nds character detail] flaw", succeeds).value;
            console.log(returnMotiv);
            if (succeeds.successcode === 0) {
                returnMotiv = failure(returnMotiv);
            }
            else {
                returnMotiv = success(returnMotiv);
            }
        }
        catch (error) {
            console.log(error);
            returnMotiv = failure({
                desire:"(Desire Error)",
                fear:"(Fear Error)",
                strength:"(Strength Error)",
                flaw:"(Flaw Error)"
            });
        }
        returnDetails.motivation = returnMotiv;
        // get obligation
        let returnObligation = { successcode:1 };
        // TODO implement obligation
        returnDetails.obligation = returnObligation;
        // get duty
        let returnDuty = { successcode:1 };
        // TODO implement duty
        returnDetails.duty = returnDuty;
        // get Morality
        returnMorality = { successcode:1 };
        // TODO implement morality
        returnDetails.morality = returnMorality;

        // return it all
        returnDetails.successcode = returnConfig.successcode * returnMotiv.successcode * returnObligation.successcode * returnDuty.successcode * returnMorality.successcode;// if failure (0), returns 0, else returns 1^5. 
        return returnDetails;

        /* Old code:
        try {
            if (characterType(character) === GENESYS) {
                let returnDetails = { };
                let succeeds = { };
                returnDetails.desire = findInArray(details, "[gen character detail] desire", succeeds).value;
                returnDetails.fear = findInArray(details, "[gen character detail] fear", succeeds).value;
                returnDetails.strength = findInArray(details, "[gen character detail] strength", succeeds).value;
                returnDetails.flaw = findInArray(details, "[gen character detail] flaw", succeeds).value;
                if (succeeds.successcode === 0) {
                    return failure(returnDetails);
                }
                return success(returnDetails);
            } else
            if (characterType(character) === STARWARS) {
                // Get configuration. 
                // Figure if you need to query duty andor morality andor obligation
                // ^ I don't want to display, say, motivation, when they have it hidden even if there are moralities listed
                // Then get those
                // Final display will be "${obligation name}: ${obligation }"
                //BEGIN getting configuration
                let configuration = character.configuration;
                let displayDuty = configuration.dutyEnabled;
                let displayMorality = configuration.displayMorality;
                let displayObligation = configuration.displayObligation;
                //END getting configuration
                motivation = new Array();
                if (displayDuty) {
                    let duty = character.duty;
                    returnDuty = {type:DUTY,
                        innerArray:[],
                        amount:duty.amount
                    };
                    for (dutyToAdd in duty.duties) {
                        returnDuty.innerArray.push({
                            type:DUTY,
                            name:dutyToAdd.name,
                            amount:dutyToAdd.amount
                        });
                    }
                    motivation.push(returnDuty);
                }
                if (displayMorality) {
                    let morality = character.morality;
                    returnMorality = {
                        type:MORALITY,
                        innerArray:[],
                        amount:morality.score
                    };
                    for (moralityToAdd in morality.moralities) {
                        returnMorality.innerArray.push({
                            type:MORALITYSTRENGTH,
                            name:moralityToAdd.strengthName,
                            amount:0
                        });
                        returnMorality.innerArray.push({
                            type:MORALITYWEAKNESS,
                            name:moralityToAdd.weaknessName,
                            amount:0
                        });
                    }
                    motivation.push(returnMorality);
                }
                if (displayObligation) {
                    let obligation = character.obligation;
                    returnObligation = {
                        type:OBLIGATION,
                        innerArray:[],
                        amount:0
                    };
                    for (obligationToAdd in obligation.obligations) {
                        returnObligation.innerArray.push({
                            type:OBLIGATION,
                            name:obligation.name,
                            amount:obligation.amount
                        });
                    }
                    motivation.push(returnObligation);
                }
                return motivation();
            }
        }
        catch (error) {
            console.log(error);
            return failure({ });
        }
        */
    }

    global.sessionsJSON = sessionsJSON;
})(window);