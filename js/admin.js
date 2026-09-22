/**
 * INAYAT ELECTRONICS - Admin Dashboard Logic
 * Handles real-time product preview, CRUD operations, inventory search,
 * image uploading, JSON export/import, and UI tab management.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initLivePreview();
  initProductCreation();
  initInventoryManagement();
  initEditModal();
  initBackupSettings();
  renderDashboard();
});

let productToDeleteId = null;

/**
 * 1. Tab Navigation
 */
function initTabNavigation() {
  const navButtons = document.querySelectorAll('.nav-item-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchAdminTab(targetTab);
    });
  });
}

function switchAdminTab(tabName) {
  // Update sidebar buttons
  document.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });

  // Update tab panels
  document.querySelectorAll('.tab-content').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabName}`);
  });

  if (tabName === 'overview') {
    renderDashboard();
  } else if (tabName === 'inventory') {
    renderInventoryTable();
  }
}

/**
 * 2. Live Card Preview for "Post Product"
 */
function initLivePreview() {
  const nameInput = document.getElementById('postName');
  const catSelect = document.getElementById('postCategory');
  const tagInput = document.getElementById('postTag');
  const priceInput = document.getElementById('postPrice');
  const descInput = document.getElementById('postDesc');
  const imgInput = document.getElementById('postImage');
  const inStockCheck = document.getElementById('postInStock');
  const uploadInput = document.getElementById('postImageUpload');
  const presetButtons = document.querySelectorAll('.preset-img-btn');

  function updatePreview() {
    const previewContainer = document.getElementById('cardPreviewContainer');
    if (!previewContainer) return;

    const dummyProduct = {
      id: 'preview-card',
      name: nameInput.value.trim() || 'Sample Product Name',
      category: catSelect.value,
      tag: tagInput.value.trim() || (catSelect.options[catSelect.selectedIndex]?.text || 'Item'),
      price: priceInput.value.trim() || 'Ask on WhatsApp',
      description: descInput.value.trim() || 'Product description preview will appear here as you type...',
      image: imgInput.value.trim() || 'assets/images/solar-inverter.jpg',
      inStock: inStockCheck.checked
    };

    previewContainer.innerHTML = window.InayatProducts.createProductCardHTML(dummyProduct);
  }

  // Listen to inputs
  [nameInput, catSelect, tagInput, priceInput, descInput, imgInput].forEach(elem => {
    if (elem) elem.addEventListener('input', updatePreview);
  });

  if (catSelect) {
    catSelect.addEventListener('change', () => {
      // Auto-suggest tag based on category
      const catMap = window.InayatProducts.CATEGORIES[catSelect.value];
      if (catMap && !tagInput.value) {
        tagInput.value = catMap.tag;
      }
      updatePreview();
    });
  }

  if (inStockCheck) inStockCheck.addEventListener('change', updatePreview);

  // Preset gallery buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const chosenImg = btn.getAttribute('data-img');
      imgInput.value = chosenImg;
      updatePreview();
    });
  });

  // Local File Upload
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        imgInput.value = event.target.result;
        presetButtons.forEach(b => b.classList.remove('active'));
        updatePreview();
        showToast('Image uploaded and preview updated!');
      };
      reader.readAsDataURL(file);
    });
  }

  // Initial preview render
  updatePreview();
}

/**
 * 3. Product Creation Form Submission
 */
function initProductCreation() {
  const form = document.getElementById('productCreatorForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('postName').value.trim();
    const category = document.getElementById('postCategory').value;
    const tag = document.getElementById('postTag').value.trim();
    const price = document.getElementById('postPrice').value.trim();
    const description = document.getElementById('postDesc').value.trim();
    const image = document.getElementById('postImage').value.trim() || 'assets/images/distribution-board.jpg';
    const inStock = document.getElementById('postInStock').checked;

    if (!name || !description) {
      showToast('Please fill in product name and description', 'error');
      return;
    }

    const newProd = window.InayatProducts.addProduct({
      name,
      category,
      tag: tag || undefined,
      price: price || 'Ask on WhatsApp',
      description,
      image,
      inStock
    });

    showToast(`"${newProd.name}" successfully published!`);
    form.reset();
    document.getElementById('postImage').value = 'assets/images/solar-inverter.jpg';
    document.getElementById('postInStock').checked = true;

    // Refresh live preview and tables
    const previewContainer = document.getElementById('cardPreviewContainer');
    if (previewContainer) {
      previewContainer.innerHTML = window.InayatProducts.createProductCardHTML({
        id: 'preview-card',
        name: 'Sample Product Name',
        category: 'wiring',
        tag: 'Wiring',
        price: 'Ask on WhatsApp',
        description: 'Product description preview will appear here as you type...',
        image: 'assets/images/solar-inverter.jpg',
        inStock: true
      });
    }

    renderDashboard();
  });
}

/**
 * 4. Dashboard Stats & Recent Products Table
 */
function renderDashboard() {
  const products = window.InayatProducts.getAllProducts();

  // Counters
  document.getElementById('statTotalProducts').textContent = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  document.getElementById('statInStock').textContent = inStockCount;

  // Recent Table (first 5)
  const recentTableBody = document.getElementById('recentProductsTableBody');
  if (!recentTableBody) return;

  const recent = products.slice(0, 5);
  if (recent.length === 0) {
    recentTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--admin-text-muted);">No products found.</td></tr>`;
    return;
  }

  recentTableBody.innerHTML = recent.map(p => `
    <tr>
      <td>
        <div class="product-title-cell">
          <img src="${p.image}" class="product-row-thumb" alt="${p.name}" onerror="this.src='assets/images/distribution-board.jpg'">
          <div>
            <strong>${p.name}</strong>
            <p style="font-size: 0.8rem; color: var(--admin-text-muted); max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.description}</p>
          </div>
        </div>
      </td>
      <td><span class="badge-tag">${p.tag || p.category}</span></td>
      <td><strong>${p.price || 'Ask on WhatsApp'}</strong></td>
      <td>
        <span class="badge-status ${p.inStock ? 'in-stock' : 'out-of-stock'}">
          ${p.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </td>
    </tr>
  `).join('');
}

