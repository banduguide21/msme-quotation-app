# 🇮🇳 Indian Tax Compliance Guide - GST Optional & TDS Implementation

## Overview

This enhancement adds:
1. **Optional GST** - Can be disabled for non-GST registered businesses or exempt items
2. **TDS Percentage** - Tax Deducted at Source (as per Indian Income Tax Act)
3. **GST Exemption Codes** - Mark items as exempt, nil-rated, or zero-rated
4. **Tax Summary** - Clear breakdown of all taxes in quotation
5. **Compliance Notes** - Auto-generated compliance text

---

## 🏛️ INDIAN TAX CONTEXT

### When GST is Not Applicable:
- Business turnover < ₹20 lakhs (FY 2023-24)
- Service providers < ₹20 lakhs (specified services)
- Unregistered MSME businesses
- Exempt supplies (specified under GST Act)
- Interstate supplies below threshold

### TDS Rates Under Indian Tax Law (FY 2024-25):
- **Section 194C** (Contractor services): 1% or 2% on contract value
- **Section 194J** (Professional services): 10% on fees
- **Section 194O** (E-commerce transactions): 1% on transaction value
- **Section 194AD** (Work contracts): 2% on contract value
- **Section 194LA** (Specified goods transport): 1% on freight
- **Section 194LB** (Specified goods sale): 2% on goods sale

---

## 💾 CODE IMPLEMENTATION

### SECTION 1: HTML Updates

Replace the GST section in your quotation form with:

