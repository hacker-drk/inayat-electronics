/**
 * INAYAT ELECTRONICS - Product Data Layer & Storage
 * ==========================================================
 * Manages local storage persistence, CRUD methods, seed data,
 * and category definitions.
 */

(function () {
  const STORAGE_KEY = 'inayat_products_data';
  const PIN_STORAGE_KEY = 'inayat_admin_pin';
  const DEFAULT_PIN = '1234';

  // Categories mapping
  const CATEGORIES = {
    wiring: { id: 'wiring', name: 'Wiring & Protection', tag: 'Wiring' },
    fixtures: { id: 'fixtures', name: 'Lighting & Fans', tag: 'Lighting & Fans' },
    solar: { id: 'solar', name: 'Solar Energy', tag: 'Solar' },
    supplies: { id: 'supplies', name: 'Electrical Supplies', tag: 'Supplies' }
  };

  // Seed data representing the 11 default products with existing high quality images
  const DEFAULT_PRODUCTS = [
    {
      id: 'prod-1',
      name: 'Electrical Wiring Material',
      category: 'wiring',
      tag: 'Wiring',
      description: 'Quality PVC conduit pipes, junction boxes, casing-capping, ducting and electrical installation hardware.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/home-wiring.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:00:00.000Z'
    },
    {
      id: 'prod-2',
      name: 'Cables & Wires',
      category: 'wiring',
      tag: 'Wiring',
      description: 'High-grade pure copper single-core and multi-strand cables suitable for safe domestic and commercial load.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/cables-wires.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:01:00.000Z'
    },
    {
      id: 'prod-3',
      name: 'Switches & Sockets',
      category: 'supplies',
      tag: 'Supplies',
      description: 'Modern modular switch plates, universal power sockets, dimmers and multi-plug connection units.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/switches-sockets.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:02:00.000Z'
    },
    {
      id: 'prod-4',
      name: 'LED Lights',
      category: 'fixtures',
      tag: 'Lighting',
      description: 'Energy-saving SMD downlights, panel lights, floodlights, LED bulbs and architectural cove lighting strips.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/led-lighting.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:03:00.000Z'
    },
    {
      id: 'prod-5',
      name: 'Ceiling Fans',
      category: 'fixtures',
      tag: 'Fans',
      description: 'Durable AC and BLDC inverter ceiling fans designed for powerful air delivery and low electrical consumption.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/ceiling-fan.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:04:00.000Z'
    },
    {
      id: 'prod-6',
      name: 'Exhaust Fans',
      category: 'fixtures',
      tag: 'Fans',
      description: 'High-efficiency plastic and metal ventilation exhaust fans for kitchens, bathrooms and commercial spaces.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/exhaust-fan.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:05:00.000Z'
    },
    {
      id: 'prod-7',
      name: 'Electrical Accessories',
      category: 'supplies',
      tag: 'Supplies',
      description: 'Extension boards, insulation tapes, cable ties, testers, multi-plugs and reliable routine electrical fittings.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/cables-wires.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:06:00.000Z'
    },
    {
      id: 'prod-8',
      name: 'Solar Panels',
      category: 'solar',
      tag: 'Solar',
      description: 'High-efficiency monocrystalline solar PV panels engineered for maximum power generation in local climate.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/solar-installation.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:07:00.000Z'
    },
    {
      id: 'prod-9',
      name: 'Solar Inverters',
      category: 'solar',
      tag: 'Solar',
      description: 'On-grid, off-grid and smart hybrid solar inverters with pure sine wave output and battery management.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/solar-inverter.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:08:00.000Z'
    },
    {
      id: 'prod-10',
      name: 'Solar Batteries',
      category: 'solar',
      tag: 'Solar',
      description: 'Deep cycle tubular and lithium energy storage batteries for reliable backup during outages and night hours.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/solar-battery.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:09:00.000Z'
    },
    {
      id: 'prod-11',
      name: 'Protection & Distribution Equipment',
      category: 'wiring',
      tag: 'Protection',
      description: 'MCBs, MCCBs, changeover switches, surge protection devices (SPD) and safety distribution boxes.',
      price: 'Ask on WhatsApp',
      image: 'assets/images/distribution-board.jpg',
      inStock: true,
      createdAt: '2026-09-22T10:10:00.000Z'
    }
  ];

  // Initialize store if empty
  function initStorage() {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      }
    } catch (e) {
      console.warn('LocalStorage not accessible, running in-memory mode', e);
    }
  }

  // Get all products
  function getAllProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [...DEFAULT_PRODUCTS];
    } catch (e) {
      return [...DEFAULT_PRODUCTS];
    }
  }

  // Save all products
  function saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      // Notify any listeners across windows/tabs
      window.dispatchEvent(new CustomEvent('inayat-products-updated', { detail: products }));
      return true;
    } catch (e) {
      console.error('Failed to save products', e);
      return false;
    }
  }

  // Add new product
  function addProduct(product) {
    const products = getAllProducts();
    const newProduct = {
      id: 'prod-' + Date.now(),
      name: product.name || 'Unnamed Product',
      category: product.category || 'supplies',
      tag: product.tag || (CATEGORIES[product.category] ? CATEGORIES[product.category].tag : 'Item'),
      description: product.description || '',
      price: product.price || 'Ask on WhatsApp',
      image: product.image || 'assets/images/distribution-board.jpg',
      inStock: product.inStock !== false,
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    saveProducts(products);
    return newProduct;
  }

  // Update existing product
  function updateProduct(id, updatedData) {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedData,
      tag: updatedData.tag || (CATEGORIES[updatedData.category] ? CATEGORIES[updatedData.category].tag : products[index].tag),
      updatedAt: new Date().toISOString()
    };

    saveProducts(products);
    return products[index];
  }

  // Delete product
  function deleteProduct(id) {
    let products = getAllProducts();
    const initialLen = products.length;
    products = products.filter(p => p.id !== id);
    if (products.length !== initialLen) {
      saveProducts(products);
      return true;
    }
    return false;
  }

  // Reset to original 11 products
  function resetToDefaults() {
    saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  }

  // Export JSON string
  function exportJSON() {
    return JSON.stringify(getAllProducts(), null, 2);
  }

  // Import JSON string
  function importJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        saveProducts(parsed);
        return { success: true, count: parsed.length };
      }
      return { success: false, error: 'JSON is not a valid list of products' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // PIN code management
  function getPin() {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  }

  function setPin(newPin) {
    if (!newPin || newPin.length < 4) return false;
    localStorage.setItem(PIN_STORAGE_KEY, newPin);
    return true;
  }

  function verifyPin(inputPin) {
    return (inputPin || '').trim() === getPin().trim();
  }

  // Render product card HTML for public site or preview
  function createProductCardHTML(p) {
    const priceBadge = p.price && p.price !== 'Ask on WhatsApp' 
      ? `<span class="product-price-tag">${escapeHTML(p.price)}</span>` 
      : '';
    
    const stockBadge = !p.inStock 
      ? `<span class="product-stock-tag out-of-stock">Out of Stock</span>`
      : '';

    return `
      <article class="product-card" data-category="${escapeHTML(p.category)}" id="${escapeHTML(p.id)}">
        <div class="product-thumb-box">
          <span class="product-category-tag">${escapeHTML(p.tag || p.category)}</span>
          ${stockBadge}
          <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy" width="300" height="200" onerror="this.src='assets/images/distribution-board.jpg'">
        </div>
        <div class="product-info">
          <div class="product-title-row">
            <h3 class="product-name">${escapeHTML(p.name)}</h3>
            ${priceBadge}
          </div>
          <p class="product-description">${escapeHTML(p.description)}</p>
          <button class="btn btn-whatsapp btn-sm" data-wa-action="product" data-product-name="${escapeHTML(p.name)}">
            Ask on WhatsApp
          </button>
        </div>
      </article>
    `;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize
  initStorage();

  // Expose global namespace
  window.InayatProducts = {
    CATEGORIES,
    DEFAULT_PRODUCTS,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
    exportJSON,
    importJSON,
    getPin,
    setPin,
    verifyPin,
    createProductCardHTML
  };
})();