/**
 * 5. Inventory Management Table
 */
function initInventoryManagement() {
  const searchInput = document.getElementById('inventorySearch');
  const catFilter = document.getElementById('inventoryCategoryFilter');

  if (searchInput) searchInput.addEventListener('input', renderInventoryTable);
  if (catFilter) catFilter.addEventListener('change', renderInventoryTable);

  // Delete modal buttons
  const confirmDelBtn = document.getElementById('confirmDeleteBtn');
  const cancelDelBtn = document.getElementById('cancelDeleteBtn');
  const deleteModal = document.getElementById('deleteModal');

  if (cancelDelBtn) {
    cancelDelBtn.addEventListener('click', () => {
      deleteModal.classList.remove('open');
      productToDeleteId = null;
    });
  }

  if (confirmDelBtn) {
    confirmDelBtn.addEventListener('click', () => {
      if (productToDeleteId) {
        window.InayatProducts.deleteProduct(productToDeleteId);
        showToast('Product removed from catalog.');
        deleteModal.classList.remove('open');
        productToDeleteId = null;
        renderInventoryTable();
        renderDashboard();
      }
    });
  }
}

function renderInventoryTable() {
  const tableBody = document.getElementById('inventoryTableBody');
  if (!tableBody) return;

  const query = (document.getElementById('inventorySearch')?.value || '').toLowerCase().trim();
  const categoryFilter = document.getElementById('inventoryCategoryFilter')?.value || 'all';

  let products = window.InayatProducts.getAllProducts();

  if (categoryFilter !== 'all') {
    products = products.filter(p => p.category === categoryFilter);
  }

  if (query) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.tag && p.tag.toLowerCase().includes(query))
    );
  }

  if (products.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--admin-text-muted);">No matching products found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = products.map(p => `
    <tr data-id="${p.id}">
      <td>
        <div class="product-title-cell">
          <img src="${p.image}" class="product-row-thumb" alt="${p.name}" onerror="this.src='assets/images/distribution-board.jpg'">
          <div>
            <strong>${p.name}</strong>
            <p style="font-size: 0.8rem; color: var(--admin-text-muted); max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.description}</p>
          </div>
        </div>
      </td>
      <td><span class="badge-tag">${p.tag || p.category}</span></td>
      <td><strong>${p.price || 'Ask on WhatsApp'}</strong></td>
      <td>
        <button class="badge-status ${p.inStock ? 'in-stock' : 'out-of-stock'}" onclick="toggleProductStock('${p.id}')" title="Click to toggle status" style="border: none; cursor: pointer;">
          ${p.inStock ? 'In Stock' : 'Out of Stock'}
        </button>
      </td>
      <td>
        <a href="${window.INAYAT_CONFIG ? window.INAYAT_CONFIG.getWhatsAppUrl(`Hello, I want to ask about ${p.name} at Inayat Electronics.`) : '#'}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="padding: 5px 12px; font-size: 0.78rem;">
          Test WhatsApp
        </a>
      </td>
      <td style="text-align: right;">
        <div class="action-btn-group" style="justify-content: flex-end;">
          <button class="btn-icon-action" onclick="openEditModal('${p.id}')" title="Edit Product">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn-icon-action delete-btn" onclick="openDeleteModal('${p.id}', '${p.name.replace(/'/g, "\\'")}')" title="Delete Product">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.toggleProductStock = function (id) {
  const products = window.InayatProducts.getAllProducts();
  const p = products.find(prod => prod.id === id);
  if (p) {
    window.InayatProducts.updateProduct(id, { inStock: !p.inStock });
    showToast(`Stock updated: ${p.name} is now ${!p.inStock ? 'In Stock' : 'Out of Stock'}`);
    renderInventoryTable();
    renderDashboard();
  }
};