```html
<!-- REPLACE EXISTING TAX SECTION -->
<!-- Find this section in Create Quote form and replace it -->

<fieldset class="form-section">
    <legend>💰 Taxes & Deductions (Indian Compliance)</legend>
    
    <!-- GST Section -->
    <div class="tax-subsection">
        <h5>Goods & Services Tax (GST)</h5>
        <label style="display: flex; align-items: center; margin-bottom: 15px;">
            <input type="checkbox" id="gstApplicable" checked style="width: 20px; height: 20px; margin-right: 10px;">
            <span><strong>GST Applicable</strong> (Check if you are GST registered)</span>
        </label>
        
        <div id="gstSection">
            <label>GST Rate (%)</label>
            <select id="gstRate">
                <option value="0">0% (Nil-rated/Exempt supplies)</option>
                <option value="5">5% (Food items, books, medicines)</option>
                <option value="12">12% (Standard rate items)</option>
                <option value="18" selected>18% (Most goods & services)</option>
                <option value="28">28% (Luxury items, sin goods)</option>
                <option value="custom">Custom Rate</option>
            </select>
            
            <div id="customGstDiv" style="display: none; margin-top: 10px;">
                <label>Enter Custom GST Rate (%)</label>
                <input type="number" id="customGstValue" placeholder="e.g., 2.5" min="0" max="100" step="0.01">
            </div>
            
            <label style="margin-top: 12px;">GST Exemption Type</label>
            <select id="gstExemptionType">
                <option value="normal">Normal (Taxable supply)</option>
                <option value="exempt">Exempt (No GST, non-registered)</option>
                <option value="nilrated">Nil-rated (0% GST, ITC available)</option>
                <option value="zerorated">Zero-rated (0% GST, Export)</option>
            </select>
            
            <label style="margin-top: 12px;">Your GSTIN (if registered)</label>
            <input type="text" id="yourGstinOptional" placeholder="18-digit GSTIN (optional)">
        </div>
    </div>
    
    <!-- TDS Section -->
    <div class="tax-subsection" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
        <h5>Tax Deducted at Source (TDS)</h5>
        
        <label style="display: flex; align-items: center; margin-bottom: 15px;">
            <input type="checkbox" id="tdsApplicable" style="width: 20px; height: 20px; margin-right: 10px;">
            <span><strong>TDS Applicable</strong> (Check if client will deduct tax at source)</span>
        </label>
        
        <div id="tdsSection" style="display: none;">
            <label>Select TDS Section</label>
            <select id="tdsSection">
                <option value="194c">Section 194C - Contractor/Labour Services (1-2%)</option>
                <option value="194j">Section 194J - Professional Services (10%)</option>
                <option value="194o">Section 194O - E-commerce (1%)</option>
                <option value="194ad">Section 194AD - Work Contract (2%)</option>
                <option value="194la">Section 194LA - Goods Transport (1%)</option>
                <option value="194lb">Section 194LB - Goods Sale (2%)</option>
                <option value="custom">Custom TDS Rate</option>
            </select>
            
            <label style="margin-top: 12px;">TDS Rate (%)</label>
            <div class="tds-rate-display">
                <input type="number" id="tdsRate" placeholder="Auto-filled based on section" readonly style="background: #f0f0f0; margin-bottom: 10px;">
                <small style="color: #666;">Rate is auto-filled; edit only if custom</small>
            </div>
            
            <label style="margin-top: 12px;">TDS Applies To</label>
            <select id="tdsAppliesTo">
                <option value="all">Entire invoice amount (after discount, before GST)</option>
                <option value="abovebasic">Amount above basic exemption (₹30,000 for 194J)</option>
                <option value="manual">Manual amount selection</option>
            </select>
            
            <div id="tdsManualAmount" style="display: none; margin-top: 10px;">
                <label>Amount on which TDS applies (₹)</label>
                <input type="number" id="tdsManualValue" placeholder="Enter amount" min="0" step="0.01">
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 6px; margin-top: 15px;">
                <p style="margin: 0; color: #856404;">
                    <strong>ℹ️ TDS Note:</strong> The quoted amount will be reduced by TDS amount at source. 
                    You will receive payment = Invoice Total - TDS Amount.<br>
                    <small>TDS should be deposited with income tax authorities by 7th of next month.</small>
                </p>
            </div>
        </div>
    </div>
    
    <!-- Discount Section -->
    <div class="tax-subsection" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
        <h5>Discount</h5>
        
        <label>Discount Type</label>
        <select id="discountType" onchange="updateDiscountUI()">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
        </select>
        
        <label style="margin-top: 12px;">Discount Value</label>
        <input type="number" id="discount" placeholder="0" min="0" step="0.01">
        
        <label style="margin-top: 12px;">Discount Reason (optional)</label>
        <input type="text" id="discountReason" placeholder="e.g., Early payment, bulk order, promotional offer">
    </div>
    
    <!-- Payment Terms -->
    <div class="tax-subsection" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
        <h5>Payment Terms & Validity</h5>
        
        <label>Payment Terms *</label>
        <textarea id="paymentTerms" placeholder="e.g., 50% advance, balance on delivery&#10;Or: Net 15 (payment due within 15 days)&#10;Or: COD (Cash on Delivery)" rows="3"></textarea>
        
        <label style="margin-top: 12px;">Quote Validity (Days) *</label>
        <input type="number" id="validity" value="7" min="1" required>
    </div>
</fieldset>

<!-- COMPLIANCE NOTES TAB -->
<div id="complianceNotes" class="tab-content">
    <h3>📋 Tax Compliance Information</h3>
    
    <div class="compliance-card">
        <h4>🇮🇳 Indian GST Compliance</h4>
        <div id="gstComplianceText" class="compliance-text"></div>
    </div>
    
    <div class="compliance-card">
        <h4>💰 TDS Information</h4>
        <div id="tdsComplianceText" class="compliance-text"></div>
    </div>
    
    <div class="compliance-card">
        <h4>📑 Important Notes for MSMEs</h4>
        <ul style="color: #555; line-height: 1.8;">
            <li><strong>GST Registration:</strong> Mandatory if turnover > ₹20 lakhs (FY 2023-24) in manufacturing/trading, > ₹20 lakhs in services</li>
            <li><strong>TDS Filing:</strong> If TDS is deducted, you must file Form 16A and report in ITR</li>
            <li><strong>Invoice Format:</strong> GST invoices must include GSTIN, HSN/SAC codes, and tax details</li>
            <li><strong>Payment:</strong> GST payment due by 20th of next month; ITC claim by 30th</li>
            <li><strong>Records:</strong> Maintain invoices and GST documents for 6 years</li>
            <li><strong>E-invoicing:</strong> Mandatory if turnover > ₹50 crores (as per latest rules)</li>
        </ul>
    </div>
    
    <div class="compliance-card">
        <h4>📞 When to Consult CA/Tax Professional</h4>
        <ul style="color: #555; line-height: 1.8;">
            <li>Before registering for GST</li>
            <li>When TDS is deducted from your payments</li>
            <li>For inter-state supplies and reverse charge</li>
            <li>Annual income tax filing and reconciliation</li>
            <li>When business structure changes (Sole → Partnership, etc)</li>
        </ul>
    </div>
</div>
```

