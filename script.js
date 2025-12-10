// ===== GLOBAL VARIABLES =====
let upsideDownMode = false;
let musicPlaying = false;
let spelledWord = '';
let draggedPolaroid = null;

// Walkie-Talkie messages
const walkieMessages = [
    "Do you copy?",
    "Over.",
    "We have a situation...",
    "The gate is opening...",
    "Run!",
    "It's coming...",
    "Help us!",
    "Don't go into the woods...",
    "Meet at the basement.",
    "Code red!"
];

// Secret words that trigger special animations
const secretWords = ['HELP', 'RUN', 'ELEVEN', 'WILL'];

// ===== THEME MUSIC =====
const themeMusic = new Audio('audio/stranger-things-theme.mp3');
themeMusic.loop = true;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initUpsideDownToggle();
    initMusicToggle();
    initAlphabetWall();
    initMonsterHoverEffects();
    initPolaroidDrag();
    initRandomEvents();
    initCursorGlitch();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        navbar.style.background = window.scrollY > 50 ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.9)';
    });
}

// ===== UPSIDE DOWN MODE =====
function initUpsideDownToggle() {
    const toggle = document.getElementById('upsideDownToggle');
    toggle.addEventListener('change', () => {
        upsideDownMode = toggle.checked;
        document.body.classList.toggle('upside-down', upsideDownMode);
        flickerScreen();
        console.log('Upside Down Mode:', upsideDownMode ? 'ON' : 'OFF');
    });
}

function flickerScreen() {
    const vhsOverlay = document.querySelector('.vhs-overlay');
    if (!vhsOverlay) return;
    vhsOverlay.style.opacity = '0.5';
    setTimeout(() => { vhsOverlay.style.opacity = '0.1'; }, 100);
    setTimeout(() => { vhsOverlay.style.opacity = '0.3'; }, 200);
    setTimeout(() => { vhsOverlay.style.opacity = '0.1'; }, 300);
}

// ===== MUSIC TOGGLE =====
function initMusicToggle() {
    const musicToggle = document.getElementById('musicToggle');
    musicToggle.addEventListener('click', () => {
        if (!musicPlaying) {
            themeMusic.play().then(() => musicToggle.classList.add('playing')).catch(err => console.log('Audio playback failed:', err));
        } else {
            themeMusic.pause();
            musicToggle.classList.remove('playing');
        }
        musicPlaying = !musicPlaying;
    });
}

// ===== ALPHABET WALL =====
function initAlphabetWall() {
    const letterLights = document.querySelectorAll('.letter-light');
    const spelledWordDisplay = document.getElementById('spelledWord');
    const clearBtn = document.getElementById('clearWord');
    
    letterLights.forEach(light => {
        light.addEventListener('click', () => {
            const letter = light.getAttribute('data-letter');
            spelledWord += letter;
            spelledWordDisplay.textContent = spelledWord;
            light.classList.add('active');
            setTimeout(() => light.classList.remove('active'), 500);
            checkSecretWord();
        });
    });
    
    clearBtn?.addEventListener('click', () => {
        spelledWord = '';
        spelledWordDisplay.textContent = '';
        letterLights.forEach(light => light.classList.remove('active'));
    });
}

function checkSecretWord() {
    if (secretWords.includes(spelledWord)) {
        triggerSecretWordAnimation(spelledWord);
        setTimeout(() => {
            spelledWord = '';
            document.getElementById('spelledWord').textContent = '';
        }, 3000);
    }
}

function triggerSecretWordAnimation(word) {
    const display = document.getElementById('spelledWord');
    switch(word) {
        case 'HELP':
            display.style.animation = 'flicker-anim 0.2s infinite';
            setTimeout(() => display.style.animation = '', 2000);
            showWalkiePopup('Someone is calling for help!');
            break;
        case 'RUN':
            display.style.animation = 'glitch-anim-1 0.3s infinite';
            setTimeout(() => display.style.animation = '', 2000);
            triggerDemogorgonFlash();
            break;
        case 'ELEVEN':
            display.style.textShadow = '0 0 30px #ff1a1a, 0 0 60px #ff1a1a';
            setTimeout(() => display.style.textShadow = '0 0 15px #ff1a1a', 2000);
            break;
        case 'WILL':
            flickerScreen();
            showWalkiePopup('Will Byers is trying to communicate...');
            break;
    }
}

