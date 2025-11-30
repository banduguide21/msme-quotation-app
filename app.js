// QuoteFlow - MSME Quotation Management System

// In-memory data storage (replacing localStorage due to sandbox restrictions)
let appData = {
  quotes: [],
  settings: {
    companyName: 'Your Company Name',
    gstin: '',
    address: '',
    email: '',
    phone: '',
    logoUrl: '',
    defaultGST: 18,
    defaultValidity: 30,
    defaultPaymentTerms: 'Net 30 Days'
  },
  favorites: {
    items: [],
    customers: []
  },
  nextQuoteId: 1
};

// Initialize app on load
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  addInitialItem();
});

function initializeApp() {
  // Load settings into form
  loadSettings();
  
  // Render initial views
  renderQuotations();
  renderAnalytics();
  renderFavorites();
  
  showToast('Welcome to QuoteFlow!', 'success');
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });

  // Quote Form
  document.getElementById('quoteForm').addEventListener('submit', handleQuoteSubmit);
  document.getElementById('addItemBtn').addEventListener('click', addItemRow);
  document.getElementById('clearFormBtn').addEventListener('click', clearQuoteForm);
  document.getElementById('saveDraftBtn').addEventListener('click', saveDraft);
  document.getElementById('loadTemplateBtn').addEventListener('click', showTemplateSelector);

  // Calculations
  document.getElementById('gstRate').addEventListener('change', calculateTotals);
  document.getElementById('discountRate').addEventListener('input', calculateTotals);

  // Templates
  document.querySelectorAll('.template-card').forEach(card => {
    card.querySelector('button').addEventListener('click', function() {
      loadTemplate(card.dataset.template);
    });
  });

  // Settings
  document.getElementById('saveCompanyInfoBtn').addEventListener('click', saveCompanyInfo);
  document.getElementById('saveDefaultsBtn').addEventListener('click', saveDefaults);
  document.getElementById('exportDataBtn').addEventListener('click', exportData);
  document.getElementById('importDataBtn').addEventListener('click', () => {
    document.getElementById('importFileInput').click();
  });
  document.getElementById('importFileInput').addEventListener('change', importData);
  document.getElementById('resetAppBtn').addEventListener('click', resetApp);

  // Search and filters
  document.getElementById('searchQuotes').addEventListener('input', filterQuotations);
  document.getElementById('filterStatus').addEventListener('change', filterQuotations);
  document.getElementById('sortBy').addEventListener('change', filterQuotations);

  // Export all
  document.getElementById('exportAllBtn').addEventListener('click', exportAllQuotes);

  // Favorites
  document.getElementById('addFavoriteItemBtn').addEventListener('click', addFavoriteItem);

  // Modal close
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('quotePreviewModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // Help button
  document.getElementById('helpBtn').addEventListener('click', showHelp);
}

function switchTab(tabName) {
  // Update active tab
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Update active content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}Tab`).classList.add('active');

  // Refresh data if needed
  if (tabName === 'quotations') {
    renderQuotations();
  } else if (tabName === 'analytics') {
    renderAnalytics();
  } else if (tabName === 'favorites') {
    renderFavorites();
  }
}

function addItemRow() {
  const itemsList = document.getElementById('itemsList');
  const itemCount = itemsList.children.length + 1;
  
  const itemRow = document.createElement('div');
  itemRow.className = 'item-row';
  itemRow.innerHTML = `
    <div class="form-group">
      <label>Description *</label>
      <input type="text" class="item-description" required placeholder="Item or service description">
    </div>
    <div class="form-group">
      <label>Quantity *</label>
      <input type="number" class="item-quantity" min="1" value="1" required>
    </div>
    <div class="form-group">
      <label>Unit Price (₹) *</label>
      <input type="number" class="item-price" min="0" step="0.01" required>
    </div>
    <div class="form-group">
      <label>Amount (₹)</label>
      <input type="number" class="item-amount" readonly tabindex="-1">
    </div>
    <button type="button" class="btn-remove" aria-label="Remove item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
  
  itemsList.appendChild(itemRow);
  
  // Add event listeners for calculations
  const qtyInput = itemRow.querySelector('.item-quantity');
  const priceInput = itemRow.querySelector('.item-price');
  const removeBtn = itemRow.querySelector('.btn-remove');
  
  qtyInput.addEventListener('input', () => updateItemAmount(itemRow));
  priceInput.addEventListener('input', () => updateItemAmount(itemRow));
  removeBtn.addEventListener('click', () => {
    itemRow.remove();
    calculateTotals();
  });
}

