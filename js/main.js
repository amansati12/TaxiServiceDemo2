/* =====================================================
   TAXIGO - Premium Taxi Service Website
   Main JavaScript File
   ===================================================== */

'use strict';

/* === Preloader === */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => preloader.remove(), 500);
    }, 1200);
  }
});

/* === Sticky Navbar === */
const navbar = document.querySelector('.navbar-custom');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* === Active Nav Link === */
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-custom').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* === Back to Top Button === */
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* === Scroll Animation Observer === */
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  animateObserver.observe(el);
});

/* === Number Counter Animation === */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* === Booking Form Validation === */
function validateBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const fields = {
    pickup: { el: form.querySelector('[name="pickup"]'), msg: 'Please enter pickup location.' },
    dropoff: { el: form.querySelector('[name="dropoff"]'), msg: 'Please enter drop-off location.' },
    date: { el: form.querySelector('[name="date"]'), msg: 'Please select a travel date.' },
    time: { el: form.querySelector('[name="time"]'), msg: 'Please select a travel time.' },
    name: { el: form.querySelector('[name="name"]'), msg: 'Please enter your full name.' },
    phone: { el: form.querySelector('[name="phone"]'), msg: 'Please enter a valid phone number.' },
    email: { el: form.querySelector('[name="email"]'), msg: 'Please enter a valid email address.' },
  };

  // Set minimum date to today
  const dateInput = form.querySelector('[name="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Real-time validation
  Object.values(fields).forEach(({ el }) => {
    if (!el) return;
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid')) validateField(el);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(({ el }) => {
      if (el && !validateField(el)) valid = false;
    });

    // Validate vehicle selection
    const vehicleSelected = form.querySelector('input[name="vehicle"]:checked');
    const vehicleError = document.getElementById('vehicleError');
    if (!vehicleSelected) {
      if (vehicleError) vehicleError.style.display = 'block';
      valid = false;
    } else {
      if (vehicleError) vehicleError.style.display = 'none';
    }

    if (valid) {
      showBookingSuccess();
    }
  });
}

function validateField(el) {
  if (!el) return true;
  const value = el.value.trim();
  const name = el.getAttribute('name');
  let isValid = true;
  let errorMsg = '';

  switch (name) {
    case 'email':
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      errorMsg = 'Please enter a valid email address.';
      break;
    case 'phone':
      isValid = /^[\d\s\+\-\(\)]{7,15}$/.test(value);
      errorMsg = 'Please enter a valid phone number.';
      break;
    case 'date':
      const today = new Date().toISOString().split('T')[0];
      isValid = value !== '' && value >= today;
      errorMsg = 'Please select a valid future date.';
      break;
    default:
      isValid = value.length > 0;
      errorMsg = `This field is required.`;
  }

  const feedback = el.nextElementSibling;
  if (!isValid) {
    el.classList.add('is-invalid');
    el.classList.remove('is-valid');
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = errorMsg;
    }
  } else {
    el.classList.remove('is-invalid');
    el.classList.add('is-valid');
  }
  return isValid;
}

function showBookingSuccess() {
  const form = document.getElementById('bookingForm');
  const successMsg = document.getElementById('bookingSuccess');
  if (form && successMsg) {
    form.style.display = 'none';
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* === Contact Form Validation === */
function validateContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('.form-control-custom[required]').forEach(el => {
      if (!validateField(el)) valid = false;
    });

    if (valid) {
      const successMsg = document.getElementById('contactSuccess');
      if (successMsg) {
        form.reset();
        form.querySelectorAll('.form-control-custom').forEach(el => {
          el.classList.remove('is-valid', 'is-invalid');
        });
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    }
  });

  form.querySelectorAll('.form-control-custom').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid')) validateField(el);
    });
  });
}

/* === Vehicle Type Selector (Booking Page) === */
function initVehicleSelector() {
  document.querySelectorAll('.vehicle-option').forEach(option => {
    option.addEventListener('click', function () {
      document.querySelectorAll('.vehicle-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      const radio = this.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      const vehicleError = document.getElementById('vehicleError');
      if (vehicleError) vehicleError.style.display = 'none';
    });
  });
}

/* === Smooth Hover Ripple Effect on Yellow Buttons === */
function initRipple() {
  document.querySelectorAll('.btn-yellow').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0,0,0,0.15);
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        transform: scale(0);
        animation: rippleAnim 0.5s linear;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple keyframe
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }`;
    document.head.appendChild(style);
  }
}

/* === Testimonial Auto-Scroll (if carousel present) === */
function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  if (carousel && typeof bootstrap !== 'undefined') {
    new bootstrap.Carousel(carousel, { interval: 5000, ride: 'carousel' });
  }
}

/* === Navbar Mobile Menu Toggle === */
function initMobileMenu() {
  const toggler = document.querySelector('.navbar-toggler-custom');
  const navMenu = document.getElementById('navMenu');

  if (toggler && navMenu) {
    toggler.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const spans = toggler.querySelectorAll('span');
      if (navMenu.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggler.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('show');
        toggler.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      }
    });

    // Close on nav link click (mobile)
    navMenu.querySelectorAll('.nav-link-custom').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
      });
    });
  }
}

/* === Parallax Effect on Hero === */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* === Pricing Tab Filter (Fleet Page) === */
function initFleetFilter() {
  const filterBtns = document.querySelectorAll('.fleet-filter-btn');
  const fleetCards = document.querySelectorAll('.fleet-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      fleetCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* === Dropdown hover on desktop === */
function initDropdownHover() {
  if (window.innerWidth > 991) {
    document.querySelectorAll('.nav-item.dropdown').forEach(item => {
      item.addEventListener('mouseenter', function () {
        const dropdown = this.querySelector('.dropdown-menu-custom');
        if (dropdown) dropdown.style.display = 'block';
      });
      item.addEventListener('mouseleave', function () {
        const dropdown = this.querySelector('.dropdown-menu-custom');
        if (dropdown) dropdown.style.display = 'none';
      });
    });
  }
}

/* === Tour Package "Book Now" CTA handler === */
function initTourBooking() {
  document.querySelectorAll('.tour-book-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const pkg = this.getAttribute('data-package');
      const price = this.getAttribute('data-price');
      // Navigate to booking page with pre-filled info
      window.location.href = `booking.html?package=${encodeURIComponent(pkg)}&price=${encodeURIComponent(price)}`;
    });
  });
}

/* === Pre-fill booking form from URL params === */
function prefillBookingFromURL() {
  const params = new URLSearchParams(window.location.search);
  const packageName = params.get('package');
  const price = params.get('price');

  if (packageName) {
    const notesField = document.querySelector('[name="notes"]');
    if (notesField) {
      notesField.value = `Tour Package: ${packageName}${price ? ' - ₹' + price : ''}`;
    }
  }
}

/* === Initialize All === */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initVehicleSelector();
  validateBookingForm();
  validateContactForm();
  initRipple();
  initTestimonialCarousel();
  initParallax();
  initFleetFilter();
  initDropdownHover();
  initTourBooking();
  prefillBookingFromURL();

  // Stagger animate-on-scroll items in grid
  document.querySelectorAll('.row .animate-on-scroll').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  });
});

/* === Phone Call Tracking (optional UX) === */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => {
    console.log('Phone call initiated:', link.href);
  });
});
