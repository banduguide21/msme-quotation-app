// ===== QUOTATION APP - MAIN LOGIC =====

// App State
let quotes = [];
let currentQuote = null;
let appSettings = {
    companyName: '',
    gstin: '',
    logoUrl: '',
    paymentTerms: ''
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    loadSettings();
    renderQuotationsList();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Form
    document.getElementById('quoteForm').addEventListener('submit', generateQuote);
    document.getElementById('addItemBtn').addEventListener('click', addItemRow);

    // List tab
    document.getElementById('searchQuotes').addEventListener('input', filterQuotes);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllQuotes);

    // Settings
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('importDataBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', importData);
    document.getElementById('resetAppBtn').addEventListener('click', resetApp);

    // Modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('previewModal')) closeModal();
    });

    // Preview actions
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);
    document.getElementById('shareWhatsappBtn').addEventListener('click', shareWhatsApp);
    document.getElementById('shareEmailBtn').addEventListener('click', shareEmail);
    document.getElementById('printQuoteBtn').addEventListener('click', printQuote);

    // Initial item row
    addItemRow();
}

// ===== TAB MANAGEMENT =====
function switchTab(e) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    e.target.classList.add('active');
    const tabId = e.target.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');

    if (tabId === 'list') {
        renderQuotationsList();
    }
}

