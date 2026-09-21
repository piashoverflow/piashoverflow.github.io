/**
 * PORTFOLIO JAVASCRIPT — MOHAMMAD SHAMSUDDIN PIASH
 * Advanced Vanilla JS:
 * 1. Interactive Dual-Engine Physics & FGM Stress Simulator (HTML5 Canvas)
 * 2. Animated Stats Counter (IntersectionObserver)
 * 3. Filterable Projects Gallery
 * 4. Theme Management (Dark / Light with LocalStorage)
 * 5. Scroll Spy & Reading Progress Indicator
 * 6. BibTeX Citation Exporter & Toast System
 */

(function () {
  'use strict';

  // ==========================================================================
  // THEME MANAGEMENT
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function initTheme() {
    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
    } else if (prefersDark.matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeIcon('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      updateThemeIcon('light');
    }
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        icon.className = 'fas fa-moon';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('site-theme', newTheme);
      updateThemeIcon(newTheme);
      // Redraw canvas if running
      if (typeof drawSimulation === 'function') {
        drawSimulation();
      }
    });
  }

  // ==========================================================================
  // MOBILE MENU DRAWER
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close drawer when any mobile link is clicked
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // ==========================================================================
  // SCROLL PROGRESS & SCROLL SPY
  // ==========================================================================
  const progressBar = document.getElementById('scroll-progress');
  const siteNav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = Array.from(navLinks).map(link => {
    const id = link.getAttribute('href').substring(1);
    return document.getElementById(id);
  }).filter(Boolean);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }

    if (siteNav) {
      if (scrollTop > 40) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    }

    // Scroll spy
    let currentSection = '';
    const scrollPos = scrollTop + 160;

    sections.forEach(sec => {
      if (sec && sec.offsetTop <= scrollPos) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });

  // ==========================================================================
  // ANIMATED STATS COUNTER
  // ==========================================================================
  const metricNumbers = document.querySelectorAll('.metric-number[data-target]');

  if ('IntersectionObserver' in window && metricNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out expo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = (target * easeProgress).toFixed(decimals);

            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    metricNumbers.forEach(el => counterObserver.observe(el));
  }

  // ==========================================================================
  // PROJECT FILTERING
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ==========================================================================
  // BIBTEX EXPORTER & TOAST SYSTEM
  // ==========================================================================
  const bibtexEntries = {
    'asme-2025': `@article{piash2025multiobjective,
  author    = {Piash, Mohammad Shamsuddin and Ali, Md. Afsar},
  title     = {Multi-Objective Structural and Material Optimization of Bimaterial Mechanical Components},
  journal   = {ASME Journal of Mechanical Design},
  year      = {2025},
  note      = {Under Review}
}`,
    'fgm-review': `@article{piash2025fgmreview,
  author    = {Piash, Mohammad Shamsuddin},
  title     = {State-of-the-Art in Functionally Graded Material Gradation Laws and Computational Optimization},
  journal   = {Manuscript in Preparation for Q1 Materials/Mechanics Journal},
  year      = {2025}
}`
  };

  const toast = document.getElementById('toast-notification');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-emerald);"></i> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  document.querySelectorAll('.btn-cite[data-bibtex]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-bibtex');
      const text = bibtexEntries[key] || '';
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('BibTeX citation copied to clipboard!');
        }).catch(() => {
          fallbackCopyText(text);
        });
      } else {
        fallbackCopyText(text);
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('BibTeX citation copied to clipboard!');
    } catch (err) {
      alert('BibTeX:\n\n' + text);
    }
    document.body.removeChild(textArea);
  }

  // Quick email copy
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'mohammadshamsuddinpiash0722@gmail.com';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email address copied to clipboard!');
        });
      }
    });
  }

  // ==========================================================================
  // INTERACTIVE DUAL-ENGINE SIMULATOR WORKBENCH (CANVAS)
  // Mode 1: FGM Transition-Layer Stress Analyzer (Connecting Rod)
  // Mode 2: Dynamic Atwood Machine Simulation
  // ==========================================================================
  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let currentSimMode = 'fgm'; // 'fgm' or 'atwood'
  let animId = null;

  // Simulator Mode Switch Tabs
  const tabFgm = document.getElementById('tab-sim-fgm');
  const tabAtwood = document.getElementById('tab-sim-atwood');
  const controlsFgm = document.getElementById('controls-fgm');
  const controlsAtwood = document.getElementById('controls-atwood');
  const readoutsFgm = document.getElementById('readouts-fgm');
  const readoutsAtwood = document.getElementById('readouts-atwood');

  function setSimMode(mode) {
    currentSimMode = mode;
    if (mode === 'fgm') {
      tabFgm?.classList.add('active');
      tabAtwood?.classList.remove('active');
      if (controlsFgm) controlsFgm.style.display = 'flex';
      if (controlsAtwood) controlsAtwood.style.display = 'none';
      if (readoutsFgm) readoutsFgm.style.display = 'grid';
      if (readoutsAtwood) readoutsAtwood.style.display = 'none';
    } else {
      tabAtwood?.classList.add('active');
      tabFgm?.classList.remove('active');
      if (controlsFgm) controlsFgm.style.display = 'none';
      if (controlsAtwood) controlsAtwood.style.display = 'flex';
      if (readoutsFgm) readoutsFgm.style.display = 'none';
      if (readoutsAtwood) readoutsAtwood.style.display = 'grid';
      resetAtwood();
    }
    resizeCanvas();
  }

  tabFgm?.addEventListener('click', () => setSimMode('fgm'));
  tabAtwood?.addEventListener('click', () => setSimMode('atwood'));

  // --- FGM Simulation Variables ---
  const fgmLoadSlider = document.getElementById('fgm-load');
  const fgmTempSlider = document.getElementById('fgm-temp');
  const fgmLawSelect = document.getElementById('fgm-law');
  const fgmBetaSlider = document.getElementById('fgm-beta');
  const fgmBetaGroup = document.getElementById('fgm-beta-group');

  const readoutMaxStress = document.getElementById('readout-max-stress');
  const readoutShear = document.getElementById('readout-shear');
  const readoutSF = document.getElementById('readout-sf');
  const readoutEnergy = document.getElementById('readout-energy');
  const readoutLawDisplay = document.getElementById('readout-law-formula');

  // Input listeners
  [fgmLoadSlider, fgmTempSlider, fgmBetaSlider].forEach(slider => {
    slider?.addEventListener('input', () => {
      updateFgmValues();
      drawSimulation();
    });
  });

  fgmLawSelect?.addEventListener('change', () => {
    if (fgmBetaGroup) {
      fgmBetaGroup.style.display = fgmLawSelect.value === 'exponential' ? 'block' : 'none';
    }
    updateFgmValues();
    drawSimulation();
  });

  function updateFgmValues() {
    const P = parseFloat(fgmLoadSlider?.value || '65');
    const dT = parseFloat(fgmTempSlider?.value || '120');
    const law = fgmLawSelect?.value || 'exponential';
    const beta = parseFloat(fgmBetaSlider?.value || '1.0');

    // Update slider label readouts
    const pValEl = document.getElementById('fgm-load-val');
    if (pValEl) pValEl.textContent = `${P} MPa`;

    const dtValEl = document.getElementById('fgm-temp-val');
    if (dtValEl) dtValEl.textContent = `${dT} °C`;

    const betaValEl = document.getElementById('fgm-beta-val');
    if (betaValEl) betaValEl.textContent = beta.toFixed(1);

    // Calculate FGM structural metrics
    // Steel Yield: 710 MPa; Al Yield: 505 MPa
    // Theoretical factor of safety and stress concentration reduction
    let stressConcFactor = 1.0;
    let shearMultiplier = 0.45;
    let formulaText = 'Linear: V(x) = x / L';

    if (law === 'bimaterial') {
      stressConcFactor = 1.85; // Sharp discontinuity stress singularity
      shearMultiplier = 1.65;
      formulaText = 'Bimaterial (Abrupt interface: Delamination risk)';
    } else if (law === 'linear') {
      stressConcFactor = 1.25;
      shearMultiplier = 0.55;
      formulaText = 'Linear: V(x) = x / L';
    } else if (law === 'exponential') {
      stressConcFactor = 1.12 - (beta * 0.04);
      shearMultiplier = 0.38;
      formulaText = `Exponential: V(x) = (e^{${beta}x/L} - 1) / (e^{${beta}} - 1)`;
    } else if (law === 'sigmoid') {
      stressConcFactor = 1.08;
      shearMultiplier = 0.32;
      formulaText = 'Sigmoid: Smooth S-Curve (Min Interfacial Shear)';
    }

    const sigmaMax = P * stressConcFactor + (dT * 0.42);
    const tauInterfacial = P * 0.32 * shearMultiplier;
    const sf = Math.min(505 / (sigmaMax * 0.75), 710 / sigmaMax);
    const strainEnergy = (0.5 * (Math.pow(sigmaMax, 2) / 120000) * 8.85 * 35).toFixed(1);

    if (readoutMaxStress) readoutMaxStress.textContent = `${sigmaMax.toFixed(1)} MPa`;
    if (readoutShear) readoutShear.textContent = `${tauInterfacial.toFixed(1)} MPa`;
    if (readoutSF) {
      readoutSF.textContent = sf.toFixed(2);
      readoutSF.style.color = law === 'bimaterial' ? 'var(--accent-rose)' : 'var(--accent-cyan)';
    }
    if (readoutEnergy) readoutEnergy.textContent = `${strainEnergy} mJ`;
    if (readoutLawDisplay) readoutLawDisplay.textContent = formulaText;
  }

  // --- Atwood Simulation Variables ---
  const atwoodM1 = document.getElementById('atwood-m1');
  const atwoodM2 = document.getElementById('atwood-m2');
  const atwoodInertia = document.getElementById('atwood-inertia');
  const atwoodFriction = document.getElementById('atwood-friction');
  const atwoodPlayBtn = document.getElementById('atwood-play-btn');
  const atwoodResetBtn = document.getElementById('atwood-reset-btn');

  const readoutAtwoodAcc = document.getElementById('readout-atwood-acc');
  const readoutAtwoodT1 = document.getElementById('readout-atwood-t1');
  const readoutAtwoodT2 = document.getElementById('readout-atwood-t2');
  const readoutAtwoodVel = document.getElementById('readout-atwood-vel');

  let atwoodState = {
    m1: 3.0,
    m2: 5.0,
    I: 0.5,
    mu: 0.05,
    g: 9.81,
    y1: 180,
    y2: 180,
    vel: 0,
    acc: 0,
    isRunning: false,
    pulleyAngle: 0,
    lastTime: 0
  };

  [atwoodM1, atwoodM2, atwoodInertia, atwoodFriction].forEach(slider => {
    slider?.addEventListener('input', () => {
      updateAtwoodParams();
      drawSimulation();
    });
  });

  atwoodPlayBtn?.addEventListener('click', () => {
    atwoodState.isRunning = !atwoodState.isRunning;
    const icon = atwoodPlayBtn.querySelector('i');
    if (icon) {
      icon.className = atwoodState.isRunning ? 'fas fa-pause' : 'fas fa-play';
    }
  });

  atwoodResetBtn?.addEventListener('click', resetAtwood);

  function resetAtwood() {
    atwoodState.y1 = 180;
    atwoodState.y2 = 180;
    atwoodState.vel = 0;
    atwoodState.pulleyAngle = 0;
    atwoodState.isRunning = false;
    if (atwoodPlayBtn) {
      const icon = atwoodPlayBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-play';
    }
    updateAtwoodParams();
    drawSimulation();
  }

  function updateAtwoodParams() {
    atwoodState.m1 = parseFloat(atwoodM1?.value || '3.0');
    atwoodState.m2 = parseFloat(atwoodM2?.value || '5.0');
    atwoodState.I = parseFloat(atwoodInertia?.value || '0.5');
    atwoodState.mu = parseFloat(atwoodFriction?.value || '0.05');

    const m1Val = document.getElementById('atwood-m1-val');
    if (m1Val) m1Val.textContent = `${atwoodState.m1.toFixed(1)} kg`;

    const m2Val = document.getElementById('atwood-m2-val');
    if (m2Val) m2Val.textContent = `${atwoodState.m2.toFixed(1)} kg`;

    const iVal = document.getElementById('atwood-inertia-val');
    if (iVal) iVal.textContent = `${atwoodState.I.toFixed(1)} kg·m²`;

    const muVal = document.getElementById('atwood-friction-val');
    if (muVal) muVal.textContent = atwoodState.mu.toFixed(2);

    // Physics equations for Atwood machine with massive pulley & friction
    const R = 0.8; // Effective pulley radius
    const netMassDiff = atwoodState.m2 - atwoodState.m1;
    const frictionTorque = atwoodState.mu * (atwoodState.m1 + atwoodState.m2) * atwoodState.g * 0.15;
    const totalInertia = atwoodState.m1 + atwoodState.m2 + (atwoodState.I / (R * R));

    let netForce = netMassDiff * atwoodState.g;
    if (Math.abs(netForce) > frictionTorque) {
      netForce -= Math.sign(netForce) * frictionTorque;
      atwoodState.acc = netForce / totalInertia;
    } else {
      atwoodState.acc = 0;
    }

    const T1 = atwoodState.m1 * (atwoodState.g + atwoodState.acc);
    const T2 = atwoodState.m2 * (atwoodState.g - atwoodState.acc);

    if (readoutAtwoodAcc) readoutAtwoodAcc.textContent = `${atwoodState.acc.toFixed(2)} m/s²`;
    if (readoutAtwoodT1) readoutAtwoodT1.textContent = `${T1.toFixed(1)} N`;
    if (readoutAtwoodT2) readoutAtwoodT2.textContent = `${T2.toFixed(1)} N`;
    if (readoutAtwoodVel) readoutAtwoodVel.textContent = `${Math.abs(atwoodState.vel).toFixed(2)} m/s`;
  }

  // ==========================================================================
  // CANVAS RENDERING ENGINES
  // ==========================================================================
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    drawSimulation();
  }

  window.addEventListener('resize', resizeCanvas);

  function drawSimulation() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    if (currentSimMode === 'fgm') {
      renderFgmMode(width, height);
    } else {
      renderAtwoodMode(width, height);
    }
  }

  // --- Render FGM Stress Field & Plots ---
  function renderFgmMode(w, h) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const textBright = isDark ? '#f8fafc' : '#0f172a';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';

    const law = fgmLawSelect?.value || 'exponential';
    const P = parseFloat(fgmLoadSlider?.value || '65');
    const dT = parseFloat(fgmTempSlider?.value || '120');
    const beta = parseFloat(fgmBetaSlider?.value || '1.0');

    // Section 1: Connecting Rod Transition Interface Diagram (Top)
    const margin = 45;
    const rodTop = 35;
    const rodHeight = 85;
    const rodWidth = w - margin * 2;

    const alWidth = rodWidth * 0.35;
    const fgmWidth = rodWidth * 0.30;
    const steelWidth = rodWidth * 0.35;

    // Draw Rod Outer Shell
    ctx.save();
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(margin, rodTop, rodWidth, rodHeight);

    // Segment 1: Al 7075-T6 Shank
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.fillRect(margin, rodTop, alWidth, rodHeight);

    // Segment 3: AISI 4340 Steel Bearing End
    ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
    ctx.fillRect(margin + alWidth + fgmWidth, rodTop, steelWidth, rodHeight);

    // Segment 2: Transition Layer (8.85 mm Interface)
    const startX = margin + alWidth;
    for (let x = 0; x < fgmWidth; x += 2) {
      const normX = x / fgmWidth; // 0 to 1
      let volAl = 1 - normX; // default

      if (law === 'bimaterial') {
        volAl = normX < 0.5 ? 1 : 0;
      } else if (law === 'linear') {
        volAl = 1 - normX;
      } else if (law === 'exponential') {
        volAl = 1 - (Math.exp(beta * normX) - 1) / (Math.exp(beta) - 1);
      } else if (law === 'sigmoid') {
        volAl = 1 / (1 + Math.exp(10 * (normX - 0.5)));
      }

      // Material color blend between Al (Slate) and Steel (Navy/Charcoal)
      const r = Math.round(30 + volAl * 35);
      const g = Math.round(41 + volAl * 30);
      const b = Math.round(60 + volAl * 40);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(startX + x, rodTop, 2.5, rodHeight);

      // Overlay stress heatmap color (Von Mises stress glow)
      let localStress = P * (1 + 0.3 * (1 - volAl)) + dT * 0.35;
      if (law === 'bimaterial' && Math.abs(normX - 0.5) < 0.06) {
        localStress *= 2.2; // Massive interfacial spike
      }
      const stressRatio = Math.min(localStress / 180, 1.0);
      ctx.fillStyle = `rgba(244, 63, 94, ${stressRatio * 0.6})`;
      ctx.fillRect(startX + x, rodTop, 2.5, rodHeight);
    }

    // Material Labels
    ctx.font = '600 11px JetBrains Mono';
    ctx.fillStyle = textBright;
    ctx.textAlign = 'center';
    ctx.fillText('SHANK: Al 7075-T6', margin + alWidth / 2, rodTop + rodHeight / 2 + 4);
    ctx.fillText('BEARING: AISI 4340', margin + alWidth + fgmWidth + steelWidth / 2, rodTop + rodHeight / 2 + 4);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(law === 'bimaterial' ? 'ABRUPT JOINT' : 'FGM INTERFACE (8.85 mm)', startX + fgmWidth / 2, rodTop - 12);

    // Dimension lines
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(startX, rodTop - 6);
    ctx.lineTo(startX + fgmWidth, rodTop - 6);
    ctx.stroke();

    ctx.restore();

    // Section 2: Real-time 2D Mechanics Curve Plot (Bottom)
    const plotTop = rodTop + rodHeight + 50;
    const plotHeight = h - plotTop - 35;
    const plotWidth = w - margin * 2;

    // Grid lines
    ctx.save();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let gy = 0; gy <= 4; gy++) {
      const y = plotTop + (plotHeight / 4) * gy;
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(margin + plotWidth, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.moveTo(margin, plotTop);
    ctx.lineTo(margin, plotTop + plotHeight);
    ctx.lineTo(margin + plotWidth, plotTop + plotHeight);
    ctx.stroke();

    // Labels
    ctx.font = '500 10px JetBrains Mono';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.fillText('Stress σ (MPa) & Volume Fraction V₁(x)', margin, plotTop - 12);
    ctx.textAlign = 'right';
    ctx.fillText('Axial Position x (mm) →', margin + plotWidth, plotTop + plotHeight + 22);

    // Curve 1: Volume Fraction V1(x) (Cyan Line)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= plotWidth; px += 2) {
      const normX = px / plotWidth;
      let v = 1 - normX;
      if (law === 'bimaterial') {
        v = normX < 0.5 ? 1 : 0;
      } else if (law === 'exponential') {
        v = 1 - (Math.exp(beta * normX) - 1) / (Math.exp(beta) - 1);
      } else if (law === 'sigmoid') {
        v = 1 / (1 + Math.exp(10 * (normX - 0.5)));
      }
      const py = plotTop + plotHeight - (v * plotHeight * 0.85);
      if (px === 0) ctx.moveTo(margin + px, py);
      else ctx.lineTo(margin + px, py);
    }
    ctx.stroke();

    // Curve 2: Interfacial Shear Stress / Von Mises Stress (Amber/Rose Line)
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= plotWidth; px += 2) {
      const normX = px / plotWidth;
      let stress = P * (0.8 + 0.4 * normX) + dT * 0.25;
      if (law === 'bimaterial') {
        const dist = Math.abs(normX - 0.5);
        stress += 140 * Math.exp(-dist * 40); // Sharp peak at joint
      } else if (law === 'linear') {
        stress += 25 * Math.sin(normX * Math.PI);
      } else if (law === 'exponential') {
        stress += 14 * Math.sin(normX * Math.PI);
      } else if (law === 'sigmoid') {
        stress += 8 * Math.sin(normX * Math.PI);
      }

      const normStress = Math.min(stress / 250, 1);
      const py = plotTop + plotHeight - (normStress * plotHeight);
      if (px === 0) ctx.moveTo(margin + px, py);
      else ctx.lineTo(margin + px, py);
    }
    ctx.stroke();

    // Legend
    ctx.font = '600 11px Plus Jakarta Sans';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('— V₁(x) Volume Fraction', margin + plotWidth - 190, plotTop + 18);
    ctx.fillStyle = '#fb7185';
    ctx.fillText('— σ_vM Stress Distribution', margin + plotWidth - 190, plotTop + 36);

    ctx.restore();
  }

  // --- Render Atwood Machine Simulation ---
  function renderAtwoodMode(w, h) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textBright = isDark ? '#f8fafc' : '#0f172a';

    const centerX = w / 2;
    const pulleyY = 85;
    const pulleyRadius = 45;

    // Draw Rig & Pulley Support
    ctx.save();
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, 15);
    ctx.lineTo(centerX, pulleyY);
    ctx.stroke();

    // Draw Pulley Wheel with Rotating Spokes
    ctx.translate(centerX, pulleyY);
    ctx.rotate(atwoodState.pulleyAngle);

    ctx.fillStyle = isDark ? '#1e293b' : '#cbd5e1';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, pulleyRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Spokes
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    for (let a = 0; a < 6; a++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(pulleyRadius * Math.cos(a * Math.PI / 3), pulleyRadius * Math.sin(a * Math.PI / 3));
      ctx.stroke();
    }

    // Center axle
    ctx.fillStyle = '#818cf8';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Rope Coordinates
    const x1 = centerX - pulleyRadius;
    const x2 = centerX + pulleyRadius;
    const y1 = pulleyY + atwoodState.y1;
    const y2 = pulleyY + atwoodState.y2;

    // Draw Suspension Ropes
    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;

    // Left rope
    ctx.beginPath();
    ctx.moveTo(x1, pulleyY);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Right rope
    ctx.beginPath();
    ctx.moveTo(x2, pulleyY);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw Hanging Mass Blocks
    const blockWidth = 55;
    const blockHeight1 = 30 + atwoodState.m1 * 3.5;
    const blockHeight2 = 30 + atwoodState.m2 * 3.5;

    // Mass 1 (Left Block)
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.fillRect(x1 - blockWidth / 2, y1, blockWidth, blockHeight1);
    ctx.strokeRect(x1 - blockWidth / 2, y1, blockWidth, blockHeight1);

    ctx.font = '700 12px JetBrains Mono';
    ctx.fillStyle = '#070b14';
    ctx.textAlign = 'center';
    ctx.fillText(`m₁=${atwoodState.m1}kg`, x1, y1 + blockHeight1 / 2 + 4);

    // Mass 2 (Right Block)
    ctx.fillStyle = '#818cf8';
    ctx.strokeStyle = '#4f46e5';
    ctx.fillRect(x2 - blockWidth / 2, y2, blockWidth, blockHeight2);
    ctx.strokeRect(x2 - blockWidth / 2, y2, blockWidth, blockHeight2);

    ctx.fillStyle = '#070b14';
    ctx.fillText(`m₂=${atwoodState.m2}kg`, x2, y2 + blockHeight2 / 2 + 4);

    // Dynamic Force Vectors (Arrows)
    if (atwoodState.acc !== 0) {
      drawArrow(ctx, x1, y1 - 10, x1, y1 - 40, '#2dd4bf', `T₁`);
      drawArrow(ctx, x2, y2 - 10, x2, y2 - 40, '#2dd4bf', `T₂`);
      const dir1 = atwoodState.acc < 0 ? 1 : -1;
      const dir2 = atwoodState.acc > 0 ? 1 : -1;
      drawArrow(ctx, x1 + blockWidth / 2 + 15, y1 + 10, x1 + blockWidth / 2 + 15, y1 + 10 + dir1 * 25, '#fbbf24', 'a');
      drawArrow(ctx, x2 + blockWidth / 2 + 15, y2 + 10, x2 + blockWidth / 2 + 15, y2 + 10 + dir2 * 25, '#fbbf24', 'a');
    }

    ctx.restore();
  }

  function drawArrow(ctx, fromx, fromy, tox, toy, color, label) {
    const headlen = 8;
    const angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.fill();

    if (label) {
      ctx.font = '600 11px JetBrains Mono';
      ctx.fillText(label, tox + 12, (fromy + toy) / 2);
    }
    ctx.restore();
  }

  // Atwood Physics Loop
  function atwoodLoop(timestamp) {
    if (!atwoodState.lastTime) atwoodState.lastTime = timestamp;
    const dt = Math.min((timestamp - atwoodState.lastTime) / 1000, 0.05);
    atwoodState.lastTime = timestamp;

    if (currentSimMode === 'atwood' && atwoodState.isRunning) {
      updateAtwoodParams();
      atwoodState.vel += atwoodState.acc * dt;

      // Displacement
      const dy = atwoodState.vel * dt * 45; // Pixel scale
      atwoodState.y1 -= dy;
      atwoodState.y2 += dy;
      atwoodState.pulleyAngle += (dy / 45);

      // Boundary limits (hits top or floor)
      if (atwoodState.y1 <= 20 || atwoodState.y2 >= 220 || atwoodState.y2 <= 20 || atwoodState.y1 >= 220) {
        atwoodState.isRunning = false;
        atwoodState.vel = 0;
        if (atwoodPlayBtn) {
          const icon = atwoodPlayBtn.querySelector('i');
          if (icon) icon.className = 'fas fa-play';
        }
      }

      drawSimulation();
    }

    animId = requestAnimationFrame(atwoodLoop);
  }

  // Initialize
  initTheme();
  updateFgmValues();
  updateAtwoodParams();
  setTimeout(resizeCanvas, 100);
  animId = requestAnimationFrame(atwoodLoop);

})();
