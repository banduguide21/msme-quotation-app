// ===== MSME QUOTATION APP v3.0 - COMPLETE APPLICATION =====
// Features: GST Optional, TDS, Analytics, Favorites, Recurring Items, Dark Mode, Status Tracking

let quotes = [];
let favorites = { customers: [], items: [], paymentTerms: [] };
let recurringItems = [];
let appSettings = { companyName: '', gstin: '', logoUrl: '', paymentTerms: '' };
let currentQuote = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupTabNavigation();
    setupQuoteForm();
    setupQuotationsList();
    setupRecurringItems();
    setupSettings();
    setupDarkMode();
    initializeTaxCompliance();
    updateAnalyticsDashboard();
    renderQuotationsList();
    updateFavoritesList();
    renderRecurringItems();
    setupKeyboardShortcuts();
});

// ===== TAB NAVIGATION =====
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            if (tabName === 'analytics') {
                updateAnalyticsDashboard();
            }
        });
    });
}

// ===== QUOTE FORM SETUP =====
function setupQuoteForm() {
    const addItemBtn = document.getElementById('addItemBtn');
    addItemBtn.addEventListener('click', addItemRow);
    addItemRow();
    
    const addToFavBtn = document.getElementById('addToFavoritesBtn');
    addToFavBtn.addEventListener('click', saveCustomerToFavorites);
}