window.openDeleteModal = function (id, name) {
  productToDeleteId = id;
  const msg = document.getElementById('deleteModalMessage');
  if (msg) msg.textContent = `Are you sure you want to delete "${name}"? This action cannot be undone.`;
  document.getElementById('deleteModal')?.classList.add('open');
};

/**
 * 6. Edit Product Modal
 */
function initEditModal() {
  const modal = document.getElementById('editModal');
  const closeBtn = document.getElementById('closeEditModal');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const form = document.getElementById('productEditForm');

  const closeModal = () => modal?.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editId').value;
      const name = document.getElementById('editName').value.trim();
      const category = document.getElementById('editCategory').value;
      const tag = document.getElementById('editTag').value.trim();
      const price = document.getElementById('editPrice').value.trim();
      const description = document.getElementById('editDesc').value.trim();
      const image = document.getElementById('editImage').value.trim();
      const inStock = document.getElementById('editInStock').checked;

      window.InayatProducts.updateProduct(id, {
        name,
        category,
        tag,
        price,
        description,
        image,
        inStock
      });

      showToast(`Updated "${name}" successfully!`);
      closeModal();
      renderInventoryTable();
      renderDashboard();
    });
  }
}

window.openEditModal = function (id) {
  const products = window.InayatProducts.getAllProducts();
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  document.getElementById('editId').value = p.id;
  document.getElementById('editName').value = p.name || '';
  document.getElementById('editCategory').value = p.category || 'wiring';
  document.getElementById('editTag').value = p.tag || '';
  document.getElementById('editPrice').value = p.price || '';
  document.getElementById('editDesc').value = p.description || '';
  document.getElementById('editImage').value = p.image || '';
  document.getElementById('editInStock').checked = p.inStock !== false;

  document.getElementById('editModal')?.classList.add('open');
};

/**
 * 7. Backup & Catalog Settings
 */
function initBackupSettings() {
  const exportBtn = document.getElementById('btnExportJSON');
  const importBtn = document.getElementById('btnImportJSON');
  const importFileInput = document.getElementById('importJSONFile');
  const resetBtn = document.getElementById('btnResetDefaults');

  // Export
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(window.InayatProducts.exportJSON());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `inayat_products_backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Backup JSON downloaded successfully!');
    });
  }

  // Import
  if (importBtn && importFileInput) {
    importBtn.addEventListener('click', () => {
      const file = importFileInput.files[0];
      if (!file) {
        showToast('Please choose a JSON file first', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const res = window.InayatProducts.importJSON(e.target.result);
        if (res.success) {
          showToast(`Successfully restored ${res.count} products!`);
          renderDashboard();
          renderInventoryTable();
          importFileInput.value = '';
        } else {
          showToast(`Import error: ${res.error}`, 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  // Reset Defaults
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all products to the default 11 items? Any custom products will be replaced.')) {
        window.InayatProducts.resetToDefaults();
        showToast('Catalog reset to 11 original products.');
        renderDashboard();
        renderInventoryTable();
      }
    });
  }
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  if (type === 'error') toast.style.borderLeftColor = 'var(--admin-danger)';

  toast.innerHTML = `
    <span>${type === 'error' ? '⚠️' : '✓'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
