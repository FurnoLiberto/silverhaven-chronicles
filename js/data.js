const LOCATIONS = {
    CITY: "Silverhaven",
    FOREST: "Whisperwood Forest"
};

const SKILLS = {
    COMBAT: ["One-Handed", "Blocking", "Evasion"],
    MAGIC: ["Elementalism"],
    UTILITY: ["Survival"]
};

// Simple Enemy Database
const MONSTERS = {
    "goblin": {
        name: "Goblin Scavenger",
        baseStats: { STR: 8, END: 8, WIL: 5, AGI: 12, INT: 5, MAG: 0 },
        xpReward: 25
    },
    "wolf": {
        name: "Whisperwood Wolf",
        baseStats: { STR: 12, END: 10, WIL: 6, AGI: 14, INT: 3, MAG: 0 },
        xpReward: 40
    }
};

const SPELLS = {
    "firebolt": { name: "Firebolt", cost: 5, school: "Elementalism", baseDmg: 8 }
};