// ===== ITEM ROW MANAGEMENT =====
function addItemRow() {
    const itemsContainer = document.getElementById('itemsContainer');
    const itemCount = itemsContainer.querySelectorAll('.item-row').length;
    
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
        <input type="text" placeholder="Item/Service description" class="item-description" value="">
        <input type="number" placeholder="Qty" class="item-qty" value="1" min="1">
        <input type="number" placeholder="Price" class="item-price" value="0" min="0" step="0.01">
        <input type="number" placeholder="Amount" class="item-amount" readonly>
        <button type="button" class="remove-item-btn" onclick="removeItemRow(this)">Remove</button>
    `;
    
    // Calculate amount on change
    row.querySelector('.item-qty').addEventListener('change', calculateItemAmount);
    row.querySelector('.item-price').addEventListener('change', calculateItemAmount);
    row.querySelector('.item-qty').addEventListener('input', calculateItemAmount);
    row.querySelector('.item-price').addEventListener('input', calculateItemAmount);
    
    itemsContainer.appendChild(row);
}

function removeItemRow(btn) {
    btn.closest('.item-row').remove();
    if (document.querySelectorAll('.item-row').length === 0) {
        addItemRow();
    }
}

function calculateItemAmount(e) {
    const row = e.target.closest('.item-row');
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const amount = qty * price;
    row.querySelector('.item-amount').value = amount.toFixed(2);
}

// ===== QUOTE GENERATION =====
function generateQuote(e) {
    e.preventDefault();

    const items = [];
    document.querySelectorAll('.item-row').forEach(row => {
        const description = row.querySelector('.item-description').value;
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const amount = qty * price;

        if (description && amount > 0) {
            items.push({ description, qty, price, amount });
        }
    });

    if (items.length === 0) {
        alert('Please add at least one item/service with amount > 0');
        return;
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const discountPct = parseFloat(document.getElementById('discount').value) || 0;
    const discountAmount = (subtotal * discountPct) / 100;
    const taxableAmount = subtotal - discountAmount;
    const gstRate = parseFloat(document.getElementById('gstRate').value) || 0;
    const gstAmount = (taxableAmount * gstRate) / 100;
    const total = taxableAmount + gstAmount;

    // Create quote object
    const quote = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-IN'),
        customerName: document.getElementById('customerName').value,
        companyName: document.getElementById('companyName').value,
        customerEmail: document.getElementById('customerEmail').value,
        gstin: document.getElementById('gstin').value,
        yourCompanyName: document.getElementById('yourCompanyName').value || appSettings.companyName,
        yourGstin: document.getElementById('yourGstin').value || appSettings.gstin,
        logoUrl: document.getElementById('logoUrl').value || appSettings.logoUrl,
        items,
        subtotal: subtotal.toFixed(2),
        discountPct,
        discountAmount: discountAmount.toFixed(2),
        taxableAmount: taxableAmount.toFixed(2),
        gstRate,
        gstAmount: gstAmount.toFixed(2),
        total: total.toFixed(2),
        validity: document.getElementById('validity').value,
        paymentTerms: document.getElementById('paymentTerms').value || appSettings.paymentTerms,
        specialNotes: document.getElementById('specialNotes').value,
        status: 'Draft'
    };

    quotes.push(quote);
    saveData();
    
    currentQuote = quote;
    showPreview(quote);
    
    alert('✅ Quote generated! Preview is open. Download or share now.');
}

// ===== PREVIEW & MODAL =====
function showPreview(quote) {
    currentQuote = quote;
    const previewContent = generateQuoteHTML(quote);
    document.getElementById('previewContent').innerHTML = previewContent;
    document.getElementById('previewModal').style.display = 'flex';
}

function generateQuoteHTML(quote) {
    const validTill = new Date();
    validTill.setDate(validTill.getDate() + parseInt(quote.validity));
    
    const itemsHTML = quote.items.map((item, idx) => `
        <tr>
            <td style="text-align: left;">${idx + 1}. ${item.description}</td>
            <td style="text-align: center;">${item.qty}</td>
            <td style="text-align: right;">₹${parseFloat(item.price).toFixed(2)}</td>
            <td style="text-align: right;">₹${parseFloat(item.amount).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <div class="quote-preview">
            ${quote.logoUrl ? `<img src="${quote.logoUrl}" alt="Logo" class="logo" onerror="this.style.display='none'">` : ''}
            
            <div class="header-info">
                <div>
                    <h3>${quote.yourCompanyName}</h3>
                    ${quote.yourGstin ? `<p><strong>GSTIN:</strong> ${quote.yourGstin}</p>` : ''}
                </div>
                <div style="text-align: right;">
                    <p><strong>Quotation #${quote.id.toString().slice(-6)}</strong></p>
                    <p><strong>Date:</strong> ${quote.date}</p>
                </div>
            </div>

            <h4 style="margin-top: 20px; color: #667eea;">Bill To:</h4>
            <p><strong>${quote.customerName}</strong></p>
            ${quote.companyName ? `<p>${quote.companyName}</p>` : ''}
            ${quote.customerEmail ? `<p>${quote.customerEmail}</p>` : ''}
            ${quote.gstin ? `<p><strong>GSTIN:</strong> ${quote.gstin}</p>` : ''}

            <table>
                <thead>
                    <tr>
                        <th style="text-align: left;">Description</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Unit Price</th>
                        <th style="text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <div class="totals">
                <p><strong>Subtotal:</strong> ₹${parseFloat(quote.subtotal).toFixed(2)}</p>
                ${quote.discountPct > 0 ? `<p><strong>Discount (${quote.discountPct}%):</strong> -₹${parseFloat(quote.discountAmount).toFixed(2)}</p>` : ''}
                <p><strong>Taxable Amount:</strong> ₹${parseFloat(quote.taxableAmount).toFixed(2)}</p>
                ${quote.gstRate > 0 ? `<p><strong>GST (${quote.gstRate}%):</strong> ₹${parseFloat(quote.gstAmount).toFixed(2)}</p>` : ''}
                <p style="font-size: 1.2rem; color: #667eea;"><strong>Total: ₹${parseFloat(quote.total).toFixed(2)}</strong></p>
            </div>

            ${quote.paymentTerms ? `<p style="margin-top: 20px;"><strong>Payment Terms:</strong> ${quote.paymentTerms}</p>` : ''}
            ${quote.specialNotes ? `<p><strong>Notes:</strong> ${quote.specialNotes}</p>` : ''}
            
            <p style="margin-top: 20px; font-size: 0.9rem; color: #999;">
                <strong>Valid Till:</strong> ${validTill.toLocaleDateString('en-IN')}
            </p>
        </div>
    `;
}

function closeModal() {
    document.getElementById('previewModal').style.display = 'none';
}

// ===== EXPORT & DOWNLOAD =====
function downloadPDF() {
    if (!currentQuote) return;
    
    const element = document.getElementById('previewContent');
    const opt = {
        margin: 10,
        filename: `quotation_${currentQuote.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    // For now, we'll use a simple print-to-PDF approach
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Download</title></head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

function shareWhatsApp() {
    if (!currentQuote) return;
    
    const message = `Hi ${currentQuote.customerName},\n\nPlease find the quotation details:\n\nQuote #: ${currentQuote.id.toString().slice(-6)}\nTotal Amount: ₹${currentQuote.total}\nValid Till: ${new Date(new Date().getTime() + parseInt(currentQuote.validity) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}\n\nFor full details, please contact us.\n\nThank you!`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function shareEmail() {
    if (!currentQuote) return;
    
    const subject = `Quotation - ${currentQuote.id.toString().slice(-6)}`;
    const body = `Dear ${currentQuote.customerName},\n\nPlease find the quotation details below:\n\nQuote #: ${currentQuote.id.toString().slice(-6)}\nDate: ${currentQuote.date}\nTotal Amount: ₹${currentQuote.total}\nValid Till: ${new Date(new Date().getTime() + parseInt(currentQuote.validity) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}\n\nItems:\n${currentQuote.items.map(item => `- ${item.description}: ₹${item.amount}`).join('\n')}\n\nPayment Terms: ${currentQuote.paymentTerms}\n\nPlease let us know if you have any questions.\n\nBest regards,\n${currentQuote.yourCompanyName}`;
    
    const mailtoUrl = `mailto:${currentQuote.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
}

function printQuote() {
    const element = document.getElementById('previewContent');
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Quotation</title></head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// ===== QUOTATIONS LIST =====
function renderQuotationsList() {
    const container = document.getElementById('quotationsList');
    container.innerHTML = '';

    if (quotes.length === 0) {
        document.getElementById('emptyMessage').style.display = 'block';
        return;
    }

    document.getElementById('emptyMessage').style.display = 'none';

    quotes.forEach(quote => {
        const card = document.createElement('div');
        card.className = 'quotation-card';
        card.innerHTML = `
            <h4>${quote.customerName}</h4>
            <p><strong>Company:</strong> ${quote.companyName || 'N/A'}</p>
            <p><strong>Amount:</strong> ₹${parseFloat(quote.total).toFixed(2)}</p>
            <p><strong>Date:</strong> ${quote.date}</p>
            <span class="status">${quote.status}</span>
            <div class="actions">
                <button onclick="viewQuote(${quote.id})">View</button>
                <button onclick="deleteQuote(${quote.id})" class="delete-btn">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterQuotes(e) {
    const search = e.target.value.toLowerCase();
    const filtered = quotes.filter(q => 
        q.customerName.toLowerCase().includes(search) ||
        q.companyName.toLowerCase().includes(search) ||
        q.id.toString().includes(search)
    );

    const container = document.getElementById('quotationsList');
    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No quotes found</p>';
        return;
    }

    filtered.forEach(quote => {
        const card = document.createElement('div');
        card.className = 'quotation-card';
        card.innerHTML = `
            <h4>${quote.customerName}</h4>
            <p><strong>Amount:</strong> ₹${parseFloat(quote.total).toFixed(2)}</p>
            <p><strong>Date:</strong> ${quote.date}</p>
            <div class="actions">
                <button onclick="viewQuote(${quote.id})">View</button>
                <button onclick="deleteQuote(${quote.id})" class="delete-btn">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function viewQuote(id) {
    const quote = quotes.find(q => q.id === id);
    if (quote) {
        showPreview(quote);
    }
}

function deleteQuote(id) {
    if (confirm('Are you sure you want to delete this quotation?')) {
        quotes = quotes.filter(q => q.id !== id);
        saveData();
        renderQuotationsList();
    }
}

function clearAllQuotes() {
    if (confirm('Delete ALL quotations? This cannot be undone!')) {
        quotes = [];
        saveData();
        renderQuotationsList();
    }
}

// ===== TEMPLATES =====
function loadTemplate(templateType) {
    const templates = {
        product: [
            { description: 'Sample Product A', qty: 1, price: 1000 },
            { description: 'Sample Product B', qty: 2, price: 500 }
        ],
        service: [
            { description: 'Consulting Services (8 hours @ ₹1000/hour)', qty: 8, price: 1000 },
            { description: 'Implementation Support', qty: 1, price: 5000 }
        ],
        project: [
            { description: 'Phase 1 - Planning & Design', qty: 1, price: 50000 },
            { description: 'Phase 2 - Development', qty: 1, price: 100000 },
            { description: 'Phase 3 - Testing & Deployment', qty: 1, price: 25000 }
        ],
        amc: [
            { description: 'Annual Maintenance (Year 1)', qty: 1, price: 25000 },
            { description: 'Free Support (24x7, 6 months)', qty: 1, price: 0 }
        ]
    };

    const items = templates[templateType] || [];
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <input type="text" placeholder="Item/Service description" class="item-description" value="${item.description}">
            <input type="number" placeholder="Qty" class="item-qty" value="${item.qty}" min="1">
            <input type="number" placeholder="Price" class="item-price" value="${item.price}" min="0" step="0.01">
            <input type="number" placeholder="Amount" class="item-amount" readonly value="${(item.qty * item.price).toFixed(2)}">
            <button type="button" class="remove-item-btn" onclick="removeItemRow(this)">Remove</button>
        `;
        
        row.querySelector('.item-qty').addEventListener('change', calculateItemAmount);
        row.querySelector('.item-price').addEventListener('change', calculateItemAmount);
        row.querySelector('.item-qty').addEventListener('input', calculateItemAmount);
        row.querySelector('.item-price').addEventListener('input', calculateItemAmount);
        
        container.appendChild(row);
    });

    document.querySelector('[data-tab="create"]').click();
    alert(`✅ ${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template loaded! Edit as needed.`);
}

// ===== SETTINGS =====
function saveSettings() {
    appSettings.companyName = document.getElementById('settingsCompanyName').value;
    appSettings.gstin = document.getElementById('settingsGstin').value;
    appSettings.logoUrl = document.getElementById('settingsLogoUrl').value;
    appSettings.paymentTerms = document.getElementById('settingsPaymentTerms').value;
    
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
    
    const msg = document.getElementById('settingsMessage');
    msg.textContent = '✅ Settings saved successfully!';
    msg.className = 'message success';
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);
}

function loadSettings() {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
        appSettings = JSON.parse(saved);
        document.getElementById('settingsCompanyName').value = appSettings.companyName;
        document.getElementById('settingsGstin').value = appSettings.gstin;
        document.getElementById('settingsLogoUrl').value = appSettings.logoUrl;
        document.getElementById('settingsPaymentTerms').value = appSettings.paymentTerms;
        
        document.getElementById('yourCompanyName').value = appSettings.companyName;
        document.getElementById('yourGstin').value = appSettings.gstin;
        document.getElementById('logoUrl').value = appSettings.logoUrl;
        document.getElementById('paymentTerms').value = appSettings.paymentTerms;
    }
}

// ===== DATA PERSISTENCE =====
function saveData() {
    localStorage.setItem('msmeQuotes', JSON.stringify(quotes));
}

function loadData() {
    const saved = localStorage.getItem('msmeQuotes');
    if (saved) {
        try {
            quotes = JSON.parse(saved);
        } catch (e) {
            quotes = [];
        }
    }
}

function exportData() {
    const data = {
        quotes,
        settings: appSettings,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `msme-quotes-backup-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            quotes = data.quotes || [];
            appSettings = data.settings || appSettings;
            saveData();
            loadSettings();
            
            const msg = document.getElementById('settingsMessage');
            msg.textContent = '✅ Data imported successfully!';
            msg.className = 'message success';
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 3000);
        } catch (err) {
            alert('❌ Error importing file: Invalid JSON format');
        }
    };
    reader.readAsText(file);
}

function resetApp() {
    if (confirm('WARNING: This will delete ALL quotations and settings. This cannot be undone. Continue?')) {
        if (confirm('Are you REALLY sure? Click OK again to confirm.')) {
            localStorage.clear();
            quotes = [];
            appSettings = {
                companyName: '',
                gstin: '',
                logoUrl: '',
                paymentTerms: ''
            };
            document.getElementById('quoteForm').reset();
            loadSettings();
            renderQuotationsList();
            alert('✅ App has been reset. All data deleted.');
        }
    }
}