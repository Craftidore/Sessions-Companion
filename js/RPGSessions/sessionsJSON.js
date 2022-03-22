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
        if ("[gameType] ffg genesys" === character.gameType) {
            return GENESYS;
        } else
        if ("[gameType] ffg star wars" === character.gameType) {
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
    sessionsJSON.frontmatter = function (character) {
        let returnFrontmatter = success({ });
        try {
            if (characterType(character) === GENESYS) {
                returnFrontmatter.name = character.name;
                returnFrontmatter.id = character._id;
                returnFrontmatter.archetype = findInArray(character.details, "[gen character detail] archetype", returnFrontmatter).value;
                if (returnFrontmatter.name === undefined) {// Code removed because then failure(returnFrontmatter) would be applied already // || returnFrontmatter.successcode === 0) {
                    failure(returnFrontmatter);
                }
            } else
            if (characterType(character) === STARWARS) {
                returnFrontmatter.name = character.name;
                returnFrontmatter.id = character._id;
                returnFrontmatter.archetype = findInArray(character.details, "[gen character detail] archetype", returnFrontmatter).value;
                if (returnFrontmatter.name === undefined) {// Code removed because then failure(returnFrontmatter) would be applied already // || returnFrontmatter.successcode === 0) {
                    failure(returnFrontmatter);
                }
            }
            return returnFrontmatter;
        }
        catch (error) {
            console.log(error);
            return failure({ });
        }
    }
    sessionsJSON.characteristics = function (character) {
        let characteristics = character.characteristics;
        let returnCharacteristics = { };
        let succeeds = { };
        try {
            let check = function (characteristic, stringToMatch) {
                if (characteristic.type === stringToMatch) {
                    //console.log(succeeds);
                    succeeds = successIf(succeeds);
                } else {
                    succeeds = failure(succeeds);
                }
                return characteristic.value;
            }
            if (characterType(character) === GENESYS) {
                //the code below assumes that characteristics follow the order of BR, AG, INT, CUN, WILL, PRE
                //Failure to follow this order will result in a failure successcode
                returnCharacteristics.brawn = check(characteristics[0], "[gen character characteristic] brawn");
                returnCharacteristics.agility = check(characteristics[1], "[gen character characteristic] agility");
                returnCharacteristics.intellect = check(characteristics[2], "[gen character characteristic] intellect");
                returnCharacteristics.cunning = check(characteristics[3], "[gen character characteristic] cunning");
                returnCharacteristics.willpower = check(characteristics[4], "[gen character characteristic] willpower");
                returnCharacteristics.presence = check(characteristics[5], "[gen character characteristic] presence");
            } else 
            if (characterType(character) === STARWARS) {
                //the code below assumes that characteristics follow the order of BR, AG, INT, CUN, WILL, PRE
                //Failure to follow this order will result in a failure successcode
                returnCharacteristics.brawn = check(characteristics[0], "[sw character characteristic] brawn");
                returnCharacteristics.agility = check(characteristics[1], "[sw character characteristic] agility");
                returnCharacteristics.intellect = check(characteristics[2], "[sw character characteristic] intellect");
                returnCharacteristics.cunning = check(characteristics[3], "[sw character characteristic] cunning");
                returnCharacteristics.willpower = check(characteristics[4], "[sw character characteristic] willpower");
                returnCharacteristics.presence = check(characteristics[5], "[sw character characteristic] presence");
            }
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
    sessionsJSON.derived = function (character) {
        let attributes = character.attributes;
        let returnAttributes = { };
        let succeeds = { };
        if (characterType(character) === GENESYS) {
            returnAttributes.soak = findInArray(attributes, "[gen character attribute] soak", succeeds).value;
            returnAttributes.rDefense = findInArray(attributes, "[gen character attribute] defense ranged", succeeds).value;
            returnAttributes.mDefense = findInArray(attributes, "[gen character attribute] defense melee", succeeds).value;
            returnAttributes.cWounds = findInArray(attributes, "[gen character attribute] wounds current", succeeds).value;
            returnAttributes.tWounds = findInArray(attributes, "[gen character attribute] wounds threshold", succeeds).value;
            returnAttributes.cStrain = findInArray(attributes, "[gen character attribute] strain current", succeeds).value;
            returnAttributes.tStrain = findInArray(attributes, "[gen character attribute] strain threshold", succeeds).value;
        } else
        if (characterType(character) === STARWARS) {
            returnAttributes.soak = findInArray(attributes, "[sw character attribute] soak", succeeds).value;
            returnAttributes.rDefense = findInArray(attributes, "[sw character attribute] defense ranged", succeeds).value;
            returnAttributes.mDefense = findInArray(attributes, "[sw character attribute] defense melee", succeeds).value;
            returnAttributes.cWounds = findInArray(attributes, "[sw character attribute] wounds current", succeeds).value;
            returnAttributes.tWounds = findInArray(attributes, "[sw character attribute] wounds threshold", succeeds).value;
            returnAttributes.cStrain = findInArray(attributes, "[sw character attribute] strain current", succeeds).value;
            returnAttributes.tStrain = findInArray(attributes, "[sw character attribute] strain threshold", succeeds).value;
        }
        if (succeeds.successcode === 0) {
            return failure(returnAttributes);
        }
        return success(returnAttributes);
    }
    sessionsJSON.motivation = function (character) {
        // Duty, Morality, and Obligation are included in this function - I don't know where else to put them and they display in the same place
        try {
            if (characterType(character) === GENESYS) {
                let details = character.details;
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
    }

    global.sessionsJSON = sessionsJSON;
})(window);