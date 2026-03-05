/* ═══════════════════════════════════════════════════════
   IL LABORATORIO ARCANO — JavaScript
   Edge-Glow Mask System + Journal Feature
   ═══════════════════════════════════════════════════════ */

// ─── SCENE DIMENSIONS (mask reference) ─────────────────
const SCENE_W = 1280;
const SCENE_H = 714;

// ─── GAME DATA ─────────────────────────────────────────
const OBJECTS = [
    {
        id: 'calderone',
        icon: '🔥',
        name: 'Il Calderone Alchemico',
        mask: 'Imported_Image-1.png',
        bbox: [580, 362, 723, 465],
        story: 'Questo antico calderone di ferro battuto è stato forgiato nel XV secolo. Il fuoco blu che lo alimenta non è una fiamma ordinaria: è una reazione esotermica ottenuta mescolando sali di rame con alcol etilico. Gli alchimisti lo usavano per le loro trasmutazioni, convinti di poter trasformare il piombo in oro.',
        clue: 'La fiamma blu brucia a 1085°C — la temperatura di fusione del rame. Ricorda questo numero...'
    },
    {
        id: 'ampolla',
        icon: '⚗️',
        name: 'L\'Ampolla di Vetro',
        mask: 'Imported_Image-2.png',
        bbox: [741, 422, 793, 592],
        story: 'Una sottile ampolla di vetro soffiato a mano, probabilmente di fattura veneziana. Contiene un liquido che cambia colore alla luce — un fenomeno detto fluorescenza, scoperto da George Stokes nel 1852. Sul fondo un\'iscrizione incisa: "Una goccia basta."',
        clue: 'Il liquido fluorescente reagisce alla luce ultravioletta. La parola chiave è LUCE.'
    },
    {
        id: 'libro',
        icon: '📖',
        name: 'Il Grimorio dei Segreti',
        mask: 'Imported_Image-3.png',
        bbox: [385, 503, 629, 601],
        story: 'Il grimorio è aperto su una pagina coperta di simboli che sembrano muoversi sotto la luce tremolante. Contiene centinaia di ricette alchemiche trascritte in latino medievale. Le pagine in pergamena di vitello sono state scritte con inchiostro ferro-gallico. Una parola è sottolineata tre volte: ATTENZIONE.',
        clue: 'A pagina 42 si legge: "Aurum potabile" — l\'oro potabile era considerato l\'elisir della vita eterna.'
    },
    {
        id: 'lente',
        icon: '🔍',
        name: 'La Lente d\'Ingrandimento',
        mask: 'Imported_Image-4.png',
        bbox: [665, 616, 721, 655],
        story: 'Attraverso questa lente convergente, i simboli sul tavolo appaiono completamente diversi. Qualcosa che non dovrebbe essere visibile a occhio nudo si rivela sotto l\'ingrandimento. Le lenti furono perfezionate nel XIII secolo dai monaci benedettini.',
        clue: 'La lente rivela ciò che è nascosto. Come la scienza, mostra ciò che l\'occhio non vede.'
    },
    {
        id: 'foglio',
        icon: '📄',
        name: 'Le Formule Segrete',
        mask: 'Imported_Image-5.png',
        bbox: [222, 197, 260, 241],
        story: 'Un foglio ingiallito coperto di formule chimiche e diagrammi alchemici. L\'inchiostro è ancora fresco — qualcuno era qui poco fa. Si riconoscono simboli alchemici per zolfo, mercurio e sale: i tre principi di Paracelso.',
        clue: 'Zolfo (🜍), Mercurio (☿), Sale (🜔) — i tre principi di Paracelso. La materia si TRASFORMA.'
    },
    {
        id: 'ampolla-verde',
        icon: '🧪',
        name: 'L\'Ampolla Verde',
        mask: 'Imported_Image-6.png',
        bbox: [336, 415, 387, 507],
        story: 'Un\'ampolla dal liquido verde brillante che pulsa debolmente, come se respirasse. Il colore proviene dal solfato di rame disciolto. Non toccarla — Paracelso diceva: "Solo la dose fa il veleno." (Dosis sola facit venenum)',
        clue: '"Solo la dose fa il veleno" — questa massima vale per ogni sostanza. Anche l\'acqua può essere letale in dosi eccessive!'
    },
    {
        id: 'cesto',
        icon: '🧺',
        name: 'Il Cesto delle Erbe',
        mask: 'Imported_Image-7.png',
        bbox: [224, 548, 298, 631],
        story: 'Un cesto di vimini intrecciato contiene erbe essiccate dal profumo insolito. Si riconoscono artemisia, verbena e un\'erba sconosciuta dalle foglie blu. Gli alchimisti medievali consideravano le erbe fondamentali per i loro preparati — la farmacologia moderna ne ha confermato molte proprietà.',
        clue: 'Le erbe nascondono principi attivi. La chimica delle piante è la base della medicina moderna: la TRASFORMAZIONE dalla natura alla cura.'
    }
];

