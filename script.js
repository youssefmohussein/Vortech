// SCROLL REVEAL
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

// COUNT UP
const counters = document.querySelectorAll('.counting');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      const target = parseInt(e.target.dataset.target);
      let count = 0;
      const step = Math.ceil(target / 30);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        e.target.textContent = count + '+';
        if (count >= target) clearInterval(timer);
      }, 40);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => countObserver.observe(el));

// NAV SHRINK
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 60) {
    nav.style.padding = '12px 60px';
  } else {
    nav.style.padding = '20px 60px';
  }
});

// LOADER
(function () {
  const loader    = document.getElementById('loader');
  const logoText  = document.getElementById('loader-logo-text');
  const logoDot   = document.getElementById('loader-logo-dot');
  const logoWrap  = document.getElementById('loader-logo-wrap');
  const caret     = document.getElementById('loader-caret');
  const msgsEl    = document.getElementById('loader-msgs');
  const barFill   = document.getElementById('loader-bar-fill');
  const pctEl     = document.getElementById('loader-pct');
  const statusEl  = document.getElementById('hud-status');

  document.body.style.overflow = 'hidden';

  const LOGO    = 'Vortech';
  const MSGS    = [
    ['OK',   '#6aff3a', 'Loading secure environment'],
    ['OK',   '#6aff3a', 'Establishing connection'],
    ['OK',   '#6aff3a', 'Compiling assets'],
    ['OK',   '#6aff3a', 'Initializing UI modules'],
    ['OK',   '#6aff3a', 'Running security checks'],
    ['DONE', '#C8FF00', 'System ready'],
  ];

  let progress = 0;

  function animateBar(to, duration, cb) {
    const start = progress;
    const diff  = to - start;
    const steps = Math.round(duration / 16);
    let   step  = 0;
    const iv = setInterval(() => {
      step++;
      progress = start + diff * (step / steps);
      barFill.style.width = progress + '%';
      pctEl.textContent   = Math.round(progress) + '%';
      if (step >= steps) { clearInterval(iv); cb && cb(); }
    }, 16);
  }

  function addMsg(tag, color, text, cb) {
    const el = document.createElement('span');
    el.className = 'loader-msg';
    el.innerHTML = `<span style="color:${color}">[  ${tag}  ]</span> <span style="color:rgba(200,255,0,0.55)">${text}...</span>`;
    msgsEl.appendChild(el);
    setTimeout(cb, 260);
  }

  function runMessages(idx) {
    if (idx >= MSGS.length) {
      statusEl.textContent = 'READY';
      setTimeout(() => {
        loader.classList.add('hide');
        setTimeout(() => {
          loader.style.display = 'none';
          document.body.style.overflow = '';
        }, 950);
      }, 350);
      return;
    }
    const [tag, color, text] = MSGS[idx];
    const pctTarget = ((idx + 1) / MSGS.length) * 100;
    addMsg(tag, color, text, () => {
      animateBar(pctTarget, 220, () => runMessages(idx + 1));
    });
  }

  // Type logo then start messages
  let i = 0;
  const type = setInterval(() => {
    if (i < LOGO.length) {
      logoText.textContent += LOGO[i++];
    } else {
      clearInterval(type);
      caret.style.display = 'none';
      logoDot.style.opacity = '1';
      logoWrap.classList.add('glitch');
      logoWrap.addEventListener('animationend', () => logoWrap.classList.remove('glitch'), { once: true });
      setTimeout(() => runMessages(0), 200);
    }
  }, 80);
})();

// HERO UPTIME COUNTER
(function () {
  const el = document.getElementById('hero-uptime');
  if (!el) return;
  let s = 0;
  setInterval(() => {
    s++;
    const h   = String(Math.floor(s / 3600)).padStart(2, '0');
    const m   = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    el.textContent = `${h}:${m}:${sec}`;
  }, 1000);
})();

// HAMBURGER MENU
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// FAQ ACCORDION
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// FORM SUBMIT
function handleSubmit(e) {
  e.preventDefault();
  
  const btn = document.getElementById('submit-btn');
  const txt = document.getElementById('submit-text');
  const success = document.getElementById('form-success');
  const error = document.getElementById('form-error');
  
  // Reset feedback displays
  success.style.display = 'none';
  if (error) error.style.display = 'none';
  
  // Disable button and show sending state
  btn.disabled = true;
  txt.textContent = 'Sending...';
  
  // Fetch values
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const phone = document.getElementById('contact-phone').value;
  const service = document.getElementById('contact-service').value;
  const message = document.getElementById('contact-message').value;
  
  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: "bed43068-0ef0-4a34-8308-6510236afca0",
      name: name,
      email: email,
      phone: phone,
      service: service,
      message: message
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Form submission failed");
    }
  })
  .then(data => {
    // Hide button and show success
    btn.style.display = 'none';
    success.style.display = 'block';
  })
  .catch(err => {
    console.error(err);
    // Reset button state and show error
    btn.disabled = false;
    txt.textContent = 'Send message →';
    if (error) error.style.display = 'block';
  });
}