function addItemRow() {
    const container = document.getElementById('itemsContainer');
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
        <input type="text" placeholder="Item/Service description" class="item-description" required>
        <input type="number" placeholder="Qty" class="item-qty" value="1" min="1" required>
        <input type="number" placeholder="Price" class="item-price" value="0" min="0" step="0.01" required>
        <input type="number" placeholder="Amount" class="item-amount" readonly>
        <button type="button" class="remove-item-btn" onclick="removeItemRow(this)">Remove</button>
    `;
    
    row.querySelector('.item-qty').addEventListener('change', calculateItemAmount);
    row.querySelector('.item-price').addEventListener('change', calculateItemAmount);
    container.appendChild(row);
}

function removeItemRow(btn) {
    btn.closest('.item-row').remove();
}

function calculateItemAmount(e) {
    const row = e.target.closest('.item-row');
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    row.querySelector('.item-amount').value = (qty * price).toFixed(2);
}

function saveCustomerToFavorites() {
    const name = document.getElementById('customerName').value;
    const company = document.getElementById('companyName').value;
    
    if (!name) {
        alert('⚠️ Please enter customer name first');
        return;
    }
    
    const customer = { name, company };
    const existing = favorites.customers.find(c => c.name === name);
    
    if (!existing) {
        favorites.customers.push(customer);
        saveData();
        updateFavoritesList();
        alert('✅ Customer saved to favorites!');
    } else {
        alert('ℹ️ This customer is already in favorites');
    }
}

// ===== DARK MODE =====
function setupDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    toggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===== KEYBOARD SHORTCUTS =====
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            document.querySelector('[data-tab="create"]').click();
            document.getElementById('quoteForm').reset();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            document.querySelector('[data-tab="list"]').click();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('searchQuotes').focus();
        }
    });
}

// ===== INDIAN TAX COMPLIANCE - GST OPTIONAL & TDS =====
function setupGSTOptional() {
    const gstCheckbox = document.getElementById('gstApplicable');
    const gstSection = document.getElementById('gstSection');
    const gstRateSelect = document.getElementById('gstRate');
    
    gstCheckbox.addEventListener('change', function() {
        gstSection.style.display = this.checked ? 'block' : 'none';
    });
    
    gstRateSelect.addEventListener('change', function() {
        const customDiv = document.getElementById('customGstDiv');
        customDiv.style.display = this.value === 'custom' ? 'block' : 'none';
    });
}

function setupTDS() {
    const tdsCheckbox = document.getElementById('tdsApplicable');
    const tdsSection = document.getElementById('tdsSection');
    const tdsSectionSelect = document.getElementById('tdsSectionType');
    const tdsAppliesTo = document.getElementById('tdsAppliesTo');
    const tdsManualAmount = document.getElementById('tdsManualAmount');
    
    tdsCheckbox.addEventListener('change', function() {
        tdsSection.style.display = this.checked ? 'block' : 'none';
    });
    
    const tdsRates = { '194c': 1, '194j': 10, '194o': 1, '194ad': 2, '194la': 1, '194lb': 2 };
    
    tdsSectionSelect.addEventListener('change', function() {
        document.getElementById('tdsRate').value = tdsRates[this.value] || 0;
    });
    
    tdsAppliesTo.addEventListener('change', function() {
        tdsManualAmount.style.display = this.value === 'manual' ? 'block' : 'none';
    });
}

function calculateTaxes() {
    const subtotal = document.querySelectorAll('.item-row').reduce((sum, row) => {
        return sum + (parseFloat(row.querySelector('.item-amount').value) || 0);
    }, 0);
    
    const discountType = document.getElementById('discountType').value;
    const discountValue = parseFloat(document.getElementById('discount').value) || 0;
    const discountAmount = discountType === 'percentage' ? (subtotal * discountValue) / 100 : discountValue;
    const amountAfterDiscount = subtotal - discountAmount;
    
    let gstAmount = 0, gstRate = 0;
    if (document.getElementById('gstApplicable').checked) {
        const selectedRate = document.getElementById('gstRate').value;
        gstRate = selectedRate === 'custom' ? parseFloat(document.getElementById('customGstValue').value) || 0 : parseFloat(selectedRate);
        gstAmount = (amountAfterDiscount * gstRate) / 100;
    }
    
    let tdsAmount = 0, tdsRate = 0;
    if (document.getElementById('tdsApplicable').checked) {
        tdsRate = parseFloat(document.getElementById('tdsRate').value) || 0;
        let tdsTaxableAmount = amountAfterDiscount;
        const tdsAppliesTo = document.getElementById('tdsAppliesTo').value;
        if (tdsAppliesTo === 'abovebasic') tdsTaxableAmount = Math.max(0, amountAfterDiscount - 30000);
        else if (tdsAppliesTo === 'manual') tdsTaxableAmount = parseFloat(document.getElementById('tdsManualValue').value) || 0;
        tdsAmount = (tdsTaxableAmount * tdsRate) / 100;
    }
    
    return {
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        discountPct: discountValue,
        amountAfterDiscount: amountAfterDiscount.toFixed(2),
        gstRate, gstAmount: gstAmount.toFixed(2),
        tdsRate, tdsAmount: tdsAmount.toFixed(2),
        total: (amountAfterDiscount + gstAmount - tdsAmount).toFixed(2),
        gstApplicable: document.getElementById('gstApplicable').checked,
        tdsApplicable: document.getElementById('tdsApplicable').checked,
        gstExemptionType: document.getElementById('gstExemptionType').value
    };
}

function generateQuoteWithTaxCompliance(e) {
    e.preventDefault();
    
    const items = [];
    document.querySelectorAll('.item-row').forEach(row => {
        const description = row.querySelector('.item-description').value;
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const amount = qty * price;
        if (description && amount > 0) items.push({ description, qty, price, amount });
    });
    
    if (items.length === 0) {
        alert('⚠️ Please add at least one item/service');
        return;
    }
    
    const taxes = calculateTaxes();
    const quote = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-IN'),
        customerName: document.getElementById('customerName').value,
        companyName: document.getElementById('companyName').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerGstin: document.getElementById('gstin').value,
        yourCompanyName: document.getElementById('yourCompanyName').value || appSettings.companyName,
        yourGstin: document.getElementById('yourGstinOptional').value || appSettings.gstin,
        logoUrl: document.getElementById('logoUrl').value || appSettings.logoUrl,
        items, ...taxes,
        tdsSectionType: document.getElementById('tdsSectionType').value,
        validity: document.getElementById('validity').value,
        paymentTerms: document.getElementById('paymentTerms').value,
        discountReason: document.getElementById('discountReason').value,
        specialNotes: document.getElementById('specialNotes').value,
        status: 'Draft'
    };
    
    quotes.push(quote);
    saveData();
    currentQuote = quote;
    showPreviewWithCompliance(quote);
}

function generateQuoteHTMLWithCompliance(quote) {
    const validTill = new Date();
    validTill.setDate(validTill.getDate() + parseInt(quote.validity));
    
    const itemsHTML = quote.items.map((item, idx) => `
        <tr>
            <td>${idx + 1}. ${item.description}</td>
            <td style="text-align: center;">${item.qty}</td>
            <td style="text-align: right;">₹${parseFloat(item.price).toFixed(2)}</td>
            <td style="text-align: right;">₹${parseFloat(item.amount).toFixed(2)}</td>
        </tr>
    `).join('');
    
    return `
        <div class="quote-preview">
            ${quote.logoUrl ? `<img src="${quote.logoUrl}" alt="Logo" style="max-width: 100px; margin-bottom: 20px;" onerror="this.style.display='none'">` : ''}
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #667eea; padding-bottom: 15px; margin-bottom: 20px;">
                <div><h3>${quote.yourCompanyName}</h3>
                ${quote.yourGstin ? `<p>GSTIN: ${quote.yourGstin}</p>` : ''}</div>
                <div style="text-align: right;"><p><b>Quote #${quote.id.toString().slice(-6)}</b></p>
                <p>Date: ${quote.date}</p></div>
            </div>
            <h4>Bill To:</h4>
            <p><b>${quote.customerName}</b></p>
            ${quote.companyName ? `<p>${quote.companyName}</p>` : ''}
            ${quote.customerGstin ? `<p>GSTIN: ${quote.customerGstin}</p>` : ''}
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
                <tbody>${itemsHTML}</tbody>
            </table>
            <div class="tax-summary">
                <h5>Tax Breakdown</h5>
                <div class="tax-summary-row"><span>Subtotal</span><span style="color: #667eea; font-weight: 600;">₹${parseFloat(quote.subtotal).toFixed(2)}</span></div>
                ${quote.discountAmount > 0 ? `<div class="tax-summary-row"><span>Discount (${quote.discountPct}%)</span><span style="color: #667eea;">-₹${parseFloat(quote.discountAmount).toFixed(2)}</span></div>` : ''}
                <div class="tax-summary-row"><span>After Discount</span><span style="color: #667eea; font-weight: 600;">₹${parseFloat(quote.amountAfterDiscount).toFixed(2)}</span></div>
                ${quote.gstApplicable ? `<div class="tax-summary-row"><span>GST (${quote.gstRate}%)</span><span style="color: #667eea;">₹${parseFloat(quote.gstAmount).toFixed(2)}</span></div>` : `<div class="tax-summary-row"><span>GST</span><span style="color: #2e7d32;">Not Applicable</span></div>`}
                ${quote.tdsApplicable ? `<div class="tax-summary-row" style="background: #fff3cd; padding: 10px;"><span><b>TDS (${quote.tdsRate}%) - Deducted</b></span><span style="color: #ff9800;">-₹${parseFloat(quote.tdsAmount).toFixed(2)}</span></div>` : ''}
                <div class="tax-summary-row"><span><b>TOTAL DUE</b></span><span style="color: #667eea; font-size: 1.2rem;">₹${parseFloat(quote.total).toFixed(2)}</span></div>
            </div>
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; color: #856404;">
                <b>📋 Tax Info:</b> ${quote.gstApplicable ? `GST: ${quote.gstRate}% | ` : 'GST: Not Applicable | '}${quote.tdsApplicable ? `TDS: ${quote.tdsRate}% | ` : ''}Valid Till: ${validTill.toLocaleDateString('en-IN')}
            </div>
            ${quote.paymentTerms ? `<p><b>Payment Terms:</b> ${quote.paymentTerms}</p>` : ''}
            ${quote.specialNotes ? `<p><b>Notes:</b> ${quote.specialNotes}</p>` : ''}
        </div>
    `;
}

function showPreviewWithCompliance(quote) {
    const modal = document.getElementById('previewModal');
    document.getElementById('previewContent').innerHTML = generateQuoteHTMLWithCompliance(quote);
    modal.style.display = 'flex';
    setupModalActions(quote);
}

// ===== FAVORITES =====
function updateFavoritesList() {
    const custList = document.getElementById('favoriteCustomers');
    if (favorites.customers.length > 0) {
        custList.innerHTML = favorites.customers.map(c => `
            <div class="favorite-customer" onclick="loadFavoriteCustomer('${c.name}', '${c.company}')">
                <b>${c.name}</b><p>${c.company || 'No company'}</p>
            </div>
        `).join('');
    }
}

function loadFavoriteCustomer(name, company) {
    document.getElementById('customerName').value = name;
    document.getElementById('companyName').value = company;
    document.querySelector('[data-tab="create"]').click();
}

// ===== RECURRING ITEMS =====
function setupRecurringItems() {
    document.getElementById('addRecurringItemBtn').addEventListener('click', () => {
        document.getElementById('recurringItemsForm').style.display = 
            document.getElementById('recurringItemsForm').style.display === 'none' ? 'block' : 'none';
    });
    
    document.getElementById('saveRecurringBtn').addEventListener('click', () => {
        const item = {
            id: Date.now(),
            description: document.getElementById('recurringDesc').value,
            category: document.getElementById('recurringCategory').value,
            qty: parseInt(document.getElementById('recurringQty').value),
            price: parseFloat(document.getElementById('recurringPrice').value)
        };
        
        if (item.description) {
            recurringItems.push(item);
            saveData();
            renderRecurringItems();
            document.getElementById('recurringItemsForm').style.display = 'none';
            document.getElementById('recurringDesc').value = '';
        }
    });
    
    document.getElementById('cancelRecurringBtn').addEventListener('click', () => {
        document.getElementById('recurringItemsForm').style.display = 'none';
    });
}

function renderRecurringItems() {
    const list = document.getElementById('recurringItemsList');
    list.innerHTML = recurringItems.map(item => `
        <div class="recurring-item">
            <h5>${item.description}</h5>
            <p><b>Category:</b> ${item.category}</p>
            <p><b>Qty:</b> ${item.qty}</p>
            <p><b>Price:</b> ₹${item.price.toFixed(2)}</p>
            <div class="recurring-item-actions">
                <button class="recurring-use-btn" onclick="addRecurringToQuote(${item.id})">Use</button>
                <button class="recurring-remove-btn" onclick="removeRecurringItem(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

function addRecurringToQuote(id) {
    const item = recurringItems.find(i => i.id === id);
    if (!item) return;
    
    const itemsContainer = document.getElementById('itemsContainer');
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
        <input type="text" class="item-description" value="${item.description}">
        <input type="number" class="item-qty" value="${item.qty}" min="1">
        <input type="number" class="item-price" value="${item.price}" step="0.01">
        <input type="number" class="item-amount" readonly value="${(item.qty * item.price).toFixed(2)}">
        <button type="button" class="remove-item-btn" onclick="removeItemRow(this)">Remove</button>
    `;
    
    row.querySelector('.item-qty').addEventListener('change', calculateItemAmount);
    row.querySelector('.item-price').addEventListener('change', calculateItemAmount);
    itemsContainer.appendChild(row);
    alert('✅ Item added to quote!');
}

function removeRecurringItem(id) {
    recurringItems = recurringItems.filter(i => i.id !== id);
    saveData();
    renderRecurringItems();
}

// ===== QUOTATIONS LIST =====
function setupQuotationsList() {
    document.getElementById('searchQuotes').addEventListener('input', filterQuotations);
    document.getElementById('filterStatus').addEventListener('change', filterQuotations);
    document.getElementById('clearAllBtn').addEventListener('click', function() {
        if (confirm('Delete all quotations?')) {
            quotes = [];
            saveData();
            renderQuotationsList();
        }
    });
}

function filterQuotations() {
    const searchTerm = document.getElementById('searchQuotes').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    
    const filtered = quotes.filter(q => {
        const matchesSearch = q.customerName.toLowerCase().includes(searchTerm) || 
                            q.companyName.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || q.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    renderQuotationsList(filtered);
}

function renderQuotationsList(filteredQuotes = quotes) {
    const container = document.getElementById('quotationsList');
    const emptyMessage = document.getElementById('emptyMessage');
    
    if (filteredQuotes.length === 0) {
        container.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }
    
    emptyMessage.style.display = 'none';
    container.innerHTML = filteredQuotes.map(q => `
        <div class="quotation-card">
            <h4>${q.customerName}</h4>
            <p><b>Company:</b> ${q.companyName || 'N/A'}</p>
            <p><b>Amount:</b> ₹${parseFloat(q.total).toFixed(2)}</p>
            <p><b>Date:</b> ${q.date}</p>
            <p><b>Status:</b> ${q.status || 'Draft'}</p>
            <div class="actions">
                <button onclick="viewQuotation(${q.id})">👁️ View</button>
                <button onclick="duplicateQuotation(${q.id})">📋 Duplicate</button>
                <button class="delete-btn" onclick="deleteQuotation(${q.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function viewQuotation(id) {
    const quote = quotes.find(q => q.id === id);
    if (quote) showPreviewWithCompliance(quote);
}

function duplicateQuotation(id) {
    const original = quotes.find(q => q.id === id);
    if (!original) return;
    
    const newQuote = JSON.parse(JSON.stringify(original));
    newQuote.id = Date.now();
    newQuote.date = new Date().toLocaleDateString('en-IN');
    newQuote.status = 'Draft';
    
    quotes.push(newQuote);
    saveData();
    renderQuotationsList();
    alert('✅ Quotation duplicated!');
}

function deleteQuotation(id) {
    if (confirm('Delete this quotation?')) {
        quotes = quotes.filter(q => q.id !== id);
        saveData();
        renderQuotationsList();
    }
}

// ===== ANALYTICS =====
function updateAnalyticsDashboard() {
    const stats = {
        totalQuotes: quotes.length,
        totalValue: quotes.reduce((sum, q) => sum + parseFloat(q.total), 0),
        acceptedQuotes: quotes.filter(q => q.status === 'Accepted' || q.status === 'Converted').length,
        activeQuotes: quotes.filter(q => {
            const validTill = new Date();
            validTill.setDate(validTill.getDate() + parseInt(q.validity));
            return validTill > new Date();
        }).length
    };
    
    stats.conversionRate = stats.totalQuotes > 0 ? ((stats.acceptedQuotes / stats.totalQuotes) * 100).toFixed(1) : 0;
    
    document.getElementById('totalQuotes').textContent = stats.totalQuotes;
    document.getElementById('totalValue').textContent = '₹' + stats.totalValue.toFixed(2);
    document.getElementById('conversionRate').textContent = stats.conversionRate + '%';
    document.getElementById('activeQuotes').textContent = stats.activeQuotes;
    
    const topCustomers = {};
    quotes.forEach(q => {
        topCustomers[q.customerName] = (topCustomers[q.customerName] || 0) + 1;
    });
    
    const sortedCustomers = Object.entries(topCustomers).sort((a, b) => b[1] - a[1]).slice(0, 5);
    document.getElementById('topCustomers').innerHTML = sortedCustomers.map(([name, count]) => 
        `<div class="customer-item"><b>${name}</b><p>${count} quotations</p></div>`
    ).join('');
    
    const recent = quotes.slice(-5).reverse();
    document.getElementById('recentQuotes').innerHTML = recent.map(q => 
        `<div class="recent-item"><b>${q.customerName}</b><p>₹${parseFloat(q.total).toFixed(2)} • ${q.date}</p></div>`
    ).join('');
}

// ===== SETTINGS =====
function setupSettings() {
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('importDataBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', importData);
    document.getElementById('resetAppBtn').addEventListener('click', resetApp);
}

function saveSettings() {
    appSettings.companyName = document.getElementById('settingsCompanyName').value;
    appSettings.gstin = document.getElementById('settingsGstin').value;
    appSettings.logoUrl = document.getElementById('settingsLogoUrl').value;
    appSettings.paymentTerms = document.getElementById('settingsPaymentTerms').value;
    
    saveData();
    showMessage('✅ Settings saved!', 'success');
}

function exportData() {
    const data = { quotes, favorites, recurringItems, appSettings, exportDate: new Date().toLocaleString('en-IN') };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quotations_backup_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    showMessage('✅ Data exported!', 'success');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            quotes = data.quotes || [];
            favorites = data.favorites || { customers: [], items: [], paymentTerms: [] };
            recurringItems = data.recurringItems || [];
            appSettings = data.appSettings || {};
            saveData();
            renderQuotationsList();
            updateAnalyticsDashboard();
            updateFavoritesList();
            renderRecurringItems();
            showMessage('✅ Data imported!', 'success');
        } catch (error) {
            showMessage('❌ Invalid file!', 'error');
        }
    };
    reader.readAsText(file);
}