const FINAL_MESSAGE = `
    <p><strong>🧬 Il Segreto del Laboratorio</strong></p>
    <p>Hai scoperto il filo conduttore che lega ogni oggetto: la <strong>TRASFORMAZIONE</strong>.</p>
    <p>Dall'alchimia alla chimica moderna, tutto ruota attorno a un unico principio:
    comprendere come la materia si trasforma.</p>
    <p>Gli alchimisti cercavano la Pietra Filosofale, ma il vero tesoro era il <strong>metodo scientifico</strong>
    — l'arte di osservare, sperimentare e scoprire.</p>
    <p style="margin-top:16px; font-size:1.15rem;">✨ <em>"Nulla si crea, nulla si distrugge, tutto si trasforma."</em><br>
    — Antoine Lavoisier</p>
`;

// ─── STATE ─────────────────────────────────────────────
let discoveredObjects = new Set();
let gameStarted = false;

// ─── DOM ELEMENTS ──────────────────────────────────────
const introScreen = document.getElementById('intro-screen');
const startBtn = document.getElementById('start-btn');
const scene = document.getElementById('scene');
const maskLayer = document.getElementById('maskLayer');
const modalOverlay = document.getElementById('modal-overlay');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalStory = document.getElementById('modal-story');
const modalClueText = document.getElementById('modal-clue-text');
const modalClose = document.getElementById('modal-close');
const progressText = document.getElementById('progress-text');
const progressItems = document.getElementById('progress-items');
const hintBtn = document.getElementById('hint-btn');
const resetBtn = document.getElementById('reset-btn');
const journalBtn = document.getElementById('journal-btn');
const journalPanel = document.getElementById('journal-panel');
const journalClose = document.getElementById('journal-close');
const journalEntries = document.getElementById('journal-entries');
const celebrationOverlay = document.getElementById('celebration-overlay');
const finalMessage = document.getElementById('final-message');
const celebrationClose = document.getElementById('celebration-close');
const particleCanvas = document.getElementById('particle-canvas');

// ─── OBJECT LAYER REFERENCES ──────────────────────────
// Each object gets: { glowFar, glowNear, overlay, hotspot }
const objectLayers = {};

// ─── INIT ──────────────────────────────────────────────
function init() {
    loadState();
    buildScene();
    buildProgressBar();
    attachEventListeners();
    initParticles();
    updateProgress();
    updateJournal();
}

// ─── LOAD / SAVE STATE ─────────────────────────────────
function loadState() {
    try {
        const saved = localStorage.getItem('lab_discovered');
        if (saved) {
            discoveredObjects = new Set(JSON.parse(saved));
        }
    } catch (e) {
        discoveredObjects = new Set();
    }
}

function saveState() {
    try {
        localStorage.setItem('lab_discovered', JSON.stringify([...discoveredObjects]));
    } catch (e) { /* silent fail */ }
}

