// ==========================================================================
// PRESENTATION STATE & NAVIGATION
// ==========================================================================

const totalSlides = 7;
let currentSlide = 0;
let isScrollingThrottled = false;
const throttleDuration = 1200; // ms, aligns with CSS transition duration (1.1s)

const slideContainer = document.getElementById('slideContainer');
const navLinks = document.querySelectorAll('.nav-link');
const dots = document.querySelectorAll('.dot-indicator');
const arrowUp = document.getElementById('arrowUp');
const arrowDown = document.getElementById('arrowDown');

// Set CSS property for the initial slide
document.documentElement.style.setProperty('--current-slide', currentSlide);
updateControls();

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  if (index === currentSlide) return;

  currentSlide = index;
  document.documentElement.style.setProperty('--current-slide', currentSlide);
  
  updateControls();
  triggerSlideAnimations(currentSlide);
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    goToSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  }
}

// Update active states of nav buttons, side dots, and navigation arrows
function updateControls() {
  // Update Header Nav
  navLinks.forEach((link, i) => {
    link.classList.toggle('active', i === currentSlide);
  });

  // Update Vertical Nav Dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });

  // Disable / Enable floating navigation arrows
  if (arrowUp) {
    arrowUp.style.opacity = currentSlide === 0 ? '0.3' : '1';
    arrowUp.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
  }
  if (arrowDown) {
    arrowDown.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
    arrowDown.style.pointerEvents = currentSlide === totalSlides - 1 ? 'none' : 'auto';
  }
}

// ==========================================================================
// EVENT LISTENERS: KEYBOARD, SCROLL WHEEL, CLICKS
// ==========================================================================

// Click events on header links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetSlide = parseInt(e.target.getAttribute('data-slide'));
    goToSlide(targetSlide);
  });
});

// Click events on vertical nav dots
dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    const targetSlide = parseInt(e.target.getAttribute('data-slide'));
    goToSlide(targetSlide);
  });
});

// Keyboard shortcuts: Up/Down Arrow, PageUp/PageDown, Space (down), Shift+Space (up)
window.addEventListener('keydown', (e) => {
  if (isScrollingThrottled) return;

  if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
    e.preventDefault();
    nextSlide();
    throttleScroll();
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
    e.preventDefault();
    prevSlide();
    throttleScroll();
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(totalSlides - 1);
  }
});

// Mouse Wheel & Trackpad scrolling with strong throttle to avoid multi-triggering
window.addEventListener('wheel', (e) => {
  if (isScrollingThrottled) return;

  if (Math.abs(e.deltaY) < 15) return; // Ignore small accidental scrolls

  if (e.deltaY > 0) {
    nextSlide();
  } else {
    prevSlide();
  }
  
  throttleScroll();
}, { passive: false });

// Throttle mechanism for inputs
function throttleScroll() {
  isScrollingThrottled = true;
  setTimeout(() => {
    isScrollingThrottled = false;
  }, throttleDuration);
}

// Support for swipe gestures on touchscreens
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (isScrollingThrottled) return;
  
  const touchEndY = e.changedTouches[0].clientY;
  const diffY = touchStartY - touchEndY;
  
  if (Math.abs(diffY) > 50) { // Threshold for swipe
    if (diffY > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
    throttleScroll();
  }
}, { passive: true });


// ==========================================================================
// DYNAMIC SLIDE-ENTRY ANIMATIONS & SIMULATIONS
// ==========================================================================

// Track animation timeouts to clear them when changing slides
let activeTimeouts = [];
function clearAnimationTimeouts() {
  activeTimeouts.forEach(clearTimeout);
  activeTimeouts = [];
}

function triggerSlideAnimations(slideIndex) {
  clearAnimationTimeouts();
  
  if (slideIndex === 1) {
    // Slide 2: Terminal Simulator reset & rerun
    resetAndRunTerminal();
  } else if (slideIndex === 2) {
    // Slide 3: Installer progress animation restart
    resetAndRunInstaller();
  } else if (slideIndex === 4) {
    // Slide 5: Telegram Chat typing simulation
    resetAndRunTelegramChat();
  } else if (slideIndex === 5) {
    // Slide 6: Shield alert and threat radar logs
    resetAndRunSecurityGateway();
  }
}

