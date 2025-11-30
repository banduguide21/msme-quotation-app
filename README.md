# 💼 MSME Quotation App - Complete Build & Deployment Guide

A **free, open-source, GST-compliant quotation generator** for Indian MSMEs. Create and send professional quotations in 60 seconds—no backend required, works 100% in the browser.

## 🚀 Key Features

✅ **Lightning-fast quotation creation** - Fill in customer, items, GST, and submit in <1 minute  
✅ **GST compliance** - Automatic tax calculations (5%, 12%, 18%, 28%)  
✅ **Multiple templates** - Product, Service, Project, AMC quotes  
✅ **Multi-channel sharing** - PDF download, WhatsApp, Email  
✅ **Full offline support** - Works without internet after loading  
✅ **Quotation management** - Track, search, and manage all quotations  
✅ **Zero infrastructure** - Hosted free on GitHub Pages  
✅ **No paid tools** - Pure HTML5 + CSS3 + Vanilla JavaScript  

---

## 🛠️ Tech Stack

| Component | Technology | Free? |
|-----------|-----------|-------|
| Frontend | HTML5 + CSS3 + JavaScript (Vanilla) | ✅ Yes |
| Hosting | GitHub Pages | ✅ Yes |
| Repository | GitHub | ✅ Yes |
| Database | Browser LocalStorage | ✅ Yes |
| PDF Export | Browser Print-to-PDF | ✅ Yes |

---

## 📋 Step-by-Step Setup (Novice-Friendly)

### Phase 1: Repository Setup (5 minutes)

#### Step 1.1: Create GitHub Account
1. Go to **github.com**
2. Click **Sign up**
3. Enter email, create password, verify email
4. Done!

#### Step 1.2: Create Repository
1. Click **+** (top right corner)
2. Select **New repository**
3. Fill in:
   - **Repository name:** `msme-quotation-app`
   - **Description:** "AI Quotation App for Indian MSMEs"
   - **Visibility:** **Public** (required for free hosting)
4. Check "Add a README file"
5. Click **Create repository**

#### Step 1.3: Enable GitHub Pages
1. Go to your repository
2. Click **Settings** tab
3. Left sidebar → Click **Pages**
4. Under "Source" → Select "Deploy from a branch"
5. Branch: `main` | Folder: `/ (root)`
6. Click **Save**
7. ✅ Your app is now at: `https://YOUR_USERNAME.github.io/msme-quotation-app`

---

### Phase 2: Upload Files (10 minutes)

#### Step 2.1: Add index.html
1. In GitHub, click **Add file** → **Create new file**
2. Name: `index.html`
3. Copy ALL content from `index.html` (provided separately)
4. Paste into GitHub
5. Scroll down → **Commit changes**
6. Message: "Add main HTML structure"
7. Click **Commit**

#### Step 2.2: Add style.css
1. Click **Add file** → **Create new file**
2. Name: `style.css`
3. Copy ALL content from `style.css` (provided separately)
4. Paste into GitHub
5. **Commit changes** → Message: "Add styling"

#### Step 2.3: Add app.js
1. Click **Add file** → **Create new file**
2. Name: `app.js`
3. Copy ALL content from `app.js` (provided separately)
4. Paste into GitHub
5. **Commit changes** → Message: "Add app logic"

#### Step 2.4: Update README.md
1. Go to your repository → Click **README.md**
2. Click ✏️ (Edit)
3. Replace content with this:

```markdown
# 💼 MSME Quotation App

Professional quotation generator for Indian MSMEs with GST compliance.

## 🎯 Features
- Create quotations in 60 seconds
- GST-compliant (5%, 12%, 18%, 28% rates)
- PDF download, WhatsApp, Email sharing
- Works offline
- 100% free

## 🚀 Launch App
[👉 Open the App](https://YOUR_USERNAME.github.io/msme-quotation-app)

Replace `YOUR_USERNAME` with your actual GitHub username.

## 📖 How to Use
1. Go to "Create Quote" tab
2. Fill customer details and items
3. Select GST rate
4. Click "Generate Quote"
5. Download, print, or share via WhatsApp/Email

## 💾 Your Data
- All quotations saved in your browser (LocalStorage)
- No data sent to any server
- Export/Import backups anytime

## 🔧 Deploy on Your Own Server (Optional)
Download all 3 files and host on any web server.

---

Made with ❤️ for Indian MSMEs
```

4. **Commit changes**

---

### Phase 3: Test Your App (5 minutes)

