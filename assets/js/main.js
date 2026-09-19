/* ============================================================
   SY Painting Hadapsar — Main JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ── DOM References ─────────────────────────────────────
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");
  const sections = document.querySelectorAll("section[id]");

  // ── Sticky Header & Scroll Handlers ────────────────────
  function handleScroll() {

    // Back to top visibility
    if (backToTop) {
      if (window.scrollY > 600) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    // Active nav link tracking
    updateActiveNav();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Run once on load

  // ── Mobile Navigation ──────────────────────────────────
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const navOverlay = document.querySelector(".nav-overlay");
  const navLinks = document.querySelectorAll(".nav-link");

  function openNav() {
    navToggle.classList.add("active");
    nav.classList.add("active");
    if (navOverlay) navOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    navToggle.classList.remove("active");
    nav.classList.remove("active");
    if (navOverlay) navOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      if (nav.classList.contains("active")) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", closeNav);
  }

  // Close mobile nav when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  // ── Active Nav Link on Scroll ──────────────────────────
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }

  // ── Smooth scroll for all anchor links ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ── Back to Top ────────────────────────────────────────
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ── Contact Form Handling ──────────────────────────────
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.querySelector(".form-success");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Basic validation
      if (!data.name || !data.phone || !data.message) {
        alert("Please fill in all required fields.");
        return;
      }

      // Phone number validation (Indian)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(data.phone.replace(/\s/g, ""))) {
        alert("Please enter a valid 10-digit phone number.");
        return;
      }

      /* 
       * ─── FORM BACKEND NOTE ───
       * To connect this form to a real backend, you have several options:
       *
       * Option 1: Formspree (easiest, free tier available)
       *   Change the form action to: https://formspree.io/f/YOUR_FORM_ID
       *   Remove this JS handler and let the form submit normally.
       *
       * Option 2: EmailJS (no server needed)
       *   Sign up at emailjs.com, get your keys, and use their SDK.
       *
       * Option 3: Google Forms / Google Sheets integration
       *   Create a Google Form, get the form action URL, and map fields.
       *
       * Option 4: WhatsApp redirect (quick & free)
       *   Build a WhatsApp message URL with form data (implemented below as fallback).
       */

      // WhatsApp fallback — sends form data as a WhatsApp message
      const whatsappMessage = encodeURIComponent(
        `Hello SY Painting Hadapsar!\n\n` +
        `Name: ${data.name}\n` +
        `Phone: ${data.phone}\n` +
        `Area: ${data.area || "Not specified"}\n` +
        `Service: ${data.service || "Not specified"}\n` +
        `Message: ${data.message}`
      );

      // Show success message
      contactForm.style.display = "none";
      if (formSuccess) formSuccess.classList.add("show");

      // Redirect to WhatsApp synchronously to avoid popup blockers
      window.location.href = `https://wa.me/919839170720?text=${whatsappMessage}`;

      // Reset form after 5 seconds
      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = "block";
        if (formSuccess) formSuccess.classList.remove("show");
      }, 5000);
    });
  }

  // ── Stat Counter Animation ─────────────────────────────
  const statNumbers = document.querySelectorAll(".stat-number");
  
  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stat = entry.target;
          const target = parseInt(stat.getAttribute("data-count"), 10);
          const suffix = stat.getAttribute("data-suffix") || "";
          if (!isNaN(target)) {
            const duration = 1800;
            const startTime = performance.now();
            
            function updateCount(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Cubic ease-out
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(easeOut * target);
              stat.textContent = current + suffix;
              
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                stat.textContent = target + suffix;
              }
            }
            requestAnimationFrame(updateCount);
          }
          observer.unobserve(stat);
        }
      });
    }, { threshold: 0.15 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
  } else {
    // Fallback: set targets directly
    statNumbers.forEach(stat => {
      const target = stat.getAttribute("data-count");
      const suffix = stat.getAttribute("data-suffix") || "";
      stat.textContent = target + suffix;
    });
  }

  // ── Current Year in Footer ─────────────────────────────
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});