// --- Slide 2: Terminal Simulation ---
function resetAndRunTerminal() {
  const consoleBody = document.querySelector('.console-body');
  if (!consoleBody) return;

  consoleBody.innerHTML = '';
  
  const lines = [
    { type: 'input', text: '$ pip install openclaw-core langchain chromadb' },
    { type: 'text', text: 'Collecting openclaw-core...' },
    { type: 'err', text: 'Error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/' },
    { type: 'err', text: 'Command "python setup.py egg_info" failed with error code 1' },
    { type: 'yellow', text: 'WARNING: Target directory is locked by another process.' },
    { type: 'blink', text: 'C:\\Users\\User> █' }
  ];

  lines.forEach((line, index) => {
    const t = setTimeout(() => {
      const lineEl = document.createElement('p');
      lineEl.className = 'c-line';
      
      if (line.type === 'input') lineEl.classList.add('py');
      else if (line.type === 'text') lineEl.classList.add('text');
      else if (line.type === 'err') lineEl.classList.add('err');
      else if (line.type === 'yellow') lineEl.classList.add('text-yellow');
      else if (line.type === 'blink') lineEl.classList.add('animate-blink');
      
      lineEl.textContent = line.text;
      consoleBody.appendChild(lineEl);
    }, index * 800);
    
    activeTimeouts.push(t);
  });
}

// --- Slide 3: Installer Loading Simulation ---
function toggleShowcase() {
  const showcase = document.getElementById('qclawShowcase');
  if (showcase) {
    showcase.classList.toggle('flipped');
  }
}

function resetAndRunInstaller() {
  const progressBar = document.querySelector('.inst-progress-bar');
  const percentEl = document.querySelector('.inst-percentage');
  const logsEl = document.querySelector('.inst-logs');
  const instBtnNext = document.getElementById('instBtnNext');
  const showcase = document.getElementById('qclawShowcase');
  
  if (!progressBar || !percentEl || !logsEl) return;
  
  if (showcase) showcase.classList.remove('flipped');
  
  if (instBtnNext) {
    instBtnNext.textContent = 'Menginstal...';
    instBtnNext.classList.add('pulsate', 'disabled');
    instBtnNext.classList.remove('active');
    instBtnNext.onclick = null;
  }
  
  progressBar.style.animation = 'none';
  progressBar.style.width = '0%';
  percentEl.textContent = '0%';
  logsEl.innerHTML = '';

  const logs = [
    '✔ Checking system compatibility (Windows 11 x64)...',
    '✔ Downloading localized weight components...',
    '✔ Configuring local security database...',
    '⚡ Setting up virtual environment runtimes...',
    '✔ Installing main QClaw Agent engine packages...',
    '✔ Injecting Discord & Telegram Webhook integration layers...',
    '🎉 Instalasi selesai! QClaw siap digunakan.'
  ];

  let currentPercent = 0;
  
  // Percent increment loop
  const intervalTime = 60; // ms
  const totalDuration = 4500; // total animation time
  const steps = totalDuration / intervalTime;
  
  const timer = setInterval(() => {
    currentPercent += 100 / steps;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(timer);
      
      // Installer done! Enable click to view workspace
      if (instBtnNext) {
        instBtnNext.textContent = 'Buka Workspace';
        instBtnNext.classList.remove('disabled', 'pulsate');
        instBtnNext.classList.add('active');
        instBtnNext.onclick = () => {
          toggleShowcase();
        };

        // Auto-press button after 1.5 seconds (1500ms)
        const autoPressTimeout = setTimeout(() => {
          if (showcase && !showcase.classList.contains('flipped')) {
            toggleShowcase();
          }
        }, 1500);
        activeTimeouts.push(autoPressTimeout);
      }
    }
    
    const displayPercent = Math.floor(currentPercent);
    percentEl.textContent = `${displayPercent}%`;
    progressBar.style.width = `${displayPercent}%`;
  }, intervalTime);

  // Trigger logs at specific percentages
  const logMilestones = [5, 25, 45, 60, 75, 90, 100];
  logMilestones.forEach((milestone, logIdx) => {
    const logTime = (totalDuration * (milestone / 100));
    const t = setTimeout(() => {
      const p = document.createElement('p');
      if (logIdx === 3) p.className = 'c-green';
      if (logIdx === 6) p.style.color = '#76C7C0';
      p.textContent = logs[logIdx];
      logsEl.appendChild(p);
      logsEl.scrollTop = logsEl.scrollHeight;
    }, logTime);
    activeTimeouts.push(t);
  });

  activeTimeouts.push(setTimeout(() => clearInterval(timer), totalDuration + 200));
}