function addInitialItem() {
  addItemRow();
}

function updateItemAmount(itemRow) {
  const qty = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
  const price = parseFloat(itemRow.querySelector('.item-price').value) || 0;
  const amount = qty * price;
  
  itemRow.querySelector('.item-amount').value = amount.toFixed(2);
  calculateTotals();
}

function calculateTotals() {
  let subtotal = 0;
  
  document.querySelectorAll('.item-row').forEach(row => {
    const amount = parseFloat(row.querySelector('.item-amount').value) || 0;
    subtotal += amount;
  });
  
  const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;
  const gstRate = parseFloat(document.getElementById('gstRate').value) || 0;
  
  const discountAmount = (subtotal * discountRate) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = (taxableAmount * gstRate) / 100;
  const total = taxableAmount + gstAmount;
  
  document.getElementById('subtotalDisplay').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('discountDisplay').textContent = `₹${discountAmount.toFixed(2)}`;
  document.getElementById('gstDisplay').textContent = `₹${gstAmount.toFixed(2)}`;
  document.getElementById('totalDisplay').textContent = `₹${total.toFixed(2)}`;
}

function handleQuoteSubmit(e) {
  e.preventDefault();
  
  const items = [];
  document.querySelectorAll('.item-row').forEach(row => {
    items.push({
      description: row.querySelector('.item-description').value,
      quantity: parseFloat(row.querySelector('.item-quantity').value),
      unitPrice: parseFloat(row.querySelector('.item-price').value),
      amount: parseFloat(row.querySelector('.item-amount').value)
    });
  });
  
  if (items.length === 0) {
    showToast('Please add at least one item', 'error');
    return;
  }
  
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;
  const gstRate = parseFloat(document.getElementById('gstRate').value) || 0;
  const discountAmount = (subtotal * discountRate) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = (taxableAmount * gstRate) / 100;
  const total = taxableAmount + gstAmount;
  
  const quote = {
    id: `QT-${String(appData.nextQuoteId).padStart(4, '0')}`,
    date: new Date().toISOString(),
    customer: {
      name: document.getElementById('customerName').value,
      company: document.getElementById('companyName').value,
      email: document.getElementById('customerEmail').value,
      phone: document.getElementById('customerPhone').value,
      gstin: document.getElementById('customerGSTIN').value,
      address: document.getElementById('billingAddress').value
    },
    items: items,
    subtotal: subtotal,
    discountRate: discountRate,
    discountAmount: discountAmount,
    gstRate: gstRate,
    gstAmount: gstAmount,
    total: total,
    validityDays: parseInt(document.getElementById('validityDays').value),
    paymentTerms: document.getElementById('paymentTerms').value,
    notes: document.getElementById('specialNotes').value,
    status: 'draft'
  };
  
  appData.quotes.push(quote);
  appData.nextQuoteId++;
  
  // Save customer to favorites if not exists
  if (quote.customer.name && !appData.favorites.customers.find(c => c.name === quote.customer.name)) {
    appData.favorites.customers.push(quote.customer);
  }
  
  showToast('Quotation created successfully!', 'success');
  showQuotePreview(quote);
  clearQuoteForm();
  renderQuotations();
  renderAnalytics();
}

function saveDraft() {
  const customerName = document.getElementById('customerName').value;
  if (!customerName) {
    showToast('Please enter customer name to save draft', 'warning');
    return;
  }
  
  handleQuoteSubmit(new Event('submit'));
  showToast('Draft saved successfully!', 'success');
}

function clearQuoteForm() {
  document.getElementById('quoteForm').reset();
  document.getElementById('itemsList').innerHTML = '';
  addInitialItem();
  calculateTotals();
}

