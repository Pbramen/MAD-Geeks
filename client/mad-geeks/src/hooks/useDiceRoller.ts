import { dieResults } from "components/CharacterSheet/model";

type RollParams = {
    quantity: number,
    quality: number,
    min?: number,
    max?: number,
    reroll: boolean, // for advantage or disadvantage
}
// decorator -> returns a set of functions 
export const useDiceRoller = ({ quantity, quality, min = 1, max = 100, rerolls = false }) => {
    // sanitize input
    quantity = Math.floor(quantity);
    quality = Math.floor(quality);
    min = Math.floor(min);
    max = Math.floor(max);
    
    min = min > 0 ? min : 1;
    min = min < 100 ? min : 100; 
    max = max > 0 ? max : 1;
    max = max < 100 ? max : 100;  
    quality = quality < max ? quality : max; 
    quantity = quantity <= 100 ? quantity : 100; 

  
    const rollDice = () : dieResults => {
        var result = {stats: [], minIndex: 0, total: 0};
        var minValue = max;
        for (let i = 0; i < quantity; i++){
            var die = Math.floor(Math.random() * (quality - min + 1) + min)
            result.stats.push(die);
            if (die < minValue) {
                minValue = die;
                result.minIndex = i;
            }
            result.total += die;
        }
        return result;
    }

    const batchRoll = (amount: number) : dieResults[] => {
        amount = amount < 100 ? amount : 100; // limit number of rolls
        var result = [];
        for (let i = 0; i < amount; i++){
            result.push(rollDice());
        }
        return result;
    }

    return {rollDice, batchRoll};
}
