/* ============================================================
   LALITHA MULTISPECIALITY HOSPITAL — SCRIPT.JS
   ============================================================

   APPOINTMENT EMAILS → harshithking24@gmail.com
   ─────────────────────────────────────────────────────────────

   QUICK SETUP (5 mins, free):
   ────────────────────────────
   STEP 1: Go to https://www.emailjs.com → Sign up FREE with
           harshithking24@gmail.com

   STEP 2: Email Services → Add New Service → Gmail
           → Connect harshithking24@gmail.com
           → Copy the SERVICE ID  (looks like: service_abc1234)
           → Paste below as EMAILJS_SERVICE_ID

   STEP 3: Email Templates → Create New Template
           Set "To Email" → harshithking24@gmail.com
           Paste this as the template body:
           ─────────────────────────────────
           Subject: New Appointment - {{department}} | {{fname}} {{lname}}

           New appointment request received!

           Patient Details:
           ─────────────────
           Name       : {{fname}} {{lname}}
           Email      : {{email}}
           Phone      : {{phone}}
           Age        : {{age}}
           Gender     : {{gender}}

           Appointment Details:
           ─────────────────────
           Department : {{department}}
           Date       : {{date}}
           Time       : {{time}}

           Message / Symptoms:
           {{message}}

           ─────────────────────
           Lalitha Multispeciality Hospital
           ─────────────────────
           → Copy the TEMPLATE ID  (looks like: template_xyz9876)
           → Paste below as EMAILJS_TEMPLATE_ID

   STEP 4: Account → General → Public Key
           → Paste below as EMAILJS_PUBLIC_KEY

   ============================================================ */

// ─── EmailJS Configuration ─────────────────────────────────
// TARGET EMAIL: harshithking24@gmail.com
const EMAILJS_PUBLIC_KEY   = 'YOUR_PUBLIC_KEY';        // ← Paste from Step 4
const EMAILJS_SERVICE_ID   = 'YOUR_SERVICE_ID';        // ← Paste from Step 2
const EMAILJS_TEMPLATE_ID  = 'YOUR_TEMPLATE_ID';       // ← Paste from Step 3

// Appointments will be delivered to: harshithking24@gmail.com
const HOSPITAL_EMAIL = 'harshithking24@gmail.com';

// ─── Init EmailJS ───────────────────────────────────────────
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();


// ─── PRELOADER ──────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('preloader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});


// ─── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});


// ─── MOBILE HAMBURGER ────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});


// ─── SMOOTH ACTIVE LINK HIGHLIGHT ───────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const observerOptions = { threshold: 0.35 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--gold-light)'
          : '';
      });
    }
  });
}, observerOptions);

sections.forEach(sec => sectionObserver.observe(sec));


// ─── CARD / SPEC FADE-IN ON SCROLL ──────────────────────────
const animatables = document.querySelectorAll('.spec-card, .doctor-card, .contact-card, .about-card');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.style.transform.replace(/translateY\(-?\d+px\)/, '') + ' translateY(0)';
      }, Number(delay));
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animatables.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = (el.style.transform || '') + ' translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});


// ─── SET DATE MIN ────────────────────────────────────────────
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}


// ─── APPOINTMENT FORM SUBMIT ─────────────────────────────────
const form      = document.getElementById('appointmentForm');
const submitBtn = document.getElementById('submitBtn');
const btnText   = document.getElementById('btnText');
const btnLoad   = document.getElementById('btnLoading');
const formMsg   = document.getElementById('formMsg');

function showMessage(type, text) {
  formMsg.textContent  = text;
  formMsg.className    = `form-msg ${type}`;
  setTimeout(() => { formMsg.className = 'form-msg'; formMsg.textContent = ''; }, 6000);
}

function validateForm(data) {
  if (!data.fname.trim())      return 'Please enter your first name.';
  if (!data.lname.trim())      return 'Please enter your last name.';
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                               return 'Please enter a valid email address.';
  if (!data.phone.trim())      return 'Please enter your phone number.';
  if (!data.department)        return 'Please select a department.';
  if (!data.date)              return 'Please select a preferred date.';
  return null;
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      fname:      document.getElementById('fname').value,
      lname:      document.getElementById('lname').value,
      email:      document.getElementById('email').value,
      phone:      document.getElementById('phone').value,
      age:        document.getElementById('age').value || 'Not provided',
      gender:     document.getElementById('gender').value || 'Not provided',
      department: document.getElementById('department').value,
      date:       document.getElementById('date').value,
      time:       document.getElementById('time').value || 'Not specified',
      message:    document.getElementById('message').value || 'No additional information',
    };

    const error = validateForm(data);
    if (error) { showMessage('error', error); return; }

    // Loading state
    submitBtn.disabled    = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'inline';
    formMsg.className     = 'form-msg';

    // Check if EmailJS credentials are configured
    const isConfigured =
      EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY'  &&
      EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID'  &&
      EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';

    if (!isConfigured) {
      // Demo mode — simulate success without sending
      await new Promise(r => setTimeout(r, 1500));
      showMessage(
        'success',
        '⚙️ Almost live! Complete EmailJS setup (see script.js) to send emails to harshithking24@gmail.com'
      );
      console.log('%c📋 Appointment Data (Demo Mode)', 'color:#0a5f78;font-weight:bold;font-size:14px');
      console.log('%c→ Will be sent to: harshithking24@gmail.com once EmailJS is configured', 'color:#c9a96e');
      console.table(data);
      form.reset();
    } else {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          ...data,
          to_email: HOSPITAL_EMAIL,
          hospital_name: 'Lalitha Multispeciality Hospital',
          submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        });
        showMessage(
          'success',
          `✅ Appointment confirmed! Notification sent to harshithking24@gmail.com. We'll call ${data.fname} within 2 hours.`
        );
        form.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        showMessage('error', '❌ Failed to send. Please call us directly at +91 40 2345 6789.');
      }
    }

    // Reset button
    submitBtn.disabled    = false;
    btnText.style.display = 'inline';
    btnLoad.style.display = 'none';
  });
}


// ─── HERO STATS COUNTER ANIMATION ────────────────────────────
function animateCounter(el, target, suffix) {
  let current = 0;
  const step     = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(interval);
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(num => {
        const raw    = num.textContent;
        const match  = raw.match(/^(\d+)(.*)$/);
        if (match) animateCounter(num, parseInt(match[1]), match[2]);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
