document.addEventListener('DOMContentLoaded', () => {
    // 1. THEME TOGGLE
    const themeBtn = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        if (themeBtn) themeBtn.textContent = '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeBtn.textContent = isLight ? '☀️' : '🌙';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // 2. MOBILE MENU
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 3. FPS CALCULATOR LOGIC
    const budget = document.getElementById('budgetSelect');
    const game = document.getElementById('gameSelect');
    const result = document.getElementById('resultDisplay');
    const qualityBadge = document.getElementById('qualityBadge');
    const fpsLabel = document.getElementById('fpsLabel');

    // FPS data: { budget: { game: fps } }
    const fpsData = {
        '20k': {
            valorant:    { fps: 45,  settings: 'Low settings, 1080p' },
            cs2:         { fps: 40,  settings: 'Low settings, 1080p' },
            pubg:        { fps: 20,  settings: 'Very low settings, 720p' },
            fortnite:    { fps: 30,  settings: 'Low settings, 720p' },
            freefile:    { fps: 60,  settings: 'Medium settings, 1080p' },
            warzone:     { fps: 18,  settings: 'Very low settings, 720p' },
            rocketleague:{ fps: 40,  settings: 'Low settings, 1080p' },
            fc24:        { fps: 35,  settings: 'Low settings, 1080p' },
            gta5:        { fps: 25,  settings: 'Low settings, 1080p' },
            minecraft:   { fps: 60,  settings: 'Low-medium, 1080p' },
            roblox:      { fps: 60,  settings: 'Medium settings, 1080p' },
            dota2:       { fps: 35,  settings: 'Low settings, 1080p' },
        },
        '30k': {
            valorant:    { fps: 90,  settings: 'Medium settings, 1080p' },
            cs2:         { fps: 80,  settings: 'Medium settings, 1080p' },
            pubg:        { fps: 40,  settings: 'Low settings, 1080p' },
            fortnite:    { fps: 60,  settings: 'Medium settings, 1080p' },
            freefile:    { fps: 90,  settings: 'High settings, 1080p' },
            warzone:     { fps: 35,  settings: 'Low settings, 1080p' },
            rocketleague:{ fps: 75,  settings: 'Medium settings, 1080p' },
            fc24:        { fps: 60,  settings: 'Medium settings, 1080p' },
            gta5:        { fps: 45,  settings: 'Medium settings, 1080p' },
            minecraft:   { fps: 110, settings: 'Medium-high, 1080p' },
            roblox:      { fps: 80,  settings: 'High settings, 1080p' },
            dota2:       { fps: 65,  settings: 'Medium settings, 1080p' },
        },
        '40k': {
            valorant:    { fps: 144, settings: 'High settings, 1080p' },
            cs2:         { fps: 130, settings: 'High settings, 1080p' },
            pubg:        { fps: 60,  settings: 'Medium settings, 1080p' },
            fortnite:    { fps: 90,  settings: 'High settings, 1080p' },
            freefile:    { fps: 120, settings: 'Max settings, 1080p' },
            warzone:     { fps: 55,  settings: 'Medium settings, 1080p' },
            rocketleague:{ fps: 120, settings: 'High settings, 1080p' },
            fc24:        { fps: 90,  settings: 'High settings, 1080p' },
            gta5:        { fps: 60,  settings: 'High settings, 1080p' },
            minecraft:   { fps: 200, settings: 'High + shaders, 1080p' },
            roblox:      { fps: 120, settings: 'Max settings, 1080p' },
            dota2:       { fps: 90,  settings: 'High settings, 1080p' },
        },
        '50k': {
            valorant:    { fps: 220, settings: 'Max settings, 1080p' },
            cs2:         { fps: 200, settings: 'Max settings, 1080p' },
            pubg:        { fps: 90,  settings: 'High settings, 1080p' },
            fortnite:    { fps: 140, settings: 'Epic settings, 1080p' },
            freefile:    { fps: 144, settings: 'Max settings, 1080p' },
            warzone:     { fps: 80,  settings: 'High settings, 1080p' },
            rocketleague:{ fps: 180, settings: 'Max settings, 1080p' },
            fc24:        { fps: 120, settings: 'Max settings, 1080p' },
            gta5:        { fps: 85,  settings: 'Very High, 1080p' },
            minecraft:   { fps: 350, settings: 'Max + shaders, 1080p' },
            roblox:      { fps: 144, settings: 'Max settings, 1080p' },
            dota2:       { fps: 140, settings: 'Max settings, 1080p' },
        },
        '60k': {
            valorant:    { fps: 280, settings: 'Max settings, 1440p' },
            cs2:         { fps: 260, settings: 'Max settings, 1440p' },
            pubg:        { fps: 120, settings: 'Ultra settings, 1080p' },
            fortnite:    { fps: 180, settings: 'Epic settings, 1440p' },
            freefile:    { fps: 144, settings: 'Max settings, 1080p (capped)' },
            warzone:     { fps: 110, settings: 'High-Ultra, 1080p' },
            rocketleague:{ fps: 240, settings: 'Max settings, 1440p' },
            fc24:        { fps: 144, settings: 'Max settings, 1080p' },
            gta5:        { fps: 110, settings: 'Max settings, 1080p' },
            minecraft:   { fps: 500, settings: 'Max + RTX shaders, 1080p' },
            roblox:      { fps: 144, settings: 'Max settings, 1080p (capped)' },
            dota2:       { fps: 180, settings: 'Max settings, 1440p' },
        }
    };

    // Quality badge based on FPS
    function getQuality(fps) {
        if (fps < 40)  return { label: '⚠️ Struggling',  cls: 'badge-low' };
        if (fps < 80)  return { label: '✅ Playable',    cls: 'badge-medium' };
        if (fps < 150) return { label: '🔥 Smooth',      cls: 'badge-high' };
        return             { label: '⚡ Ultra Smooth',   cls: 'badge-ultra' };
    }

    function updateFPS() {
        if (budget && game && result) {
            const data = fpsData[budget.value][game.value];
            result.innerText = data.fps + '+ FPS';

            if (fpsLabel) fpsLabel.textContent = data.settings;

            if (qualityBadge) {
                const q = getQuality(data.fps);
                qualityBadge.textContent = q.label;
                qualityBadge.className = 'quality-badge ' + q.cls;
            }
        }
    }

    if (budget) budget.addEventListener('change', updateFPS);
    if (game)   game.addEventListener('change', updateFPS);
    updateFPS(); // Run on page load
});