// ─── BUILD SCENE (create mask layers + hotspots) ──────
function buildScene() {
    OBJECTS.forEach(obj => {
        const maskUrl = obj.mask;

        // --- Far glow (heavy blur, wide aura) ---
        const glowFar = document.createElement('div');
        glowFar.className = 'hotspot-glow-far';
        glowFar.style.webkitMaskImage = `url(${maskUrl})`;
        glowFar.style.maskImage = `url(${maskUrl})`;
        maskLayer.appendChild(glowFar);

        // --- Near glow (medium blur, edge definition) ---
        const glowNear = document.createElement('div');
        glowNear.className = 'hotspot-glow-near';
        glowNear.style.webkitMaskImage = `url(${maskUrl})`;
        glowNear.style.maskImage = `url(${maskUrl})`;
        maskLayer.appendChild(glowNear);

        // --- Overlay (sharp, very subtle inner highlight) ---
        const overlay = document.createElement('div');
        overlay.className = 'hotspot-overlay';
        overlay.style.webkitMaskImage = `url(${maskUrl})`;
        overlay.style.maskImage = `url(${maskUrl})`;
        maskLayer.appendChild(overlay);

        // --- Hotspot click area (invisible, positioned by bbox) ---
        const [x1, y1, x2, y2] = obj.bbox;
        const hotspot = document.createElement('div');
        hotspot.className = 'hotspot';
        hotspot.dataset.id = obj.id;
        hotspot.style.left = (x1 / SCENE_W * 100).toFixed(2) + '%';
        hotspot.style.top = (y1 / SCENE_H * 100).toFixed(2) + '%';
        hotspot.style.width = ((x2 - x1) / SCENE_W * 100).toFixed(2) + '%';
        hotspot.style.height = ((y2 - y1) / SCENE_H * 100).toFixed(2) + '%';
        scene.appendChild(hotspot);

        // Store references
        objectLayers[obj.id] = { glowFar, glowNear, overlay, hotspot };

        // --- Hover events ---
        hotspot.addEventListener('mouseenter', () => {
            if (!overlay.classList.contains('active') && !overlay.classList.contains('discovered')) {
                glowFar.classList.add('hover');
                glowNear.classList.add('hover');
                overlay.classList.add('hover');
            }
        });

        hotspot.addEventListener('mouseleave', () => {
            if (!overlay.classList.contains('active')) {
                glowFar.classList.remove('hover');
                glowNear.classList.remove('hover');
                overlay.classList.remove('hover');
            }
        });

        // --- Click event ---
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            onObjectClick(obj.id, e);
        });

        // Apply discovered state if already found
        if (discoveredObjects.has(obj.id)) {
            glowFar.classList.add('discovered');
            glowNear.classList.add('discovered');
            overlay.classList.add('discovered');
        }
    });
}

// ─── BUILD PROGRESS BAR ───────────────────────────────
function buildProgressBar() {
    progressItems.innerHTML = '';
    OBJECTS.forEach(obj => {
        const item = document.createElement('div');
        item.className = 'progress-item';
        item.id = `prog-${obj.id}`;
        item.textContent = obj.icon;
        item.title = obj.name;
        if (discoveredObjects.has(obj.id)) {
            item.classList.add('found');
        }
        progressItems.appendChild(item);
    });
}

// ─── EVENT LISTENERS ──────────────────────────────────
function attachEventListeners() {
    // Start button
    startBtn.addEventListener('click', startGame);

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeJournal();
            removeHintTooltip();
        }
    });

    // Hint button
    hintBtn.addEventListener('click', showHint);

    // Reset button
    resetBtn.addEventListener('click', resetGame);

    // Journal buttons
    journalBtn.addEventListener('click', toggleJournal);
    journalClose.addEventListener('click', closeJournal);
    journalPanel.addEventListener('click', (e) => {
        if (e.target === journalPanel) closeJournal();
    });

    // Celebration close
    celebrationClose.addEventListener('click', closeCelebration);

    // Click on scene background to clear active states
    scene.addEventListener('click', (e) => {
        if (e.target === scene || e.target.classList.contains('scene-bg') || e.target.id === 'vignette-overlay') {
            clearActiveStates();
        }
    });
}

// ─── START GAME ───────────────────────────────────────
function startGame() {
    gameStarted = true;
    introScreen.classList.add('fade-out');

    setTimeout(() => {
        introScreen.classList.add('hidden');
    }, 1000);
}

// ─── OBJECT CLICK ─────────────────────────────────────
function onObjectClick(objId, event) {
    const obj = OBJECTS.find(o => o.id === objId);
    if (!obj) return;

    const layers = objectLayers[objId];
    if (!layers) return;

    // Spawn particles
    if (event) {
        spawnClickParticles(event.clientX, event.clientY);
    }

    // Hide global hint text
    const clickHint = document.getElementById('click-hint');
    if (clickHint) {
        clickHint.style.transition = 'opacity 0.5s ease';
        clickHint.style.opacity = '0';
        setTimeout(() => clickHint.remove(), 500);
    }

    // Clear previous active states
    clearActiveStates();

    // Set active glow
    layers.glowFar.classList.remove('hover');
    layers.glowNear.classList.remove('hover');
    layers.overlay.classList.remove('hover');
    layers.glowFar.classList.add('active');
    layers.glowNear.classList.add('active');
    layers.overlay.classList.add('active');

    // Play click sound
    playClickSound();

    // Mark as discovered
    const isNew = !discoveredObjects.has(objId);
    discoveredObjects.add(objId);
    saveState();

    // Open modal
    openModal(obj, isNew);

    // Update progress
    updateProgress();

    // Update journal
    if (isNew) {
        journalBtn.classList.add('has-new');
        updateJournal();
    }

    // Check win condition
    if (discoveredObjects.size === OBJECTS.length) {
        setTimeout(() => {
            showCelebration();
        }, 1500);
    }
}

