class CombatManager {
    constructor() {
        this.active = false;
        this.enemy = null;
        this.turnCount = 0;
    }

    startCombat(enemyKey) {
        this.active = true;
        this.enemy = new Enemy(enemyKey);
        this.turnCount = 1;

        ui.toggleCombatView(true);
        ui.updateEnemyStats(this.enemy);
        ui.logCombat(`You encountered a ${this.enemy.name}!`);
    }

    endCombat(victory) {
        this.active = false;
        ui.toggleCombatView(false);
        
        if (victory) {
            ui.log(`Victory! Gained ${this.enemy.xpReward} general XP (Note: General XP not impl yet).`, "highlight");
            // Here you would add loot drops
        } else {
            ui.log("Defeat... You crawl back to town.", "combat");
            game.travel(LOCATIONS.CITY, 0);
            game.player.hp = 1; // Mercy rule
            ui.updateStats();
        }
        this.enemy = null;
        ui.renderActions(); // Refresh buttons to show exploration options again
    }

    // --- PLAYER ACTIONS ---

    playerAction(type) {
        if (!this.active) return;

        // Player Turn Logic
        let actionSuccess = true;
        
        // Reset Player defense from previous turn
        game.player.isDefending = false;

        switch(type) {
            case 'attack':
                this.performPhysicalAttack();
                break;
            case 'spell':
                if (game.player.mp >= SPELLS.firebolt.cost) {
                    this.performSpellAttack();
                } else {
                    ui.logCombat("Not enough Mana!");
                    actionSuccess = false;
                }
                break;
            case 'defend':
                ui.logCombat("You raise your guard.");
                game.player.isDefending = true;
                game.player.gainSkillXP("Blocking", 10);
                break;
            case 'flee':
                this.attemptFlee();
                return; // Flee handles its own turn logic
        }

        if (actionSuccess) {
            // Check if enemy died from player attack
            if (this.enemy.hp <= 0) {
                this.endCombat(true);
                return;
            }
            
            // Enemy Turn
            this.enemyTurn();
        }
    }

    performPhysicalAttack() {
        const p = game.player;
        // Formula: Weapon Dmg + (STR * 0.5)
        const dmg = Math.floor(p.equipment.mainHand.damage + (p.actualStats.STR * 0.5));
        
        this.enemy.hp -= dmg;
        ui.logCombat(`You hit for ${dmg} physical damage.`);
        ui.updateEnemyStats(this.enemy);
        
        p.gainSkillXP("One-Handed", 10);
    }

    performSpellAttack() {
        const p = game.player;
        const spell = SPELLS.firebolt;
        const skillLvl = p.skills[spell.school].level;
        
        // GDD Formula: ((Base Damage) + (Actual_MAG * 0.5)) * sqrt(Elementalism_Level)
        let rawDmg = (spell.baseDmg + (p.actualStats.MAG * 0.5)) * Math.sqrt(skillLvl);
        let finalDmg = Math.floor(rawDmg);

        p.mp -= spell.cost;
        this.enemy.hp -= finalDmg;
        
        ui.logCombat(`You cast ${spell.name} for ${finalDmg} damage.`);
        ui.updateStats(); // Update MP
        ui.updateEnemyStats(this.enemy);

        p.gainSkillXP("Elementalism", 15);
    }

    attemptFlee() {
        const p = game.player;
        const enemyAgi = this.enemy.actualStats.AGI;
        // Simple AGI check
        const chance = p.actualStats.AGI / (p.actualStats.AGI + enemyAgi);
        
        if (Math.random() < chance) {
            ui.logCombat("You managed to escape!");
            this.endCombat(false); // Not a victory, but combat ends
        } else {
            ui.logCombat("Failed to escape!");
            this.enemyTurn(); // Enemy gets a free hit
        }
    }

    // --- ENEMY AI ---

    enemyTurn() {
        const e = this.enemy;
        const p = game.player;

        // Reset Enemy defense (if they had logic for it)
        e.isDefending = false;

        // Calculate incoming damage
        // Enemy basic attack formula: STR / 2
        let rawDmg = Math.floor(e.actualStats.STR / 2);

        // Player Defense Logic
        // If Defending, 50% damage reduction (Simple implementation of "Block Chance")
        if (p.isDefending) {
            rawDmg = Math.floor(rawDmg * 0.5);
            ui.logCombat("You blocked some damage!");
        }

        // Apply
        p.hp -= rawDmg;
        ui.logCombat(`${e.name} attacks you for ${rawDmg} damage.`);
        ui.updateStats();

        // Check Player Death
        if (p.hp <= 0) {
            this.endCombat(false);
        }
        
        this.turnCount++;
    }
}