function resetApp() {
    if (confirm('⚠️ Delete everything?')) {
        quotes = [];
        favorites = { customers: [], items: [], paymentTerms: [] };
        recurringItems = [];
        appSettings = {};
        localStorage.clear();
        location.reload();
    }
}

// ===== MODAL ACTIONS =====
function setupModalActions(quote) {
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('previewModal').style.display = 'none';
    });
    
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('previewModal').style.display = 'none';
    });
    
    document.getElementById('downloadPdfBtn').addEventListener('click', () => { window.print(); });
    
    document.getElementById('shareWhatsappBtn').addEventListener('click', () => {
        const message = `Hello ${quote.customerName},\n\nQuotation:\nQuote #: ${quote.id.toString().slice(-6)}\nTotal: ₹${parseFloat(quote.total).toFixed(2)}\nValid till: ${new Date(Date.now() + parseInt(quote.validity) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}\n\nThanks!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    });
    
    document.getElementById('shareEmailBtn').addEventListener('click', () => {
        const subject = `Quotation for ${quote.customerName}`;
        const body = `Hello ${quote.customerName},\n\nQuotation #${quote.id.toString().slice(-6)}\nTotal: ₹${parseFloat(quote.total).toFixed(2)}\nValid till: ${new Date(Date.now() + parseInt(quote.validity) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}\n\nRegards,\n${quote.yourCompanyName}`;
        window.open(`mailto:${quote.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    });
    
    document.getElementById('printQuoteBtn').addEventListener('click', () => { window.print(); });
}

// ===== TAX COMPLIANCE INITIALIZATION =====
function initializeTaxCompliance() {
    setupGSTOptional();
    setupTDS();
    document.getElementById('quoteForm').addEventListener('submit', generateQuoteWithTaxCompliance);
}

// ===== DATA PERSISTENCE =====
function saveData() {
    localStorage.setItem('msmeQuotes', JSON.stringify(quotes));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('recurringItems', JSON.stringify(recurringItems));
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
}

function loadData() {
    const saved = localStorage.getItem('msmeQuotes');
    if (saved) try { quotes = JSON.parse(saved); } catch (e) { quotes = []; }
    
    const favSaved = localStorage.getItem('favorites');
    if (favSaved) try { favorites = JSON.parse(favSaved); } catch (e) { favorites = { customers: [], items: [], paymentTerms: [] }; }
    
    const recurSaved = localStorage.getItem('recurringItems');
    if (recurSaved) try { recurringItems = JSON.parse(recurSaved); } catch (e) { recurringItems = []; }
    
    const settingsSaved = localStorage.getItem('appSettings');
    if (settingsSaved) {
        try {
            appSettings = JSON.parse(settingsSaved);
            document.getElementById('settingsCompanyName').value = appSettings.companyName || '';
            document.getElementById('settingsGstin').value = appSettings.gstin || '';
            document.getElementById('settingsLogoUrl').value = appSettings.logoUrl || '';
            document.getElementById('settingsPaymentTerms').value = appSettings.paymentTerms || '';
        } catch (e) { appSettings = {}; }
    }
}

// ===== HELPER FUNCTIONS =====
function showMessage(text, type) {
    const msg = document.getElementById('settingsMessage');
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 3000);
}

// ===== END OF CODE =====
