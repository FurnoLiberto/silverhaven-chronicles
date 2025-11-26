class Game {
    constructor() {
        this.player = new Player();
        this.time = new TimeSystem();
        this.location = LOCATIONS.CITY;
        this.isBusy = false;
    }

    // Helper to run timed actions
    performAction(actionName, durationMinutes, callback) {
        if (this.isBusy || combatManager.active) return;
        
        this.isBusy = true;
        ui.renderActions(); // Re-render to show disabled state if you add that logic
        
        this.time.advance(durationMinutes);
        callback();
        
        this.isBusy = false;
        ui.renderActions();
    }

    travel(destination, minutes) {
        this.performAction(`Travel`, minutes, () => {
            this.location = destination;
            ui.log(`You traveled to ${destination}.`);
            ui.updateLocation();
        });
    }

    forage() {
        this.performAction("Foraging", 5, () => {
            this.player.gainSkillXP("Survival", 10);
            
            const roll = Math.random();
            if (roll < 0.60) {
                ui.log("You found a Whisperwood Branch!", "item");
                // Inventory logic here...
            } else if (roll < 0.85) {
                ui.log("You searched but found nothing.");
            } else {
                // SURPRISE COMBAT
                ui.log("Ambush! Something emerges from the trees!", "combat");
                combatManager.startCombat("goblin");
            }
        });
    }

    rest() {
        this.performAction("Resting", 480, () => {
            this.player.hp = this.player.maxHp;
            this.player.mp = this.player.actualStats.MAG * 10;
            ui.log("You feel well rested.");
            ui.updateStats();
        });
    }
}

// --- INIT ---
const game = new Game();
const combatManager = new CombatManager();

// Start
ui.updateClock();
ui.updateStats();
ui.updateSkills();
ui.renderActions();
ui.log("Welcome to Silverhaven Chronicles.");
