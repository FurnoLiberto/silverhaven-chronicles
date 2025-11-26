const ui = {
    // --- GENERAL ---
    log: (msg, type="normal") => {
        const el = document.getElementById('game-log');
        const div = document.createElement('div');
        div.className = `log-entry log-${type}`;
        div.innerHTML = `<span class="log-time">[${game.time.getFormatted().split(' ')[3]}]</span> ${msg}`;
        el.prepend(div);
    },

    updateClock: () => {
        document.getElementById('clock-display').innerText = game.time.getFormatted();
    },

    updateLocation: () => {
        document.getElementById('location-display').innerText = `Location: ${game.location}`;
    },

    // --- STATS & SKILLS ---
    updateStats: () => {
        const p = game.player;
        // HP / MP Header
        const htmlHeader = `
            <div class="stat-row"><span>HP</span> <span>${p.hp} / ${p.maxHp}</span></div>
            <div class="stat-row"><span>MP</span> <span>${p.mp} / ${p.actualStats.MAG * 10}</span></div>
            <hr style="border-color:#444">
        `;
        
        // Attributes
        let htmlStats = '';
        for (let [key, val] of Object.entries(p.actualStats)) {
            const base = p.baseStats[key];
            const color = val > base ? '#4caf50' : (val < base ? '#f44336' : '#fff');
            htmlStats += `<div class="stat-row"><span>${key}</span> <span style="color:${color}">${val}</span></div>`;
        }
        document.getElementById('stats-container').innerHTML = htmlHeader + htmlStats;
    },

    updateSkills: () => {
        let html = '';
        for (let [name, data] of Object.entries(game.player.skills)) {
            const pct = (data.xp / data.xpToNext) * 100;
            html += `
                <div class="skill-row">
                    <div class="stat-row"><span>${name}</span> <span>Lv ${data.level}</span></div>
                    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
                </div>
            `;
        }
        document.getElementById('skills-container').innerHTML = html;
    },

    // --- COMBAT ---
    toggleCombatView: (isCombat) => {
        document.getElementById('exploration-view').style.display = isCombat ? 'none' : 'block';
        document.getElementById('combat-view').style.display = isCombat ? 'block' : 'none';
        
        // Hide exploration actions during combat
        document.getElementById('right-panel').style.opacity = isCombat ? '0.5' : '1';
        document.getElementById('right-panel').style.pointerEvents = isCombat ? 'none' : 'auto';
        
        // Clear combat log on new fight
        if(isCombat) document.getElementById('combat-log').innerHTML = '';
    },

    updateEnemyStats: (enemy) => {
        document.getElementById('enemy-name').innerText = enemy.name;
        document.getElementById('enemy-hp').innerText = `${enemy.hp}/${enemy.maxHp}`;
        const pct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
        document.getElementById('enemy-hp-bar').style.width = `${pct}%`;
    },

    logCombat: (msg) => {
        const el = document.getElementById('combat-log');
        const div = document.createElement('div');
        div.className = "log-entry";
        div.innerText = msg;
        el.prepend(div);
    },

    // --- ACTION BUTTONS ---
    renderActions: () => {
        const container = document.getElementById('actions-container');
        container.innerHTML = '';

        if (game.location === LOCATIONS.CITY) {
            container.appendChild(ui.createBtn("Rest at Inn (10g) - 8h", () => game.rest()));
            container.appendChild(ui.createBtn("Travel to Whisperwood (30m)", () => game.travel(LOCATIONS.FOREST, 30)));
        } else if (game.location === LOCATIONS.FOREST) {
            container.appendChild(ui.createBtn("Forage for Resources (5m)", () => game.forage()));
            container.appendChild(ui.createBtn("Return to Silverhaven (30m)", () => game.travel(LOCATIONS.CITY, 30)));
        }
    },

    createBtn: (text, onClick) => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = onClick;
        return btn;
    }
};