// --- Slide 5: Telegram Chat Mockup Simulation ---
function resetAndRunTelegramChat() {
  const chatBody = document.querySelector('.tg-chat-body');
  if (!chatBody) return;

  chatBody.innerHTML = '<div class="chat-date">HARI INI</div>';

  const script = [
    { sender: 'user', text: 'Tolong rapikan folder unduhan saya dan kumpulkan semua invoice pajak tahun 2025 ke folder baru.' },
    { sender: 'bot', text: 'Memproses perintah Anda secara lokal... <br>🔍 Memindai folder <code>C:\\Users\\Downloads</code>... <br>📂 Ditemukan 42 berkas bertipe invoice pajak 2025.<br>✅ Berhasil memindahkan seluruh berkas ke folder baru: <code>Documents\\Pajak_2025</code>.<br>📄 Membuat berkas rangkuman data: <code>_DAFTAR_INVOICE.xlsx</code>.' },
    { sender: 'user', text: '/remote run-cmd "systeminfo"' },
    { sender: 'bot', text: 'Mengeksekusi perintah command-line jarak jauh...<br>💻 <b>OS Name:</b> Microsoft Windows 11 Home<br>💻 <b>System Model:</b> Custom PC Desktop<br>💻 <b>Total Physical Memory:</b> 32,768 MB<br>Semua sistem berjalan normal.' }
  ];

  let currentMsgIdx = 0;

  function typeNextMessage() {
    if (currentMsgIdx >= script.length) return;

    const msg = script[currentMsgIdx];
    const isUser = msg.sender === 'user';
    
    // Add typing indicator for bot messages
    if (!isUser) {
      const typingEl = document.createElement('div');
      typingEl.className = 'chat-bubble bot typing-indicator';
      typingEl.innerHTML = '<div class="bot-badge">QClaw</div><span>Mengetik...</span>';
      chatBody.appendChild(typingEl);
      chatBody.scrollTop = chatBody.scrollHeight;

      const t = setTimeout(() => {
        // Remove typing indicator
        if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
        
        // Add actual bot bubble
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble bot';
        bubble.innerHTML = `<div class="bot-badge">QClaw</div>${msg.text}`;
        chatBody.appendChild(bubble);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        currentMsgIdx++;
        // Trigger next message
        const nextTime = 1200;
        activeTimeouts.push(setTimeout(typeNextMessage, nextTime));
      }, 1500); // bot typing duration
      
      activeTimeouts.push(t);
    } else {
      // User messages appear instantly
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble user';
      bubble.textContent = msg.text;
      chatBody.appendChild(bubble);
      chatBody.scrollTop = chatBody.scrollHeight;
      
      currentMsgIdx++;
      const nextTime = 1500;
      activeTimeouts.push(setTimeout(typeNextMessage, nextTime));
    }
  }

  // Kick off chat script
  activeTimeouts.push(setTimeout(typeNextMessage, 500));
}

// --- Slide 6: Security Gateway (Claw Gateway) Simulation ---
function resetAndRunSecurityGateway() {
  const radarLine = document.querySelector('.radar-line');
  const logsEl = document.querySelector('.log-details');
  const alertPanel = document.querySelector('.threat-status');
  
  if (!radarLine || !logsEl || !alertPanel) return;

  alertPanel.style.display = 'none';
  logsEl.innerHTML = '';
  
  const secLogs = [
    '[01:42:05] Chat Source: Discord Remote Control Link',
    '[01:42:05] Command: <span class="c-red">rmdir /s /q C:\\Windows\\System32</span>',
    '[01:42:06] Rule Triggered: CRITICAL_SYSTEM_PATH_LOCK',
    '🚨 ANALYZING DESTRUCTIVE COMMAND PROPERTIES...',
    '⚠️ WARNING: ATTEMPTED TO DELETE PROTECTED OS DIRECTORY!',
    '<span class="c-red font-bold animate-blink">--- [BLOCKED BY CLAW GATEWAY] ---</span>'
  ];

  secLogs.forEach((logLine, idx) => {
    const t = setTimeout(() => {
      const p = document.createElement('p');
      p.innerHTML = logLine;
      logsEl.appendChild(p);
      
      // When reaching the warning log (idx 4), trigger red warning block
      if (idx === 4) {
        alertPanel.style.display = 'flex';
      }
    }, idx * 1000);
    
    activeTimeouts.push(t);
  });
}

// Trigger animations for the initial slide 1
window.addEventListener('DOMContentLoaded', () => {
  triggerSlideAnimations(0);
});