// ===== MONSTER HOVER EFFECTS =====
function initMonsterHoverEffects() {
    document.querySelectorAll('.monster-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.filter = 'blur(1px) contrast(1.2)';
            const fog = document.createElement('div');
            fog.classList.add('monster-fog');
            fog.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle, rgba(255,26,26,0.3) 0%, transparent 70%);pointer-events:none;z-index:1;`;
            card.appendChild(fog);
        });
        card.addEventListener('mouseleave', () => {
            card.style.filter = '';
            const fog = card.querySelector('.monster-fog');
            if(fog) fog.remove();
        });
    });
}

// ===== POLAROID DRAG =====
function initPolaroidDrag() {
    document.querySelectorAll('.polaroid').forEach(polaroid => {
        let isDragging=false, startX, startY, initialX, initialY;
        polaroid.addEventListener('mousedown', e => {
            isDragging=true;
            startX=e.clientX; startY=e.clientY;
            const rect = polaroid.getBoundingClientRect();
            initialX=rect.left; initialY=rect.top;
            polaroid.style.position='fixed';
            polaroid.style.zIndex='1000';
            polaroid.style.left=initialX+'px';
            polaroid.style.top=initialY+'px';
        });
        document.addEventListener('mousemove', e => {
            if(isDragging){
                polaroid.style.left=(initialX+e.clientX-startX)+'px';
                polaroid.style.top=(initialY+e.clientY-startY)+'px';
            }
        });
        document.addEventListener('mouseup', () => { isDragging=false; });
    });
}

// ===== RANDOM EVENTS =====
function initRandomEvents() {
    setInterval(() => {
        if(Math.random()<0.1){
            const message = walkieMessages[Math.floor(Math.random()*walkieMessages.length)];
            showWalkiePopup(message);
        }
    }, 30000);

    setInterval(() => {
        if(Math.random()<0.05) triggerDemogorgonFlash();
    }, 45000);
}

function showWalkiePopup(message){
    let popup=document.getElementById('walkiePopup');
    let messageEl=document.getElementById('walkieMessage');
    if(!popup){
        // create popup dynamically if not exist
        popup=document.createElement('div');
        popup.id='walkiePopup';
        popup.className='walkie-popup';
        messageEl=document.createElement('div');
        messageEl.id='walkieMessage';
        popup.appendChild(messageEl);
        const closeBtn=document.createElement('button');
        closeBtn.id='walkieClose';
        closeBtn.textContent='✖';
        closeBtn.addEventListener('click',()=>popup.classList.remove('show'));
        popup.appendChild(closeBtn);
        document.body.appendChild(popup);
    }
    messageEl.textContent=message;
    popup.classList.add('show');
    setTimeout(()=>popup.classList.remove('show'),5000);
}

function triggerDemogorgonFlash(){
    const flash=document.getElementById('demogorgonFlash');
    if(!flash) return;
    flash.classList.add('show');
    setTimeout(()=>flash.classList.remove('show'),1000);
}

// ===== CURSOR GLITCH =====
function initCursorGlitch() {
    ['.monster-card','.alphabet-wall','.walkie-talkie-zone'].forEach(sel=>{
        document.querySelectorAll(sel).forEach(el=>{
            el.addEventListener('mouseenter',()=>{document.body.style.cursor='crosshair'; el.style.filter='hue-rotate(5deg)';});
            el.addEventListener('mouseleave',()=>{document.body.style.cursor='default'; el.style.filter='';});
        });
    });
}

// ===== SCROLL ANIMATION =====
function animateOnScroll(){
    const timelineItems=document.querySelectorAll('.timeline-item');
    const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.style.opacity='1';
                entry.target.style.transform='translateY(0)';
            }
        });
    },{threshold:0.3});
    timelineItems.forEach(item=>observer.observe(item));
}
animateOnScroll();

// ===== FOG SCROLL EFFECT =====
window.addEventListener('scroll',()=>{
    const scrollPercent=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight);
    document.querySelectorAll('.fog').forEach(fog=>fog.style.opacity=Math.min(0.5+scrollPercent*0.3,0.8));
});

// ===== SCREEN SHAKE =====
document.querySelectorAll('.monster-card').forEach(card=>{
    card.addEventListener('click',()=>{document.body.style.animation='screen-shake 0.5s'; setTimeout(()=>document.body.style.animation='',500);});
});
const style=document.createElement('style');
style.textContent=`@keyframes screen-shake{0%,100%{transform:translate(0,0);}10%{transform:translate(-2px,2px);}20%{transform:translate(2px,-2px);}30%{transform:translate(-2px,-2px);}40%{transform:translate(2px,2px);}50%{transform:translate(-2px,2px);}60%{transform:translate(2px,-2px);}70%{transform:translate(-2px,-2px);}80%{transform:translate(2px,2px);}90%{transform:translate(-2px,2px);}}`;
document.head.appendChild(style);

// ===== TYPEWRITER HERO =====
function typewriterEffect(){
    const subtitle=document.querySelector('.hero-subtitle');
    if(!subtitle) return;
    const text=subtitle.textContent;
    subtitle.textContent='';
    let i=0;
    const interval=setInterval(()=>{
        if(i<text.length) subtitle.textContent+=text.charAt(i++);
        else clearInterval(interval);
    },100);
}
window.addEventListener('load',()=>setTimeout(typewriterEffect,1000));