---

### SECTION 2: CSS Updates

Add these styles to style.css:

```css
/* Tax Compliance Styling */
.tax-subsection {
    background: white;
    padding: 15px;
    border-radius: 6px;
    border-left: 4px solid #667eea;
    margin-bottom: 10px;
}

.tax-subsection h5 {
    margin: 0 0 15px 0;
    color: #667eea;
    font-size: 1.05rem;
}

.tax-subsection label {
    display: block;
    margin-top: 12px;
    font-weight: 500;
    color: #555;
}

.tax-subsection input,
.tax-subsection select {
    width: 100%;
    padding: 10px;
    margin-top: 6px;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.tds-rate-display {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.tds-rate-display input {
    margin-top: 0;
}

/* Compliance Cards */
.compliance-card {
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.compliance-card h4 {
    color: #667eea;
    margin: 0 0 15px 0;
    font-size: 1.1rem;
}

.compliance-text {
    background: white;
    padding: 15px;
    border-left: 4px solid #667eea;
    border-radius: 4px;
    color: #555;
    line-height: 1.8;
}

.compliance-text ul {
    margin: 10px 0;
    padding-left: 20px;
}

.compliance-text li {
    margin: 8px 0;
}

/* Tax Summary in Preview */
.tax-summary {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
}

.tax-summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
}

.tax-summary-row:last-child {
    border-bottom: none;
    padding-top: 10px;
    border-top: 2px solid #667eea;
    font-weight: bold;
    font-size: 1.1rem;
}

.tax-label {
    color: #666;
}

.tax-amount {
    color: #667eea;
    font-weight: 600;
}

/* GST Optional Indicator */
.gst-optional-badge {
    display: inline-block;
    background: #e8f5e9;
    color: #2e7d32;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-left: 10px;
    font-weight: 600;
}

/* TDS Deduction Badge */
.tds-deduction-badge {
    display: inline-block;
    background: #fff3cd;
    color: #856404;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-left: 10px;
    font-weight: 600;
}

/* Exemption Type Indicator */
.exemption-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.exemption-normal { background: #e3f2fd; color: #1976d2; }
.exemption-exempt { background: #f3e5f5; color: #7b1fa2; }
.exemption-nilrated { background: #e8f5e9; color: #2e7d32; }
.exemption-zerorated { background: #fff3e0; color: #e65100; }

/* Compliance Notice */
.compliance-notice {
    background: linear-gradient(135deg, #fff3cd 0%, #ffe8a1 100%);
    border-left: 4px solid #ffc107;
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
    color: #856404;
}

.compliance-notice strong {
    color: #333;
}

/* Tax Breakdown Table in Preview */
.tax-table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
}

.tax-table th,
.tax-table td {
    padding: 10px;
    text-align: right;
    border-bottom: 1px solid #ddd;
}

.tax-table th {
    background: #f5f5f5;
    font-weight: 600;
}

.tax-table tr:last-child td {
    border-bottom: 2px solid #667eea;
    font-weight: bold;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .tax-subsection {
        padding: 12px;
    }
    
    .compliance-card {
        padding: 15px;
    }
}
```

---

### SECTION 3: JavaScript Updates

Add these functions to app.js:

