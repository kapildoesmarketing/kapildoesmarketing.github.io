/* Kapil Pidhwani (kapilpidhwani.in) — Shared Modular Multi-Page Script */
(function () {
  const root = document.documentElement;
  const navItems = document.querySelectorAll('[data-nav-item]');
  const navTriggers = document.querySelectorAll('[data-nav-trigger]');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResultsEl = document.getElementById('search-results');
  const openSearchBtns = document.querySelectorAll('[data-open-search]');
  const closeSearchBtns = document.querySelectorAll('[data-close-search]');
  const qrModal = document.getElementById('qr-modal');
  const openQrBtns = document.querySelectorAll('[data-open-qr]');
  const closeQrBtns = document.querySelectorAll('[data-close-qr]');
  const vcardBtn = document.querySelector('[data-download-vcard]');
  const vcardContactBtn = document.querySelector('[data-download-vcard-contact]');
  const copyEmailBtns = document.querySelectorAll('[data-copy-email]');
  const backToTopBtns = document.querySelectorAll('[data-back-to-top]');
  const workFilterBtns = document.querySelectorAll('[data-work-filter]');
  const workSortBtns = document.querySelectorAll('[data-work-sort]');
  const workResetBtns = document.querySelectorAll('[data-work-reset]');
  const workGrid = document.getElementById('work-projects-grid');
  const workEmptyState = document.getElementById('work-empty-state');
  const workCards = document.querySelectorAll('[data-work-cat]');

  root.setAttribute('data-sf-theme', 'dark');
  try {
    localStorage.removeItem('sf_theme');
  } catch (e) {}

  /* Deisgned by Kapil Pidhwani: Multi-page route metadata & legacy hash redirect router (ceiling: static physical HTML routes; upgrade path: none needed). */
  const routeMeta = {
    home: { path: '/' },
    about: { path: '/about/' },
    work: { path: '/work/' },
    links: { path: '/links/' },
    playbooks: { path: '/playbooks/' },
    contact: { path: '/contact/' }
  };

  function getActiveViewKey() {
    const viewEl = document.querySelector('[data-page-view]');
    return viewEl ? (viewEl.getAttribute('data-page-view') || 'home') : 'home';
  }

  function handleLegacyHashRedirect() {
    const hashKey = (window.location.hash || '').replace(/^#/, '').toLowerCase();
    if (routeMeta[hashKey]) {
      if (getActiveViewKey() !== hashKey) {
        window.location.replace(routeMeta[hashKey].path);
        return true;
      }
    }
    return false;
  }

  if (handleLegacyHashRedirect()) {
    return;
  }

  window.addEventListener('hashchange', handleLegacyHashRedirect);

  function navigateToRoute(routeKey) {
    const normalized = (routeKey || 'home').replace(/^#|^\/+|\/+$/g, '').toLowerCase() || 'home';
    const meta = routeMeta[normalized] || routeMeta.home;
    if (getActiveViewKey() === normalized) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.href = meta.path;
  }

  // Allow native browser link navigation across pages; only intercept same-page clicks or button triggers
  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = (item.getAttribute('data-nav-route') || 'home').toLowerCase();
      if (getActiveViewKey() === target && !document.getElementById('view-subpage')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  navTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = trigger.getAttribute('href');
      const target = (trigger.getAttribute('data-nav-trigger') || 'home').toLowerCase();
      if (!href) {
        e.preventDefault();
        navigateToRoute(target);
      } else if (getActiveViewKey() === target && !document.getElementById('view-subpage')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  /* Deisgned by Kapil Pidhwani: Yearly + category-priority Featured sort (ceiling: client DOM appendChild over <50 cards; upgrade path: virtualized list if >200 cards). */
  const workCatRank = { transformations: 1, events: 2, solutions: 3 };

  function updateWorkEmptyState() {
    if (!workEmptyState) return;
    let visibleCount = 0;
    workCards.forEach(function (card) {
      if (!card.hidden) visibleCount += 1;
    });
    workEmptyState.hidden = visibleCount > 0;
  }

  function sortWorkCards(mode) {
    if (!workGrid) return;
    const cardsArr = Array.from(workGrid.querySelectorAll('[data-work-cat]'));
    cardsArr.sort(function (a, b) {
      const titleA = (a.getAttribute('data-work-title') || '').toLowerCase();
      const titleB = (b.getAttribute('data-work-title') || '').toLowerCase();
      if (mode === 'az') return titleA.localeCompare(titleB);
      if (mode === 'za') return titleB.localeCompare(titleA);
      const yearA = parseInt(a.getAttribute('data-work-year') || '0', 10);
      const yearB = parseInt(b.getAttribute('data-work-year') || '0', 10);
      if (yearB !== yearA) return yearB - yearA;
      const rankA = workCatRank[a.getAttribute('data-work-cat') || ''] || 99;
      const rankB = workCatRank[b.getAttribute('data-work-cat') || ''] || 99;
      if (rankA !== rankB) return rankA - rankB;
      const orderA = parseInt(a.getAttribute('data-work-order') || '0', 10);
      const orderB = parseInt(b.getAttribute('data-work-order') || '0', 10);
      return orderA - orderB;
    });
    cardsArr.forEach(function (card) {
      workGrid.appendChild(card);
    });
  }

  workFilterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const cat = btn.getAttribute('data-work-filter') || 'all';
      workFilterBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      workCards.forEach(function (card) {
        const match = cat === 'all' || card.getAttribute('data-work-cat') === cat;
        card.hidden = !match;
      });
      if (cat === 'all') {
        const featuredBtn = document.querySelector('[data-work-sort="featured"]');
        if (featuredBtn) {
          workSortBtns.forEach(function (b) {
            b.classList.toggle('is-active', b === featuredBtn);
          });
        }
        sortWorkCards('featured');
      }
      updateWorkEmptyState();
    });
  });

  workResetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const allBtn = document.querySelector('[data-work-filter="all"]');
      if (allBtn) allBtn.click();
    });
  });

  workSortBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const mode = btn.getAttribute('data-work-sort') || 'featured';
      workSortBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      sortWorkCards(mode);
    });
  });

  sortWorkCards('featured');

  // Playbooks Page: Category Filter Control (consistent with Work page)
  const pbFilterBtns = document.querySelectorAll('[data-pb-filter]');
  const pbFilterCards = document.querySelectorAll('[data-pb-cat]');
  pbFilterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const cat = btn.getAttribute('data-pb-filter') || 'all';
      pbFilterBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      pbFilterCards.forEach(function (card) {
        const match = cat === 'all' || card.getAttribute('data-pb-cat') === cat;
        card.hidden = !match;
      });
    });
  });

  // Project pages: full-screen Sankey modal on touch widths
  const sankeyModal = document.getElementById('sankey-modal');
  document.querySelectorAll('[data-open-sankey]').forEach(function (btn) {
    if (btn.classList.contains('sf-sankey-bare-canvas') && window.innerWidth > 1023) {
      btn.removeAttribute('role');
      btn.removeAttribute('tabindex');
      btn.removeAttribute('aria-label');
    }
    function openSankey() {
      if (btn.classList.contains('sf-sankey-bare-canvas') && window.innerWidth > 1023) return;
      if (sankeyModal) sankeyModal.hidden = false;
    }
    btn.addEventListener('click', openSankey);
    btn.addEventListener('keydown', function (e) {
      if (btn.tagName !== 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openSankey();
      }
    });
  });
  document.querySelectorAll('[data-close-sankey]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (sankeyModal) sankeyModal.hidden = true;
    });
  });

  // Full-resolution image lightbox (loads the 2752w master only on open)
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.sf-lightbox-img') : null;
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.removeAttribute('src');
    document.documentElement.classList.remove('sf-lightbox-open');
  }
  document.querySelectorAll('[data-open-lightbox]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!lightbox || !lightboxImg) return;
      const src = btn.getAttribute('data-open-lightbox');
      const img = btn.parentElement ? btn.parentElement.querySelector('img') : null;
      lightboxImg.alt = img ? (img.getAttribute('alt') || '') : '';
      lightboxImg.src = src;
      lightbox.hidden = false;
      document.documentElement.classList.add('sf-lightbox-open');
    });
  });
  document.querySelectorAll('[data-close-lightbox]').forEach(function (btn) {
    btn.addEventListener('click', closeLightbox);
  });

  /* Deisgned by Kapil Pidhwani: cursor torch (ceiling: one rAF loop per page; upgrade path: pause when tab hidden). */
  (function initTorch() {
    const light = document.querySelector('.sf-cursor-light');
    if (!light || !window.matchMedia('(hover: hover)').matches) return;
    let tx = window.innerWidth * 0.5, ty = window.innerHeight * 0.2, x = tx, y = ty;
    window.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function tick() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      light.style.setProperty('--sx', x + 'px');
      light.style.setProperty('--sy', y + 'px');
      window.requestAnimationFrame(tick);
    })();
  })();

  // Floating Back to Top button (appears on scroll in bottom-right corner)
  function updateBackToTopVisibility() {
    const show = (window.scrollY || window.pageYOffset || 0) > 220;
    backToTopBtns.forEach(function (btn) {
      btn.classList.toggle('is-visible', show);
    });
  }

  backToTopBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();

  // Interactive Executive TL;DR Sankey Hover Highlighting on Project Subpages
  const sankeySvgs = document.querySelectorAll('[data-sankey-svg]');
  sankeySvgs.forEach(function (svg) {
    const nodes = svg.querySelectorAll('.sf-sk-node');
    const flows = svg.querySelectorAll('.sf-sk-flow');
    function clearHighlight() {
      svg.classList.remove('is-hovering');
      nodes.forEach(function (n) { n.classList.remove('is-active'); });
      flows.forEach(function (f) { f.classList.remove('is-active'); });
    }
    nodes.forEach(function (node) {
      node.addEventListener('mouseenter', function () {
        const id = node.getAttribute('data-node-id');
        svg.classList.add('is-hovering');
        const activeNodes = new Set([id]);
        flows.forEach(function (f) {
          const fromId = f.getAttribute('data-from');
          const toId = f.getAttribute('data-to');
          if (fromId === id || toId === id) {
            f.classList.add('is-active');
            activeNodes.add(fromId);
            activeNodes.add(toId);
          } else {
            f.classList.remove('is-active');
          }
        });
        nodes.forEach(function (n) {
          n.classList.toggle('is-active', activeNodes.has(n.getAttribute('data-node-id')));
        });
      });
      node.addEventListener('mouseleave', clearHighlight);
    });
    flows.forEach(function (flow) {
      flow.addEventListener('mouseenter', function () {
        const fromId = flow.getAttribute('data-from');
        const toId = flow.getAttribute('data-to');
        svg.classList.add('is-hovering');
        flows.forEach(function (f) {
          f.classList.toggle('is-active', f === flow);
        });
        nodes.forEach(function (n) {
          const nid = n.getAttribute('data-node-id');
          n.classList.toggle('is-active', nid === fromId || nid === toId);
        });
      });
      flow.addEventListener('mouseleave', clearHighlight);
    });
  });

  // Networking Utility 1: Download vCard (.vcf) without phone number (kept private)
  function triggerVcardDownload() {
    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Pidhwani;Kapil;;;',
      'FN:Kapil Pidhwani',
      'TITLE:Revenue Strategy, BizOps & AI',
      'EMAIL;TYPE=INTERNET,WORK:kapildoesmarketing@gmail.com',
      'URL:https://kapilpidhwani.in',
      'ITEM1.URL:https://www.linkedin.com/in/kapilpidhwani/',
      'ITEM1.X-ABLabel:LinkedIn',
      'ITEM2.URL:https://github.com/kapildoesmarketing',
      'ITEM2.X-ABLabel:GitHub',
      'ADR;TYPE=WORK:;;Gurgaon;Haryana;;India',
      'NOTE:Revenue Strategy, BizOps & AI - Strategies & solutions that unlock revenue.',
      'END:VCARD'
    ].join('\r\n');
    const blob = new Blob([vcardLines], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kapil_Pidhwani.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  if (vcardBtn) {
    vcardBtn.addEventListener('click', triggerVcardDownload);
  }
  if (vcardContactBtn) {
    vcardContactBtn.addEventListener('click', triggerVcardDownload);
  }

  /* Deisgned by Kapil Pidhwani: 5-second auto-advancing Playbooks Slideshow with scroll-snap sync and hover pause (ceiling: DOM scrollTo; upgrade path: none needed). */
  const pbCarousel = document.getElementById('pb-carousel');
  const pbViewport = document.getElementById('pb-viewport');
  const pbSlides = document.querySelectorAll('[data-pb-slide]');
  const pbDots = document.querySelectorAll('[data-pb-dot]');
  const pbCounter = document.getElementById('pb-slide-counter');
  const pbPrevBtn = document.getElementById('pb-prev-btn');
  const pbNextBtn = document.getElementById('pb-next-btn');
  let pbCurrentIndex = 0;
  let pbTimer = null;
  let pbIsPaused = false;
  const PB_INTERVAL_MS = 5000;

  function updatePbUi(index) {
    const total = pbSlides.length || 1;
    pbCurrentIndex = ((index % total) + total) % total;
    if (pbCounter) {
      const numStr = pbCurrentIndex + 1 < 10 ? '0' + (pbCurrentIndex + 1) : String(pbCurrentIndex + 1);
      const totStr = total < 10 ? '0' + total : String(total);
      pbCounter.textContent = numStr + ' / ' + totStr + ' \u00b7 Auto-advances every 5s';
    }
    pbDots.forEach(function (dot, i) {
      dot.classList.remove('is-active');
      void dot.offsetWidth;
      if (i === pbCurrentIndex) {
        dot.classList.add('is-active');
      }
    });
  }

  function goToPbSlide(index) {
    if (!pbViewport || !pbSlides.length) return;
    const total = pbSlides.length;
    const targetIdx = ((index % total) + total) % total;
    updatePbUi(targetIdx);
    const slideWidth = pbViewport.clientWidth || 0;
    if (slideWidth > 0) {
      pbViewport.scrollTo({ left: targetIdx * slideWidth, behavior: 'smooth' });
    }
  }

  function startPbAutoplay() {
    stopPbAutoplay();
    if (!pbSlides.length) return;
    pbTimer = window.setInterval(function () {
      if (!pbIsPaused && !document.hidden) {
        goToPbSlide(pbCurrentIndex + 1);
      }
    }, PB_INTERVAL_MS);
  }

  function stopPbAutoplay() {
    if (pbTimer) {
      window.clearInterval(pbTimer);
      pbTimer = null;
    }
  }

  if (pbPrevBtn) {
    pbPrevBtn.addEventListener('click', function () {
      goToPbSlide(pbCurrentIndex - 1);
      startPbAutoplay();
    });
  }

  if (pbNextBtn) {
    pbNextBtn.addEventListener('click', function () {
      goToPbSlide(pbCurrentIndex + 1);
      startPbAutoplay();
    });
  }

  pbDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const idx = parseInt(dot.getAttribute('data-pb-dot') || '0', 10);
      goToPbSlide(idx);
      startPbAutoplay();
    });
  });

  if (pbCarousel) {
    pbCarousel.addEventListener('mouseenter', function () { pbIsPaused = true; });
    pbCarousel.addEventListener('mouseleave', function () { pbIsPaused = false; });
    pbCarousel.addEventListener('touchstart', function () { pbIsPaused = true; }, { passive: true });
    pbCarousel.addEventListener('touchend', function () { pbIsPaused = false; }, { passive: true });
  }

  if (pbViewport) {
    let scrollDebounce = null;
    pbViewport.addEventListener('scroll', function () {
      if (scrollDebounce) window.clearTimeout(scrollDebounce);
      scrollDebounce = window.setTimeout(function () {
        const w = pbViewport.clientWidth || 1;
        const approxIdx = Math.round(pbViewport.scrollLeft / w);
        if (approxIdx !== pbCurrentIndex && approxIdx >= 0 && approxIdx < pbSlides.length) {
          updatePbUi(approxIdx);
        }
      }, 120);
    }, { passive: true });
  }

  startPbAutoplay();

  // Contact Page: Topic Selector Pills, Inquiry Form Dispatch & FAQ Accordion
  const topicPills = document.querySelectorAll('[data-contact-topic]');
  let selectedContactTopic = 'Strategy & BizOps';
  topicPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      selectedContactTopic = pill.getAttribute('data-contact-topic') || 'Leadership / General';
      topicPills.forEach(function (p) {
        p.classList.toggle('is-active', p === pill);
      });
    });
  });

  // Deisgned by Kapil Pidhwani: Direct client-side POST to Google Forms /formResponse (no-cors URLSearchParams) with mailto fallback if blocked by browser privacy extensions.
  const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd_odUFhJwo3BbW0iD2QuptJ-LI1BYPJJGP7jt9sGUJu1HjYQ/formResponse';
  const GOOGLE_FORM_FIELDS = {
    name: 'entry.2053400866',
    email: 'entry.1429894223',
    topic: 'entry.39421880',
    message: 'entry.350208973'
  };

  const contactForm = document.getElementById('contact-inquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const msgInput = document.getElementById('contact-message');
      const submitBtn = document.getElementById('contact-submit-btn');
      const submitLabel = document.getElementById('contact-submit-label');
      const statusEl = document.getElementById('contact-form-status');

      const nameVal = (nameInput ? nameInput.value : '').trim();
      const emailVal = (emailInput ? emailInput.value : '').trim();
      const msgVal = (msgInput ? msgInput.value : '').trim();
      if (!nameVal || !emailVal || !msgVal) return;

      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Sending...';
      if (statusEl) statusEl.textContent = 'Submitting your message...';

      const payload = new URLSearchParams();
      payload.append(GOOGLE_FORM_FIELDS.name, nameVal);
      payload.append(GOOGLE_FORM_FIELDS.email, emailVal);
      payload.append(GOOGLE_FORM_FIELDS.topic, selectedContactTopic);
      payload.append(GOOGLE_FORM_FIELDS.message, msgVal);

      fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload
      }).then(function () {
        if (submitLabel) submitLabel.textContent = 'Message sent \u2713';
        if (statusEl) {
          statusEl.textContent = 'Thanks \u00b7 Your message was received. I\u2019ll reply within one business day.';
        }
        contactForm.reset();
        setTimeout(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (submitLabel) submitLabel.textContent = 'Send message';
        }, 4000);
      }).catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = 'Message prepared \u2713';
        if (statusEl) statusEl.textContent = 'Opening email draft to kapildoesmarketing@gmail.com...';
        const subject = encodeURIComponent('[' + selectedContactTopic + '] Message from ' + nameVal);
        const body = encodeURIComponent(
          'Hi Kapil,\n\n' +
          msgVal + '\n\n' +
          '---\n' +
          'Name: ' + nameVal + '\n' +
          'Email: ' + emailVal + '\n' +
          'Topic: ' + selectedContactTopic
        );
        window.location.href = 'mailto:kapildoesmarketing@gmail.com?subject=' + subject + '&body=' + body;
      });
    });
  }

  const faqItems = document.querySelectorAll('#contact-faq-list .sf-faq-item');
  faqItems.forEach(function (item) {
    const trigger = item.querySelector('.sf-faq-trigger');
    const body = item.querySelector('.sf-faq-body');
    if (!item.classList.contains('is-open') && body) {
      body.hidden = true;
    }
    if (trigger && body) {
      trigger.addEventListener('click', function () {
        const isOpen = item.classList.contains('is-open');
        item.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        body.hidden = isOpen;
      });
    }
  });

  // Networking Utility 2: 1-Click Copy Email across all buttons (Links + Footer)
  copyEmailBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const email = btn.getAttribute('data-copy-email') || 'kapildoesmarketing@gmail.com';
      const labelEl = btn.querySelector('[data-copy-email-label]');
      const defaultText = labelEl ? labelEl.textContent : 'Copy email';
      function showCopied() {
        btn.classList.add('is-copied');
        if (labelEl) labelEl.textContent = 'Copied email';
        setTimeout(function () {
          btn.classList.remove('is-copied');
          if (labelEl) labelEl.textContent = defaultText;
        }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied).catch(showCopied);
      } else {
        showCopied();
      }
    });
  });

  // Networking Utility 3: QR Code Modal
  function openQr() {
    if (!qrModal) return;
    qrModal.hidden = false;
  }

  function closeQr() {
    if (!qrModal) return;
    qrModal.hidden = true;
  }

  openQrBtns.forEach(function (btn) {
    btn.addEventListener('click', openQr);
  });

  closeQrBtns.forEach(function (btn) {
    btn.addEventListener('click', closeQr);
  });

  document.querySelectorAll('[data-share-qr]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const shareUrl = btn.getAttribute('data-share-qr') || 'https://kapilpidhwani.in/links/';
      const labelEl = btn.querySelector('[data-share-qr-label]');
      const defaultText = labelEl ? labelEl.textContent : 'Share link';
      function showCopiedLink() {
        if (labelEl) labelEl.textContent = 'Copied link \u2713';
        setTimeout(function () {
          if (labelEl) labelEl.textContent = defaultText;
        }, 2000);
      }
      if (navigator.share) {
        navigator.share({
          title: 'Kapil Pidhwani - Links',
          url: shareUrl
        }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(showCopiedLink).catch(showCopiedLink);
      } else {
        showCopiedLink();
      }
    });
  });

  /* Deisgned by Kapil Pidhwani: Zero-dependency Command Palette Search (ceiling: in-memory array filter; upgrade path: JSON search index if site exceeds 100 pages). */
  const searchCatalog = [
    { title: 'Home', sub: 'Strategies & solutions that unlock revenue', badge: 'Page', route: 'home' },
    { title: 'About Kapil Pidhwani', sub: 'Google, Amazon, ACCA, Experience & Tools', badge: 'Page', route: 'about' },
    { title: 'Selected Work', sub: 'Transformations, Flagship Events & Solutions', badge: 'Page', route: 'work' },
    { title: 'Playbooks & Presentations', sub: 'Interactive HTML slide decks & AI prompt libraries', badge: 'Page', route: 'playbooks' },
    { title: 'Links & Networking Hub', sub: 'Connect on LinkedIn, Save Contact, Copy Email & QR', badge: 'Page', route: 'links' },
    { title: 'Contact', sub: 'Leadership, speaking, AI systems or strategy exchange', badge: 'Page', route: 'contact' },
    { title: 'Playbook 01: Fix Your LinkedIn Profile in 15 Steps', sub: '12 interactive slides, 15-point checklist & 5 AI prompts', badge: 'Playbook', url: '/playbooks/linkedin-profile-playbook/' },
    { title: 'Amazon Rufus Rollout (Project Page)', sub: 'Zero-to-one rollout of Amazon Rufus AI to US childcare sellers', badge: 'Transformation', url: '/work/amazon-rufus-rollout/' },
    { title: 'ACCA Onboarding Redesign (Project Page)', sub: 'Eight-week new-hire programme rebuilt into four; QA 60 to 85+', badge: 'Transformation', url: '/work/onboarding-redesign/' },
    { title: 'Google Think Travel (Project Page)', sub: 'Google India flagship summit for travel & hospitality leaders', badge: 'Event', url: '/work/think-travel-2026/' },
    { title: 'Fundingly.in (Project Page)', sub: 'Indian startup funding intelligence tracker & video engine', badge: 'Solution', url: '/work/fundingly/' },
    { title: 'Toolity.in (Project Page)', sub: 'Suite of zero-bloat web utilities for marketers & operators', badge: 'Solution', url: '/work/toolity/' },
    { title: 'Privacy Policy', sub: 'Data privacy & analytics policy for kapilpidhwani.in', badge: 'Legal', url: '/privacy-policy/' },
    { title: 'Terms of Service', sub: 'Website usage terms & intellectual property notice', badge: 'Legal', url: '/terms-of-service/' },
    { title: 'Cookie Policy', sub: 'Local storage & minimal cookie usage details', badge: 'Legal', url: '/cookie-policy/' },
    { title: 'Ask Google AI About Me', sub: 'See an instant summary of my work, ventures and public footprint on Google AI', badge: 'Google AI', url: 'https://www.google.com/search?q=who+is+%22kapil+pidhwani%22&udm=50&hl=en&arv=1', external: true },
    { title: 'Copy Email (kapildoesmarketing@gmail.com)', sub: 'Copy direct email address to clipboard', badge: 'Action', action: 'copy-email' },
    { title: 'Save Contact', sub: 'Download contact card for your address book', badge: 'Action', action: 'vcard' },
    { title: 'Show Networking QR Code', sub: 'Open scannable QR code modal', badge: 'Action', action: 'qr' }
  ];

  let selectedSearchIdx = 0;
  let currentFilteredSearch = searchCatalog.slice();

  function executeSearchItem(item) {
    if (!item) return;
    closeSearch();
    if (item.route) {
      navigateToRoute(item.route);
    } else if (item.url) {
      if (item.external) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.url;
      }
    } else if (item.action === 'copy-email') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('kapildoesmarketing@gmail.com');
      }
    } else if (item.action === 'vcard') {
      triggerVcardDownload();
    } else if (item.action === 'qr') {
      openQr();
    }
  }

  function renderSearchResults(query) {
    if (!searchResultsEl) return;
    const q = (query || '').trim().toLowerCase();
    currentFilteredSearch = searchCatalog.filter(function (item) {
      if (!q) return true;
      return (item.title + ' ' + item.sub + ' ' + item.badge).toLowerCase().indexOf(q) !== -1;
    });
    if (selectedSearchIdx >= currentFilteredSearch.length) {
      selectedSearchIdx = 0;
    }
    searchResultsEl.innerHTML = '';
    if (currentFilteredSearch.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sf-search-item';
      empty.innerHTML = '<div class="sf-search-item-main"><span class="sf-search-item-title">No matching results</span><span class="sf-search-item-sub">Try searching for Work, LinkedIn, Fundingly, Playbooks or Email</span></div>';
      searchResultsEl.appendChild(empty);
      return;
    }
    currentFilteredSearch.forEach(function (item, idx) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sf-search-item' + (idx === selectedSearchIdx ? ' is-selected' : '');
      btn.setAttribute('role', 'option');
      btn.innerHTML =
        '<div class="sf-search-item-main">' +
          '<span class="sf-search-item-title">' + item.title + '</span>' +
          '<span class="sf-search-item-sub">' + item.sub + '</span>' +
        '</div>' +
        '<span class="sf-search-item-badge">' + item.badge + '</span>';
      btn.addEventListener('click', function () {
        executeSearchItem(item);
      });
      searchResultsEl.appendChild(btn);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      selectedSearchIdx = 0;
      renderSearchResults(searchInput.value);
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentFilteredSearch.length > 0) {
          selectedSearchIdx = (selectedSearchIdx + 1) % currentFilteredSearch.length;
          renderSearchResults(searchInput.value);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentFilteredSearch.length > 0) {
          selectedSearchIdx = (selectedSearchIdx - 1 + currentFilteredSearch.length) % currentFilteredSearch.length;
          renderSearchResults(searchInput.value);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFilteredSearch[selectedSearchIdx]) {
          executeSearchItem(currentFilteredSearch[selectedSearchIdx]);
        }
      }
    });
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.hidden = false;
    selectedSearchIdx = 0;
    if (searchInput) {
      searchInput.value = '';
      renderSearchResults('');
      searchInput.focus();
    }
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.hidden = true;
  }

  openSearchBtns.forEach(function (btn) {
    btn.addEventListener('click', openSearch);
  });

  closeSearchBtns.forEach(function (btn) {
    btn.addEventListener('click', closeSearch);
  });

  window.addEventListener('keydown', function (e) {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (((e.key === 's' || e.key === 'S') && tag !== 'input' && tag !== 'textarea' && !e.metaKey && !e.ctrlKey) || ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K'))) {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape') {
      if (searchModal && !searchModal.hidden) closeSearch();
      if (qrModal && !qrModal.hidden) closeQr();
      if (sankeyModal && !sankeyModal.hidden) sankeyModal.hidden = true;
      if (lightbox && !lightbox.hidden) closeLightbox();
    }
  });

  document.querySelectorAll('.sf-current-year').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
  renderSearchResults('');

  /* Deisgned by Kapil Pidhwani: Data-driven Area of Work Knowledge Graph pipeline & ForceAtlas2 spring-physics canvas (ceiling: 2D Canvas O(V^2) repulsion; upgrade path: Barnes-Hut quadtree if nodes > 300). */
  const WORK_GRAPH_PROJECTS = [
    {
      id: 'fundingly',
      label: 'Fundingly.in',
      meta: 'Solution \u00b7 2026',
      skills: [
        'Market Research', 'Data Analysis', 'Google Sheets', 'Content Strategy', 'Competitive Analysis',
        'Product Management', 'SEO', 'Workflow Automation', 'UI/UX Design', 'Web Development'
      ]
    },
    {
      id: 'toolity',
      label: 'Toolity.in',
      meta: 'Solution \u00b7 2026',
      skills: [
        'Product Management', 'SEO', 'Workflow Automation', 'UI/UX Design', 'Web Development',
        'Product Marketing', 'Prompt Engineering', 'User Research', 'Growth Strategy', 'Conversion Optimization'
      ]
    },
    {
      id: 'think-travel-2026',
      label: 'Google Think Travel',
      meta: 'Event \u00b7 2026',
      skills: [
        'Content Strategy', 'UI/UX Design', 'Product Marketing', 'Market Research', 'Workflow Automation',
        'Growth Strategy', 'Event Marketing', 'Executive Communications', 'Brand Identity', 'Stakeholder Management'
      ]
    },
    {
      id: 'onboarding-redesign',
      label: 'ACCA Onboarding Redesign',
      meta: 'Transformation \u00b7 2023',
      skills: [
        'Training Design', 'Team Leadership', 'Operations', 'Process Design', 'Coaching',
        'Stakeholder Management', 'Change Management', 'Customer Experience', 'Workflow Automation', 'Content Strategy'
      ]
    },
    {
      id: 'amazon-rufus-rollout',
      label: 'Amazon Rufus Rollout',
      meta: 'Transformation \u00b7 2024',
      skills: [
        'Go-To-Market Strategy', 'Sales Enablement', 'Product Marketing', 'Stakeholder Management', 'Change Management',
        'Customer Experience', 'Data Analysis', 'Content Strategy', 'Training Design', 'Growth Strategy'
      ]
    }
  ];
  window.WORK_GRAPH_PROJECTS = WORK_GRAPH_PROJECTS;

  function initWorkKnowledgeGraph() {
    const canvas = document.getElementById('sf-work-graph-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Build deduplicated nodes & edges from WORK_GRAPH_PROJECTS pipeline
    const nodes = [];
    const edges = [];
    const nodeById = {};
    const skillMap = {};

    WORK_GRAPH_PROJECTS.forEach(function (proj, idx) {
      const vNode = {
        id: 'venture:' + proj.id,
        rawId: proj.id,
        label: proj.label,
        meta: proj.meta || 'Case Study',
        type: 'venture',
        ventureIndex: idx,
        degree: proj.skills.length,
        isShared: false,
        projects: [proj.id],
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        anchorX: 0,
        anchorY: 0,
        radius: 9.5
      };
      nodes.push(vNode);
      nodeById[vNode.id] = vNode;

      proj.skills.forEach(function (skillName) {
        const sKey = 'skill:' + skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (!skillMap[sKey]) {
          skillMap[sKey] = {
            id: sKey,
            label: skillName,
            type: 'skill',
            degree: 0,
            isShared: false,
            isCoreBet: false,
            rank: 99,
            outerIdx: 0,
            projects: [],
            ventureIndices: [],
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            anchorX: 0,
            anchorY: 0,
            radius: 4.5
          };
          nodes.push(skillMap[sKey]);
          nodeById[sKey] = skillMap[sKey];
        }
        skillMap[sKey].degree += 1;
        skillMap[sKey].projects.push(proj.id);
        skillMap[sKey].ventureIndices.push(idx);
        edges.push({
          from: vNode.id,
          to: sKey
        });
      });
    });

    // Rank skills by project frequency (with strategic tie-break priority for Core Bets)
    const priorityOrder = [
      'Content Strategy',
      'Workflow Automation',
      'Data Analysis',
      'Growth Strategy',
      'Stakeholder Management',
      'Product Marketing',
      'UI/UX Design',
      'Go-To-Market Strategy',
      'Market Research',
      'Product Management'
    ];
    const skillNodesSorted = Object.keys(skillMap).map(function (k) { return skillMap[k]; }).sort(function (a, b) {
      if (b.degree !== a.degree) return b.degree - a.degree;
      const pa = priorityOrder.indexOf(a.label);
      const pb = priorityOrder.indexOf(b.label);
      if (pa !== -1 && pb !== -1) return pa - pb;
      if (pa !== -1) return -1;
      if (pb !== -1) return 1;
      return a.label.localeCompare(b.label);
    });

    const CORE_BET_COUNT = Math.min(8, skillNodesSorted.length);
    skillNodesSorted.forEach(function (s, idx) {
      s.rank = idx + 1;
      s.isShared = s.degree > 1;
      if (idx < CORE_BET_COUNT) {
        s.isCoreBet = true;
        s.radius = 6.5 + Math.max(0, s.degree - 2) * 0.85;
      } else {
        s.isCoreBet = false;
        s.radius = 3.6 + s.degree * 0.55;
      }
    });

    // Update filter pill count dynamically
    const panelEl = canvas.parentElement;
    const allFilterBtn = panelEl ? panelEl.querySelector('[data-graph-filter="all"]') : null;
    if (allFilterBtn) {
      allFilterBtn.textContent = 'All Skills (' + skillNodesSorted.length + ')';
    }

    // Build adjacency lookup for instant O(1) neighbor highlight checks
    const adjacency = {};
    nodes.forEach(function (n) { adjacency[n.id] = new Set([n.id]); });
    edges.forEach(function (e) {
      adjacency[e.from].add(e.to);
      adjacency[e.to].add(e.from);
    });

    let width = 800;
    let height = 540;
    let dpr = 1;
    let initialized = false;
    let simAlpha = 1.0;
    let pulsePhase = 0;
    let filterMode = 'all';
    let dragNode = null;
    let hoverNode = null;
    let selectedNode = null;
    const defaultProjId = canvas.getAttribute('data-default-project');
    if (defaultProjId && nodeById['venture:' + defaultProjId]) {
      selectedNode = nodeById['venture:' + defaultProjId];
    }
    let pointerDownPos = null;
    let animFrameId = null;

    function computeAnchorsAndSeed(preservePositions) {
      const isCompact = width < 640;
      const cx = width * 0.5;
      const cy = height * 0.52;
      const ventureNodes = nodes.filter(function (n) { return n.type === 'venture'; });
      const coreNodes = skillNodesSorted.slice(0, CORE_BET_COUNT);
      const specNodes = skillNodesSorted.slice(CORE_BET_COUNT);

      // 1. Inner Constellation Ring: Top 8 Compounding Core Bets
      const rxCore = isCompact ? Math.min(width * 0.17, 74) : Math.min(width * 0.155, 148);
      const ryCore = isCompact ? Math.min(height * 0.16, 72) : Math.min(height * 0.175, 96);
      coreNodes.forEach(function (s, i) {
        const angle = (i / coreNodes.length) * Math.PI * 2 - Math.PI * 0.5;
        s.anchorX = cx + Math.cos(angle) * rxCore;
        s.anchorY = cy + Math.sin(angle) * ryCore;
        s.radius = isCompact ? (5.2 + Math.max(0, s.degree - 2) * 0.6) : (6.5 + Math.max(0, s.degree - 2) * 0.85);
        if (!preservePositions) {
          s.x = s.anchorX;
          s.y = s.anchorY;
          s.vx = 0;
          s.vy = 0;
        }
      });

      // 2. Middle Constellation Ring: Shipped Projects (interleaved by half-step angle)
      const rxProj = isCompact ? Math.min(width * 0.30, 128) : Math.min(width * 0.285, 286);
      const ryProj = isCompact ? Math.min(height * 0.30, 136) : Math.min(height * 0.335, 184);
      ventureNodes.forEach(function (vNode, i) {
        const angle = ((i + 0.5) / ventureNodes.length) * Math.PI * 2 - Math.PI * 0.5;
        vNode.anchorX = cx + Math.cos(angle) * rxProj;
        vNode.anchorY = cy + Math.sin(angle) * ryProj;
        vNode.radius = isCompact ? 8.0 : 9.5;
        if (!preservePositions) {
          vNode.x = vNode.anchorX;
          vNode.y = vNode.anchorY;
          vNode.vx = 0;
          vNode.vy = 0;
        }
      });

      // 3. Outer Constellation Perimeter: Domain & Specialist Skills sorted by parent project angle
      const specWithAngle = specNodes.map(function (s) {
        let sumSin = 0;
        let sumCos = 0;
        s.ventureIndices.forEach(function (vIdx) {
          const vn = ventureNodes[vIdx];
          if (vn) {
            const a = Math.atan2(vn.anchorY - cy, vn.anchorX - cx);
            sumSin += Math.sin(a);
            sumCos += Math.cos(a);
          }
        });
        return { node: s, prefAngle: Math.atan2(sumSin, sumCos) };
      }).sort(function (a, b) { return a.prefAngle - b.prefAngle; });

      const rxOuter = isCompact
        ? Math.min(width * 0.41, width * 0.5 - 32)
        : Math.max(185, Math.min(width * 0.385, width * 0.5 - 160));
      const ryOuter = isCompact
        ? Math.min(height * 0.42, height * 0.5 - 32)
        : Math.min(height * 0.445, 240);

      specWithAngle.forEach(function (item, i) {
        const angle = (i / (specWithAngle.length || 1)) * Math.PI * 2 - Math.PI;
        const stagger = (i % 2 === 0) ? 1.0 : 0.92;
        item.node.outerIdx = i;
        item.node.anchorX = cx + Math.cos(angle) * rxOuter * stagger;
        item.node.anchorY = cy + Math.sin(angle) * ryOuter * stagger;
        item.node.radius = isCompact ? (3.2 + item.node.degree * 0.4) : (3.6 + item.node.degree * 0.55);
        if (!preservePositions) {
          item.node.x = item.node.anchorX;
          item.node.y = item.node.anchorY;
          item.node.vx = 0;
          item.node.vy = 0;
        }
      });
    }

    function stepPhysics() {
      const isCompact = width < 640;
      const padX = isCompact ? 26 : 48;
      const padTop = 52;
      const padBottom = 30;
      const damping = 0.78;

      // 1. Elliptical node repulsion (prevents horizontal label collisions)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (filterMode === 'core' && a.type === 'skill' && !a.isCoreBet) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (filterMode === 'core' && b.type === 'skill' && !b.isCoreBet) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const effDx = dx * 0.68;
          const effDy = dy * 1.18;
          const distSq = effDx * effDx + effDy * effDy + 160;
          if (distSq > 18000) continue;
          const dist = Math.sqrt(distSq);
          const rep = ((isCompact ? 380 : 720) * simAlpha) / distSq;
          const fx = (dx / dist) * rep;
          const fy = (dy / dist) * rep;
          if (a !== dragNode) { a.vx -= fx; a.vy -= fy; }
          if (b !== dragNode) { b.vx += fx; b.vy += fy; }
        }
      }

      // 2. Elastic edge spring tension when a node is dragged
      if (dragNode) {
        for (let i = 0; i < edges.length; i++) {
          const e = edges[i];
          const u = nodeById[e.from];
          const v = nodeById[e.to];
          if (!u || !v) continue;
          if (u === dragNode || v === dragNode) {
            const other = u === dragNode ? v : u;
            const dx = dragNode.x - other.x;
            const dy = dragNode.y - other.y;
            other.vx += dx * 0.022;
            other.vy += dy * 0.022;
          }
        }
      }

      // 3. Concentric Anchor Gravity (keeps the 3-ring structure crisp while allowing elastic play)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n === dragNode) continue;
        const kAnchor = 0.085;
        n.vx += (n.anchorX - n.x) * kAnchor;
        n.vy += (n.anchorY - n.y) * kAnchor;
        n.vx *= damping;
        n.vy *= damping;
        n.x = Math.max(padX, Math.min(width - padX, n.x + n.vx));
        n.y = Math.max(padTop, Math.min(height - padBottom, n.y + n.vy));
      }

      if (!dragNode && simAlpha > 0.05) {
        simAlpha *= 0.96;
      }
    }

    function renderGraph() {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const isCompact = width < 640;
      const cx = width * 0.5;
      const cy = height * 0.52;
      const focusNode = dragNode || hoverNode || selectedNode;
      const activeSet = focusNode ? adjacency[focusNode.id] : null;
      pulsePhase = (pulsePhase + 0.011) % 1;

      // Subtle atmospheric spotlight behind the Core Bets center
      const centerGlow = ctx.createRadialGradient(cx, cy, 8, cx, cy, Math.min(width, height) * 0.36);
      centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.045)');
      centerGlow.addColorStop(0.55, 'rgba(255, 255, 255, 0.015)');
      centerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Curved Constellation Filaments + Traveling Chrome Light Particles
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const u = nodeById[e.from]; // project
        const v = nodeById[e.to];   // skill
        if (!u || !v) continue;
        if (filterMode === 'core' && !v.isCoreBet) continue;

        const isHighlighted = focusNode && (focusNode.id === u.id || focusNode.id === v.id);

        ctx.beginPath();
        const mx = (u.x + v.x) * 0.5 + (cx - (u.x + v.x) * 0.5) * 0.12;
        const my = (u.y + v.y) * 0.5 + (cy - (u.y + v.y) * 0.5) * 0.12;
        ctx.moveTo(u.x, u.y);
        ctx.quadraticCurveTo(mx, my, v.x, v.y);

        if (focusNode) {
          if (isHighlighted) {
            ctx.strokeStyle = v.isCoreBet ? 'rgba(255, 255, 255, 0.78)' : 'rgba(212, 212, 220, 0.48)';
            ctx.lineWidth = v.isCoreBet ? 1.85 : 1.25;
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
            ctx.lineWidth = 0.7;
          }
        } else {
          ctx.strokeStyle = v.isCoreBet ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.055)';
          ctx.lineWidth = v.isCoreBet ? 1.15 : 0.75;
        }
        ctx.stroke();

        if (isHighlighted) {
          const t = pulsePhase;
          const omt = 1 - t;
          const px = omt * omt * u.x + 2 * omt * t * mx + t * t * v.x;
          const py = omt * omt * u.y + 2 * omt * t * my + t * t * v.y;
          ctx.beginPath();
          ctx.arc(px, py, 2.1, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      }

      // 2. Draw Outer Perimeter Specialist Skill Stars
      if (filterMode !== 'core') {
        nodes.forEach(function (s) {
          if (s.type !== 'skill' || s.isCoreBet) return;
          const isConnected = !activeSet || activeSet.has(s.id);
          const isDirectHover = focusNode && focusNode.id === s.id;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDirectHover
            ? '#ffffff'
            : (isConnected ? (focusNode ? '#e4e4e7' : 'rgba(165, 165, 175, 0.74)') : 'rgba(110, 110, 120, 0.18)');
          ctx.fill();

          const showOuterLabel = isCompact
            ? (focusNode && isConnected)
            : ((focusNode && isConnected) || (!focusNode && (s.degree >= 2 || s.outerIdx % 2 === 0)));

          if (showOuterLabel) {
            const label = s.label + ' · ' + s.degree;
            ctx.font = (focusNode && isConnected)
              ? (isCompact ? '500 10px Inter, sans-serif' : '500 11px Inter, sans-serif')
              : (isCompact ? '400 9.5px Inter, sans-serif' : '400 10.5px Inter, sans-serif');
            ctx.fillStyle = (focusNode && isConnected) ? '#f4f4f6' : 'rgba(169, 169, 169, 0.66)';
            const lw = ctx.measureText(label).width;
            const isRight = s.x >= cx;
            if (isRight && s.x + s.radius + 6 + lw <= width - 10) {
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, s.x + s.radius + 6, s.y);
            } else if (!isRight && s.x - s.radius - 6 - lw >= 10) {
              ctx.textAlign = 'right';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, s.x - s.radius - 6, s.y);
            } else {
              ctx.textAlign = 'center';
              ctx.textBaseline = s.y < cy ? 'bottom' : 'top';
              const clampedX = Math.max(lw * 0.5 + 10, Math.min(width - lw * 0.5 - 10, s.x));
              ctx.fillText(label, clampedX, s.y + (s.y < cy ? -s.radius - 5 : s.radius + 5));
            }
          }
        });
      }

      // 3. Draw Middle Ring: Shipped Project Beacons (Tactile Chrome-Ringed Nodes + Pill Labels)
      nodes.forEach(function (p) {
        if (p.type !== 'venture') return;
        const isConnected = !activeSet || activeSet.has(p.id);
        const isFocused = focusNode && focusNode.id === p.id;

        // Outer subtle ring around project node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = isFocused
          ? 'rgba(255, 255, 255, 0.78)'
          : (isConnected ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.04)');
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Project core circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isConnected ? '#232327' : 'rgba(28, 28, 32, 0.4)';
        ctx.fill();
        ctx.strokeStyle = isConnected ? '#f7f7f7' : 'rgba(160, 160, 170, 0.22)';
        ctx.lineWidth = isFocused ? 2.2 : 1.5;
        ctx.stroke();

        // Inner bright center dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = isConnected ? '#ffffff' : 'rgba(255, 255, 255, 0.2)';
        ctx.fill();

        // Crisp pill label below project beacon
        const displayLabel = (isCompact && p.label === 'ACCA Onboarding Redesign')
          ? 'ACCA Onboarding'
          : ((isCompact && p.label === 'Amazon Rufus Rollout') ? 'Amazon Rufus' : p.label);
        ctx.font = isCompact ? '500 10.5px Inter, sans-serif' : '500 11.5px Inter, sans-serif';
        const tw = ctx.measureText(displayLabel).width;
        const pw = tw + (isCompact ? 10 : 14);
        const ph = isCompact ? 18 : 20;
        const lx = Math.max(pw * 0.5 + 6, Math.min(width - pw * 0.5 - 6, p.x + (p.x - cx) * 0.06));
        const ly = p.y + p.radius + (isCompact ? 12 : 14);

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(lx - pw / 2, ly - ph / 2, pw, ph, 6);
        } else {
          ctx.rect(lx - pw / 2, ly - ph / 2, pw, ph);
        }
        ctx.fillStyle = isConnected ? 'rgba(20, 20, 22, 0.92)' : 'rgba(20, 20, 22, 0.38)';
        ctx.fill();
        ctx.strokeStyle = isFocused
          ? 'rgba(255, 255, 255, 0.65)'
          : (isConnected ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)');
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = isConnected ? '#f7f7f7' : 'rgba(169, 169, 169, 0.3)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayLabel, lx, ly + 0.5);
      });

      // 4. Draw Inner Ring: Top 8 Compounding "Core Bet" Stars with Proportional Aura & ×N Badge
      nodes.forEach(function (s) {
        if (s.type !== 'skill' || !s.isCoreBet) return;
        const isConnected = !activeSet || activeSet.has(s.id);
        const isFocused = focusNode && focusNode.id === s.id;

        if (isConnected) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius + (isCompact ? 4.2 : 5.5), 0, Math.PI * 2);
          ctx.fillStyle = isFocused ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.07)';
          ctx.fill();
          ctx.strokeStyle = isFocused ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.24)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.save();
        if (isConnected) {
          ctx.shadowColor = 'rgba(255, 255, 255, 0.65)';
          ctx.shadowBlur = isFocused ? 16 : 10;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = isConnected ? '#ffffff' : 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        ctx.restore();

        // High-contrast Core Bet label + ×N project count
        const txt = s.label + ' · ×' + s.degree;
        ctx.font = isCompact ? '600 10px Inter, sans-serif' : '600 11.5px Inter, sans-serif';
        const tw = ctx.measureText(txt).width;
        const bw = tw + (isCompact ? 10 : 14);
        const bh = isCompact ? 18 : 20;
        const isTopCenter = (s.y < cy - (isCompact ? 38 : 55) && Math.abs(s.x - cx) < 35);
        const rawLx = s.x + (Math.abs(s.x - cx) > 30 ? Math.sign(s.x - cx) * (isCompact ? 8 : 14) : 0);
        const lx = Math.max(bw * 0.5 + 6, Math.min(width - bw * 0.5 - 6, rawLx));
        const ly = s.y + (isTopCenter ? -s.radius - (isCompact ? 13 : 16) : s.radius + (isCompact ? 13 : 15));

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(lx - bw / 2, ly - bh / 2, bw, bh, 999);
        } else {
          ctx.rect(lx - bw / 2, ly - bh / 2, bw, bh);
        }
        ctx.fillStyle = isConnected ? 'rgba(15, 15, 17, 0.94)' : 'rgba(15, 15, 17, 0.4)';
        ctx.fill();
        ctx.strokeStyle = isFocused
          ? '#ffffff'
          : (isConnected ? 'rgba(255, 255, 255, 0.34)' : 'rgba(255, 255, 255, 0.06)');
        ctx.lineWidth = isFocused ? 1.4 : 1;
        ctx.stroke();

        ctx.fillStyle = isConnected ? '#ffffff' : 'rgba(169, 169, 169, 0.3)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(txt, lx, ly + 0.5);
      });

      ctx.restore();
    }

    /* Deisgned by Kapil Pidhwani: Non-accidental glassmorphic destination preview popover on project nodes (ceiling: single reused DOM card; upgrade path: none needed). */
    let popoverEl = null;
    let activePopoverNode = null;
    if (panelEl) {
      popoverEl = panelEl.querySelector('.sf-graph-popover');
      if (!popoverEl) {
        popoverEl = document.createElement('div');
        popoverEl.className = 'sf-graph-popover';
        popoverEl.hidden = true;
        popoverEl.setAttribute('role', 'dialog');
        popoverEl.setAttribute('aria-label', 'Case study preview');
        popoverEl.addEventListener('pointerdown', function (ev) {
          ev.stopPropagation();
        });
        panelEl.appendChild(popoverEl);
      }
    }

    function hidePopover() {
      activePopoverNode = null;
      if (popoverEl) {
        popoverEl.hidden = true;
      }
    }

    function positionPopover(vNode) {
      if (!popoverEl || !vNode) return;
      const cardW = Math.min(304, width - 24);
      const cardH = 124;
      let left = Math.round(vNode.x - cardW * 0.5);
      let top = Math.round(vNode.y + (vNode.radius || 10) + 38);
      if (top + cardH > height - 12) {
        top = Math.round(vNode.y - cardH - (vNode.radius || 10) - 16);
      }
      left = Math.max(12, Math.min(width - cardW - 12, left));
      top = Math.max(50, Math.min(height - cardH - 12, top));
      popoverEl.style.left = left + 'px';
      popoverEl.style.top = top + 'px';
    }

    function showProjectPopover(vNode) {
      if (!popoverEl || !vNode) return;
      activePopoverNode = vNode;
      const slug = vNode.rawId;
      const isCurrentPage = Boolean(defaultProjId && defaultProjId === slug);
      const actionHtml = isCurrentPage
        ? '<span class="sf-graph-popover-current">Currently viewing this page</span>'
        : '<a href="/work/' + slug + '/" class="sf-graph-popover-cta"><span>View case study</span><span aria-hidden="true">&rarr;</span></a>';
      popoverEl.innerHTML =
        '<div class="sf-graph-popover-top">' +
          '<span class="sf-graph-popover-cat">' + (vNode.meta || 'Case Study') + '</span>' +
          '<button type="button" class="sf-graph-popover-close" aria-label="Close preview">&times;</button>' +
        '</div>' +
        '<p class="sf-graph-popover-title">' + vNode.label + '</p>' +
        '<p class="sf-graph-popover-url">kapilpidhwani.in/work/' + slug + '/</p>' +
        actionHtml;
      const closeBtn = popoverEl.querySelector('.sf-graph-popover-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          hidePopover();
        });
      }
      popoverEl.hidden = false;
      positionPopover(vNode);
    }

    function tick() {
      stepPhysics();
      renderGraph();
      if (activePopoverNode && popoverEl && !popoverEl.hidden) {
        positionPopover(activePopoverNode);
      }
      animFrameId = window.requestAnimationFrame(tick);
    }

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width));
      height = Math.max(320, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      computeAnchorsAndSeed(initialized);
      if (!initialized) {
        initialized = true;
        simAlpha = 1.0;
        for (let i = 0; i < 55; i++) {
          stepPhysics();
        }
      } else {
        simAlpha = Math.max(simAlpha, 0.5);
      }
      renderGraph();
      if (activePopoverNode && popoverEl && !popoverEl.hidden) {
        positionPopover(activePopoverNode);
      }
    }

    function getPointerCoords(evt) {
      const rect = canvas.getBoundingClientRect();
      const clientX = evt.touches && evt.touches.length ? evt.touches[0].clientX : evt.clientX;
      const clientY = evt.touches && evt.touches.length ? evt.touches[0].clientY : evt.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function findNodeAt(x, y) {
      let best = null;
      let bestDist = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (filterMode === 'core' && n.type === 'skill' && !n.isCoreBet) continue;
        const hitR = n.type === 'venture' ? 24 : (n.isCoreBet ? 22 : 14);
        const d = Math.hypot(x - n.x, y - n.y);
        if (d <= hitR && d < bestDist) {
          best = n;
          bestDist = d;
        }
      }
      return best;
    }

    canvas.addEventListener('pointerdown', function (e) {
      const pt = getPointerCoords(e);
      const hit = findNodeAt(pt.x, pt.y);
      pointerDownPos = { x: pt.x, y: pt.y, hitNode: hit };
      if (hit) {
        dragNode = hit;
        hoverNode = hit;
        simAlpha = 1.0;
        canvas.classList.add('is-dragging');
        if (canvas.setPointerCapture && e.pointerId !== undefined) {
          try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
        }
      }
    });

    canvas.addEventListener('pointermove', function (e) {
      const pt = getPointerCoords(e);
      if (dragNode) {
        const moved = pointerDownPos ? Math.hypot(pt.x - pointerDownPos.x, pt.y - pointerDownPos.y) : 99;
        if (moved >= 6) {
          hidePopover();
        }
        const padX = 36;
        const padTop = 52;
        const padBottom = 28;
        dragNode.x = Math.max(padX, Math.min(width - padX, pt.x));
        dragNode.y = Math.max(padTop, Math.min(height - padBottom, pt.y));
        dragNode.vx = 0;
        dragNode.vy = 0;
        simAlpha = 0.92;
        return;
      }
      const hit = findNodeAt(pt.x, pt.y);
      if (hit !== hoverNode) {
        hoverNode = hit;
        canvas.style.cursor = hit ? (hit.type === 'venture' ? 'pointer' : 'grab') : 'default';
      }
    });

    function handlePointerEnd(e) {
      if (pointerDownPos) {
        const pt = getPointerCoords(e);
        const movedDist = Math.hypot(pt.x - pointerDownPos.x, pt.y - pointerDownPos.y);
        if (movedDist < 6) {
          const hit = pointerDownPos.hitNode;
          if (hit && hit.type === 'venture') {
            if (activePopoverNode === hit && popoverEl && !popoverEl.hidden) {
              hidePopover();
              selectedNode = null;
            } else {
              selectedNode = hit;
              showProjectPopover(hit);
            }
          } else if (hit) {
            hidePopover();
            selectedNode = (selectedNode === hit) ? null : hit;
          } else {
            hidePopover();
            selectedNode = null;
          }
        }
      }
      if (dragNode) {
        dragNode = null;
        simAlpha = 0.85;
        canvas.classList.remove('is-dragging');
      }
      pointerDownPos = null;
    }

    canvas.addEventListener('pointerup', handlePointerEnd);
    canvas.addEventListener('pointercancel', handlePointerEnd);
    canvas.addEventListener('pointerleave', function () {
      if (!dragNode) {
        hoverNode = null;
      }
    });

    window.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        hidePopover();
      }
    });

    if (panelEl) {
      const filterBtns = panelEl.querySelectorAll('[data-graph-filter]');
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          hidePopover();
          filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          filterMode = btn.getAttribute('data-graph-filter') || 'all';
          simAlpha = 0.9;
        });
      });
    }

    const resetBtn = panelEl ? panelEl.querySelector('[data-graph-reset]') : null;
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        selectedNode = (defaultProjId && nodeById['venture:' + defaultProjId])
          ? nodeById['venture:' + defaultProjId]
          : null;
        hoverNode = null;
        dragNode = null;
        nodes.forEach(function (n) { n.vx = 0; n.vy = 0; });
        computeAnchorsAndSeed(false);
        simAlpha = 1.0;
        for (let i = 0; i < 55; i++) {
          stepPhysics();
        }
        renderGraph();
        resetBtn.classList.remove('is-spinning');
        void resetBtn.offsetWidth;
        resetBtn.classList.add('is-spinning');
        window.setTimeout(function () {
          resetBtn.classList.remove('is-spinning');
        }, 420);
      });
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    if (animFrameId) window.cancelAnimationFrame(animFrameId);
    animFrameId = window.requestAnimationFrame(tick);
  }

  initWorkKnowledgeGraph();

  // Deisgned by Kapil Pidhwani: Settled monochrome white cursor-following card glow across all right-side gray cards in #main-content (excluding photos & sidebar); O(k) getBoundingClientRect per animation frame (upgrade to IntersectionObserver active subset if page card count exceeds 100).
  function initCardCursorGlow() {
    const mainEl = document.getElementById('main-content');
    if (!mainEl) return;

    const selectors = [
      '.sf-hero-copy',
      '.sf-work-header-panel',
      '.sf-stat-card',
      '.sf-service-tray',
      '.sf-contact-channels-panel',
      '.sf-collab-card',
      '.sf-article-row',
      '.sf-testimonial-tray',
      '.sf-graph-panel',
      '.sf-client-card',
      '.sf-exp-row',
      '.sf-tool-card',
      '.sf-links-spotlight-primary',
      '.sf-links-bento-card',
      '.sf-contact-form-panel',
      '.sf-details-table',
      '.sf-faq-item',
      '.sf-legal-prose',
      '.sf-footer-cta-panel'
    ];
    const glowCards = Array.from(mainEl.querySelectorAll(selectors.join(', ')));
    if (!glowCards.length) return;

    glowCards.forEach(function (card) {
      card.setAttribute('data-sf-glow', '');
    });

    let lastClientX = -9999;
    let lastClientY = -9999;
    let rafPending = false;

    function updateGlowPositions() {
      rafPending = false;
      for (let i = 0; i < glowCards.length; i++) {
        const card = glowCards[i];
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (lastClientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (lastClientY - rect.top) + 'px');
      }
    }

    mainEl.addEventListener('pointermove', function (e) {
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(updateGlowPositions);
      }
    }, { passive: true });

    window.addEventListener('scroll', function () {
      if (lastClientX < -1000) return;
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(updateGlowPositions);
      }
    }, { passive: true });
  }

  initCardCursorGlow();

  // Runnable self-check for modular Sidefolio architecture, global shell, SEO & current page view
  window.__verifySidefolioSidebar = function () {
    const mainLinks = Array.from(document.querySelectorAll('[data-framer-name="Main"] .sf-nav-link:not(.sf-nav-mobile-only) .sf-nav-label')).map(function (el) { return el.textContent.trim(); });
    const connectLinks = Array.from(document.querySelectorAll('[data-framer-name="Connect"] .sf-nav-label')).map(function (el) { return el.textContent.trim(); });
    const views = document.querySelectorAll('[data-page-view]');
    const hiddenViews = document.querySelectorAll('[data-page-view][hidden]');
    const activeView = getActiveViewKey();
    const footerEl = document.getElementById('site-footer');
    const legalPrivacyLink = document.querySelector('#site-footer a[href="/privacy-policy/"]');
    const searchItemsCount = document.querySelectorAll('#search-results .sf-search-item').length;
    const schemaScript = document.getElementById('sf-schema-jsonld');
    const externalCss = document.querySelector('link[rel="stylesheet"][href="/assets/css/main.css"]');
    const externalJs = document.querySelector('script[src="/assets/js/main.js"]');
    const bodyText = document.body.innerText || '';

    console.assert(JSON.stringify(mainLinks) === JSON.stringify(['Home', 'About', 'Work', 'Playbooks', 'Links']), 'Main nav mismatch', mainLinks);
    console.assert(JSON.stringify(connectLinks) === JSON.stringify(['Contact', 'LinkedIn', 'GitHub', 'Ask Google AI']), 'Connect nav mismatch', connectLinks);
    console.assert(!document.querySelector('.sf-actions-tray [name="Start a project"]'), 'Sidebar primary CTA should not be present');
    console.assert(views.length === 1 && hiddenViews.length === 0, 'Modular page must contain exactly 1 active view and 0 hidden views', views.length, hiddenViews.length);
    console.assert(Boolean(externalCss) && Boolean(externalJs), 'Modular page must link /assets/css/main.css and /assets/js/main.js');
    console.assert(Boolean(document.querySelector('.sf-cursor-light')), 'Black Badge torch layer must exist in the shell');
    console.assert(Boolean(footerEl) && Boolean(legalPrivacyLink), 'Global Sidefolio footer and /privacy-policy/ link must exist');
    console.assert(searchItemsCount > 10, 'Command palette search must populate items', searchItemsCount);
    console.assert(Boolean(schemaScript && JSON.parse(schemaScript.textContent)['@graph']), 'Valid JSON-LD Schema.org @graph must exist');
    console.assert(bodyText.indexOf('Plx' + 'ie') === -1 && bodyText.indexOf('Kaag' + 'zee') === -1, 'Removed projects must not appear');
    console.assert(bodyText.indexOf('832' + '98') === -1, 'Phone number must be kept private');
    console.assert(bodyText.indexOf('\u2014') === -1 && bodyText.indexOf('\u2013') === -1, 'Zero em-dashes or en-dashes allowed per taste-skill');
    console.assert(document.querySelectorAll('#main-content [data-sf-glow]').length > 0 && !document.querySelector('.sf-sidebar [data-sf-glow], .sf-hero-portrait[data-sf-glow]'), 'Cursor glow must apply to right-side gray cards only, never sidebar or portrait');

    if (['home', 'about', 'work', 'playbooks', 'links'].indexOf(activeView) !== -1) {
      const heroPortrait = document.querySelector('.sf-header-card .sf-hero-portrait-img');
      const startProjectBtn = document.querySelector('.sf-header-card .sf-hero-actions .sf-btn-primary[href="/contact/"]');
      console.assert(Boolean(heroPortrait) && Boolean(startProjectBtn), 'All 5 main pages must share the unified 2/3 + 1/3 Portrait Header and Start a project Primary CTA', activeView);
    }

    if (activeView === 'home') {
      const statValues = Array.from(document.querySelectorAll('#hero .sf-stat-value')).map(function (el) { return el.textContent.trim(); });
      const homeServicesCount = document.querySelectorAll('#home-services .sf-service-tray').length;
      const homePlaybookSlides = document.querySelectorAll('#home-playbooks-slideshow [data-pb-slide]').length;
      const homeTestimonialsCount = document.querySelectorAll('#home-testimonials [data-testimonial-card]').length;
      const graphCanvas = document.getElementById('sf-work-graph-canvas');
      const graphCta = document.querySelector('#home-area-of-work .sf-section-ghost-link[href="/work/"]');
      console.assert(JSON.stringify(statValues) === JSON.stringify(['100+', '6+', '50+']), 'Hero stats mismatch', statValues);
      console.assert(homeServicesCount === 3, 'Homepage How I Can Help must have 3 bento cards', homeServicesCount);
      console.assert(homePlaybookSlides === 1, 'Homepage Playbooks section must have 1 real playbook row', homePlaybookSlides);
      console.assert(homeTestimonialsCount === 4, 'Homepage Testimonials must have 4 primary cards in marquee', homeTestimonialsCount);
      console.assert(Boolean(graphCanvas) && Boolean(graphCta) && Array.isArray(window.WORK_GRAPH_PROJECTS) && window.WORK_GRAPH_PROJECTS.length === 5, 'Homepage Area of Work knowledge graph and View all work CTA must exist');
      console.assert(!document.querySelector('#view-home .sf-section-eyebrow, #view-home .sf-service-tags, #view-home .sf-work-badge-copper'), 'Zero AI-slop eyebrow or tag chips on homepage');
    } else if (activeView === 'links') {
      const bentoCells = document.querySelectorAll('#links-hub .sf-links-bento-card').length;
      const playbooksCard = document.querySelector('#links-hub [data-nav-trigger="playbooks"]');
      const primaryLinksCta = document.getElementById('links-primary-cta');
      console.assert(bentoCells === 5, 'Links stack must have 5 rows', bentoCells);
      console.assert(playbooksCard && playbooksCard.textContent.indexOf('Presentations and Playbooks') !== -1, 'Playbooks row must exist and be named Presentations and Playbooks');
      console.assert(primaryLinksCta && primaryLinksCta.getAttribute('href').indexOf('linkedin.com/in/kapilpidhwani') !== -1, 'Primary Links CTA must point to LinkedIn');
    } else if (activeView === 'about') {
      const aboutRoles = document.querySelectorAll('#about-hub .sf-about-role-card').length;
      const aboutClients = document.querySelectorAll('#about-hub .sf-client-card').length;
      const aboutTools = document.querySelectorAll('#about-hub .sf-tool-card').length;
      console.assert(aboutRoles === 4, 'About experience must have 4 career roles', aboutRoles);
      console.assert(aboutClients === 8, 'About ecosystem grid must have 8 cards', aboutClients);
      console.assert(aboutTools === 6, 'About tools grid must have 6 cards', aboutTools);
    } else if (activeView === 'work') {
      const workCardEls = Array.from(document.querySelectorAll('#work-hub a.sf-work-card[href^="/work/"]'));
      const rankMap = { transformations: 1, events: 2, solutions: 3 };
      let sortedOk = true;
      for (let i = 1; i < workCardEls.length; i++) {
        const prev = workCardEls[i - 1];
        const curr = workCardEls[i];
        const yPrev = parseInt(prev.getAttribute('data-work-year') || '0', 10);
        const yCurr = parseInt(curr.getAttribute('data-work-year') || '0', 10);
        const rPrev = rankMap[prev.getAttribute('data-work-cat') || ''] || 99;
        const rCurr = rankMap[curr.getAttribute('data-work-cat') || ''] || 99;
        if (yPrev < yCurr || (yPrev === yCurr && rPrev > rCurr)) {
          sortedOk = false;
          break;
        }
      }
      console.assert(workCardEls.length === 5 && sortedOk, 'All live Work cards must be sorted by Year DESC then Transformations > Events > Solutions', workCardEls.map(function (c) { return c.getAttribute('data-work-title'); }));
    } else if (activeView === 'contact') {
      const contactFormEl = document.getElementById('contact-inquiry-form');
      const contactFaqCount = document.querySelectorAll('#contact-faq-list .sf-faq-item').length;
      console.assert(Boolean(contactFormEl) && contactFaqCount === 4, 'Contact page must have inquiry form and 4 FAQs', contactFaqCount);
    }

    document.documentElement.setAttribute('data-sf-verified', 'true');
    return true;
  };
  window.__verifySidefolioSidebar();
})();