1. Wait 1-2 minutes for GitHub Pages to deploy
2. Go to: `https://YOUR_USERNAME.github.io/msme-quotation-app`
3. You should see the purple header with "MSME Quotation App"

#### Test Steps:
1. Click **Create Quote**
2. Enter:
   - Customer Name: "Test Customer"
   - Company: "Test Company"
   - Click **+ Add Item/Service**
   - Description: "Sample Item"
   - Qty: 1
   - Price: 1000
3. Select GST: 18%
4. Click **Generate Quote**
5. ✅ Should open a preview modal
6. Try "📄 Download PDF", "📱 Share WhatsApp", "📧 Email"

---

## 📖 User Guide

### Creating a Quotation
1. **Customer Details**: Name, company, email, GSTIN
2. **Add Items**: Click "+ Add Item/Service", enter description, quantity, price
3. **Tax & Discount**: Select GST rate, add discount if needed
4. **Payment Terms**: Specify advance, balance, delivery terms
5. **Special Notes**: Add T&Cs, warranty, or special instructions
6. **Generate**: Click "Generate Quote" button

### Sharing Options
- **PDF**: Print-to-PDF (Ctrl+P or Cmd+P in preview)
- **WhatsApp**: Pre-filled message with quote details
- **Email**: Pre-filled email with full quotation data
- **Print**: Direct printer output

### Managing Quotations
- **View**: Go to "My Quotations" tab
- **Search**: Use search box to find by customer name or quote ID
- **Delete**: Remove individual quotations
- **Export**: Backup all data as JSON file
- **Import**: Restore from backup file

### Templates
- **Product Quote**: For physical products (includes SKU, stock info)
- **Service Quote**: For hourly/project services
- **Project Estimate**: For multi-phase, milestone-based projects
- **AMC**: For annual maintenance contracts

### Settings
- **Default Company Info**: Pre-fill company name, GSTIN, logo
- **Default Payment Terms**: Auto-populate payment conditions
- **Data Management**: Export/import/reset options

---

## 🛡️ Data & Privacy

- ✅ **All data stored locally** in your browser (LocalStorage)
- ✅ **No data sent to any server**
- ✅ **No tracking or analytics**
- ✅ **Export anytime** as JSON backup
- ✅ **Works offline** after first load

---

## 🚀 Optional: Enhanced Features (Phase 2)

### To Add Later:
1. **WhatsApp Bot Integration**: Auto-respond to customer enquiries with quote drafts
2. **Email Parsing**: Read customer emails and auto-create quote drafts
3. **Invoice Conversion**: Convert approved quotation to tax invoice
4. **Tally Integration**: Export quotes directly to Tally accounting software
5. **SMS Notifications**: Remind customers before quote expiry
6. **Multi-language**: Hindi, Marathi, Tamil support
7. **Team Collaboration**: Multi-user access with role-based permissions

---

## 🐛 Troubleshooting

### App not loading?
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Try different browser

### Quotations not saving?
- Check if LocalStorage is enabled (it is by default)
- Use "Export Data" to backup
- Try clearing and reloading page

### PDF download not working?
- Use the Print button instead
- In print dialog, select "Save as PDF"
- Set margins to minimal

### WhatsApp share not working?
- You must have WhatsApp installed or WhatsApp Web open
- Check if phone number is in E.164 format (+91...)

---

## 📱 Mobile-First Design

The app is fully responsive and optimized for:
- 📱 Android phones (Chrome, Firefox)
- 📱 iPhones (Safari)
- 💻 Tablets
- 🖥️ Desktop browsers

---

## 🤝 Contributing

Want to improve the app?
1. Fork the repository
2. Make changes locally
3. Test thoroughly
4. Submit Pull Request

---

## 📞 Support & Feedback

- Found a bug? → Open an Issue on GitHub
- Have a feature idea? → Start a Discussion
- Want to collaborate? → Email or DM

---

## 📄 License

This project is **free and open-source** under MIT License.
Feel free to use, modify, and distribute for commercial purposes.

---

## 🎓 Deployment Alternatives

If you prefer other free hosting:

| Platform | Type | Free Tier | Setup Time |
|----------|------|-----------|-----------|
| GitHub Pages | Static | ✅ Yes | 5 min |
| Netlify | Static | ✅ Yes | 5 min |
| Vercel | Static | ✅ Yes | 5 min |
| Firebase | Static | ✅ Yes | 10 min |
| Surge.sh | Static | ✅ Yes | 3 min |

All methods are equally free and work the same way. GitHub Pages is recommended for beginners.

---

**Last Updated:** Nov 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

---