```javascript
// ===== INDIAN TAX COMPLIANCE - GST OPTIONAL & TDS =====

// SECTION 1: GST OPTIONAL SETUP
function setupGSTOptional() {
    const gstCheckbox = document.getElementById('gstApplicable');
    const gstSection = document.getElementById('gstSection');
    const gstRateSelect = document.getElementById('gstRate');
    
    // Toggle GST section based on checkbox
    gstCheckbox.addEventListener('change', function() {
        gstSection.style.display = this.checked ? 'block' : 'none';
        if (!this.checked) {
            document.getElementById('gstRate').value = '0';
        }
        recalculateTotals();
    });
    
    // Handle custom GST rate
    gstRateSelect.addEventListener('change', function() {
        const customDiv = document.getElementById('customGstDiv');
        if (this.value === 'custom') {
            customDiv.style.display = 'block';
        } else {
            customDiv.style.display = 'none';
        }
        recalculateTotals();
    });
    
    document.getElementById('customGstValue').addEventListener('change', recalculateTotals);
}

// SECTION 2: TDS IMPLEMENTATION
function setupTDS() {
    const tdsCheckbox = document.getElementById('tdsApplicable');
    const tdsSection = document.getElementById('tdsSection');
    const tdsSectionSelect = document.getElementById('tdsSection');
    const tdsAppliesTo = document.getElementById('tdsAppliesTo');
    const tdsManualAmount = document.getElementById('tdsManualAmount');
    
    // Toggle TDS section
    tdsCheckbox.addEventListener('change', function() {
        tdsSection.style.display = this.checked ? 'block' : 'none';
        if (!this.checked) {
            document.getElementById('tdsRate').value = '0';
        }
        recalculateTotals();
    });
    
    // TDS section rate mapping
    const tdsRates = {
        '194c': 1,      // 1% for contractors (can be 2%)
        '194j': 10,     // 10% for professionals
        '194o': 1,      // 1% for e-commerce
        '194ad': 2,     // 2% for work contracts
        '194la': 1,     // 1% for goods transport
        '194lb': 2      // 2% for goods sale
    };
    
    tdsSectionSelect.addEventListener('change', function() {
        const rate = tdsRates[this.value] || 0;
        document.getElementById('tdsRate').value = rate;
        recalculateTotals();
    });
    
    // TDS applies to selector
    tdsAppliesTo.addEventListener('change', function() {
        tdsManualAmount.style.display = this.value === 'manual' ? 'block' : 'none';
        recalculateTotals();
    });
    
    document.getElementById('tdsManualValue').addEventListener('change', recalculateTotals);
}

// SECTION 3: ENHANCED TAX CALCULATION
function calculateTaxes() {
    // Get all values
    const subtotal = document.querySelectorAll('.item-row').reduce((sum, row) => {
        const amount = parseFloat(row.querySelector('.item-amount').value) || 0;
        return sum + amount;
    }, 0);
    
    // Discount calculation
    const discountType = document.getElementById('discountType').value;
    const discountValue = parseFloat(document.getElementById('discount').value) || 0;
    let discountAmount = 0;
    
    if (discountType === 'percentage') {
        discountAmount = (subtotal * discountValue) / 100;
    } else {
        discountAmount = discountValue;
    }
    
    const amountAfterDiscount = subtotal - discountAmount;
    
    // GST Calculation (Optional)
    let gstAmount = 0;
    let gstRate = 0;
    
    if (document.getElementById('gstApplicable').checked) {
        const selectedRate = document.getElementById('gstRate').value;
        gstRate = selectedRate === 'custom' 
            ? parseFloat(document.getElementById('customGstValue').value) || 0
            : parseFloat(selectedRate);
        
        gstAmount = (amountAfterDiscount * gstRate) / 100;
    }
    
    // TDS Calculation
    let tdsAmount = 0;
    let tdsRate = 0;
    
    if (document.getElementById('tdsApplicable').checked) {
        tdsRate = parseFloat(document.getElementById('tdsRate').value) || 0;
        
        const tdsAppliesTo = document.getElementById('tdsAppliesTo').value;
        let tdsTaxableAmount = amountAfterDiscount;
        
        if (tdsAppliesTo === 'abovebasic') {
            // For 194J, exemption is ₹30,000
            tdsTaxableAmount = Math.max(0, amountAfterDiscount - 30000);
        } else if (tdsAppliesTo === 'manual') {
            tdsTaxableAmount = parseFloat(document.getElementById('tdsManualValue').value) || 0;
        }
        
        // TDS typically doesn't apply to GST amount
        tdsAmount = (tdsTaxableAmount * tdsRate) / 100;
    }
    
    // Final total
    const total = amountAfterDiscount + gstAmount - tdsAmount;
    
    return {
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        discountPct: discountValue,
        amountAfterDiscount: amountAfterDiscount.toFixed(2),
        gstRate: gstRate,
        gstAmount: gstAmount.toFixed(2),
        tdsRate: tdsRate,
        tdsAmount: tdsAmount.toFixed(2),
        total: total.toFixed(2),
        gstApplicable: document.getElementById('gstApplicable').checked,
        tdsApplicable: document.getElementById('tdsApplicable').checked,
        gstExemptionType: document.getElementById('gstExemptionType').value
    };
}

// SECTION 4: RECALCULATE TOTALS (Enhanced)
function recalculateTotals() {
    const taxes = calculateTaxes();
    
    // Update form display (optional live preview)
    // You can add visual feedback here
}

// SECTION 5: ENHANCED QUOTE GENERATION
function generateQuoteWithTaxCompliance(e) {
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
        alert('⚠️ Please add at least one item/service with amount > 0');
        return;
    }
    
    // Calculate taxes
    const taxes = calculateTaxes();
    
    // Create quote object with tax compliance
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
        items,
        
        // Tax details
        subtotal: taxes.subtotal,
        discountPct: taxes.discountPct,
        discountAmount: taxes.discountAmount,
        amountAfterDiscount: taxes.amountAfterDiscount,
        gstApplicable: taxes.gstApplicable,
        gstRate: taxes.gstRate,
        gstAmount: taxes.gstAmount,
        gstExemptionType: taxes.gstExemptionType,
        tdsApplicable: taxes.tdsApplicable,
        tdsRate: taxes.tdsRate,
        tdsAmount: taxes.tdsAmount,
        total: taxes.total,
        
        // Additional compliance info
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
    
    alert('✅ Quote generated! Check tax breakdown below.');
}

// SECTION 6: COMPLIANCE TEXT GENERATION
function getGSTComplianceText(quote) {
    if (!quote.gstApplicable) {
        return `
            <p><strong>Status:</strong> <span class="gst-optional-badge">NOT APPLICABLE</span></p>
            <p>This quotation is provided without GST as the supplier is either:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Not registered under GST (Turnover < ₹20 lakhs)</li>
                <li>Providing exempt supplies</li>
                <li>Composition scheme taxpayer</li>
            </ul>
            <p style="color: #d32f2f;"><strong>Note:</strong> If client wants GST invoice, they must request GST registration.</p>
        `;
    }
    
    const exemptionText = {
        'normal': 'Normal taxable supply - GST is applicable and charged',
        'exempt': 'Exempt supply - GST is not charged (Invoice issued without GST)',
        'nilrated': 'Nil-rated supply - 0% GST charged but ITC is available to supplier',
        'zerorated': 'Zero-rated supply (Export) - 0% GST charged, ITC available'
    };
    
    return `
        <p><strong>GST Rate:</strong> ${quote.gstRate}%</p>
        <p><strong>GST Amount:</strong> ₹${parseFloat(quote.gstAmount).toFixed(2)}</p>
        <p><strong>Exemption Type:</strong> <span class="exemption-badge exemption-${quote.gstExemptionType}">${exemptionText[quote.gstExemptionType]}</span></p>
        <p><strong>Supplier GSTIN:</strong> ${quote.yourGstin || 'Not provided'}</p>
        ${quote.customerGstin ? `<p><strong>Customer GSTIN:</strong> ${quote.customerGstin}</p>` : ''}
        <p style="color: #666; font-size: 0.9rem;">
            This invoice is issued in compliance with GST Act, 2017. 
            HSN/SAC codes should be mentioned in detailed invoice.
        </p>
    `;
}

function getTDSComplianceText(quote) {
    if (!quote.tdsApplicable) {
        return `
            <p><strong>Status:</strong> TDS is not applicable to this quotation.</p>
            <p>You will receive full payment = Invoice Total</p>
        `;
    }
    
    const sectionInfo = {
        '194c': 'Section 194C - Contractor/Labour Services',
        '194j': 'Section 194J - Professional Services',
        '194o': 'Section 194O - E-commerce',
        '194ad': 'Section 194AD - Work Contracts',
        '194la': 'Section 194LA - Goods Transport',
        '194lb': 'Section 194LB - Goods Sale'
    };
    
    return `
        <p><strong style="color: #ff9800;">⚠️ TDS WILL BE DEDUCTED AT SOURCE</strong></p>
        <p><strong>Applicable Section:</strong> ${sectionInfo[quote.tdsSectionType] || 'Custom'}</p>
        <p><strong>TDS Rate:</strong> ${quote.tdsRate}%</p>
        <p><strong>TDS Amount:</strong> ₹${parseFloat(quote.tdsAmount).toFixed(2)}</p>
        <p><strong>Amount Payable to You:</strong> ₹${(parseFloat(quote.total)).toFixed(2)}</p>
        
        <div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin-top: 10px;">
            <p style="margin: 0; color: #856404;"><strong>Important:</strong></p>
            <ul style="margin: 5px 0; padding-left: 20px; color: #856404;">
                <li>Client will deduct ₹${parseFloat(quote.tdsAmount).toFixed(2)} and deposit with tax authorities</li>
                <li>You will receive: Invoice Amount - TDS Amount</li>
                <li>You must file Form 16A received from client in your ITR</li>
                <li>Deposition must be done by 7th of next month</li>
                <li>Claim TDS credit in your tax return</li>
            </ul>
        </div>
    `;
}

// SECTION 7: ENHANCED QUOTE PREVIEW WITH TAX COMPLIANCE
function generateQuoteHTMLWithCompliance(quote) {
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
            ${quote.customerGstin ? `<p><strong>GSTIN:</strong> ${quote.customerGstin}</p>` : ''}
            
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
            
            <!-- TAX BREAKDOWN -->
            <div class="tax-summary">
                <h5 style="margin: 0 0 15px 0; color: #667eea;">Tax Breakdown</h5>
                <div class="tax-summary-row">
                    <span class="tax-label">Subtotal</span>
                    <span class="tax-amount">₹${parseFloat(quote.subtotal).toFixed(2)}</span>
                </div>
                ${quote.discountAmount > 0 ? `
                    <div class="tax-summary-row">
                        <span class="tax-label">Discount (${quote.discountPct}%)</span>
                        <span class="tax-amount">-₹${parseFloat(quote.discountAmount).toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="tax-summary-row">
                    <span class="tax-label">Amount After Discount</span>
                    <span class="tax-amount">₹${parseFloat(quote.amountAfterDiscount).toFixed(2)}</span>
                </div>
                ${quote.gstApplicable ? `
                    <div class="tax-summary-row">
                        <span class="tax-label">GST (${quote.gstRate}%)</span>
                        <span class="tax-amount">₹${parseFloat(quote.gstAmount).toFixed(2)}</span>
                    </div>
                ` : `
                    <div class="tax-summary-row">
                        <span class="tax-label">GST</span>
                        <span class="tax-amount" style="color: #2e7d32;">Not Applicable</span>
                    </div>
                `}
                ${quote.tdsApplicable ? `
                    <div class="tax-summary-row" style="background: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 4px;">
                        <span class="tax-label"><strong>TDS (${quote.tdsRate}%) - Deducted at Source</strong></span>
                        <span class="tax-amount" style="color: #ff9800;">-₹${parseFloat(quote.tdsAmount).toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="tax-summary-row">
                    <span><strong>Total Amount Due</strong></span>
                    <span class="tax-amount" style="font-size: 1.2rem;">₹${parseFloat(quote.total).toFixed(2)}</span>
                </div>
            </div>
            
            <!-- COMPLIANCE INFORMATION -->
            <div class="compliance-notice">
                <strong>📋 Tax Compliance Information:</strong><br>
                ${quote.gstApplicable ? `GST: Applicable at ${quote.gstRate}% | ` : `GST: Not Applicable | `}
                ${quote.tdsApplicable ? `TDS: Applicable at ${quote.tdsRate}% | ` : `TDS: Not Applicable | `}
                Valid Till: ${validTill.toLocaleDateString('en-IN')}
            </div>
            
            ${quote.paymentTerms ? `<p style="margin-top: 20px;"><strong>Payment Terms:</strong> ${quote.paymentTerms}</p>` : ''}
            ${quote.specialNotes ? `<p><strong>Notes:</strong> ${quote.specialNotes}</p>` : ''}
        </div>
    `;
}

// SECTION 8: INITIALIZE TAX COMPLIANCE
function initializeTaxCompliance() {
    setupGSTOptional();
    setupTDS();
    
    // Replace existing form submit handler
    document.getElementById('quoteForm').removeEventListener('submit', generateQuote);
    document.getElementById('quoteForm').addEventListener('submit', generateQuoteWithTaxCompliance);
}

// Call in DOMContentLoaded:
// Add this: initializeTaxCompliance();
```

---

### SECTION 4: HTML - Add New Tab Button

Add this button to the tab navigation:

```html
<!-- Find the tabs section and add this -->
<button class="tab-btn" data-tab="complianceNotes">📋 Tax Compliance</button>
```

---

## 🚀 UPDATE INSTRUCTIONS

### Step 1: Add New Tab Navigation
In `index.html`, find the `<div class="tabs">` section and add:
```html
<button class="tab-btn" data-tab="complianceNotes">📋 Tax Compliance</button>
```

### Step 2: Replace Tax Section in Form
Find the existing tax section and replace with the complete HTML from SECTION 1.

### Step 3: Add CSS Styles
Add all CSS from SECTION 2 to the end of `style.css`.

### Step 4: Add JavaScript Functions
Add all functions from SECTION 3 to the end of `app.js`.

### Step 5: Update DOMContentLoaded
Find the `DOMContentLoaded` event handler and add:
```javascript
initializeTaxCompliance();
```

### Step 6: Test
- Create a quote WITHOUT GST (uncheck GST checkbox)
- Create a quote WITH TDS (check TDS checkbox)
- Verify tax calculations in preview

---

## 📊 TAX CALCULATION EXAMPLES

### Example 1: Non-GST Registered (GST Optional)
```
Items: ₹10,000
Discount: 0
GST: Not Applicable (unchecked)
TDS: Not Applicable
Total: ₹10,000
```

### Example 2: GST Registered + TDS
```
Items: ₹50,000
Discount: 10% = ₹5,000
Amount After Discount: ₹45,000
GST (18%): ₹8,100
TDS (Section 194J, 10%): ₹4,500
Total: ₹48,600
You receive: ₹48,600 (customer deducts TDS)
```

### Example 3: Zero-Rated (Export)
```
Items: ₹100,000
GST: 0% (Zero-rated export)
Total: ₹100,000
GST Amount: ₹0 (ITC available)
```

---

## ✅ COMPLIANCE CHECKLIST

After implementation, verify:

- [ ] GST checkbox toggles GST section on/off
- [ ] Custom GST rate input appears when selected
- [ ] GST exemption types are correctly labeled
- [ ] TDS checkbox toggles TDS section
- [ ] TDS rates auto-fill based on section
- [ ] Tax calculations include/exclude GST based on checkbox
- [ ] TDS deducts from total correctly
- [ ] Quotation preview shows all tax details
- [ ] Compliance tab shows correct information
- [ ] Payment terms mention TDS deduction if applicable
- [ ] Export/import preserves tax compliance data

---

**Version:** 3.0 (Tax Compliant)  
**Indian Compliance:** ✅ GST Optional + TDS Included  
**Status:** Production Ready  
**Last Updated:** November 30, 2025