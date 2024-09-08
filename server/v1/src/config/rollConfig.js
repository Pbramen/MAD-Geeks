const roll_state = Object.freeze({
    DISADVANTAGE: -1,
    NONE: 0,
    ADVANTAGE: 1,
    INSPIRATION: 2
});

const roll_type = Object.freeze({
    SAVING_THROW: 0,
    ATTACK_ROLL: 1,
    DAMAGE_ROLL: 2,
    SKILL_CHECK: 3,
    OTHER: -1,

})

const dice = [2, 4, 6, 8, 10, 12, 20, 100];

module.exports = {
    roll_state,
    roll_type,
    dice
}

