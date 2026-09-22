/**
 * INAYAT ELECTRONICS - Main Interactive Logic
 * Handles dynamic WhatsApp click-to-chat links, sticky navbar,
 * mobile drawer menu, FAQ accordion, and product category filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initStickyHeader();
  initMobileNavigation();
  initFaqAccordion();
  initProductFiltering();
  initContactForm();
  initSmoothScroll();
});

/**
 * 1. Initialize Central WhatsApp Links
 * Dynamically binds all WhatsApp triggers across the website to the centralized config.
 */
function initWhatsAppLinks() {
  const config = window.INAYAT_CONFIG;
  if (!config) return;

  // Query all buttons marked for WhatsApp actions
  const waButtons = document.querySelectorAll('[data-wa-action]');

  waButtons.forEach(btn => {
    const actionType = btn.getAttribute('data-wa-action');
    let message = config.WHATSAPP_MESSAGES.general;

    switch (actionType) {
      case 'home_wiring':
        message = config.WHATSAPP_MESSAGES.home_wiring;
        break;
      case 'electrical_repair':
        message = config.WHATSAPP_MESSAGES.electrical_repair;
        break;
      case 'fault_finding':
        message = config.WHATSAPP_MESSAGES.fault_finding;
        break;
      case 'fan_service':
        message = config.WHATSAPP_MESSAGES.fan_service;
        break;
      case 'led_lighting':
        message = config.WHATSAPP_MESSAGES.led_lighting;
        break;
      case 'solar_system':
        message = config.WHATSAPP_MESSAGES.solar_system;
        break;
      case 'solar_consultation':
        message = config.WHATSAPP_MESSAGES.solar_consultation;
        break;
      case 'product':
        const productName = btn.getAttribute('data-product-name') || 'electrical products';
        message = config.WHATSAPP_MESSAGES.product_inquiry(productName);
        break;
      case 'general':
      default:
        message = config.WHATSAPP_MESSAGES.general;
        break;
    }

    const url = config.getWhatsAppUrl(message);

    if (btn.tagName.toLowerCase() === 'a') {
      btn.setAttribute('href', url);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    } else {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }
  });

  // Also bind the floating WhatsApp button
  const floatingBtn = document.getElementById('floatingWhatsAppBtn');
  if (floatingBtn) {
    const url = config.getWhatsAppUrl(config.WHATSAPP_MESSAGES.general);
    floatingBtn.setAttribute('href', url);
    floatingBtn.setAttribute('target', '_blank');
    floatingBtn.setAttribute('rel', 'noopener noreferrer');
  }
}

/**
 * 2. Sticky Header with Scroll Detection
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 3. Mobile Navigation Drawer Toggle
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileBackdrop');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    toggleBtn.classList.add('open');
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    toggleBtn.classList.remove('open');
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  backdrop.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * 4. FAQ Accordion (Accessible & Smooth)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question-btn');
    if (!button) return;

    button.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all other items for a clean single-open accordion feel
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isCurrentlyActive) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 5. Product Category Filtering
 */
function initProductFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!filterButtons.length || !productCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-filter');

      // Update active state on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter product cards
      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/**
 * 6. Contact Form - Connects cleanly to WhatsApp or shows confirmation
 */
function initContactForm() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName')?.value.trim() || 'Valued Customer';
    const service = document.getElementById('formService')?.value || 'General Inquiry';
    const message = document.getElementById('formMessage')?.value.trim() || '';

    const formattedMessage = `Hello Inayat Electronics,\nMy Name: ${name}\nRequired Service: ${service}\nDetails: ${message || 'Please contact me regarding this service.'}`;

    const config = window.INAYAT_CONFIG;
    if (config) {
      const waUrl = config.getWhatsAppUrl(formattedMessage);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    const feedback = document.getElementById('formFeedback');
    if (feedback) {
      feedback.style.display = 'block';
      feedback.textContent = 'Inquiry generated! Redirecting to WhatsApp...';
      setTimeout(() => {
        feedback.style.display = 'none';
        form.reset();
      }, 4000);
    }
  });
}

/**
 * 7. Smooth Scroll & Active Nav Highlighting
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}