function showQuotePreview(quote) {
  const modal = document.getElementById('quotePreviewModal');
  const content = document.getElementById('quotePreviewContent');
  
  const validUntil = new Date(quote.date);
  validUntil.setDate(validUntil.getDate() + quote.validityDays);
  
  content.innerHTML = `
    <div class="quote-preview">
      <div class="preview-header">
        <div class="preview-company">
          ${appData.settings.logoUrl ? `<img src="${appData.settings.logoUrl}" alt="Company Logo" class="preview-logo">` : ''}
          <h2>${appData.settings.companyName}</h2>
          <p>${appData.settings.address}</p>
          <p>${appData.settings.email} | ${appData.settings.phone}</p>
          ${appData.settings.gstin ? `<p>GSTIN: ${appData.settings.gstin}</p>` : ''}
        </div>
        <div>
          <h3>QUOTATION</h3>
          <p><strong>${quote.id}</strong></p>
          <p>${new Date(quote.date).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div class="preview-info">
        <div class="preview-section">
          <h3>Bill To</h3>
          <p><strong>${quote.customer.name}</strong></p>
          ${quote.customer.company ? `<p>${quote.customer.company}</p>` : ''}
          ${quote.customer.address ? `<p>${quote.customer.address}</p>` : ''}
          ${quote.customer.email ? `<p>${quote.customer.email}</p>` : ''}
          ${quote.customer.phone ? `<p>${quote.customer.phone}</p>` : ''}
          ${quote.customer.gstin ? `<p>GSTIN: ${quote.customer.gstin}</p>` : ''}
        </div>
        <div class="preview-section">
          <h3>Quote Details</h3>
          <p><strong>Valid Until:</strong> ${validUntil.toLocaleDateString()}</p>
          <p><strong>Payment Terms:</strong> ${quote.paymentTerms}</p>
        </div>
      </div>
      
      <table class="preview-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${quote.items.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>₹${item.unitPrice.toFixed(2)}</td>
              <td>₹${item.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="preview-totals">
        <div class="preview-total-row">
          <span>Subtotal:</span>
          <span>₹${quote.subtotal.toFixed(2)}</span>
        </div>
        ${quote.discountAmount > 0 ? `
          <div class="preview-total-row">
            <span>Discount (${quote.discountRate}%):</span>
            <span>-₹${quote.discountAmount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="preview-total-row">
          <span>GST (${quote.gstRate}%):</span>
          <span>₹${quote.gstAmount.toFixed(2)}</span>
        </div>
        <div class="preview-total-row grand-total">
          <span>Total Amount:</span>
          <span>₹${quote.total.toFixed(2)}</span>
        </div>
      </div>
      
      ${quote.notes ? `
        <div class="preview-notes">
          <h3>Terms &amp; Conditions / Notes</h3>
          <p>${quote.notes.replace(/\n/g, '<br>')}</p>
        </div>
      ` : ''}
    </div>
  `;
  
  modal.classList.add('active');
  
  // Setup modal buttons
  document.getElementById('printQuoteBtn').onclick = () => window.print();
  document.getElementById('emailQuoteBtn').onclick = () => emailQuote(quote);
  document.getElementById('whatsappQuoteBtn').onclick = () => whatsappQuote(quote);
}

function closeModal() {
  document.getElementById('quotePreviewModal').classList.remove('active');
}

function emailQuote(quote) {
  const subject = `Quotation ${quote.id} from ${appData.settings.companyName}`;
  const body = `Dear ${quote.customer.name},\n\nPlease find attached quotation ${quote.id} for your review.\n\nQuotation Summary:\nTotal Amount: ₹${quote.total.toFixed(2)}\nValid Until: ${new Date(new Date(quote.date).getTime() + quote.validityDays * 86400000).toLocaleDateString()}\n\nThank you for your business!\n\nBest regards,\n${appData.settings.companyName}`;
  
  window.open(`mailto:${quote.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
}

function whatsappQuote(quote) {
  const message = `*Quotation ${quote.id}*\n\nDear ${quote.customer.name},\n\nThank you for your interest! Here's your quotation summary:\n\n💰 Total Amount: ₹${quote.total.toFixed(2)}\n📅 Valid Until: ${new Date(new Date(quote.date).getTime() + quote.validityDays * 86400000).toLocaleDateString()}\n\nFor detailed quotation, please contact us at ${appData.settings.email}\n\nThank you!\n${appData.settings.companyName}`;
  
  const phone = quote.customer.phone ? quote.customer.phone.replace(/[^0-9]/g, '') : '';
  const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
  
  window.open(url, '_blank');
}

function renderQuotations() {
  const container = document.getElementById('quotationsList');
  
  if (appData.quotes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <h3>No quotations yet</h3>
        <p>Create your first quotation to get started</p>
      </div>
    `;
    return;
  }
  
  const sortedQuotes = getSortedQuotes();
  
  container.innerHTML = sortedQuotes.map(quote => {
    const validUntil = new Date(quote.date);
    validUntil.setDate(validUntil.getDate() + quote.validityDays);
    const isExpired = validUntil < new Date();
    
    return `
      <div class="quote-card" data-quote-id="${quote.id}">
        <div class="quote-header">
          <div class="quote-id">${quote.id}</div>
          <span class="quote-status status-${quote.status}">${quote.status.toUpperCase()}</span>
        </div>
        <div class="quote-customer">${quote.customer.name}</div>
        ${quote.customer.company ? `<div class="quote-company">${quote.customer.company}</div>` : ''}
        <div class="quote-details">
          <div class="quote-detail-row">
            <span>Date:</span>
            <span>${new Date(quote.date).toLocaleDateString()}</span>
          </div>
          <div class="quote-detail-row">
            <span>Valid Until:</span>
            <span style="color: ${isExpired ? 'var(--error)' : 'inherit'}">
              ${validUntil.toLocaleDateString()} ${isExpired ? '(Expired)' : ''}
            </span>
          </div>
          <div class="quote-detail-row">
            <span>Items:</span>
            <span>${quote.items.length}</span>
          </div>
          <div class="quote-detail-row">
            <span><strong>Total:</strong></span>
            <span class="quote-amount">₹${quote.total.toFixed(2)}</span>
          </div>
        </div>
        <div class="quote-actions">
          <button class="btn-icon" onclick="viewQuote('${quote.id}')" title="View">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button class="btn-icon" onclick="duplicateQuote('${quote.id}')" title="Duplicate">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
          <button class="btn-icon" onclick="updateQuoteStatus('${quote.id}')" title="Update Status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </button>
          <button class="btn-icon" onclick="deleteQuote('${quote.id}')" title="Delete" style="color: var(--error);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function getSortedQuotes() {
  const searchTerm = document.getElementById('searchQuotes').value.toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;
  const sortBy = document.getElementById('sortBy').value;
  
  let filtered = appData.quotes.filter(quote => {
    const matchesSearch = quote.customer.name.toLowerCase().includes(searchTerm) ||
                         (quote.customer.company && quote.customer.company.toLowerCase().includes(searchTerm)) ||
                         quote.id.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  filtered.sort((a, b) => {
    switch(sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.total - a.total;
      case 'amount-asc':
        return a.total - b.total;
      default:
        return 0;
    }
  });
  
  return filtered;
}

function filterQuotations() {
  renderQuotations();
}

function viewQuote(quoteId) {
  const quote = appData.quotes.find(q => q.id === quoteId);
  if (quote) {
    showQuotePreview(quote);
  }
}

function duplicateQuote(quoteId) {
  const quote = appData.quotes.find(q => q.id === quoteId);
  if (!quote) return;
  
  // Populate form
  document.getElementById('customerName').value = quote.customer.name;
  document.getElementById('companyName').value = quote.customer.company || '';
  document.getElementById('customerEmail').value = quote.customer.email || '';
  document.getElementById('customerPhone').value = quote.customer.phone || '';
  document.getElementById('customerGSTIN').value = quote.customer.gstin || '';
  document.getElementById('billingAddress').value = quote.customer.address || '';
  document.getElementById('gstRate').value = quote.gstRate;
  document.getElementById('discountRate').value = quote.discountRate;
  document.getElementById('validityDays').value = quote.validityDays;
  document.getElementById('paymentTerms').value = quote.paymentTerms;
  document.getElementById('specialNotes').value = quote.notes || '';
  
  // Clear and add items
  document.getElementById('itemsList').innerHTML = '';
  quote.items.forEach(item => {
    addItemRow();
    const lastRow = document.querySelector('.item-row:last-child');
    lastRow.querySelector('.item-description').value = item.description;
    lastRow.querySelector('.item-quantity').value = item.quantity;
    lastRow.querySelector('.item-price').value = item.unitPrice;
    updateItemAmount(lastRow);
  });
  
  switchTab('create');
  showToast('Quote duplicated! Modify and save as new.', 'success');
}

function updateQuoteStatus(quoteId) {
  const quote = appData.quotes.find(q => q.id === quoteId);
  if (!quote) return;
  
  const statuses = ['draft', 'sent', 'accepted', 'rejected'];
  const currentIndex = statuses.indexOf(quote.status);
  const nextIndex = (currentIndex + 1) % statuses.length;
  quote.status = statuses[nextIndex];
  
  renderQuotations();
  renderAnalytics();
  showToast(`Status updated to ${quote.status}`, 'success');
}

function deleteQuote(quoteId) {
  if (!confirm('Are you sure you want to delete this quotation?')) return;
  
  appData.quotes = appData.quotes.filter(q => q.id !== quoteId);
  renderQuotations();
  renderAnalytics();
  showToast('Quotation deleted', 'success');
}

function renderAnalytics() {
  const totalQuotes = appData.quotes.length;
  const totalValue = appData.quotes.reduce((sum, q) => sum + q.total, 0);
  const acceptedQuotes = appData.quotes.filter(q => q.status === 'accepted').length;
  const conversionRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes * 100).toFixed(1) : 0;
  
  const now = new Date();
  const activeQuotes = appData.quotes.filter(q => {
    const validUntil = new Date(q.date);
    validUntil.setDate(validUntil.getDate() + q.validityDays);
    return validUntil >= now && q.status !== 'rejected';
  }).length;
  
  document.getElementById('statTotalQuotes').textContent = totalQuotes;
  document.getElementById('statTotalValue').textContent = `₹${totalValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
  document.getElementById('statConversionRate').textContent = `${conversionRate}%`;
  document.getElementById('statActiveQuotes').textContent = activeQuotes;
  
  // Recent activity
  const recentActivity = document.getElementById('recentActivity');
  const recent = appData.quotes.slice(-5).reverse();
  
  if (recent.length === 0) {
    recentActivity.innerHTML = '<p class="empty-state">No recent activity</p>';
  } else {
    recentActivity.innerHTML = recent.map(quote => `
      <div class="activity-item">
        <div>
          <strong>${quote.id}</strong> - ${quote.customer.name}
          <br>
          <small>${new Date(quote.date).toLocaleDateString()}</small>
        </div>
        <div>
          <span class="quote-status status-${quote.status}">${quote.status.toUpperCase()}</span>
          <br>
          <strong>₹${quote.total.toFixed(2)}</strong>
        </div>
      </div>
    `).join('');
  }
}

function renderFavorites() {
  // Render favorite items
  const itemsList = document.getElementById('favoriteItemsList');
  if (appData.favorites.items.length === 0) {
    itemsList.innerHTML = '<p class="empty-state">No saved items yet</p>';
  } else {
    itemsList.innerHTML = appData.favorites.items.map((item, index) => `
      <div class="favorite-item">
        <div>
          <strong>${item.description}</strong><br>
          <small>₹${item.price} per ${item.unit || 'unit'}</small>
        </div>
        <button class="btn-icon" onclick="removeFavoriteItem(${index})" title="Remove">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `).join('');
  }
  
  // Render favorite customers
  const customersList = document.getElementById('favoriteCustomersList');
  if (appData.favorites.customers.length === 0) {
    customersList.innerHTML = '<p class="empty-state">No saved customers yet</p>';
  } else {
    customersList.innerHTML = appData.favorites.customers.map((customer, index) => `
      <div class="favorite-item">
        <div>
          <strong>${customer.name}</strong><br>
          <small>${customer.company || customer.email || ''}</small>
        </div>
        <button class="btn-icon" onclick="loadCustomer(${index})" title="Load">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
    `).join('');
  }
}

function addFavoriteItem() {
  const description = prompt('Item Description:');
  if (!description) return;
  
  const price = prompt('Unit Price (₹):');
  if (!price) return;
  
  const unit = prompt('Unit (e.g., pcs, hrs, kg):') || 'unit';
  
  appData.favorites.items.push({
    description,
    price: parseFloat(price),
    unit
  });
  
  renderFavorites();
  showToast('Item added to favorites', 'success');
}

function removeFavoriteItem(index) {
  appData.favorites.items.splice(index, 1);
  renderFavorites();
}

function loadCustomer(index) {
  const customer = appData.favorites.customers[index];
  document.getElementById('customerName').value = customer.name || '';
  document.getElementById('companyName').value = customer.company || '';
  document.getElementById('customerEmail').value = customer.email || '';
  document.getElementById('customerPhone').value = customer.phone || '';
  document.getElementById('customerGSTIN').value = customer.gstin || '';
  document.getElementById('billingAddress').value = customer.address || '';
  
  switchTab('create');
  showToast('Customer details loaded', 'success');
}

function loadTemplate(templateType) {
  clearQuoteForm();
  
  const templates = {
    product: {
      items: [
        { desc: 'Product Name - Model/SKU', qty: 1, price: 0 },
        { desc: 'Installation Charges', qty: 1, price: 0 }
      ],
      payment: '50% Advance, 50% on Delivery',
      notes: 'Warranty: 1 Year\nDelivery: 7-10 business days\nFree installation included'
    },
    service: {
      items: [
        { desc: 'Service Description - Hours/Days', qty: 1, price: 0 },
        { desc: 'Additional Support', qty: 1, price: 0 }
      ],
      payment: 'Net 15 Days',
      notes: 'Service will be provided at client location\nAll tools and materials included\nSupport available during business hours'
    },
    project: {
      items: [
        { desc: 'Phase 1: Planning and Design', qty: 1, price: 0 },
        { desc: 'Phase 2: Development', qty: 1, price: 0 },
        { desc: 'Phase 3: Testing and Deployment', qty: 1, price: 0 }
      ],
      payment: '30% on signing, 40% on Phase 2, 30% on completion',
      notes: 'Project duration: 3 months\nWeekly progress updates\nDedicated project manager assigned'
    },
    amc: {
      items: [
        { desc: 'Annual Maintenance Contract - 12 Months', qty: 1, price: 0 },
        { desc: 'Quarterly Preventive Maintenance', qty: 4, price: 0 }
      ],
      payment: 'Annual payment or Quarterly installments',
      notes: 'Contract Duration: 12 Months\n24/7 Support hotline\nFree parts replacement\nPriority service'
    }
  };
  
  const template = templates[templateType];
  if (!template) return;
  
  // Add items
  template.items.forEach(item => {
    addItemRow();
    const lastRow = document.querySelector('.item-row:last-child');
    lastRow.querySelector('.item-description').value = item.desc;
    lastRow.querySelector('.item-quantity').value = item.qty;
    lastRow.querySelector('.item-price').value = item.price;
    updateItemAmount(lastRow);
  });
  
  document.getElementById('paymentTerms').value = template.payment;
  document.getElementById('specialNotes').value = template.notes;
  
  switchTab('create');
  showToast(`${templateType.toUpperCase()} template loaded`, 'success');
}

function showTemplateSelector() {
  switchTab('templates');
}

function loadSettings() {
  document.getElementById('settingsCompanyName').value = appData.settings.companyName;
  document.getElementById('settingsGSTIN').value = appData.settings.gstin;
  document.getElementById('settingsAddress').value = appData.settings.address;
  document.getElementById('settingsEmail').value = appData.settings.email;
  document.getElementById('settingsPhone').value = appData.settings.phone;
  document.getElementById('settingsLogoUrl').value = appData.settings.logoUrl;
  document.getElementById('settingsDefaultGST').value = appData.settings.defaultGST;
  document.getElementById('settingsDefaultValidity').value = appData.settings.defaultValidity;
  document.getElementById('settingsDefaultPaymentTerms').value = appData.settings.defaultPaymentTerms;
}

function saveCompanyInfo() {
  appData.settings.companyName = document.getElementById('settingsCompanyName').value;
  appData.settings.gstin = document.getElementById('settingsGSTIN').value;
  appData.settings.address = document.getElementById('settingsAddress').value;
  appData.settings.email = document.getElementById('settingsEmail').value;
  appData.settings.phone = document.getElementById('settingsPhone').value;
  appData.settings.logoUrl = document.getElementById('settingsLogoUrl').value;
  
  showToast('Company information saved', 'success');
}

function saveDefaults() {
  appData.settings.defaultGST = parseInt(document.getElementById('settingsDefaultGST').value);
  appData.settings.defaultValidity = parseInt(document.getElementById('settingsDefaultValidity').value);
  appData.settings.defaultPaymentTerms = document.getElementById('settingsDefaultPaymentTerms').value;
  
  // Apply to current form if empty
  if (!document.getElementById('gstRate').value) {
    document.getElementById('gstRate').value = appData.settings.defaultGST;
  }
  if (!document.getElementById('validityDays').value) {
    document.getElementById('validityDays').value = appData.settings.defaultValidity;
  }
  
  showToast('Default settings saved', 'success');
}

function exportData() {
  const dataStr = JSON.stringify(appData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `quoteflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  showToast('Data exported successfully', 'success');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (confirm('This will replace all existing data. Continue?')) {
        appData = imported;
        renderQuotations();
        renderAnalytics();
        renderFavorites();
        loadSettings();
        showToast('Data imported successfully', 'success');
      }
    } catch (error) {
      showToast('Invalid data file', 'error');
    }
  };
  reader.readAsText(file);
  
  event.target.value = '';
}

function exportAllQuotes() {
  if (appData.quotes.length === 0) {
    showToast('No quotations to export', 'warning');
    return;
  }
  
  const csv = generateCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `quotations-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  
  showToast('Quotations exported to CSV', 'success');
}

function generateCSV() {
  const headers = ['Quote ID', 'Date', 'Customer', 'Company', 'Email', 'Total', 'Status'];
  const rows = appData.quotes.map(q => [
    q.id,
    new Date(q.date).toLocaleDateString(),
    q.customer.name,
    q.customer.company || '',
    q.customer.email || '',
    q.total.toFixed(2),
    q.status
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function resetApp() {
  if (!confirm('This will delete ALL data including quotations, settings, and favorites. This action cannot be undone. Continue?')) {
    return;
  }
  
  if (!confirm('Are you absolutely sure? This is your last chance to cancel.')) {
    return;
  }
  
  appData = {
    quotes: [],
    settings: {
      companyName: 'Your Company Name',
      gstin: '',
      address: '',
      email: '',
      phone: '',
      logoUrl: '',
      defaultGST: 18,
      defaultValidity: 30,
      defaultPaymentTerms: 'Net 30 Days'
    },
    favorites: {
      items: [],
      customers: []
    },
    nextQuoteId: 1
  };
  
  clearQuoteForm();
  renderQuotations();
  renderAnalytics();
  renderFavorites();
  loadSettings();
  
  showToast('All data has been reset', 'success');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showHelp() {
  const helpText = `QuoteFlow - Quick Help\n\n` +
    `1. Create Quote: Fill in customer details and add items to generate quotations\n` +
    `2. Templates: Use pre-built templates for common quote types\n` +
    `3. My Quotations: View, search, and manage all quotations\n` +
    `4. Analytics: Track conversion rates and business metrics\n` +
    `5. Favorites: Save frequently used items and customers\n` +
    `6. Settings: Configure company details and defaults\n\n` +
    `Share quotations via WhatsApp, Email, or Print to PDF\n` +
    `All data is stored locally in your browser.`;
  
  alert(helpText);
}