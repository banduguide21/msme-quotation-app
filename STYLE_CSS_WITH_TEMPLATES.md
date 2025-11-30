# 📁 STYLE.CSS - COMPLETE UPDATED FILE (With Templates)

```css
/* ===== MSME QUOTATION APP v3.0 - COMPLETE STYLING WITH TEMPLATES ===== */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
    color: #333;
    transition: background 0.3s;
}

body[data-theme="dark"] {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #e0e0e0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    overflow: hidden;
}

body[data-theme="dark"] .container {
    background: #2d2d2d;
    color: #e0e0e0;
}

/* ===== HEADER ===== */
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 20px;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.header h1 {
    font-size: 2.5rem;
    margin: 0;
}

.dark-mode-btn {
    background: rgba(255,255,255,0.2);
    border: 2px solid white;
    color: white;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s;
}

.dark-mode-btn:hover {
    background: rgba(255,255,255,0.3);
}

.subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
}

/* ===== TABS ===== */
.tabs {
    display: flex;
    background: #f5f5f5;
    border-bottom: 2px solid #e0e0e0;
    overflow-x: auto;
}

body[data-theme="dark"] .tabs {
    background: #3a3a3a;
}

.tab-btn {
    flex: 1;
    padding: 15px 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #666;
    transition: all 0.3s;
    white-space: nowrap;
    min-width: 120px;
}

body[data-theme="dark"] .tab-btn {
    color: #999;
}

.tab-btn:hover {
    background: #efefef;
}

body[data-theme="dark"] .tab-btn:hover {
    background: #4a4a4a;
}

.tab-btn.active {
    background: white;
    color: #667eea;
    border-bottom: 3px solid #667eea;
    margin-bottom: -2px;
}

body[data-theme="dark"] .tab-btn.active {
    background: #2d2d2d;
    color: #64b5f6;
}

/* ===== TAB CONTENT ===== */
.tab-content {
    display: none;
    padding: 30px;
    animation: fadeIn 0.3s;
}

body[data-theme="dark"] .tab-content {
    background: #2d2d2d;
}

.tab-content.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ===== TEMPLATES GRID (NEW) ===== */
.templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.template-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 25px;
    text-align: center;
    transition: all 0.3s;
    cursor: pointer;
}

body[data-theme="dark"] .template-card {
    background: #3a3a3a;
    border-color: #555;
}

.template-card:hover {
    border-color: #667eea;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    transform: translateY(-4px);
}

.template-icon {
    font-size: 3rem;
    margin-bottom: 15px;
}

.template-card h4 {
    color: #667eea;
    margin-bottom: 10px;
    font-size: 1.2rem;
}

body[data-theme="dark"] .template-card h4 {
    color: #64b5f6;
}

.template-card p {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 15px;
    line-height: 1.5;
}

body[data-theme="dark"] .template-card p {
    color: #aaa;
}

.template-details {
    background: #f9f9f9;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 0.85rem;
    color: #555;
}

body[data-theme="dark"] .template-details {
    background: #4a4a4a;
    color: #aaa;
}

/* ===== FORMS ===== */
.form-section {
    background: #fafafa;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

body[data-theme="dark"] .form-section {
    background: #3a3a3a;
    border-color: #555;
    color: #e0e0e0;
}

.form-section legend {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
}

body[data-theme="dark"] .form-section legend {
    color: #e0e0e0;
}

label {
    display: block;
    margin-top: 12px;
    margin-bottom: 5px;
    font-weight: 500;
    color: #555;
}

body[data-theme="dark"] label {
    color: #b0b0b0;
}

input[type="text"],
input[type="email"],
input[type="phone"],
input[type="number"],
select,
textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.2s;
    background: white;
    color: #333;
}

body[data-theme="dark"] input[type="text"],
body[data-theme="dark"] input[type="email"],
body[data-theme="dark"] input[type="phone"],
body[data-theme="dark"] input[type="number"],
body[data-theme="dark"] select,
body[data-theme="dark"] textarea {
    background: #4a4a4a;
    border-color: #555;
    color: #e0e0e0;
}

input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea {
    resize: vertical;
}

/* ===== TAX SUBSECTIONS ===== */
.tax-subsection {
    background: white;
    padding: 15px;
    border-radius: 6px;
    border-left: 4px solid #667eea;
    margin-bottom: 10px;
}

body[data-theme="dark"] .tax-subsection {
    background: #4a4a4a;
    border-left-color: #64b5f6;
}

.tax-subsection h5 {
    margin: 0 0 15px 0;
    color: #667eea;
    font-size: 1.05rem;
}

body[data-theme="dark"] .tax-subsection h5 {
    color: #64b5f6;
}

/* ===== ITEMS CONTAINER ===== */
.item-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    gap: 10px;
    padding: 15px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin-bottom: 10px;
    align-items: center;
}

body[data-theme="dark"] .item-row {
    background: #4a4a4a;
    border-color: #555;
}

.item-row input {
    padding: 8px;
}

.remove-item-btn {
    background: #ff4444;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.remove-item-btn:hover {
    background: #cc0000;
}

/* ===== BUTTONS ===== */
.btn-primary,
.btn-secondary,
.btn-danger {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary {
    background: #667eea;
    color: white;
}

.btn-primary:hover {
    background: #5568d3;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: #e0e0e0;
    color: #333;
}

body[data-theme="dark"] .btn-secondary {
    background: #555;
    color: #e0e0e0;
}

.btn-secondary:hover {
    background: #d0d0d0;
}

body[data-theme="dark"] .btn-secondary:hover {
    background: #666;
}

.btn-danger {
    background: #ff4444;
    color: white;
}

.btn-danger:hover {
    background: #cc0000;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.form-actions button {
    flex: 1;
    min-width: 150px;
}

/* ===== ANALYTICS ===== */
.analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.metric-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.metric-value {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.metric-label {
    font-size: 0.9rem;
    opacity: 0.9;
}

.analytics-section {
    background: #fafafa;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

body[data-theme="dark"] .analytics-section {
    background: #3a3a3a;
    border-color: #555;
}

.analytics-section h4 {
    color: #667eea;
    margin-bottom: 15px;
}

body[data-theme="dark"] .analytics-section h4 {
    color: #64b5f6;
}

.customer-list,
.recent-list,
.expiring-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}

.customer-item,
.recent-item,
.expiring-item {
    background: white;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

body[data-theme="dark"] .customer-item,
body[data-theme="dark"] .recent-item,
body[data-theme="dark"] .expiring-item {
    background: #4a4a4a;
}

.customer-item p,
.recent-item p,
.expiring-item p {
    margin: 5px 0;
    font-size: 0.9rem;
    color: #666;
}

body[data-theme="dark"] .customer-item p,
body[data-theme="dark"] .recent-item p,
body[data-theme="dark"] .expiring-item p {
    color: #aaa;
}

/* ===== QUOTATIONS LIST ===== */
.list-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.search-box {
    flex: 1;
    min-width: 200px;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
}

body[data-theme="dark"] .search-box {
    background: #4a4a4a;
    border-color: #555;
    color: #e0e0e0;
}

.quotations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.quotation-card {
    background: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s;
}

body[data-theme="dark"] .quotation-card {
    background: #3a3a3a;
    border-color: #555;
}

.quotation-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-4px);
}

.quotation-card h4 {
    color: #667eea;
    margin-bottom: 10px;
}

body[data-theme="dark"] .quotation-card h4 {
    color: #64b5f6;
}

.quotation-card p {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 5px;
}

body[data-theme="dark"] .quotation-card p {
    color: #aaa;
}

.quotation-card .actions {
    display: flex;
    gap: 8px;
    margin-top: 15px;
}

.quotation-card button {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    background: #667eea;
    color: white;
    transition: all 0.2s;
}

.quotation-card button:hover {
    background: #5568d3;
}

.quotation-card .delete-btn {
    background: #ff4444;
}

.quotation-card .delete-btn:hover {
    background: #cc0000;
}

/* ===== FAVORITES ===== */
.favorites-section {
    background: #fafafa;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
}

body[data-theme="dark"] .favorites-section {
    background: #3a3a3a;
}

.favorites-section h4 {
    color: #667eea;
    margin-bottom: 15px;
}

body[data-theme="dark"] .favorites-section h4 {
    color: #64b5f6;
}

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}

.favorites-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.favorite-item,
.favorite-customer,
.favorite-term {
    background: white;
    padding: 12px 15px;
    border-radius: 8px;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: all 0.2s;
    word-break: break-word;
}

body[data-theme="dark"] .favorite-item,
body[data-theme="dark"] .favorite-customer,
body[data-theme="dark"] .favorite-term {
    background: #4a4a4a;
    border-color: #555;
    color: #e0e0e0;
}

.favorite-item:hover,
.favorite-customer:hover,
.favorite-term:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

/* ===== RECURRING ITEMS ===== */
.recurring-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
}

.recurring-item {
    background: white;
    padding: 15px;
    border-radius: 8px;
    border: 2px solid #e0e0e0;
    transition: all 0.2s;
}

body[data-theme="dark"] .recurring-item {
    background: #4a4a4a;
    border-color: #555;
}

.recurring-item:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.recurring-item h5 {
    color: #667eea;
    margin: 0 0 10px 0;
}

body[data-theme="dark"] .recurring-item h5 {
    color: #64b5f6;
}

.recurring-item p {
    margin: 5px 0;
    font-size: 0.9rem;
    color: #666;
}

body[data-theme="dark"] .recurring-item p {
    color: #aaa;
}

.recurring-item-actions {
    margin-top: 10px;
    display: flex;
    gap: 10px;
}

.recurring-item-actions button {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
}

.recurring-use-btn {
    background: #667eea;
    color: white;
}

.recurring-use-btn:hover {
    background: #5568d3;
}

.recurring-remove-btn {
    background: #ff4444;
    color: white;
}

.recurring-remove-btn:hover {
    background: #cc0000;
}

/* ===== TAX SUMMARY ===== */
.tax-summary {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
}

body[data-theme="dark"] .tax-summary {
    background: #3a3a3a;
}

.tax-summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
}

body[data-theme="dark"] .tax-summary-row {
    border-bottom-color: #555;
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

body[data-theme="dark"] .tax-label {
    color: #aaa;
}

.tax-amount {
    color: #667eea;
    font-weight: 600;
}

body[data-theme="dark"] .tax-amount {
    color: #64b5f6;
}

/* ===== COMPLIANCE CARDS ===== */
.compliance-card {
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

body[data-theme="dark"] .compliance-card {
    background: #3a3a3a;
    border-color: #555;
}

.compliance-card h4 {
    color: #667eea;
    margin: 0 0 15px 0;
    font-size: 1.1rem;
}

body[data-theme="dark"] .compliance-card h4 {
    color: #64b5f6;
}

.compliance-text {
    background: white;
    padding: 15px;
    border-left: 4px solid #667eea;
    border-radius: 4px;
    color: #555;
    line-height: 1.8;
}

body[data-theme="dark"] .compliance-text {
    background: #4a4a4a;
    color: #b0b0b0;
}

/* ===== MODAL ===== */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

body[data-theme="dark"] .modal-content {
    background: #2d2d2d;
    color: #e0e0e0;
}

.close-modal {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 2rem;
    cursor: pointer;
    color: #999;
}

.close-modal:hover {
    color: #333;
}

body[data-theme="dark"] .close-modal:hover {
    color: #e0e0e0;
}

/* ===== QUOTE PREVIEW ===== */
.quote-preview {
    background: white;
    border: 1px solid #ddd;
    padding: 40px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #333;
}

body[data-theme="dark"] .quote-preview {
    background: #3a3a3a;
    border-color: #555;
    color: #e0e0e0;
}

.quote-preview table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.quote-preview th {
    background: #f5f5f5;
    padding: 10px;
    text-align: left;
    border-bottom: 2px solid #ddd;
    font-weight: 600;
}

body[data-theme="dark"] .quote-preview th {
    background: #4a4a4a;
    border-color: #555;
}

.quote-preview td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

body[data-theme="dark"] .quote-preview td {
    border-color: #555;
}

.modal-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.modal-actions button {
    flex: 1;
    min-width: 150px;
}

/* ===== MESSAGE ===== */
.message {
    padding: 15px;
    border-radius: 6px;
    margin-top: 10px;
}

.message.success {
    background: #c8e6c9;
    color: #2e7d32;
    border: 1px solid #81c784;
}

.message.error {
    background: #ffcdd2;
    color: #c62828;
    border: 1px solid #ef5350;
}

/* ===== FOOTER ===== */
.footer {
    background: #f5f5f5;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #e0e0e0;
    color: #666;
    font-size: 0.9rem;
}

body[data-theme="dark"] .footer {
    background: #3a3a3a;
    border-top-color: #555;
    color: #aaa;
}

.footer p {
    margin: 5px 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    .header h1 {
        font-size: 1.8rem;
    }

    .tabs {
        flex-wrap: wrap;
    }

    .tab-btn {
        min-width: 100px;
        font-size: 0.85rem;
        padding: 12px 10px;
    }

    .tab-content {
        padding: 15px;
    }

    .item-row {
        grid-template-columns: 1fr;
    }

    .quotations-grid {
        grid-template-columns: 1fr;
    }

    .templates-grid {
        grid-template-columns: 1fr;
    }

    .form-actions {
        flex-direction: column;
    }

    .form-actions button {
        min-width: auto;
        width: 100%;
    }

    .modal-content {
        padding: 20px;
        margin: 20px;
    }

    .quote-preview {
        padding: 20px;
        font-size: 0.85rem;
    }

    .modal-actions {
        flex-direction: column;
    }

    .modal-actions button {
        min-width: auto;
        width: 100%;
    }

    .analytics-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .customer-list,
    .recent-list,
    .expiring-list {
        grid-template-columns: 1fr;
    }

    .favorites-grid {
        grid-template-columns: 1fr;
    }

    .recurring-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .header {
        padding: 20px 10px;
    }

    .header h1 {
        font-size: 1.5rem;
    }

    .header-top {
        flex-direction: column;
        gap: 10px;
    }

    .tab-btn {
        padding: 10px 8px;
        font-size: 0.75rem;
        min-width: 80px;
    }

    .metric-card {
        padding: 15px;
    }

    .metric-value {
        font-size: 2rem;
    }

    .analytics-grid {
        grid-template-columns: 1fr;
    }
}

/* ===== PRINT STYLES ===== */
@media print {
    body {
        background: white;
    }

    .header,
    .tabs,
    .modal-actions,
    .footer {
        display: none;
    }

    .quote-preview {
        box-shadow: none;
        border: none;
        page-break-after: always;
    }
}
```

---

## Key Features in this CSS:

✅ **Templates Styling**
- .templates-grid (3-column responsive grid)
- .template-card (interactive card design)
- .template-icon (large emoji icons)
- .template-details (info section)

✅ **All Previous Components**
- Form sections and inputs
- Buttons and states
- Tabs navigation
- Analytics dashboard
- Quotations grid
- Favorites
- Recurring items
- Modal preview
- Dark mode support

✅ **Responsive Design**
- Mobile (480px and below)
- Tablet (768px and below)
- Desktop (all sizes)
- Print styles

✅ **Dark Mode**
- All components have dark theme colors
- Smooth transitions
- Proper contrast

**File Size:** ~28 KB  
**Status:** ✅ Complete & Ready