// ─── CLEAR ACTIVE / HOVER STATES ──────────────────────
function clearActiveStates() {
    document.querySelectorAll('.hotspot-glow-far, .hotspot-glow-near, .hotspot-overlay').forEach(el => {
        el.classList.remove('active', 'hover');
    });

    // Re-apply discovered states
    OBJECTS.forEach(obj => {
        if (discoveredObjects.has(obj.id)) {
            const layers = objectLayers[obj.id];
            if (layers) {
                layers.glowFar.classList.add('discovered');
                layers.glowNear.classList.add('discovered');
                layers.overlay.classList.add('discovered');
            }
        }
    });
}

// ─── TYPEWRITER EFFECT ────────────────────────────────
let typewriterInterval = null;

function typeWriter(text, element, speed = 25) {
    stopTypewriter();
    element.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            typewriterInterval = setTimeout(type, speed);
        }
    }
    type();
}

function stopTypewriter() {
    if (typewriterInterval) {
        clearTimeout(typewriterInterval);
        typewriterInterval = null;
    }
}

// ─── MODAL ────────────────────────────────────────────
function openModal(obj, isNew) {
    modalIcon.textContent = obj.icon;
    modalTitle.textContent = obj.name;

    // Use typewriter for the story
    typeWriter(obj.story, modalStory);

    modalClueText.textContent = obj.clue;

    const badge = document.getElementById('modal-badge');
    if (isNew) {
        badge.style.display = 'block';
        badge.innerHTML = '<span>✨ Indizio Sbloccato!</span>';
        badge.style.color = '';
    } else {
        badge.style.display = 'block';
        badge.innerHTML = '<span>📌 Già Scoperto</span>';
        badge.style.color = 'var(--text-secondary)';
    }

    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    stopTypewriter();
    modalOverlay.classList.add('hidden');
    const badge = document.getElementById('modal-badge');
    badge.style.color = '';
    clearActiveStates();
}

// ─── UPDATE PROGRESS ──────────────────────────────────
function updateProgress() {
    const count = discoveredObjects.size;
    const total = OBJECTS.length;
    progressText.textContent = `${count} / ${total} segreti scoperti`;

    OBJECTS.forEach(obj => {
        const progItem = document.getElementById(`prog-${obj.id}`);
        if (progItem && discoveredObjects.has(obj.id)) {
            progItem.classList.add('found');
        }
    });
}

// ─── JOURNAL ──────────────────────────────────────────
function toggleJournal() {
    if (journalPanel.classList.contains('hidden')) {
        openJournal();
    } else {
        closeJournal();
    }
}

function openJournal() {
    journalBtn.classList.remove('has-new');
    updateJournal();
    journalPanel.classList.remove('hidden');
}

function closeJournal() {
    journalPanel.classList.add('hidden');
}

function updateJournal() {
    journalEntries.innerHTML = '';

    OBJECTS.forEach(obj => {
        const entry = document.createElement('div');
        const isFound = discoveredObjects.has(obj.id);
        entry.className = `journal-entry ${isFound ? 'unlocked' : 'locked'}`;

        const header = document.createElement('div');
        header.className = 'journal-entry-header';

        const icon = document.createElement('span');
        icon.className = 'journal-entry-icon';
        icon.textContent = isFound ? obj.icon : '🔒';

        const name = document.createElement('span');
        name.className = 'journal-entry-name';
        name.textContent = isFound ? obj.name : '???';

        header.appendChild(icon);
        header.appendChild(name);

        const clue = document.createElement('div');
        clue.className = 'journal-entry-clue';
        clue.textContent = isFound ? obj.clue : 'Indizio non ancora scoperto...';

        entry.appendChild(header);
        entry.appendChild(clue);
        journalEntries.appendChild(entry);
    });
}

