class Character {
    constructor(name, baseStats) {
        this.name = name;
        this.baseStats = { ...baseStats };
        this.actualStats = { ...baseStats };
        
        // Derived stats (Calculated immediately)
        this.maxHp = this.actualStats.END * 10;
        this.hp = this.maxHp;
        
        // Combat Flags
        this.isDefending = false;
    }

    // Call this before every combat turn or when equipment changes
    recalculateStats() {
        this.actualStats = { ...this.baseStats };
        // (Future: Add equipment/buff logic here)
        
        this.maxHp = this.actualStats.END * 10;
        // Clamp HP if it exceeds max
        if (this.hp > this.maxHp) this.hp = this.maxHp;
    }
}

class Player extends Character {
    constructor() {
        super("Hero", { STR: 10, END: 10, WIL: 10, AGI: 10, INT: 10, MAG: 10 });
        this.mp = 100;
        this.level = 1;
        this.xp = 0;
        
        // Initialize Skills
        this.skills = {};
        Object.values(SKILLS).flat().forEach(s => {
            this.skills[s] = { level: 1, xp: 0, xpToNext: 100 };
        });

        this.inventory = [];
        this.equipment = { mainHand: { name: "Rusty Sword", damage: 3 } }; // Starter Item
    }

    gainSkillXP(skillName, amount) {
        if(!this.skills[skillName]) return;
        const skill = this.skills[skillName];
        skill.xp += amount;
        
        if (skill.xp >= skill.xpToNext) {
            skill.level++;
            skill.xp -= skill.xpToNext;
            skill.xpToNext = Math.floor(skill.xpToNext * 1.2);
            ui.log(`<b>${skillName} leveled up to ${skill.level}!</b>`, "highlight");
        }
        ui.updateSkills();
    }
}

class Enemy extends Character {
    constructor(templateKey) {
        const template = MONSTERS[templateKey];
        super(template.name, template.baseStats);
        this.xpReward = template.xpReward;
    }
}

class TimeSystem {
    constructor() {
        this.minute = 0;
        this.hour = 8;
        this.day = 1;
    }
    advance(minutes) {
        this.minute += minutes;
        while (this.minute >= 60) {
            this.minute -= 60;
            this.hour++;
        }
        while (this.hour >= 24) {
            this.hour -= 24;
            this.day++;
        }
        ui.updateClock();
    }
    getFormatted() {
        return `Day ${this.day} - ${this.hour.toString().padStart(2,'0')}:${this.minute.toString().padStart(2,'0')}`;
    }
}
