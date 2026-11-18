/**
 * After School Maktab Bangladesh
 * Main Interactive Engine
 * assets/js/main.js
 */

(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = $('#siteHeader');
  const nav = $('#mainNav');
  const toggle = $('#menuToggle');
  const scrollTopBtn = $('#scrollToTop');

  function closeMenu() {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'মেনু খুলুন');
    document.body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', () => {
    const opened = !nav.classList.contains('open');
    nav.classList.toggle('open', opened);
    toggle.classList.toggle('open', opened);
    toggle.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute('aria-label', opened ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');
    document.body.classList.toggle('menu-open', opened);
  });

  $$('.main-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeMenu();
  }, { passive: true });

  function scrollStatus() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 35);
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', scrollY > 380);
    }
  }
  scrollStatus();
  window.addEventListener('scroll', scrollStatus, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     Scroll Reveal & Section Intersection Engine
     ========================================================================== */
  if ('IntersectionObserver' in window && !reduced) {
    document.documentElement.classList.add('motion-ready');

    const appear = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 60px 0px' });

    const revealTargets = $$('.reveal, main section[id], .footer');
    revealTargets.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
        setTimeout(() => el.classList.add('visible'), 50);
      } else {
        appear.observe(el);
      }
    });

    const checkVisibleElements = () => {
      $$('.reveal:not(.visible), main section[id]:not(.visible), .footer:not(.visible)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 80 && r.bottom > -50) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', checkVisibleElements, { passive: true });
    window.addEventListener('resize', checkVisibleElements, { passive: true });

    const sections = $$('main section[id]');
    const sectionWatch = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          $$('.main-nav a[href^="#"]').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach(s => sectionWatch.observe(s));
  } else {
    $$('.reveal, main section[id]').forEach(e => e.classList.add('visible'));
  }

  // Fallback for missing/slow images
  $$('.photo-fallback img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      img.closest('.photo-fallback')?.classList.add('asset-unavailable');
    });
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
    }
  });

  /* ==========================================================================
     03 / Five Foundations (Pillars) Tab & Auto-Rotation System
     ========================================================================== */
  const pillars = [
    { en: 'FOUNDATION ONE', ar: 'القرآن', title: 'কুরআন', description: 'বিশুদ্ধভাবে কুরআন তিলাওয়াত, নির্বাচিত সূরা ও কুরআনিক শিক্ষার নিয়মিত অনুশীলন।', tags: ['বিশুদ্ধ তিলাওয়াত', 'নির্বাচিত সূরা', 'নিয়মিত অনুশীলন'] },
    { en: 'FOUNDATION TWO', ar: 'السنة', title: 'সুন্নাহ', description: 'দৈনন্দিন জীবনের সুন্নাহসম্মত আমল, মাসনুন দোয়া ও প্রয়োজনীয় হাদিস সম্পর্কে শেখা।', tags: ['সুন্নাহর অনুশীলন', 'মাসনুন দোয়া', 'নির্বাচিত হাদিস'] },
    { en: 'FOUNDATION THREE', ar: 'العقيدة', title: 'ইসলামী আকিদা', description: 'তাওহীদ, রিসালাত, আখেরাত এবং ইসলামের মৌলিক বিশ্বাস সম্পর্কে বয়সোপযোগী পরিচিতি।', tags: ['তাওহীদ', 'রিসালাত', 'আখেরাত'] },
    { en: 'FOUNDATION FOUR', ar: 'الفقه', title: 'ফিকহ', description: 'তাহারাত, সালাত এবং দৈনন্দিন জীবনে প্রয়োজনীয় ইবাদত-সংক্রান্ত মাসায়েলের ব্যবহারিক পরিচিতি।', tags: ['তাহারাত', 'সালাত শিক্ষা', 'ইবাদতের প্রয়োজনীয় জ্ঞান'] },
    { en: 'FOUNDATION FIVE', ar: 'الأদব', title: 'ইসলামী শিষ্টাচার', description: 'উত্তম আচরণ, আদব-আখলাক ও দৈনন্দিন জীবনে ইসলামী মূল্যবোধ চর্চার শিক্ষা।', tags: ['উত্তম আচরণ', 'আদব-আখলাক', 'ইসলামী মূল্যবোধ'] }
  ];

  const pillarButtons = $$('.pillar-tab');
  let currentPillarIndex = 0;

  function choosePillar(n, focus = false) {
    const d = pillars[n];
    if (!d) return;
    currentPillarIndex = n;
    pillarButtons.forEach((b, i) => {
      b.classList.toggle('active', i === n);
      b.setAttribute('aria-selected', String(i === n));
      b.tabIndex = i === n ? 0 : -1;
    });

    const pTop = $('.pillar-panel-top');
    const pArt = $('.pillar-art');
    const pContent = $('.pillar-content');
    [pTop, pArt, pContent].forEach(el => {
      if (el) {
        el.classList.remove('content-swapping');
        void el.offsetWidth;
        el.classList.add('content-swapping');
      }
    });

    $('#pillarEn').textContent = d.en;
    $('#pillarCounter').textContent = String(n + 1).padStart(2, '0') + ' / 05';
    $('#pillarArabic').textContent = d.ar;
    $('#pillarTitle').textContent = d.title;
    $('#pillarDescription').textContent = d.description;
    $('#pillarDetail').replaceChildren(...d.tags.map(t => {
      const s = document.createElement('span');
      s.textContent = t;
      return s;
    }));
    $('#pillarPanel').setAttribute('aria-labelledby', 'pillarTab' + n);
    if (focus) pillarButtons[n].focus();
  }

  let pillarInterval = null;
  let pillarHovered = false;
  let pillarInView = false;

  function startPillarAuto() {
    if (pillarInterval) clearInterval(pillarInterval);
    pillarInterval = setInterval(() => {
      const pillarsSec = $('#pillars');
      const isFocusedInside = pillarsSec && pillarsSec.contains(document.activeElement);
      if (!pillarHovered && pillarInView && !document.hidden && !isFocusedInside) {
        currentPillarIndex = (currentPillarIndex + 1) % pillars.length;
        choosePillar(currentPillarIndex);
      }
    }, 4200);
  }

  pillarButtons.forEach((b, i) => {
    b.addEventListener('click', () => {
      choosePillar(i);
      startPillarAuto();
    });
    b.addEventListener('keydown', e => {
      let next = null;
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) next = (i + 1) % pillars.length;
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) next = (i + pillars.length - 1) % pillars.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = pillars.length - 1;
      if (next !== null) {
        e.preventDefault();
        choosePillar(next, true);
        startPillarAuto();
      }
    });
  });

  const pillarStage = $('.pillars-stage');
  if (pillarStage) {
    pillarStage.addEventListener('mouseenter', () => { pillarHovered = true; });
    pillarStage.addEventListener('mouseleave', () => { pillarHovered = false; });
    pillarStage.addEventListener('touchstart', () => { pillarHovered = true; }, { passive: true });
    pillarStage.addEventListener('touchend', () => {
      setTimeout(() => { pillarHovered = false; }, 2500);
    }, { passive: true });
  }

  const pillarsSection = $('#pillars');
  if (pillarsSection && 'IntersectionObserver' in window) {
    const pillarObs = new IntersectionObserver(entries => {
      pillarInView = entries[0].isIntersecting;
    }, { threshold: 0.12 });
    pillarObs.observe(pillarsSection);
  } else {
    pillarInView = true;
  }
  startPillarAuto();

  /* ==========================================================================
     04 / Educational Programs Tab & Auto-Rotation System (Using Local Images)
     ========================================================================== */
  const programs = [
    {
      title: 'আফটার স্কুল মাকতাব',
      description: 'স্কুলগামী শিশু-কিশোরদের নিয়মিত পড়াশোনার পাশাপাশি কুরআন, সুন্নাহ, আকিদা, ফিকহ ও ইসলামী আদব-আখলাক শেখার পরিকল্পিত শিক্ষা বিভাগ।',
      img: 'assets/images/program-maktab.jpg',
      alt: 'প্রতিনিধিত্বমূলক আলোকচিত্র: শিশুদের কুরআন শিক্ষা—এটি প্রতিষ্ঠানের নিজস্ব ছবি নয়'
    },
    {
      title: 'আফটার স্কুল হিফজ',
      description: 'কুরআন হিফজে আগ্রহী এবং উপযোগী হিসেবে বিবেচিত শিক্ষার্থীদের জন্য প্রচারপত্রে উল্লিখিত বিভাগ। ভর্তি যোগ্যতা ও কার্যক্রমের বিস্তারিত জানতে যোগাযোগ করুন।',
      img: 'assets/images/program-hifz.jpg',
      alt: 'প্রতিনিধিত্বমূলক আলোকচিত্র: কুরআন পাঠে মনোযোগী শিশু—এটি প্রতিষ্ঠানের নিজস্ব ছবি নয়'
    },
    {
      title: 'ফরজে আইন মাকতাব',
      description: 'যুবক ও বয়স্ক পুরুষদের কুরআন এবং দৈনন্দিন জীবনে প্রয়োজনীয় মৌলিক দ্বীনি জ্ঞান শেখার জন্য উল্লেখিত বিভাগ। কার্যক্রমের বর্তমান অবস্থা নিশ্চিত করুন।',
      img: 'assets/images/program-farze-ain.jpg',
      alt: 'প্রতিনিধিত্বমূলক আলোকচিত্র: পাঠদান ও শিক্ষার্থী—প্রতিষ্ঠানের নিজস্ব ছবি নয়'
    },
    {
      title: 'মাসুরাত মাকতাব',
      description: 'প্রাতিষ্ঠানিক প্রচারপত্রে উল্লেখিত পৃথক শিক্ষাবিভাগ। এই বিভাগের নির্দিষ্ট উদ্দেশ্য, পাঠ্যসূচি ও চলমান কার্যক্রমের বিস্তারিত প্রতিষ্ঠানের কাছ থেকে নিশ্চিত করুন।',
      img: 'assets/images/program-masurat.jpg',
      alt: 'প্রতিনিধিত্বমূলক আলোকচিত্র: ইসলামী শিক্ষার বই—প্রতিষ্ঠানের নিজস্ব ছবি নয়'
    },
    {
      title: 'প্রি-মাকতাব',
      description: 'প্রায় চার থেকে পাঁচ বছর বয়সী ছোট শিশুদের জন্য প্রাথমিক পর্যায়ের শিক্ষাবিভাগ হিসেবে উল্লেখিত। বয়সসীমা, ভর্তি ও বর্তমান ব্যাচ সম্পর্কে যোগাযোগ করুন।',
      img: 'assets/images/program-pre-maktab.jpg',
      alt: 'প্রতিনিধিত্বমূলক আলোকচিত্র: শিশু কুরআন পড়ছে—প্রতিষ্ঠানের নিজস্ব ছবি নয়'
    }
  ];

  const choices = $$('.program-choice');
  const programImage = $('#programImage');
  let currentProgramIndex = 0;

  function chooseProgram(n) {
    const d = programs[n];
    if (!d) return;
    currentProgramIndex = n;
    choices.forEach((b, i) => {
      b.classList.toggle('selected', i === n);
      b.setAttribute('aria-pressed', String(i === n));
    });

    const pCopy = $('.program-feature-copy');
    if (pCopy) {
      pCopy.classList.remove('content-swapping');
      void pCopy.offsetWidth;
      pCopy.classList.add('content-swapping');
    }

    $('#programIndex').textContent = String(n + 1).padStart(2, '0');
    $('#programTitle').textContent = d.title;
    $('#programDesc').textContent = d.description;

    if (programImage) {
      programImage.classList.add('img-swapping');
      setTimeout(() => {
        programImage.style.display = 'block';
        programImage.src = d.img;
        programImage.alt = d.alt;
        if (programImage.complete && programImage.naturalWidth === 0) {
          programImage.style.display = 'none';
        }
        programImage.classList.remove('img-swapping');
      }, 120);
    }
  }

  let programInterval = null;
  let programHovered = false;
  let programInView = false;

  function startProgramAuto() {
    if (programInterval) clearInterval(programInterval);
    programInterval = setInterval(() => {
      const progsSec = $('#programs');
      const isFocusedInside = progsSec && progsSec.contains(document.activeElement);
      if (!programHovered && programInView && !document.hidden && !isFocusedInside) {
        currentProgramIndex = (currentProgramIndex + 1) % programs.length;
        chooseProgram(currentProgramIndex);
      }
    }, 4600);
  }

  choices.forEach((b, i) => {
    b.addEventListener('click', () => {
      chooseProgram(i);
      startProgramAuto();
    });
  });

  $$('[data-footer-program]').forEach(a => {
    a.addEventListener('click', (e) => {
      const idx = Number(a.dataset.footerProgram);
      const targetCard = document.getElementById('program-' + idx);
      if (targetCard) {
        e.preventDefault();
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
        targetCard.style.borderColor = '#c9a76d';
        targetCard.style.boxShadow = '0 0 0 3px rgba(168, 135, 91, 0.4)';
        setTimeout(() => {
          targetCard.style.borderColor = '';
          targetCard.style.boxShadow = '';
        }, 2200);
      } else {
        chooseProgram(idx);
      }
    });
  });

  const programShell = $('.program-shell');
  if (programShell) {
    programShell.addEventListener('mouseenter', () => { programHovered = true; });
    programShell.addEventListener('mouseleave', () => { programHovered = false; });
    programShell.addEventListener('touchstart', () => { programHovered = true; }, { passive: true });
    programShell.addEventListener('touchend', () => {
      setTimeout(() => { programHovered = false; }, 2500);
    }, { passive: true });
  }

  const programsSection = $('#programs');
  if (programsSection && 'IntersectionObserver' in window) {
    const progObs = new IntersectionObserver(entries => {
      programInView = entries[0].isIntersecting;
    }, { threshold: 0.12 });
    progObs.observe(programsSection);
  } else {
    programInView = true;
  }
  startProgramAuto();

  /* ==========================================================================
     Contact Form & WhatsApp Direct Dispatch
     ========================================================================== */
  const form = $('#contactForm');
  const status = $('#formStatus');
  const fallback = $('#whatsappFallback');

  const normDigits = s =>
    String(s)
      .replace(/[০-৯]/g, ch => String(ch.charCodeAt(0) - 0x09E6))
      .replace(/[٠-٩]/g, ch => String(ch.charCodeAt(0) - 0x0660));

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      fallback.hidden = true;
      status.classList.remove('error');

      const name = form.elements.name.value.trim();
      const phone = normDigits(form.elements.phone.value).replace(/[\s()-]/g, '');
      const program = form.elements.program.value;
      const message = form.elements.message.value.trim();

      if (name.length < 2) {
        status.textContent = 'অনুগ্রহ করে আপনার নাম লিখুন।';
        status.classList.add('error');
        form.elements.name.focus();
        return;
      }
      if (!/^(?:\+?88)?01\d{9}$/.test(phone)) {
        status.textContent = 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।';
        status.classList.add('error');
        form.elements.phone.focus();
        return;
      }
      if (!program) {
        status.textContent = 'আপনার আগ্রহের বিষয় নির্বাচন করুন।';
        status.classList.add('error');
        form.elements.program.focus();
        return;
      }
      if (message.length < 5) {
        status.textContent = 'আপনার প্রশ্ন বা বার্তা একটু বিস্তারিত লিখুন।';
        status.classList.add('error');
        form.elements.message.focus();
        return;
      }

      const msg = `আসসালামু আলাইকুম। আফটার স্কুল মাকতাব বাংলাদেশ সম্পর্কে জানতে চাই。\n\nনাম: ${name}\nমোবাইল: ${phone}\nবিষয়: ${program}\nবার্তা: ${message}`;
      const url = 'https://wa.me/8801942079507?text=' + encodeURIComponent(msg);
      fallback.href = url;
      fallback.hidden = false;
      status.textContent = 'আপনার মেসেজ প্রস্তুত। WhatsApp-এ খুলে Send চাপলে বার্তাটি পাঠানো হবে।';

      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        status.textContent += ' নিচের লিংকটি ব্যবহার করুন।';
      }
    });
  }

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