// ─── HINT SYSTEM ──────────────────────────────────────
function showHint() {
    removeHintTooltip();

    const undiscovered = OBJECTS.filter(o => !discoveredObjects.has(o.id));
    if (undiscovered.length === 0) {
        showTooltip('🎉 Hai già scoperto tutti gli oggetti!');
        return;
    }

    // Pick a random undiscovered object and highlight
    const target = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    const layers = objectLayers[target.id];

    if (layers) {
        // Briefly show the glow for the hinted object
        layers.glowFar.classList.add('hover');
        layers.glowNear.classList.add('hover');
        layers.hotspot.classList.add('hint-highlight');

        setTimeout(() => {
            layers.glowFar.classList.remove('hover');
            layers.glowNear.classList.remove('hover');
            layers.hotspot.classList.remove('hint-highlight');
        }, 3000);
    }

    showTooltip(`💡 Cerca ${target.icon} ${target.name}...`);
}

function showTooltip(text) {
    removeHintTooltip();
    const tooltip = document.createElement('div');
    tooltip.className = 'hint-tooltip';
    tooltip.id = 'active-tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    setTimeout(() => {
        tooltip.classList.add('fade-out');
        setTimeout(() => tooltip.remove(), 300);
    }, 3000);
}

function removeHintTooltip() {
    const existing = document.getElementById('active-tooltip');
    if (existing) existing.remove();
}

// ─── RESET GAME ───────────────────────────────────────
function resetGame() {
    if (!confirm('Vuoi ricominciare? Tutti i progressi saranno persi.')) return;

    discoveredObjects.clear();
    localStorage.removeItem('lab_discovered');

    // Clear all glow states
    document.querySelectorAll('.hotspot-glow-far, .hotspot-glow-near, .hotspot-overlay').forEach(el => {
        el.classList.remove('active', 'hover', 'discovered');
        // Reset background color (for discovered green state)
        el.style.background = '';
    });

    buildProgressBar();
    updateProgress();
    updateJournal();
}

// ─── CELEBRATION ──────────────────────────────────────
function showCelebration() {
    closeModal();
    finalMessage.innerHTML = FINAL_MESSAGE;
    celebrationOverlay.classList.remove('hidden');
    launchConfetti();
}

function closeCelebration() {
    celebrationOverlay.classList.add('hidden');
}

// ─── CONFETTI ─────────────────────────────────────────
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ['#d4a844', '#f0d080', '#7744aa', '#4488cc', '#44aa66', '#ff6644', '#ff44aa'];

    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            drift: (Math.random() - 0.5) * 2
        });
    }

    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach(c => {
            c.y += c.speed;
            c.x += c.drift;
            c.angle += c.spin;

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.angle);
            ctx.fillStyle = c.color;
            ctx.globalAlpha = Math.max(0, 1 - (c.y / canvas.height) * 0.5);
            ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            ctx.restore();
        });

        frame++;
        if (frame < 300 && !celebrationOverlay.classList.contains('hidden')) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ─── CLICK PARTICLES ──────────────────────────────────
function spawnClickParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-particle';

        const dx = (Math.random() - 0.5) * 80;
        particle.style.setProperty('--dx', `${dx}px`);

        const dy = (Math.random() - 0.5) * 20;
        particle.style.left = `${x}px`;
        particle.style.top = `${y + dy}px`;
        particle.style.animationDelay = `${Math.random() * 0.2}s`;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1100);
    }
}

// ─── AMBIENT PARTICLE SYSTEM ──────────────────────────
function initParticles() {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];

    function resize() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Create ambient particles
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            size: Math.random() * 2 + 0.5,
            speedY: -(Math.random() * 0.4 + 0.08),
            speedX: (Math.random() - 0.5) * 0.25,
            opacity: Math.random() * 0.4 + 0.08,
            flickerSpeed: Math.random() * 0.02 + 0.005,
            flickerOffset: Math.random() * Math.PI * 2
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;

            const flicker = Math.sin(Date.now() * p.flickerSpeed + p.flickerOffset) * 0.3 + 0.7;

            if (p.y < -10) p.y = particleCanvas.height + 10;
            if (p.x < -10) p.x = particleCanvas.width + 10;
            if (p.x > particleCanvas.width + 10) p.x = -10;

            // Core dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 168, 68, ${p.opacity * flicker})`;
            ctx.fill();

            // Soft glow halo
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 168, 68, ${p.opacity * flicker * 0.12})`;
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// ─── CLICK SOUND ──────────────────────────────────────
function playClickSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Magical chime
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        osc1.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.3);
        gain1.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc1.start(audioCtx.currentTime);
        osc1.stop(audioCtx.currentTime + 0.5);

        // Second harmonic
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.35);
        gain2.gain.setValueAtTime(0.06, audioCtx.currentTime + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc2.start(audioCtx.currentTime + 0.05);
        osc2.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
        // Audio not supported — fail silently
    }
}

// ─── INITIALIZE ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
