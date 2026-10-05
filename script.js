/**
 * Amit Singh — Portfolio & Resume Script
 * Features:
 * - Accessible responsive navigation drawer & backdrop
 * - Active link tracking via IntersectionObserver
 * - Header styling on scroll
 * - Dynamic project category filtering
 * - Animated stats counters
 * - Contact form validation & responsive feedback
 * - Dynamic copyright year
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Mobile Navigation Menu & Backdrop
  // -------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-btn');
  const header = document.getElementById('header');

  const openMobileMenu = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    menuBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeMobileMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    menuBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (menuBackdrop) {
      menuBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Header Style on Scroll
  // -------------------------------------------------------------------------
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // -------------------------------------------------------------------------
  // 3. Active Nav Link via Intersection Observer
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const mainNavLinks = document.querySelectorAll('.nav-list .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        mainNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // -------------------------------------------------------------------------
  // 4. Project Filtering
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active filter button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 5. Animated Number Counters
  // -------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.textContent.replace(/[0-9]/g, ''); // keep + or %
      const duration = 1200; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quad
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        stat.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // -------------------------------------------------------------------------
  // 6. Contact Form Validation & Feedback
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectSelect = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const setGroupError = (inputEl, isError) => {
    const group = inputEl.closest('.form-group');
    if (group) {
      if (isError) {
        group.classList.add('has-error');
      } else {
        group.classList.remove('has-error');
      }
    }
  };

  if (contactForm) {
    // Clear errors on input
    [nameInput, emailInput, subjectSelect, messageInput].forEach(field => {
      if (field) {
        field.addEventListener('input', () => {
          setGroupError(field, false);
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setGroupError(nameInput, true);
        isValid = false;
      } else {
        setGroupError(nameInput, false);
      }

      // Validate Email
      if (!validateEmail(emailInput.value.trim())) {
        setGroupError(emailInput, true);
        isValid = false;
      } else {
        setGroupError(emailInput, false);
      }

      // Validate Subject
      if (!subjectSelect.value) {
        setGroupError(subjectSelect, true);
        isValid = false;
      } else {
        setGroupError(subjectSelect, false);
      }

      // Validate Message
      if (messageInput.value.trim().length < 10) {
        setGroupError(messageInput, true);
        isValid = false;
      } else {
        setGroupError(messageInput, false);
      }

      if (!isValid) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please correct the highlighted fields above.';
        return;
      }

      // Simulated sending state
      submitBtn.disabled = true;
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Sending Message...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Thank you, ' + nameInput.value.trim() + '! Your message has been sent successfully. I will get back to you shortly.';
        contactForm.reset();

        setTimeout(() => {
          formStatus.style.display = 'none';
          formStatus.className = 'form-status';
        }, 6000);
      }, 1000);
    });
  }

  // -------------------------------------------------------------------------
  // 7. Dynamic Year in Footer
  // -------------------------------------------------------------------------
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
