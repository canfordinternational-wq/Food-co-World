// Food Co World Accounting Portal - Main Application Engine
// Enhanced with Indian Rupees (₹), Multi-Outlet Separate Accounting,
// Master Entries Full Edit Capability, Invoice Modification with Reason Tracking,
// Compulsory Supplier Address, Optional Client Address, and Direct Logo Upload.

(function() {
  'use strict';

  // Application State
  let state = {
    company: {},
    master: {
      outlets: [],
      customers: [],
      vendors: [],
      expenseCategories: [],
      incomeCategories: [],
      itemCategories: [],
      items: [],
      chartOfAccounts: [],
      taxRates: [],
      paymentMethods: []
    },
    invoices: [],
    expenses: [],
    journalEntries: [],
    currentView: 'dashboard',
    currentMasterTab: 'outlets',
    selectedOutlet: 'all', // 'all' or outletId
    reportDateRange: 'all',
    currentReportType: 'pnl',
    editingInvoiceId: null, // null for new, ID for editing
    editingMaster: {
      type: null, // 'expenseCat', 'incomeCat', 'itemCat', 'item', 'account', 'vendor', 'outlet', 'customer', 'tax', 'payment'
      id: null
    },
    searchQueries: {
      master: '',
      invoices: '',
      expenses: '',
      journals: ''
    }
  };

  const STORAGE_KEY = 'FOOD_CO_WORLD_ACCOUNTING_DATA_V2';

  // Initialize
  function init() {
    loadData();
    ensureIndianSpiceProducts();
    setupEventListeners();
    renderLogo();
    populateOutletSelectors();
    renderCurrentView();
    updateDashboard();
    renderMasterView();
    renderInvoicesTable();
    renderExpensesTable();
    renderJournalsTable();
    renderBankingView();
    renderFinancialReport();
    renderSettingsView();
  }

  // Load Data with Migration Check
  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        state.company = parsed.company || window.DEFAULT_ACCOUNTING_DATA.company;
        state.master = parsed.master || window.DEFAULT_ACCOUNTING_DATA.master;
        state.invoices = parsed.invoices || window.DEFAULT_ACCOUNTING_DATA.invoices;
        state.expenses = parsed.expenses || window.DEFAULT_ACCOUNTING_DATA.expenses;
        state.journalEntries = parsed.journalEntries || window.DEFAULT_ACCOUNTING_DATA.journalEntries;

        // Auto-migrate if older version without outlets or not in INR
        if (!state.master.outlets || state.master.outlets.length === 0 || state.company.currency !== '₹') {
          console.log("Migrating to V2 Indian Rupees & Multi-Outlet Structure...");
          resetToDefaults(false);
        }
      } else {
        resetToDefaults(false);
      }
    } catch (e) {
      console.error("Failed to load local storage data:", e);
      resetToDefaults(false);
    }
  }

  // Indian Spice Product Starter Catalogue
  // Images use Wikimedia Commons Special:FilePath URLs so the catalogue can remain lightweight.
  const INDIAN_SPICE_PRODUCTS = [
    { sku: 'SP-001', name: 'Black Pepper', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Indian%20black%20pepper.jpg?width=500' },
    { sku: 'SP-002', name: 'Turmeric', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Turmeric%20of%20India.jpg?width=500' },
    { sku: 'SP-003', name: 'Green Cardamom', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cardamom%20(Elaichi)%20from%20India.jpg?width=500' },
    { sku: 'SP-004', name: 'Cinnamon', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cinnamon%20bark.jpg?width=500' },
    { sku: 'SP-005', name: 'Cloves', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cloves%20from%20india.jpg?width=500' },
    { sku: 'SP-006', name: 'Cumin Seeds', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cumin.jpg?width=500' },
    { sku: 'SP-007', name: 'Coriander Seeds', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coriander%20whole.jpg?width=500' },
    { sku: 'SP-008', name: 'Fenugreek Seeds', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fenugreek%20seeds(%E0%A6%AE%E0%A7%87%E0%A6%A5%E0%A6%BF).JPG?width=500' },
    { sku: 'SP-009', name: 'Mustard Seeds', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mustard%20Seeds%20in%20a%20plate%20at%20Reganigudem.jpg?width=500' },
    { sku: 'SP-010', name: 'Dry Red Chilli', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Closeup%20of%20Khola%20chilli.jpg?width=500' },
    { sku: 'SP-011', name: 'Star Anise', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Illicium%20verum.jpg?width=500' },
    { sku: 'SP-012', name: 'Black Cumin (Kalonji)', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blackcuminseeds.jpg?width=500' },
    { sku: 'SP-013', name: 'Mace (Javitri)', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mace%201.JPG?width=500' },
    { sku: 'SP-014', name: 'Kasuri Methi', category: 'Indian Spices', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kasoori%20Methi.jpg?width=500' },
    { sku: 'SP-015', name: 'Indian Spice Mix', category: 'Indian Spice Blends', unit: 'Kg', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Common%20Indian%20spices.jpg?width=500' }
  ];

  function ensureIndianSpiceProducts() {
    if (!state.master || !Array.isArray(state.master.items)) return;
    let changed = false;
    state.master.itemCategories = Array.isArray(state.master.itemCategories) ? state.master.itemCategories : [];
    [
      { name: 'Indian Spices', description: 'Whole and dried Indian spices for wholesale and retail trade.' },
      { name: 'Indian Spice Blends', description: 'Blended spice products and masala mixes.' }
    ].forEach((category, index) => {
      if (!state.master.itemCategories.some(c => c.name === category.name)) {
        state.master.itemCategories.push({ id: `SPICE-CAT-${index + 1}`, ...category });
        changed = true;
      }
    });
    INDIAN_SPICE_PRODUCTS.forEach((spice, index) => {
      const existing = state.master.items.find(item => item.sku === spice.sku);
      if (existing) {
        if (!existing.image) { existing.image = spice.image; changed = true; }
        if (!existing.category || existing.category === 'Grains, Spices & Dry Staples') { existing.category = spice.category; changed = true; }
        return;
      }
      state.master.items.push({
        id: spice.sku,
        name: spice.name,
        sku: spice.sku,
        category: spice.category,
        unit: spice.unit,
        costPrice: 0,
        salePrice: 0,
        taxRate: 0,
        stockQty: 0,
        reorderLevel: 10,
        image: spice.image
      });
      changed = true;
    });
    if (changed) saveData();
  }

  // Save State
  function saveData() {
    try {
      const dataToSave = {
        company: state.company,
        master: state.master,
        invoices: state.invoices,
        expenses: state.expenses,
        journalEntries: state.journalEntries
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Error saving data:", e);
      showToast("Storage error: Failed to save changes locally", "error");
    }
  }

  // Reset to Defaults
  function resetToDefaults(showFeedback = true) {
    if (window.DEFAULT_ACCOUNTING_DATA) {
      state.company = JSON.parse(JSON.stringify(window.DEFAULT_ACCOUNTING_DATA.company));
      state.master = JSON.parse(JSON.stringify(window.DEFAULT_ACCOUNTING_DATA.master));
      state.invoices = JSON.parse(JSON.stringify(window.DEFAULT_ACCOUNTING_DATA.invoices));
      state.expenses = JSON.parse(JSON.stringify(window.DEFAULT_ACCOUNTING_DATA.expenses));
      state.journalEntries = JSON.parse(JSON.stringify(window.DEFAULT_ACCOUNTING_DATA.journalEntries));
      saveData();
      renderLogo();
      populateOutletSelectors();
      if (showFeedback) {
        showToast("Reset to default Food Co World sample data (Rupees & Outlets)", "success");
        refreshAllViews();
      }
    }
  }

  // Indian Rupee (₹) Currency Formatter
  function formatCurrency(amount) {
    const num = Number(amount) || 0;
    const sign = num < 0 ? '-' : '';
    const absVal = Math.abs(num);
    const curr = state.company.currency || '₹';
    // Format using Indian numbering system (Lakhs & Crores)
    return `${sign}${curr} ${absVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  // Toast Notification
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>';
    }
    
    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Render Brand Logo
  function renderLogo() {
    const brandSlot = document.getElementById('sidebar-brand-slot');
    const settingsPreview = document.getElementById('settings-logo-preview');
    if (!brandSlot) return;

    if (state.company.logo && state.company.logo.trim() !== '') {
      brandSlot.innerHTML = `<img src="${state.company.logo}" class="brand-custom-logo" alt="Food Co World Logo">`;
      if (settingsPreview) {
        settingsPreview.innerHTML = `<img src="${state.company.logo}" alt="Company Logo">`;
      }
    } else {
      brandSlot.innerHTML = `<div class="brand-logo">FC</div>`;
      if (settingsPreview) {
        settingsPreview.innerHTML = `<span style="font-size:11px; color:#94a3b8; font-weight:600;">No Logo</span>`;
      }
    }
  }

  // Populate Outlet Selectors across App (Topbar, Invoices, Expenses, Reports)
  function populateOutletSelectors() {
    const topbarSelect = document.getElementById('topbar-outlet-selector');
    if (topbarSelect) {
      const current = state.selectedOutlet || 'all';
      let opts = `<option value="all" ${current === 'all' ? 'selected' : ''}>🏢 All Outlets (Consolidated)</option>`;
      state.master.outlets.forEach(out => {
        opts += `<option value="${out.id}" ${current === out.id ? 'selected' : ''}>📍 ${out.name} [${out.code}]</option>`;
      });
      topbarSelect.innerHTML = opts;
    }
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Nav Items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewName = item.getAttribute('data-view');
        if (viewName) switchView(viewName);
      });
    });

    // Master Navigation Tabs
    document.querySelectorAll('.master-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchMasterTab(tab);
      });
    });

    // Search input handlers
    const masterSearch = document.getElementById('master-search');
    if (masterSearch) {
      masterSearch.addEventListener('input', (e) => {
        state.searchQueries.master = e.target.value.toLowerCase();
        renderCurrentMasterTab();
      });
    }

    const invoicesSearch = document.getElementById('invoices-search');
    if (invoicesSearch) {
      invoicesSearch.addEventListener('input', (e) => {
        state.searchQueries.invoices = e.target.value.toLowerCase();
        renderInvoicesTable();
      });
    }

    const expensesSearch = document.getElementById('expenses-search');
    if (expensesSearch) {
      expensesSearch.addEventListener('input', (e) => {
        state.searchQueries.expenses = e.target.value.toLowerCase();
        renderExpensesTable();
      });
    }

    // Modal Close
    document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });

    // Topbar Outlet Selector
    const topbarOutlet = document.getElementById('topbar-outlet-selector');
    if (topbarOutlet) {
      topbarOutlet.addEventListener('change', (e) => {
        setOutletFilter(e.target.value);
      });
    }

    // Reports Selectors
    const reportTypeSelect = document.getElementById('report-type-select');
    if (reportTypeSelect) {
      reportTypeSelect.addEventListener('change', (e) => {
        state.currentReportType = e.target.value;
        renderFinancialReport();
      });
    }

    const reportRangeSelect = document.getElementById('report-range-select');
    if (reportRangeSelect) {
      reportRangeSelect.addEventListener('change', (e) => {
        state.reportDateRange = e.target.value;
        renderFinancialReport();
      });
    }

    const printReportBtn = document.getElementById('print-report-btn');
    if (printReportBtn) {
      printReportBtn.addEventListener('click', () => window.print());
    }

    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', exportFinancialReportCSV);
    }
  }

  // Switch Active View
  function switchView(viewName) {
    state.currentView = viewName;
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    document.querySelectorAll('.portal-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add('active');

    const titles = {
      dashboard: "Executive Dashboard",
      master: "Master Categories & Outlets",
      invoices: "Sales & Invoicing",
      expenses: "Expenses & Vendor Bills",
      journals: "General Ledger & Journal Entries",
      banking: "Cash & Bank Accounts",
      reports: "Financial Statements & Reports",
      settings: "Company Settings & Logo"
    };

    const titleEl = document.getElementById('current-page-title');
    if (titleEl) titleEl.textContent = titles[viewName] || "Accounting Portal";

    if (viewName === 'dashboard') updateDashboard();
    if (viewName === 'master') renderCurrentMasterTab();
    if (viewName === 'invoices') renderInvoicesTable();
    if (viewName === 'expenses') renderExpensesTable();
    if (viewName === 'journals') renderJournalsTable();
    if (viewName === 'banking') renderBankingView();
    if (viewName === 'reports') renderFinancialReport();
  }

  // Set Outlet Filter
  function setOutletFilter(outletId) {
    state.selectedOutlet = outletId;
    const outletObj = state.master.outlets.find(o => o.id === outletId);
    const label = outletObj ? outletObj.name : "All Outlets (Consolidated)";
    showToast(`Filtering accounts for: ${label}`, "info");

    refreshAllViews();
  }

  // Switch Master Tab
  function switchMasterTab(tabName) {
    state.currentMasterTab = tabName;
    document.querySelectorAll('.master-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderCurrentMasterTab();
  }

  function refreshAllViews() {
    populateOutletSelectors();
    updateDashboard();
    renderCurrentMasterTab();
    renderInvoicesTable();
    renderExpensesTable();
    renderJournalsTable();
    renderBankingView();
    renderFinancialReport();
    renderSettingsView();
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
    state.editingInvoiceId = null;
    state.editingMaster = { type: null, id: null };
  }

  function openModal(modalId) {
    closeAllModals();
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  // Filter Transactions by Outlet
  function getFilteredInvoices() {
    if (!state.selectedOutlet || state.selectedOutlet === 'all') {
      return state.invoices;
    }
    return state.invoices.filter(i => i.outletId === state.selectedOutlet);
  }

  function getFilteredExpenses() {
    if (!state.selectedOutlet || state.selectedOutlet === 'all') {
      return state.expenses;
    }
    return state.expenses.filter(e => e.outletId === state.selectedOutlet);
  }

  // ==========================================
  // DASHBOARD CALCULATIONS & CHARTS
  // ==========================================
  function updateDashboard() {
    const invs = getFilteredInvoices();
    const exps = getFilteredExpenses();

    const totalRevenue = invs.reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);
    const pendingReceivables = invs.filter(i => i.status === 'Pending').reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);
    const totalExpenses = exps.reduce((sum, exp) => sum + (Number(exp.total) || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    const cashAccounts = state.master.chartOfAccounts.filter(acc => ['1010', '1020', '1030'].includes(acc.code));
    const totalLiquidCash = cashAccounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);

    const revEl = document.getElementById('kpi-revenue');
    if (revEl) revEl.textContent = formatCurrency(totalRevenue);

    const expEl = document.getElementById('kpi-expenses');
    if (expEl) expEl.textContent = formatCurrency(totalExpenses);

    const profitEl = document.getElementById('kpi-profit');
    if (profitEl) {
      profitEl.textContent = formatCurrency(netProfit);
      profitEl.style.color = netProfit >= 0 ? '#10b981' : '#ef4444';
    }

    const recEl = document.getElementById('kpi-receivables');
    if (recEl) recEl.textContent = formatCurrency(pendingReceivables);

    const cashEl = document.getElementById('kpi-cash');
    if (cashEl) cashEl.textContent = formatCurrency(totalLiquidCash);

    renderRecentTransactions(invs, exps);
    renderRevenueExpenseChart(totalRevenue, totalExpenses);
    renderExpenseBreakdownChart(exps);
  }

  function renderRecentTransactions(invs, exps) {
    const tbody = document.getElementById('dashboard-recent-table');
    if (!tbody) return;

    const combined = [
      ...invs.map(inv => ({
        type: 'Invoice',
        id: inv.id,
        date: inv.date,
        party: inv.customerName,
        outlet: inv.outletName || 'Central Kitchen',
        category: inv.category,
        amount: inv.grandTotal,
        status: inv.status,
        isIncome: true
      })),
      ...exps.map(exp => ({
        type: 'Expense',
        id: exp.id,
        date: exp.date,
        party: exp.vendorName || 'Operational Bill',
        outlet: exp.outletName || 'Central Kitchen',
        category: exp.category,
        amount: exp.total,
        status: exp.status,
        isIncome: false
      }))
    ];

    combined.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recent = combined.slice(0, 6);

    tbody.innerHTML = recent.length === 0 ? 
      '<tr><td colspan="8" class="text-center" style="padding:20px; color:#94a3b8;">No transactions found for this outlet.</td></tr>' :
      recent.map(item => `
        <tr>
          <td><strong>${item.id}</strong></td>
          <td>${formatDate(item.date)}</td>
          <td>
            <span class="badge ${item.isIncome ? 'badge-success' : 'badge-danger'}">
              ${item.isIncome ? '↑ Revenue' : '↓ Expense'}
            </span>
          </td>
          <td>${item.party}</td>
          <td><span class="badge badge-purple" style="font-size:11px;">📍 ${item.outlet.replace('Food Co World - ', '')}</span></td>
          <td><span class="badge badge-secondary">${item.category}</span></td>
          <td class="text-right" style="font-weight: 600; color: ${item.isIncome ? '#047857' : '#b91c1c'};">
            ${item.isIncome ? '+' : '-'}${formatCurrency(item.amount)}
          </td>
          <td class="text-center">
            <span class="badge ${item.status === 'Paid' ? 'badge-success' : 'badge-warning'}">${item.status}</span>
          </td>
        </tr>
      `).join('');
  }

  function renderRevenueExpenseChart(currRev, currExp) {
    const canvas = document.getElementById('revenueExpenseChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth || 500;
    const height = canvas.height = 240;

    ctx.clearRect(0, 0, width, height);

    const months = ['Jul', 'Aug', 'Sep', 'Oct'];
    const revenueData = [280000, 360000, currRev, 120000];
    const expenseData = [210000, 290000, currExp, 85000];

    const maxVal = Math.max(...revenueData, ...expenseData, 500000) * 1.25;
    const padding = { top: 30, right: 30, bottom: 40, left: 75 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + (chartHeight / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const val = Math.round(maxVal - (maxVal / gridCount) * i);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`₹${(val / 1000).toFixed(0)}k`, padding.left - 10, y + 4);
    }

    const groupWidth = chartWidth / months.length;
    const barWidth = Math.min(28, groupWidth * 0.32);

    months.forEach((m, idx) => {
      const groupX = padding.left + idx * groupWidth;
      const revX = groupX + (groupWidth / 2) - barWidth - 3;
      const expX = groupX + (groupWidth / 2) + 3;

      const revHeight = (revenueData[idx] / maxVal) * chartHeight;
      const expHeight = (expenseData[idx] / maxVal) * chartHeight;

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(revX, padding.top + (chartHeight - revHeight), barWidth, revHeight, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(expX, padding.top + (chartHeight - expHeight), barWidth, expHeight, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(m, groupX + groupWidth / 2, height - 12);
    });

    ctx.fillStyle = '#10b981';
    ctx.fillRect(width - 170, 10, 12, 12);
    ctx.fillStyle = '#334155';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Revenue (₹)', width - 152, 20);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(width - 85, 10, 12, 12);
    ctx.fillStyle = '#334155';
    ctx.fillText('Expenses (₹)', width - 68, 20);
  }

  function renderExpenseBreakdownChart(exps) {
    const canvas = document.getElementById('expenseBreakdownChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth || 300;
    const height = canvas.height = 240;

    ctx.clearRect(0, 0, width, height);

    const catMap = {};
    exps.forEach(e => {
      catMap[e.category] = (catMap[e.category] || 0) + (Number(e.total) || 0);
    });

    const entries = Object.entries(catMap);
    if (entries.length === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No expenses in this outlet', width / 2, height / 2);
      return;
    }

    const total = entries.reduce((s, [, val]) => s + val, 0);
    const colors = ['#065f46', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];

    const centerX = width / 2;
    const centerY = height / 2 - 10;
    const outerRadius = Math.min(centerX, centerY) - 25;
    const innerRadius = outerRadius * 0.6;

    let startAngle = -Math.PI / 2;

    entries.forEach(([cat, val], idx) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      ctx.fillStyle = colors[idx % colors.length];

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fill();

      startAngle += sliceAngle;
    });

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(formatCurrency(total), centerX, centerY + 5);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Expenses', centerX, centerY + 18);
  }

  // ==========================================
  // MASTER SECTION (OUTLETS, CUSTOMERS, CATEGORIES WITH FULL EDIT)
  // ==========================================
  function renderMasterView() {
    renderCurrentMasterTab();
  }

  function renderCurrentMasterTab() {
    const tab = state.currentMasterTab;
    const container = document.getElementById('master-content-area');
    if (!container) return;

    const query = state.searchQueries.master;
    let html = '';

    switch (tab) {
      case 'outlets':
        html = buildOutletsTable(query);
        break;
      case 'customers':
        html = buildCustomersTable(query);
        break;
      case 'vendors':
        html = buildVendorsTable(query);
        break;
      case 'expenseCats':
        html = buildExpenseCatsTable(query);
        break;
      case 'incomeCats':
        html = buildIncomeCatsTable(query);
        break;
      case 'itemCats':
        html = buildItemCatsTable(query);
        break;
      case 'items':
        html = buildItemsCatalogTable(query);
        break;
      case 'coa':
        html = buildChartOfAccountsTable(query);
        break;
      case 'taxes':
        html = buildTaxRatesTable(query);
        break;
      case 'payments':
        html = buildPaymentMethodsTable(query);
        break;
      default:
        html = '<p>Select a category tab.</p>';
    }

    container.innerHTML = html;
  }

  // 1. Master: Outlets (Branches & Kitchens)
  function buildOutletsTable(query) {
    const list = state.master.outlets.filter(o => 
      !query || o.name.toLowerCase().includes(query) || o.code.toLowerCase().includes(query) || o.type.toLowerCase().includes(query) || (o.address && o.address.toLowerCase().includes(query))
    );

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div>
            <div style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">
              Food Co World Outlets, Kitchens & Retail Counters (${list.length})
            </div>
            <div style="font-size: 12px; color: #64748b;">
              Company-owned production base kitchens, delivery hubs, and retail outlets.
            </div>
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddOutletModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add New Outlet / Branch
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Outlet Code</th>
                <th>Outlet / Branch Name</th>
                <th>Facility Type</th>
                <th>Manager / Incharge</th>
                <th>Contact Phone</th>
                <th>Full Physical Address</th>
                <th class="text-center">Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.length === 0 ? '<tr><td colspan="8" class="text-center" style="padding: 24px; color:#94a3b8;">No outlets found.</td></tr>' : 
                list.map(o => `
                  <tr>
                    <td><code>${o.code}</code></td>
                    <td><strong>${o.name}</strong></td>
                    <td><span class="badge badge-purple">${o.type}</span></td>
                    <td>${o.manager || '-'}</td>
                    <td>${o.phone || '-'}</td>
                    <td style="color: #475569; max-width: 250px; font-size: 12px;">${o.address || '-'}</td>
                    <td class="text-center"><span class="badge badge-success">${o.status || 'Active'}</span></td>
                    <td class="text-right">
                      <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditOutletModal('${o.id}')">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteOutlet('${o.id}')">Delete</button>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 2. Master: Customers (Clients Billed)
  function buildCustomersTable(query) {
    const list = state.master.customers.filter(c => 
      !query || c.name.toLowerCase().includes(query) || (c.contact && c.contact.toLowerCase().includes(query)) || (c.type && c.type.toLowerCase().includes(query)) || (c.address && c.address.toLowerCase().includes(query))
    );

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div>
            <div style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">
              Customers & Food Buyers (${list.length})
            </div>
            <div style="font-size: 12px; color: #64748b;">
              External wholesale restaurants, hotels, corporate catering clients, and supermarket buyers.
            </div>
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddCustomerModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add New Client
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Client Name</th>
                <th>Client Type</th>
                <th>Contact Person</th>
                <th>Phone / Email</th>
                <th>Delivery Address (Optional)</th>
                <th class="text-right">Credit Limit</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.length === 0 ? '<tr><td colspan="8" class="text-center" style="padding: 24px; color:#94a3b8;">No clients registered.</td></tr>' : 
                list.map(c => `
                  <tr>
                    <td><code>${c.id}</code></td>
                    <td><strong>${c.name}</strong></td>
                    <td><span class="badge badge-info">${c.type}</span></td>
                    <td>${c.contact || '-'}</td>
                    <td>
                      <div style="font-size: 12px;">${c.phone || '-'}</div>
                      <div style="font-size: 11px; color:#64748b;">${c.email || '-'}</div>
                    </td>
                    <td style="color: #64748b; font-size: 12px; max-width: 200px;">
                      ${c.address && c.address.trim() ? c.address : '<em style="color:#cbd5e1;">(Not specified)</em>'}
                    </td>
                    <td class="text-right" style="font-weight:600;">${formatCurrency(c.creditLimit || 0)}</td>
                    <td class="text-right">
                      <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditCustomerModal('${c.id}')">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteCustomer('${c.id}')">Delete</button>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. Master: Suppliers / Vendors (Compulsory Registered Address)
  function buildVendorsTable(query) {
    const list = state.master.vendors.filter(v => 
      !query || v.name.toLowerCase().includes(query) || (v.contact && v.contact.toLowerCase().includes(query)) || (v.category && v.category.toLowerCase().includes(query)) || (v.address && v.address.toLowerCase().includes(query))
    );

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div>
            <div style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">
              Food Suppliers & Vendors (${list.length})
            </div>
            <div style="font-size: 12px; color: #64748b;">
              Registered farm growers, packaging vendors, meat suppliers, and utilities (Compulsory address required).
            </div>
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddVendorModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add Supplier / Vendor
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Vendor ID</th>
                <th>Supplier Name</th>
                <th>Category</th>
                <th>GSTIN / Tax ID</th>
                <th>Registered Address (Compulsory)</th>
                <th>Contact</th>
                <th class="text-center">Credit Days</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.length === 0 ? '<tr><td colspan="8" class="text-center" style="padding: 24px; color:#94a3b8;">No suppliers found.</td></tr>' : 
                list.map(v => `
                  <tr>
                    <td><code>${v.id}</code></td>
                    <td><strong>${v.name}</strong></td>
                    <td><span class="badge badge-secondary">${v.category}</span></td>
                    <td><code>${v.taxId || '-'}</code></td>
                    <td style="color: #0f172a; font-size: 12px; max-width: 250px;">
                      <strong>${v.address}</strong>
                    </td>
                    <td>
                      <div style="font-size: 12px;">${v.contact || '-'}</div>
                      <div style="font-size: 11px; color:#64748b;">${v.phone || ''}</div>
                    </td>
                    <td class="text-center">${v.creditDays ? `${v.creditDays} Days` : 'Cash'}</td>
                    <td class="text-right">
                      <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditVendorModal('${v.id}')">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteVendor('${v.id}')">Delete</button>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 4. Master: Expense Categories Table
  function buildExpenseCatsTable(query) {
    const list = state.master.expenseCategories.filter(c => 
      !query || c.name.toLowerCase().includes(query) || (c.code && c.code.toLowerCase().includes(query)) || (c.description && c.description.toLowerCase().includes(query))
    );

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">
            Expense & Cost Categories (${list.length})
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddExpenseCatModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add Expense Category
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Category Name</th>
                <th>Type</th>
                <th>Description</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(c => `
                <tr>
                  <td><code>${c.code || '-'}</code></td>
                  <td><strong>${c.name}</strong></td>
                  <td><span class="badge ${c.type === 'COGS' ? 'badge-warning' : 'badge-info'}">${c.type}</span></td>
                  <td style="color: #64748b;">${c.description || '-'}</td>
                  <td class="text-right">
                    <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditExpenseCatModal('${c.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteExpenseCat('${c.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 5. Master: Income Categories Table
  function buildIncomeCatsTable(query) {
    const list = state.master.incomeCategories.filter(c => 
      !query || c.name.toLowerCase().includes(query) || (c.code && c.code.toLowerCase().includes(query)) || (c.description && c.description.toLowerCase().includes(query))
    );

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">
            Revenue / Income Categories (${list.length})
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddIncomeCatModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add Income Category
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Income Category Name</th>
                <th>Description</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(c => `
                <tr>
                  <td><code>${c.code || '-'}</code></td>
                  <td><strong>${c.name}</strong></td>
                  <td style="color: #64748b;">${c.description || '-'}</td>
                  <td class="text-right">
                    <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditIncomeCatModal('${c.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteIncomeCat('${c.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 6. Master: Food Item Categories
  function buildItemCatsTable(query) {
    const list = state.master.itemCategories.filter(c => 
      !query || c.name.toLowerCase().includes(query) || (c.description && c.description.toLowerCase().includes(query))
    );

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">
            Food Product Master Categories (${list.length})
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddItemCatModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add Food Category
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Culinary Scope</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(c => `
                <tr>
                  <td><code>${c.id}</code></td>
                  <td><strong>${c.name}</strong></td>
                  <td style="color: #64748b;">${c.description || '-'}</td>
                  <td class="text-right">
                    <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditItemCatModal('${c.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteItemCat('${c.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 7. Master: Food Items Catalog
  function buildItemsCatalogTable(query) {
    const list = state.master.items.filter(item => {
      const q = (query || '').toLowerCase();
      return !q || (item.name || '').toLowerCase().includes(q) || (item.sku || '').toLowerCase().includes(q) || (item.category || '').toLowerCase().includes(q);
    });

    const fallbackImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="28" fill="#94a3b8">Spice Image</text></svg>`);

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div>
            <div style="font-weight: 800; font-size: 16px; color: var(--primary-dark);">Indian Spice Product Catalogue (${list.length})</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 3px;">Visual product list for Indian spices, with SKU, pricing, GST and stock information. Product images are loaded from Wikimedia Commons.</div>
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddItemModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add Spice Product
          </button>
        </div>
        <div class="spice-gallery">
          ${list.length === 0 ? '<div class="spice-gallery-empty">No spice products found. Try another search or add a product.</div>' : list.map(item => `
            <article class="spice-card">
              <img class="spice-card-image" src="${item.image || fallbackImage}" alt="${item.name || 'Spice'}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}'">
              <div class="spice-card-body">
                <div class="spice-card-title">${item.name}</div>
                <div class="spice-card-sku">SKU: ${item.sku}</div>
                <div class="spice-card-meta">
                  <span class="badge badge-secondary">${item.category}</span>
                  <span class="spice-card-stock badge ${item.stockQty <= (item.reorderLevel || 10) ? 'badge-danger' : 'badge-success'}">${item.stockQty} ${item.unit}</span>
                </div>
                <div class="spice-card-meta">
                  <span class="spice-card-price">${formatCurrency(item.salePrice)}</span>
                  <span style="font-size:11px;color:#64748b;">GST ${item.taxRate}%</span>
                </div>
                <div class="spice-card-actions">
                  <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditItemModal('${item.id}')">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteItem('${item.id}')">Delete</button>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 8. Master: Chart of Accounts
  function buildChartOfAccountsTable(query) {
    const list = state.master.chartOfAccounts.filter(acc => 
      !query || acc.code.toLowerCase().includes(query) || acc.name.toLowerCase().includes(query) || acc.type.toLowerCase().includes(query) || (acc.subType && acc.subType.toLowerCase().includes(query))
    );

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">
            Chart of Accounts Heads (${list.length})
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddAccountModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add Account Head
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Account Name</th>
                <th>Primary Type</th>
                <th>Classification</th>
                <th class="text-right">Ledger Balance</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(acc => `
                <tr>
                  <td><code>${acc.code}</code></td>
                  <td><strong>${acc.name}</strong></td>
                  <td><span class="badge ${getAccountTypeBadge(acc.type)}">${acc.type}</span></td>
                  <td>${acc.subType || '-'}</td>
                  <td class="text-right" style="font-weight: 600;">${formatCurrency(acc.balance || 0)}</td>
                  <td class="text-right">
                    <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditAccountModal('${acc.code}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteAccount('${acc.code}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function getAccountTypeBadge(type) {
    switch (type) {
      case 'Asset': return 'badge-success';
      case 'Liability': return 'badge-danger';
      case 'Equity': return 'badge-purple';
      case 'Revenue': return 'badge-info';
      case 'Expense': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  // 9. Master: Tax Rates Table
  function buildTaxRatesTable(query) {
    const list = state.master.taxRates.filter(t => 
      !query || t.name.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query))
    );

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">
            Tax Rates & GST Brackets (${list.length})
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddTaxModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add Tax Rate
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tax Code</th>
                <th>Tax / GST Name</th>
                <th class="text-center">Rate (%)</th>
                <th>Applicability Description</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(t => `
                <tr>
                  <td><code>${t.id}</code></td>
                  <td><strong>${t.name}</strong></td>
                  <td class="text-center"><span class="badge badge-warning">${t.rate}%</span></td>
                  <td style="color: #64748b;">${t.description || '-'}</td>
                  <td class="text-right">
                    <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditTaxModal('${t.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteTaxRate('${t.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 10. Master: Payment Methods Table
  function buildPaymentMethodsTable(query) {
    const list = state.master.paymentMethods.filter(p => 
      !query || p.name.toLowerCase().includes(query) || (p.accountCode && p.accountCode.toLowerCase().includes(query))
    );

    return `
      <div class="table-card">
        <div class="table-toolbar">
          <div style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">
            Payment Modes & Accounts (${list.length})
          </div>
          <button class="btn btn-primary" onclick="window.FCW.openAddPaymentMethodModal()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Add Payment Method
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Payment Mode</th>
                <th>Linked Account Head</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(p => `
                <tr>
                  <td><code>${p.id}</code></td>
                  <td><strong>${p.name}</strong></td>
                  <td><code>${p.accountCode}</code> ${getAccountNameByCode(p.accountCode)}</td>
                  <td class="text-right">
                    <button class="btn btn-secondary btn-sm" onclick="window.FCW.openEditPaymentMethodModal('${p.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.FCW.deletePaymentMethod('${p.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function getAccountNameByCode(code) {
    const found = state.master.chartOfAccounts.find(a => a.code === code);
    return found ? `(${found.name})` : '';
  }

  // ==========================================
  // SALES & INVOICES MANAGEMENT (WITH EDIT & REASON TRACKING)
  // ==========================================
  function renderInvoicesTable() {
    const tbody = document.getElementById('invoices-table-body');
    if (!tbody) return;

    const query = state.searchQueries.invoices;
    const invs = getFilteredInvoices();

    const list = invs.filter(i => 
      !query || i.id.toLowerCase().includes(query) || i.customerName.toLowerCase().includes(query) || (i.category && i.category.toLowerCase().includes(query)) || (i.outletName && i.outletName.toLowerCase().includes(query))
    );

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center" style="padding: 24px; color:#94a3b8;">No invoices match criteria.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(inv => {
      const hasEdits = inv.editHistory && inv.editHistory.length > 0;
      return `
        <tr>
          <td>
            <strong>${inv.id}</strong>
            ${hasEdits ? `<span class="badge badge-warning" title="${inv.editHistory.length} modification(s)" style="font-size:10px; margin-left:4px;">Edited (${inv.editHistory.length})</span>` : ''}
          </td>
          <td>${formatDate(inv.date)}</td>
          <td>${inv.customerName}</td>
          <td><span class="badge badge-purple" style="font-size:11px;">📍 ${(inv.outletName || 'Central Kitchen').replace('Food Co World - ', '')}</span></td>
          <td><span class="badge badge-secondary">${inv.category}</span></td>
          <td class="text-right">${formatCurrency(inv.subTotal)}</td>
          <td class="text-right">${formatCurrency(inv.taxTotal)}</td>
          <td class="text-right" style="font-weight: 700; color: #065f46;">${formatCurrency(inv.grandTotal)}</td>
          <td class="text-center">
            <span class="badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-warning'}">${inv.status}</span>
          </td>
          <td class="text-right">
            <button class="btn btn-secondary btn-sm" onclick="window.FCW.previewInvoice('${inv.id}')">View</button>
            <button class="btn btn-secondary btn-sm" style="color: #065f46; font-weight:600;" onclick="window.FCW.openEditInvoiceModal('${inv.id}')">Edit with Reason</button>
            <button class="btn btn-secondary btn-sm" onclick="window.FCW.toggleInvoiceStatus('${inv.id}')">
              ${inv.status === 'Paid' ? 'Pending' : 'Paid'}
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteInvoice('${inv.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================
  // EXPENSES & BILLS MANAGEMENT (WITH OUTLET SELECTION)
  // ==========================================
  function renderExpensesTable() {
    const tbody = document.getElementById('expenses-table-body');
    if (!tbody) return;

    const query = state.searchQueries.expenses;
    const exps = getFilteredExpenses();

    const list = exps.filter(e => 
      !query || e.id.toLowerCase().includes(query) || (e.vendorName && e.vendorName.toLowerCase().includes(query)) || e.category.toLowerCase().includes(query) || (e.outletName && e.outletName.toLowerCase().includes(query))
    );

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center" style="padding: 24px; color:#94a3b8;">No expense records match criteria.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(exp => `
      <tr>
        <td><strong>${exp.id}</strong></td>
        <td>${formatDate(exp.date)}</td>
        <td>${exp.vendorName || 'Operational Bill'}</td>
        <td><span class="badge badge-purple" style="font-size:11px;">📍 ${(exp.outletName || 'Central Kitchen').replace('Food Co World - ', '')}</span></td>
        <td><span class="badge badge-secondary">${exp.category}</span></td>
        <td><code>${exp.referenceNo || '-'}</code></td>
        <td>${exp.paymentMethod || 'Bank'}</td>
        <td class="text-right" style="font-weight: 700; color: #b91c1c;">${formatCurrency(exp.total)}</td>
        <td class="text-right">
          <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteExpense('${exp.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================
  // GENERAL LEDGER & JOURNALS
  // ==========================================
  function renderJournalsTable() {
    const container = document.getElementById('journals-container');
    if (!container) return;

    const query = state.searchQueries.journals;
    const list = state.journalEntries.filter(je => 
      !query || je.id.toLowerCase().includes(query) || (je.narration && je.narration.toLowerCase().includes(query)) || (je.reference && je.reference.toLowerCase().includes(query))
    );

    if (list.length === 0) {
      container.innerHTML = '<div style="padding: 30px; text-align: center; color: #94a3b8;">No journal entries found.</div>';
      return;
    }

    container.innerHTML = list.map(je => {
      const totalDebit = je.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
      const totalCredit = je.lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);

      return `
        <div class="table-card" style="margin-bottom: 20px;">
          <div class="table-toolbar" style="background: #fafaf9;">
            <div>
              <span style="font-weight: 700; font-size: 15px; color: var(--primary-dark);">${je.id}</span>
              <span style="margin-left: 12px; color: #64748b; font-size: 13px;">${formatDate(je.date)}</span>
              ${je.reference ? `<span class="badge badge-secondary" style="margin-left: 8px;">Ref: ${je.reference}</span>` : ''}
            </div>
            <div style="font-size: 13px; color: #475569;">
              <strong>${je.narration}</strong>
            </div>
            <button class="btn btn-danger btn-sm" onclick="window.FCW.deleteJournal('${je.id}')">Delete</button>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Account Code</th>
                  <th>Account Title</th>
                  <th class="text-right" style="width: 160px;">Debit (₹)</th>
                  <th class="text-right" style="width: 160px;">Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${je.lines.map(line => `
                  <tr>
                    <td><code>${line.accountCode}</code></td>
                    <td>${line.accountName || getAccountNameByCode(line.accountCode)}</td>
                    <td class="text-right">${line.debit > 0 ? formatCurrency(line.debit) : '-'}</td>
                    <td class="text-right">${line.credit > 0 ? formatCurrency(line.credit) : '-'}</td>
                  </tr>
                `).join('')}
                <tr style="background-color: #f8fafc; font-weight: 700;">
                  <td colspan="2" class="text-right">Entry Totals:</td>
                  <td class="text-right" style="color: #047857;">${formatCurrency(totalDebit)}</td>
                  <td class="text-right" style="color: #047857;">${formatCurrency(totalCredit)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================
  // BANKING & CASH
  // ==========================================
  function renderBankingView() {
    const select = document.getElementById('banking-account-select');
    if (!select) return;

    const liquidAccounts = state.master.chartOfAccounts.filter(a => a.type === 'Asset' && (a.subType === 'Current Asset' || ['1010', '1020', '1030'].includes(a.code)));
    const currentSelected = select.value || (liquidAccounts[0] ? liquidAccounts[0].code : '1020');

    select.innerHTML = liquidAccounts.map(a => `
      <option value="${a.code}" ${a.code === currentSelected ? 'selected' : ''}>
        ${a.code} - ${a.name} (${formatCurrency(a.balance)})
      </option>
    `).join('');

    renderBankingLedger(currentSelected);

    select.onchange = (e) => renderBankingLedger(e.target.value);
  }

  function renderBankingLedger(accountCode) {
    const acc = state.master.chartOfAccounts.find(a => a.code === accountCode);
    const balanceDisplay = document.getElementById('banking-current-balance');
    const ledgerTbody = document.getElementById('banking-ledger-tbody');

    if (acc && balanceDisplay) {
      balanceDisplay.textContent = formatCurrency(acc.balance);
    }

    if (!ledgerTbody) return;

    const rows = [];
    state.journalEntries.forEach(je => {
      je.lines.forEach(line => {
        if (line.accountCode === accountCode) {
          rows.push({
            date: je.date,
            description: `${je.narration} (Ref: ${je.reference || je.id})`,
            debit: line.debit || 0,
            credit: line.credit || 0
          });
        }
      });
    });

    state.expenses.forEach(exp => {
      if (exp.paymentAccount === accountCode) {
        rows.push({
          date: exp.date,
          description: `Bill Paid: ${exp.vendorName || exp.category} (${exp.id})`,
          debit: 0,
          credit: exp.total
        });
      }
    });

    rows.sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBalance = 0;
    const renderedRows = rows.map(r => {
      runningBalance += (r.debit - r.credit);
      return `
        <tr>
          <td>${formatDate(r.date)}</td>
          <td>${r.description}</td>
          <td class="text-right">${r.debit > 0 ? formatCurrency(r.debit) : '-'}</td>
          <td class="text-right" style="color: #b91c1c;">${r.credit > 0 ? formatCurrency(r.credit) : '-'}</td>
          <td class="text-right" style="font-weight: 600;">${formatCurrency(runningBalance)}</td>
        </tr>
      `;
    });

    ledgerTbody.innerHTML = renderedRows.length === 0 ? 
      '<tr><td colspan="5" class="text-center" style="padding: 24px; color:#94a3b8;">No ledger entries recorded for this account.</td></tr>' :
      renderedRows.join('');
  }

  // ==========================================
  // FINANCIAL REPORTS GENERATOR (OUTLET FILTERED)
  // ==========================================
  function renderFinancialReport() {
    const reportType = state.currentReportType;
    const container = document.getElementById('financial-report-output');
    if (!container) return;

    let html = '';
    switch (reportType) {
      case 'pnl':
        html = generateProfitAndLossReport();
        break;
      case 'balance-sheet':
        html = generateBalanceSheetReport();
        break;
      case 'trial-balance':
        html = generateTrialBalanceReport();
        break;
      case 'cash-flow':
        html = generateCashFlowReport();
        break;
      case 'tax-report':
        html = generateTaxSummaryReport();
        break;
      case 'expense-analysis':
        html = generateExpenseAnalysisReport();
        break;
      default:
        html = generateProfitAndLossReport();
    }

    container.innerHTML = html;
  }

  function getReportOutletHeaderTitle() {
    if (!state.selectedOutlet || state.selectedOutlet === 'all') {
      return "Consolidated (All Outlets & Kitchens)";
    }
    const o = state.master.outlets.find(x => x.id === state.selectedOutlet);
    return o ? `Outlet Account: ${o.name} [${o.code}]` : "Single Outlet";
  }

  // 1. Profit & Loss Report
  function generateProfitAndLossReport() {
    const invs = getFilteredInvoices();
    const exps = getFilteredExpenses();

    const incomeByCategory = {};
    invs.forEach(inv => {
      incomeByCategory[inv.category] = (incomeByCategory[inv.category] || 0) + (Number(inv.subTotal) || 0);
    });

    const totalRevenue = Object.values(incomeByCategory).reduce((s, v) => s + v, 0);

    const cogsByCategory = {};
    const opexByCategory = {};

    exps.forEach(exp => {
      const catObj = state.master.expenseCategories.find(c => c.name === exp.category);
      if (catObj && catObj.type === 'COGS') {
        cogsByCategory[exp.category] = (cogsByCategory[exp.category] || 0) + (Number(exp.amount) || 0);
      } else {
        opexByCategory[exp.category] = (opexByCategory[exp.category] || 0) + (Number(exp.amount) || 0);
      }
    });

    const totalCogs = Object.values(cogsByCategory).reduce((s, v) => s + v, 0);
    const grossProfit = totalRevenue - totalCogs;
    const grossMarginPct = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

    const totalOpex = Object.values(opexByCategory).reduce((s, v) => s + v, 0);
    const netProfit = grossProfit - totalOpex;

    return `
      <div class="financial-statement">
        <div class="statement-title-block">
          <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:6px;">
            ${state.company.logo ? `<img src="${state.company.logo}" style="max-height:48px; object-fit:contain;">` : ''}
            <div class="statement-company">${state.company.name}</div>
          </div>
          <div class="statement-name">Profit & Loss Statement (Income Statement)</div>
          <div class="statement-period">
            <strong>${getReportOutletHeaderTitle()}</strong> | Reporting Period: FY 2026-27 | Currency: Indian Rupee (₹)
          </div>
        </div>

        <!-- REVENUE -->
        <div class="fs-row section-header">
          <span>Operating Revenue / Food Sales</span>
          <span>Amount (₹)</span>
        </div>
        ${Object.keys(incomeByCategory).length === 0 ? 
          '<div class="fs-row sub-row"><span style="color:#94a3b8;">No recorded sales</span><span>₹ 0.00</span></div>' :
          Object.entries(incomeByCategory).map(([cat, val]) => `
            <div class="fs-row sub-row">
              <span>${cat}</span>
              <span>${formatCurrency(val)}</span>
            </div>
          `).join('')
        }
        <div class="fs-row sub-total">
          <span>Total Operating Revenue</span>
          <span>${formatCurrency(totalRevenue)}</span>
        </div>

        <!-- COGS -->
        <div class="fs-row section-header">
          <span>Cost of Goods Sold (Raw Ingredients, Packaging & Spoilage)</span>
          <span>Amount (₹)</span>
        </div>
        ${Object.keys(cogsByCategory).length === 0 ? 
          '<div class="fs-row sub-row"><span style="color:#94a3b8;">No recorded COGS</span><span>₹ 0.00</span></div>' :
          Object.entries(cogsByCategory).map(([cat, val]) => `
            <div class="fs-row sub-row">
              <span>${cat}</span>
              <span>${formatCurrency(val)}</span>
            </div>
          `).join('')
        }
        <div class="fs-row sub-total">
          <span>Total Cost of Goods Sold</span>
          <span style="color: #b91c1c;">(${formatCurrency(totalCogs)})</span>
        </div>

        <!-- GROSS PROFIT -->
        <div class="fs-row grand-total" style="background-color: #ecfdf5; border-color: #047857;">
          <span>GROSS PROFIT (Gross Margin: ${grossMarginPct}%)</span>
          <span>${formatCurrency(grossProfit)}</span>
        </div>

        <!-- OPERATING EXPENSES -->
        <div class="fs-row section-header">
          <span>Operating & Facility Expenses (Salaries, Gas, Rent & Delivery)</span>
          <span>Amount (₹)</span>
        </div>
        ${Object.keys(opexByCategory).length === 0 ? 
          '<div class="fs-row sub-row"><span style="color:#94a3b8;">No operating expenses</span><span>₹ 0.00</span></div>' :
          Object.entries(opexByCategory).map(([cat, val]) => `
            <div class="fs-row sub-row">
              <span>${cat}</span>
              <span>${formatCurrency(val)}</span>
            </div>
          `).join('')
        }
        <div class="fs-row sub-total">
          <span>Total Operating Expenses</span>
          <span style="color: #b91c1c;">(${formatCurrency(totalOpex)})</span>
        </div>

        <!-- NET OPERATING PROFIT -->
        <div class="fs-row grand-total" style="margin-top: 24px; font-size: 16px;">
          <span>NET OPERATING PROFIT / (LOSS)</span>
          <span style="color: ${netProfit >= 0 ? '#047857' : '#b91c1c'};">${formatCurrency(netProfit)}</span>
        </div>
      </div>
    `;
  }

  // 2. Balance Sheet
  function generateBalanceSheetReport() {
    const assets = state.master.chartOfAccounts.filter(a => a.type === 'Asset');
    const liabilities = state.master.chartOfAccounts.filter(a => a.type === 'Liability');
    const equity = state.master.chartOfAccounts.filter(a => a.type === 'Equity');

    const totalAssets = assets.reduce((s, a) => s + (Number(a.balance) || 0), 0);
    const totalLiabilities = liabilities.reduce((s, a) => s + (Number(a.balance) || 0), 0);
    const totalEquity = equity.reduce((s, a) => s + (Number(a.balance) || 0), 0);
    const totalLiabEquity = totalLiabilities + totalEquity;

    const isBalanced = Math.abs(totalAssets - totalLiabEquity) < 0.01;

    return `
      <div class="financial-statement">
        <div class="statement-title-block">
          <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:6px;">
            ${state.company.logo ? `<img src="${state.company.logo}" style="max-height:48px; object-fit:contain;">` : ''}
            <div class="statement-company">${state.company.name}</div>
          </div>
          <div class="statement-name">Balance Sheet (Financial Position)</div>
          <div class="statement-period">As of ${new Date().toLocaleDateString('en-IN')} | All amounts in Indian Rupees (₹)</div>
          <div style="margin-top: 8px;">
            <span class="badge ${isBalanced ? 'badge-success' : 'badge-danger'}">
              ${isBalanced ? '✓ Equation Balanced (Assets = Liabilities + Equity)' : '⚠ Discrepancy in Ledger Balancing'}
            </span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
          <div>
            <div class="fs-row section-header">
              <span>ASSETS</span>
              <span>Amount (₹)</span>
            </div>
            ${assets.map(a => `
              <div class="fs-row sub-row">
                <span><code>${a.code}</code> ${a.name}</span>
                <span>${formatCurrency(a.balance)}</span>
              </div>
            `).join('')}
            <div class="fs-row grand-total">
              <span>TOTAL ASSETS</span>
              <span>${formatCurrency(totalAssets)}</span>
            </div>
          </div>

          <div>
            <div class="fs-row section-header">
              <span>LIABILITIES</span>
              <span>Amount (₹)</span>
            </div>
            ${liabilities.map(l => `
              <div class="fs-row sub-row">
                <span><code>${l.code}</code> ${l.name}</span>
                <span>${formatCurrency(l.balance)}</span>
              </div>
            `).join('')}
            <div class="fs-row sub-total">
              <span>Total Liabilities</span>
              <span>${formatCurrency(totalLiabilities)}</span>
            </div>

            <div class="fs-row section-header" style="margin-top: 20px;">
              <span>EQUITY & CAPITAL</span>
              <span>Amount (₹)</span>
            </div>
            ${equity.map(e => `
              <div class="fs-row sub-row">
                <span><code>${e.code}</code> ${e.name}</span>
                <span>${formatCurrency(e.balance)}</span>
              </div>
            `).join('')}
            <div class="fs-row sub-total">
              <span>Total Equity</span>
              <span>${formatCurrency(totalEquity)}</span>
            </div>

            <div class="fs-row grand-total">
              <span>TOTAL LIABILITIES & EQUITY</span>
              <span>${formatCurrency(totalLiabEquity)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 3. Trial Balance
  function generateTrialBalanceReport() {
    let grandDebit = 0;
    let grandCredit = 0;

    const rows = state.master.chartOfAccounts.map(acc => {
      const bal = Number(acc.balance) || 0;
      let debit = 0;
      let credit = 0;

      if (['Asset', 'Expense'].includes(acc.type)) {
        if (bal >= 0) debit = bal;
        else credit = Math.abs(bal);
      } else {
        if (bal >= 0) credit = bal;
        else debit = Math.abs(bal);
      }

      grandDebit += debit;
      grandCredit += credit;

      return `
        <tr>
          <td><code>${acc.code}</code></td>
          <td>${acc.name}</td>
          <td><span class="badge ${getAccountTypeBadge(acc.type)}">${acc.type}</span></td>
          <td class="text-right">${debit > 0 ? formatCurrency(debit) : '-'}</td>
          <td class="text-right">${credit > 0 ? formatCurrency(credit) : '-'}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="financial-statement">
        <div class="statement-title-block">
          <div class="statement-company">${state.company.name}</div>
          <div class="statement-name">Trial Balance Audit</div>
          <div class="statement-period">As of ${new Date().toLocaleDateString('en-IN')}</div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Account Code</th>
                <th>Account Name</th>
                <th>Type</th>
                <th class="text-right" style="width: 170px;">Debit Balance (₹)</th>
                <th class="text-right" style="width: 170px;">Credit Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr style="background-color: #f0fdf4; font-weight: 800; font-size: 14px; border-top: 2px solid #0f172a; border-bottom: 3px double #0f172a;">
                <td colspan="3" class="text-right">TRIAL BALANCE TOTALS:</td>
                <td class="text-right" style="color: #047857;">${formatCurrency(grandDebit)}</td>
                <td class="text-right" style="color: #047857;">${formatCurrency(grandCredit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 4. Cash Flow Statement
  function generateCashFlowReport() {
    const invs = getFilteredInvoices();
    const exps = getFilteredExpenses();

    const cashReceipts = invs.filter(i => i.status === 'Paid').reduce((s, i) => s + (Number(i.grandTotal) || 0), 0);
    const cashPayments = exps.filter(e => e.paymentAccount !== '1200').reduce((s, e) => s + (Number(e.total) || 0), 0);
    const netOperatingCash = cashReceipts - cashPayments;

    return `
      <div class="financial-statement">
        <div class="statement-title-block">
          <div class="statement-company">${state.company.name}</div>
          <div class="statement-name">Cash Flow Statement</div>
          <div class="statement-period">${getReportOutletHeaderTitle()}</div>
        </div>

        <div class="fs-row section-header">
          <span>1. CASH FLOWS FROM OPERATING ACTIVITIES</span>
          <span>Amount (₹)</span>
        </div>
        <div class="fs-row sub-row">
          <span>Cash received from Food Sales / Customer Receipts</span>
          <span style="color: #047857;">+${formatCurrency(cashReceipts)}</span>
        </div>
        <div class="fs-row sub-row">
          <span>Cash paid for Ingredients, Packaging, Staff & Gas</span>
          <span style="color: #b91c1c;">-${formatCurrency(cashPayments)}</span>
        </div>
        <div class="fs-row sub-total">
          <span>Net Cash from Operating Activities</span>
          <span style="font-weight: 700;">${formatCurrency(netOperatingCash)}</span>
        </div>

        <div class="fs-row section-header" style="margin-top: 20px;">
          <span>2. CASH FLOWS FROM INVESTING ACTIVITIES</span>
          <span>Amount (₹)</span>
        </div>
        <div class="fs-row sub-row">
          <span>Capital expenditure on Commercial Kitchen Machinery</span>
          <span>₹ 0.00</span>
        </div>
        <div class="fs-row sub-total">
          <span>Net Cash from Investing Activities</span>
          <span>₹ 0.00</span>
        </div>

        <div class="fs-row grand-total" style="margin-top: 20px;">
          <span>NET CHANGE IN CASH & CASH EQUIVALENTS</span>
          <span style="color: ${netOperatingCash >= 0 ? '#047857' : '#b91c1c'};">${formatCurrency(netOperatingCash)}</span>
        </div>
      </div>
    `;
  }

  // 5. Tax / GST Summary Report
  function generateTaxSummaryReport() {
    const invs = getFilteredInvoices();
    const exps = getFilteredExpenses();

    const outputTax = invs.reduce((s, i) => s + (Number(i.taxTotal) || 0), 0);
    const inputTax = exps.reduce((s, e) => s + (Number(e.taxAmount) || 0), 0);
    const netTaxPayable = outputTax - inputTax;

    return `
      <div class="financial-statement">
        <div class="statement-title-block">
          <div class="statement-company">${state.company.name}</div>
          <div class="statement-name">Food VAT & GST Tax Audit Summary</div>
          <div class="statement-period">${getReportOutletHeaderTitle()} | Company GSTIN: ${state.company.taxNumber}</div>
        </div>

        <div class="fs-row section-header">
          <span>TAX CALCULATION BREAKDOWN</span>
          <span>Amount (₹)</span>
        </div>
        <div class="fs-row sub-row">
          <span>Total Output GST Collected on Food Invoices</span>
          <span style="font-weight: 600;">${formatCurrency(outputTax)}</span>
        </div>
        <div class="fs-row sub-row">
          <span>Less: Input Tax Credit (ITC) Paid on Raw Ingredient Bills</span>
          <span style="font-weight: 600; color: #047857;">(${formatCurrency(inputTax)})</span>
        </div>
        <div class="fs-row grand-total">
          <span>NET GST / TAX PAYABLE TO GOVERNMENT</span>
          <span style="color: ${netTaxPayable >= 0 ? '#b91c1c' : '#047857'};">${formatCurrency(netTaxPayable)}</span>
        </div>
      </div>
    `;
  }

  // 6. Culinary Expense Analysis
  function generateExpenseAnalysisReport() {
    const exps = getFilteredExpenses();
    const catMap = {};
    exps.forEach(e => {
      catMap[e.category] = (catMap[e.category] || 0) + (Number(e.total) || 0);
    });

    const total = Object.values(catMap).reduce((s, v) => s + v, 0);
    const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

    return `
      <div class="financial-statement">
        <div class="statement-title-block">
          <div class="statement-company">${state.company.name}</div>
          <div class="statement-name">Culinary Cost Center Analysis</div>
          <div class="statement-period">${getReportOutletHeaderTitle()}</div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Expense Category</th>
                <th class="text-right">Total Expenditure (₹)</th>
                <th class="text-right">Share (%)</th>
                <th style="width: 250px;">Cost Distribution</th>
              </tr>
            </thead>
            <tbody>
              ${sorted.map(([cat, val]) => {
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return `
                  <tr>
                    <td><strong>${cat}</strong></td>
                    <td class="text-right" style="font-weight: 600;">${formatCurrency(val)}</td>
                    <td class="text-right"><span class="badge badge-info">${pct}%</span></td>
                    <td>
                      <div style="background-color: #f1f5f9; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div style="background-color: #065f46; height: 100%; width: ${pct}%;"></div>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
              <tr style="background-color: #f8fafc; font-weight: 800;">
                <td>TOTAL CULINARY EXPENDITURE:</td>
                <td class="text-right">${formatCurrency(total)}</td>
                <td class="text-right">100.0%</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Export Financial CSV
  function exportFinancialReportCSV() {
    const reportType = state.currentReportType;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `"${state.company.name} - ${reportType.toUpperCase()} REPORT"\n`;
    csvContent += `"Outlet Filter:","${getReportOutletHeaderTitle()}"\n`;
    csvContent += `"Currency:","INR (₹)"\n`;
    csvContent += `"Generated:","${new Date().toLocaleString('en-IN')}"\n\n`;

    const invs = getFilteredInvoices();
    const exps = getFilteredExpenses();

    if (reportType === 'pnl') {
      csvContent += `"Section","Category","Amount (INR)"\n`;
      invs.forEach(i => csvContent += `"Revenue","${i.category}","${i.subTotal}"\n`);
      exps.forEach(e => csvContent += `"Expense","${e.category}","${e.amount}"\n`);
    } else {
      csvContent += `"ID","Date","Outlet","Party","Category","Total (INR)","Status"\n`;
      invs.forEach(i => csvContent += `"${i.id}","${i.date}","${i.outletName || ''}","${i.customerName}","${i.category}","${i.grandTotal}","${i.status}"\n`);
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FoodCoWorld_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("CSV Financial Report downloaded successfully", "success");
  }

  // ==========================================
  // SETTINGS & LOGO UPLOAD
  // ==========================================
  function renderSettingsView() {
    const nameEl = document.getElementById('company-name-input');
    const currEl = document.getElementById('company-currency-input');
    const taxEl = document.getElementById('company-tax-input');
    const phoneEl = document.getElementById('company-phone-input');
    const emailEl = document.getElementById('company-email-input');
    const addrEl = document.getElementById('company-address-input');

    if (nameEl) nameEl.value = state.company.name || '';
    if (currEl) currEl.value = state.company.currency || '₹';
    if (taxEl) taxEl.value = state.company.taxNumber || '';
    if (phoneEl) phoneEl.value = state.company.phone || '';
    if (emailEl) emailEl.value = state.company.email || '';
    if (addrEl) addrEl.value = state.company.address || '';

    renderLogo();
  }

  function saveCompanySettings() {
    state.company.name = document.getElementById('company-name-input').value.trim() || 'Food Co World';
    state.company.currency = document.getElementById('company-currency-input').value.trim() || '₹';
    state.company.taxNumber = document.getElementById('company-tax-input').value.trim();
    state.company.phone = document.getElementById('company-phone-input').value.trim();
    state.company.email = document.getElementById('company-email-input').value.trim();
    state.company.address = document.getElementById('company-address-input').value.trim();

    saveData();
    showToast("Company profile saved", "success");
    refreshAllViews();
  }

  function uploadLogoFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return showToast("Please select a valid image file (PNG, JPG, SVG, WebP)", "error");
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      state.company.logo = e.target.result;
      saveData();
      renderLogo();
      showToast("Company logo updated successfully!", "success");
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    state.company.logo = "";
    saveData();
    renderLogo();
    showToast("Brand logo removed", "info");
  }

  function backupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `FoodCoWorld_Accounting_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    dlAnchor.remove();
    showToast("Complete backup exported safely", "success");
  }

  function restoreJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.master && imported.invoices) {
          state.company = imported.company || state.company;
          state.master = imported.master || state.master;
          state.invoices = imported.invoices || [];
          state.expenses = imported.expenses || [];
          state.journalEntries = imported.journalEntries || [];
          saveData();
          renderLogo();
          showToast("Data restored successfully from backup!", "success");
          refreshAllViews();
        } else {
          showToast("Invalid backup JSON structure", "error");
        }
      } catch (err) {
        showToast("Error parsing backup JSON file", "error");
      }
    };
    reader.readAsText(file);
  }

  // ==========================================
  // MASTER ENTITIES: ADD & EDIT MODAL HANDLERS
  // ==========================================

  // Outlets
  function openAddOutletModal() {
    state.editingMaster = { type: 'outlet', id: null };
    document.getElementById('modal-outlet-title').textContent = "Add Food Co Outlet / Branch";
    document.getElementById('new-outlet-name').value = '';
    document.getElementById('new-outlet-code').value = '';
    document.getElementById('new-outlet-type').value = 'Base Production Kitchen';
    document.getElementById('new-outlet-manager').value = '';
    document.getElementById('new-outlet-phone').value = '';
    document.getElementById('new-outlet-email').value = '';
    document.getElementById('new-outlet-address').value = '';
    openModal('modal-add-outlet');
  }

  function openEditOutletModal(id) {
    const o = state.master.outlets.find(x => x.id === id);
    if (!o) return;
    state.editingMaster = { type: 'outlet', id };
    document.getElementById('modal-outlet-title').textContent = `Edit Outlet (${o.code})`;
    document.getElementById('new-outlet-name').value = o.name;
    document.getElementById('new-outlet-code').value = o.code;
    document.getElementById('new-outlet-type').value = o.type;
    document.getElementById('new-outlet-manager').value = o.manager || '';
    document.getElementById('new-outlet-phone').value = o.phone || '';
    document.getElementById('new-outlet-email').value = o.email || '';
    document.getElementById('new-outlet-address').value = o.address || '';
    openModal('modal-add-outlet');
  }

  function submitOutlet() {
    const name = document.getElementById('new-outlet-name').value.trim();
    const code = document.getElementById('new-outlet-code').value.trim();
    const type = document.getElementById('new-outlet-type').value;
    const manager = document.getElementById('new-outlet-manager').value.trim();
    const phone = document.getElementById('new-outlet-phone').value.trim();
    const email = document.getElementById('new-outlet-email').value.trim();
    const address = document.getElementById('new-outlet-address').value.trim();

    if (!name || !code) return showToast("Outlet Name and Branch Code are required", "error");

    if (state.editingMaster.id) {
      const o = state.master.outlets.find(x => x.id === state.editingMaster.id);
      if (o) {
        o.name = name;
        o.code = code;
        o.type = type;
        o.manager = manager;
        o.phone = phone;
        o.email = email;
        o.address = address;
        showToast(`Outlet "${name}" updated`, "success");
      }
    } else {
      state.master.outlets.push({
        id: `OUT-${Date.now().toString().slice(-4)}`,
        code,
        name,
        type,
        manager,
        phone,
        email,
        address,
        status: "Active"
      });
      showToast(`Outlet "${name}" created`, "success");
    }

    saveData();
    closeAllModals();
    populateOutletSelectors();
    renderCurrentMasterTab();
  }

  function deleteOutlet(id) {
    if (!confirm("Are you sure you want to delete this outlet?")) return;
    state.master.outlets = state.master.outlets.filter(o => o.id !== id);
    saveData();
    populateOutletSelectors();
    renderCurrentMasterTab();
    showToast("Outlet deleted", "warning");
  }

  // Customers (Clients) - Optional Address
  function openAddCustomerModal() {
    state.editingMaster = { type: 'customer', id: null };
    document.getElementById('modal-customer-title').textContent = "Add Food Client / Customer";
    document.getElementById('new-cust-name').value = '';
    document.getElementById('new-cust-type').value = 'Wholesale Restaurant';
    document.getElementById('new-cust-limit').value = '300000';
    document.getElementById('new-cust-contact').value = '';
    document.getElementById('new-cust-phone').value = '';
    document.getElementById('new-cust-email').value = '';
    document.getElementById('new-cust-address').value = '';
    openModal('modal-add-customer');
  }

  function openEditCustomerModal(id) {
    const c = state.master.customers.find(x => x.id === id);
    if (!c) return;
    state.editingMaster = { type: 'customer', id };
    document.getElementById('modal-customer-title').textContent = `Edit Client (${c.name})`;
    document.getElementById('new-cust-name').value = c.name;
    document.getElementById('new-cust-type').value = c.type;
    document.getElementById('new-cust-limit').value = c.creditLimit || 0;
    document.getElementById('new-cust-contact').value = c.contact || '';
    document.getElementById('new-cust-phone').value = c.phone || '';
    document.getElementById('new-cust-email').value = c.email || '';
    document.getElementById('new-cust-address').value = c.address || '';
    openModal('modal-add-customer');
  }

  function submitCustomer() {
    const name = document.getElementById('new-cust-name').value.trim();
    const type = document.getElementById('new-cust-type').value;
    const limit = parseFloat(document.getElementById('new-cust-limit').value) || 0;
    const contact = document.getElementById('new-cust-contact').value.trim();
    const phone = document.getElementById('new-cust-phone').value.trim();
    const email = document.getElementById('new-cust-email').value.trim();
    const address = document.getElementById('new-cust-address').value.trim(); // Optional

    if (!name) return showToast("Client name is required", "error");

    if (state.editingMaster.id) {
      const c = state.master.customers.find(x => x.id === state.editingMaster.id);
      if (c) {
        c.name = name;
        c.type = type;
        c.creditLimit = limit;
        c.contact = contact;
        c.phone = phone;
        c.email = email;
        c.address = address;
        showToast(`Client "${name}" updated`, "success");
      }
    } else {
      state.master.customers.push({
        id: `CUST-${Date.now().toString().slice(-4)}`,
        name,
        type,
        contact,
        phone,
        email,
        address,
        creditLimit: limit
      });
      showToast(`Client "${name}" registered`, "success");
    }

    saveData();
    closeAllModals();
    renderCurrentMasterTab();
  }

  function deleteCustomer(id) {
    if (!confirm("Delete customer?")) return;
    state.master.customers = state.master.customers.filter(c => c.id !== id);
    saveData();
    renderCurrentMasterTab();
    showToast("Customer deleted", "warning");
  }

  // Suppliers / Vendors - COMPULSORY ADDRESS
  function openAddVendorModal() {
    state.editingMaster = { type: 'vendor', id: null };
    document.getElementById('modal-vendor-title').textContent = "Add Food Supplier / Vendor";
    document.getElementById('new-ven-name').value = '';
    document.getElementById('new-ven-cat').value = 'Raw Ingredients';
    document.getElementById('new-ven-taxid').value = '';
    document.getElementById('new-ven-terms').value = '30';
    document.getElementById('new-ven-contact').value = '';
    document.getElementById('new-ven-phone').value = '';
    document.getElementById('new-ven-email').value = '';
    document.getElementById('new-ven-address').value = '';
    openModal('modal-add-vendor');
  }

  function openEditVendorModal(id) {
    const v = state.master.vendors.find(x => x.id === id);
    if (!v) return;
    state.editingMaster = { type: 'vendor', id };
    document.getElementById('modal-vendor-title').textContent = `Edit Supplier (${v.name})`;
    document.getElementById('new-ven-name').value = v.name;
    document.getElementById('new-ven-cat').value = v.category;
    document.getElementById('new-ven-taxid').value = v.taxId || '';
    document.getElementById('new-ven-terms').value = v.creditDays || 0;
    document.getElementById('new-ven-contact').value = v.contact || '';
    document.getElementById('new-ven-phone').value = v.phone || '';
    document.getElementById('new-ven-email').value = v.email || '';
    document.getElementById('new-ven-address').value = v.address || '';
    openModal('modal-add-vendor');
  }

  function submitVendor() {
    const name = document.getElementById('new-ven-name').value.trim();
    const category = document.getElementById('new-ven-cat').value;
    const taxId = document.getElementById('new-ven-taxid').value.trim();
    const terms = parseInt(document.getElementById('new-ven-terms').value) || 0;
    const contact = document.getElementById('new-ven-contact').value.trim();
    const phone = document.getElementById('new-ven-phone').value.trim();
    const email = document.getElementById('new-ven-email').value.trim();
    const address = document.getElementById('new-ven-address').value.trim(); // COMPULSORY!

    if (!name) return showToast("Supplier name is required", "error");
    if (!address) {
      showToast("Supplier registered address is compulsory and cannot be empty!", "error");
      document.getElementById('new-ven-address').focus();
      return;
    }

    if (state.editingMaster.id) {
      const v = state.master.vendors.find(x => x.id === state.editingMaster.id);
      if (v) {
        v.name = name;
        v.category = category;
        v.taxId = taxId;
        v.creditDays = terms;
        v.contact = contact;
        v.phone = phone;
        v.email = email;
        v.address = address;
        showToast(`Supplier "${name}" updated`, "success");
      }
    } else {
      state.master.vendors.push({
        id: `VEN-${Date.now().toString().slice(-4)}`,
        name,
        category,
        taxId,
        contact,
        phone,
        email,
        address,
        creditDays: terms
      });
      showToast(`Supplier "${name}" registered with mandatory address`, "success");
    }

    saveData();
    closeAllModals();
    renderCurrentMasterTab();
  }

  function deleteVendor(id) {
    if (!confirm("Delete supplier?")) return;
    state.master.vendors = state.master.vendors.filter(v => v.id !== id);
    saveData();
    renderCurrentMasterTab();
    showToast("Supplier deleted", "warning");
  }

  // Expense Categories Edit/Add
  function openAddExpenseCatModal() {
    state.editingMaster = { type: 'expenseCat', id: null };
    document.getElementById('modal-exp-cat-title').textContent = "Add Expense Category";
    document.getElementById('new-exp-cat-name').value = '';
    document.getElementById('new-exp-cat-code').value = '5010';
    document.getElementById('new-exp-cat-type').value = 'COGS';
    document.getElementById('new-exp-cat-desc').value = '';
    openModal('modal-add-expense-cat');
  }

  function openEditExpenseCatModal(id) {
    const c = state.master.expenseCategories.find(x => x.id === id);
    if (!c) return;
    state.editingMaster = { type: 'expenseCat', id };
    document.getElementById('modal-exp-cat-title').textContent = `Edit Expense Category: ${c.name}`;
    document.getElementById('new-exp-cat-name').value = c.name;
    document.getElementById('new-exp-cat-code').value = c.code || '';
    document.getElementById('new-exp-cat-type').value = c.type;
    document.getElementById('new-exp-cat-desc').value = c.description || '';
    openModal('modal-add-expense-cat');
  }

  function submitExpenseCategory() {
    const name = document.getElementById('new-exp-cat-name').value.trim();
    const code = document.getElementById('new-exp-cat-code').value.trim();
    const type = document.getElementById('new-exp-cat-type').value;
    const desc = document.getElementById('new-exp-cat-desc').value.trim();
    if (!name) return showToast("Category name is required", "error");

    if (state.editingMaster.id) {
      const c = state.master.expenseCategories.find(x => x.id === state.editingMaster.id);
      if (c) {
        c.name = name;
        c.code = code;
        c.type = type;
        c.description = desc;
        showToast(`Category "${name}" updated`, "success");
      }
    } else {
      state.master.expenseCategories.push({
        id: `EXP-CAT-${Date.now()}`,
        name,
        code,
        type,
        description: desc
      });
      showToast(`Category "${name}" added`, "success");
    }

    saveData();
    closeAllModals();
    renderCurrentMasterTab();
  }

  function deleteExpenseCat(id) {
    if (!confirm("Delete expense category?")) return;
    state.master.expenseCategories = state.master.expenseCategories.filter(c => c.id !== id);
    saveData();
    renderCurrentMasterTab();
    showToast("Category deleted", "warning");
  }

  // Income Categories Edit/Add
  function openAddIncomeCatModal() {
    state.editingMaster = { type: 'incomeCat', id: null };
    document.getElementById('modal-inc-cat-title').textContent = "Add Revenue Category";
    document.getElementById('new-inc-cat-name').value = '';
    document.getElementById('new-inc-cat-code').value = '4010';
    document.getElementById('new-inc-cat-desc').value = '';
    openModal('modal-add-income-cat');
  }

  function openEditIncomeCatModal(id) {
    const c = state.master.incomeCategories.find(x => x.id === id);
    if (!c) return;
    state.editingMaster = { type: 'incomeCat', id };
    document.getElementById('modal-inc-cat-title').textContent = `Edit Revenue Category: ${c.name}`;
    document.getElementById('new-inc-cat-name').value = c.name;
    document.getElementById('new-inc-cat-code').value = c.code || '';
    document.getElementById('new-inc-cat-desc').value = c.description || '';
    openModal('modal-add-income-cat');
  }

  function submitIncomeCategory() {
    const name = document.getElementById('new-inc-cat-name').value.trim();
    const code = document.getElementById('new-inc-cat-code').value.trim();
    const desc = document.getElementById('new-inc-cat-desc').value.trim();
    if (!name) return showToast("Income category name is required", "error");

    if (state.editingMaster.id) {
      const c = state.master.incomeCategories.find(x => x.id === state.editingMaster.id);
      if (c) {
        c.name = name;
        c.code = code;
        c.description = desc;
        showToast(`Income category "${name}" updated`, "success");
      }
    } else {
      state.master.incomeCategories.push({
        id: `INC-CAT-${Date.now()}`,
        name,
        code,
        description: desc
      });
      showToast(`Income category "${name}" added`, "success");
    }

    saveData();
    closeAllModals();
    renderCurrentMasterTab();
  }

  function deleteIncomeCat(id) {
    if (!confirm("Delete income category?")) return;
    state.master.incomeCategories = state.master.incomeCategories.filter(c => c.id !== id);
    saveData();
    renderCurrentMasterTab();
    showToast("Category deleted", "warning");
  }

  // Food Item Categories Edit/Add
  function openAddItemCatModal() {
    state.editingMaster = { type: 'itemCat', id: null };
    document.getElementById('modal-item-cat-title').textContent = "Add Food Category";
    document.getElementById('new-item-cat-name').value = '';
    document.getElementById('new-item-cat-desc').value = '';
    openModal('modal-add-item-cat');
  }

  function openEditItemCatModal(id) {
    const c = state.master.itemCategories.find(x => x.id === id);
    if (!c) return;
    state.editingMaster = { type: 'itemCat', id };
    document.getElementById('modal-item-cat-title').textContent = `Edit Food Category: ${c.name}`;
    document.getElementById('new-item-cat-name').value = c.name;
    document.getElementById('new-item-cat-desc').value = c.description || '';
    openModal('modal-add-item-cat');
  }

  function submitItemCategory() {
    const name = document.getElementById('new-item-cat-name').value.trim();
    const desc = document.getElementById('new-item-cat-desc').value.trim();
    if (!name) return showToast("Food category name is required", "error");

    if (state.editingMaster.id) {
      const c = state.master.itemCategories.find(x => x.id === state.editingMaster.id);
      if (c) {
        c.name = name;
        c.description = desc;
        showToast(`Category "${name}" updated`, "success");
      }
    } else {
      state.master.itemCategories.push({
        id: `ITEM-CAT-${Date.now()}`,
        name,
        description: desc
      });
      showToast(`Food category "${name}" added`, "success");
    }

    saveData();
    closeAllModals();
    renderCurrentMasterTab();
  }

  function deleteItemCat(id) {
    if (!confirm("Delete item category?")) return;
    state.master.itemCategories = state.master.itemCategories.filter(c => c.id !== id);
    saveData();
    renderCurrentMasterTab();
    showToast("Category deleted", "warning");
  }

  // Food Items Catalog Edit/Add
  function openAddItemModal() {
    state.editingMaster = { type: 'item', id: null };
    document.getElementById('modal-item-title').textContent = "Add Food Item to Catalog";
    document.getElementById('new-item-name').value = '';
    document.getElementById('new-item-sku').value = '';
    document.getElementById('new-item-unit').value = 'Box';
    document.getElementById('new-item-cost').value = '0.00';
    document.getElementById('new-item-sale').value = '0.00';
    document.getElementById('new-item-tax').value = '5';
    document.getElementById('new-item-stock').value = '100';
    document.getElementById('new-item-image').value = '';
    openModal('modal-add-item');
  }

  function openEditItemModal(id) {
    const item = state.master.items.find(x => x.id === id);
    if (!item) return;
    state.editingMaster = { type: 'item', id };
    document.getElementById('modal-item-title').textContent = `Edit Food Item: ${item.name}`;
    document.getElementById('new-item-name').value = item.name;
    document.getElementById('new-item-sku').value = item.sku;
    document.getElementById('new-item-category').value = item.category;
    document.getElementById('new-item-unit').value = item.unit;
    document.getElementById('new-item-cost').value = item.costPrice;
    document.getElementById('new-item-sale').value = item.salePrice;
    document.getElementById('new-item-tax').value = item.taxRate;
    document.getElementById('new-item-stock').value = item.stockQty;
    document.getElementById('new-item-image').value = item.image || '';
    openModal('modal-add-item');
  }

  function submitFoodItem() {
    const name = document.getElementById('new-item-name').value.trim();
    const sku = document.getElementById('new-item-sku').value.trim();
    const category = document.getElementById('new-item-category').value;
    const unit = document.getElementById('new-item-unit').value.trim() || 'Unit';
    const cost = parseFloat(document.getElementById('new-item-cost').value) || 0;
    const sale = parseFloat(document.getElementById('new-item-sale').value) || 0;
    const tax = parseFloat(document.getElementById('new-item-tax').value) || 0;
    const stock = parseInt(document.getElementById('new-item-stock').value) || 0;
    const image = document.getElementById('new-item-image').value.trim();

    if (!name || !sku) return showToast("Item Name and SKU are required", "error");

    if (state.editingMaster.id) {
      const item = state.master.items.find(x => x.id === state.editingMaster.id);
      if (item) {
        item.name = name;
        item.sku = sku;
        item.category = category;
        item.unit = unit;
        item.costPrice = cost;
        item.salePrice = sale;
        item.taxRate = tax;
        item.stockQty = stock;
        item.image = image;
        showToast(`Food item "${name}" updated`, "success");
      }
    } else {
      state.master.items.push({
        id: `ITM-${Date.now().toString().slice(-4)}`,
        name,
        sku,
        category,
        unit,
        costPrice: cost,
        salePrice: sale,
        taxRate: tax,
        stockQty: stock,
        reorderLevel: 15,
        image
      });
      showToast(`Food item "${name}" added`, "success");
    }

    saveData();
    closeAllModals();
    renderCurrentMasterTab();
  }

  function deleteItem(id) {
    if (!confirm("Delete food item?")) return;
    state.master.items = state.master.items.filter(i => i.id !== id);
    saveData();
    renderCurrentMasterTab();
    showToast("Food item deleted", "warning");
  }

  // Chart of Accounts Edit/Add
  function openAddAccountModal() {
    state.editingMaster = { type: 'account', id: null };
    document.getElementById('modal-acc-title').textContent = "Add Ledger Account Head";
    document.getElementById('new-acc-code').value = '';
    document.getElementById('new-acc-code').removeAttribute('disabled');
    document.getElementById('new-acc-name').value = '';
    document.getElementById('new-acc-type').value = 'Asset';
    document.getElementById('new-acc-subtype').value = 'Current Asset';
    document.getElementById('new-acc-balance').value = '0.00';
    openModal('modal-add-account');
  }

  function openEditAccountModal(code) {
    const acc = state.master.chartOfAccounts.find(x => x.code === code);
    if (!acc) return;
    state.editingMaster = { type: 'account', id: code };
    document.getElementById('modal-acc-title').textContent = `Edit Account (${code} - ${acc.name})`;
    document.getElementById('new-acc-code').value = acc.code;
    document.getElementById('new-acc-code').setAttribute('disabled', 'true');
    document.getElementById('new-acc-name').value = acc.name;
    document.getElementById('new-acc-type').value = acc.type;
    document.getElementById('new-acc-subtype').value = acc.subType || '';
    document.getElementById('new-acc-balance').value = acc.balance || 0;
    openModal('modal-add-account');
  }

  function submitAccountHead() {
    const code = document.getElementById('new-acc-code').value.trim();
    const name = document.getElementById('new-acc-name').value.trim();
    const type = document.getElementById('new-acc-type').value;
    const subType = document.getElementById('new-acc-subtype').value.trim();
    const balance = parseFloat(document.getElementById('new-acc-balance').value) || 0;

    if (!code || !name) return showToast("Account code and name are required", "error");

    if (state.editingMaster.id) {
      const acc = state.master.chartOfAccounts.find(x => x.code === state.editingMaster.id);
      if (acc) {
        acc.name = name;
        acc.type = type;
        acc.subType = subType;
        acc.balance = balance;
        showToast(`Account "${code} - ${name}" updated`, "success");
      }
    } else {
      if (state.master.chartOfAccounts.some(a => a.code === code)) {
        return showToast("An account with this code already exists", "error");
      }
      state.master.chartOfAccounts.push({
        code,
        name,
        type,
        subType: subType || type,
        balance
      });
      showToast(`Account "${code} - ${name}" created`, "success");
    }

    saveData();
    closeAllModals();
    renderCurrentMasterTab();
  }

  function deleteAccount(code) {
    if (!confirm(`Delete ledger account ${code}?`)) return;
    state.master.chartOfAccounts = state.master.chartOfAccounts.filter(a => a.code !== code);
    saveData();
    renderCurrentMasterTab();
    showToast(`Account ${code} deleted`, "warning");
  }

  // Tax Rates Edit/Add
  function openAddTaxModal() {
    state.editingMaster = { type: 'tax', id: null };
    document.getElementById('modal-tax-title').textContent = "Add GST / Tax Rate";
    document.getElementById('new-tax-name').value = '';
    document.getElementById('new-tax-rate').value = '5.0';
    document.getElementById('new-tax-desc').value = '';
    openModal('modal-add-tax');
  }

  function openEditTaxModal(id) {
    const t = state.master.taxRates.find(x => x.id === id);
    if (!t) return;
    state.editingMaster = { type: 'tax', id };
    document.getElementById('modal-tax-title').textContent = `Edit Tax Rate: ${t.name}`;
    document.getElementById('new-tax-name').value = t.name;
    document.getElementById('new-tax-rate').value = t.rate;
    document.getElementById('new-tax-desc').value = t.description || '';
    openModal('modal-add-tax');
  }

  function submitTaxRate() {
    const name = document.getElementById('new-tax-name').value.trim();
    const rate = parseFloat(document.getElementById('new-tax-rate').value);
    const desc = document.getElementById('new-tax-desc').value.trim();

    if (!name || isNaN(rate)) return showToast("Valid Tax Name and Rate are required", "error");

    if (state.editingMaster.id) {
      const t = state.master.taxRates.find(x => x.id === state.editingMaster.id);
      if (t) {
        t.name = name;
        t.rate = rate;
        t.description = desc;
        showToast(`Tax rate "${name}" updated`, "success");
      }
    } else {
      state.master.taxRates.push({
        id: `TAX-${Math.round(rate)}`,
        name,
        rate,
        description: desc
      });
      showToast(`Tax rate "${name}" added`, "success");
    }

    saveData();
    closeAllModals();
    renderCurrentMasterTab();
  }

  function deleteTaxRate(id) {
    state.master.taxRates = state.master.taxRates.filter(t => t.id !== id);
    saveData();
    renderCurrentMasterTab();
    showToast("Tax rate deleted", "warning");
  }

  // Payment Methods Edit/Add
  function openAddPaymentMethodModal() {
    state.editingMaster = { type: 'payment', id: null };
    document.getElementById('modal-payment-title').textContent = "Add Payment Method";
    document.getElementById('new-pay-name').value = '';
    populatePaymentAccountsSelect();
    openModal('modal-add-payment');
  }

  function openEditPaymentMethodModal(id) {
    const p = state.master.paymentMethods.find(x => x.id === id);
    if (!p) return;
    state.editingMaster = { type: 'payment', id };
    document.getElementById('modal-payment-title').textContent = `Edit Payment Method: ${p.name}`;
    document.getElementById('new-pay-name').value = p.name;
    populatePaymentAccountsSelect(p.accountCode);
    openModal('modal-add-payment');
  }

  function populatePaymentAccountsSelect(selectedCode) {
    const sel = document.getElementById('new-pay-account');
    if (!sel) return;
    sel.innerHTML = state.master.chartOfAccounts.map(a => `
      <option value="${a.code}" ${a.code === selectedCode ? 'selected' : ''}>
        ${a.code} - ${a.name} [${a.type}]
      </option>
    `).join('');
  }

  function submitPaymentMethod() {
    const name = document.getElementById('new-pay-name').value.trim();
    const accountCode = document.getElementById('new-pay-account').value;

    if (!name) return showToast("Payment Method name is required", "error");

    if (state.editingMaster.id) {
      const p = state.master.paymentMethods.find(x => x.id === state.editingMaster.id);
      if (p) {
        p.name = name;
        p.accountCode = accountCode;
        showToast(`Payment method "${name}" updated`, "success");
      }
    } else {
      state.master.paymentMethods.push({
        id: `PAY-${Date.now().toString().slice(-4)}`,
        name,
        accountCode,
        isDefault: false
      });
      showToast(`Payment method "${name}" created`, "success");
    }

    saveData();
    closeAllModals();
    renderCurrentMasterTab();
  }

  function deletePaymentMethod(id) {
    state.master.paymentMethods = state.master.paymentMethods.filter(p => p.id !== id);
    saveData();
    renderCurrentMasterTab();
    showToast("Payment method deleted", "warning");
  }

  // ==========================================
  // INVOICE CREATE & EDIT (WITH MANDATORY REASON TRACKING)
  // ==========================================
  function openNewInvoiceModal() {
    state.editingInvoiceId = null;
    document.getElementById('modal-invoice-title').textContent = "Create Food Sales Invoice";
    document.getElementById('inv-edit-reason-container').style.display = 'none';
    document.getElementById('inv-edit-reason').value = '';

    populateInvoiceModalDropdowns();
    openModal('modal-new-invoice');
  }

  function openEditInvoiceModal(id) {
    const inv = state.invoices.find(x => x.id === id);
    if (!inv) return;
    state.editingInvoiceId = id;

    document.getElementById('modal-invoice-title').textContent = `Edit Invoice ${inv.id}`;
    document.getElementById('inv-edit-reason-container').style.display = 'block';
    document.getElementById('inv-edit-reason').value = '';

    populateInvoiceModalDropdowns(inv);
    openModal('modal-new-invoice');
  }

  function populateInvoiceModalDropdowns(existingInvoice = null) {
    // Outlets dropdown
    const outletSelect = document.getElementById('inv-outlet-select');
    if (outletSelect) {
      outletSelect.innerHTML = state.master.outlets.map(o => `
        <option value="${o.id}" ${existingInvoice && existingInvoice.outletId === o.id ? 'selected' : ''}>
          ${o.name} [${o.code}]
        </option>
      `).join('');
      if (!existingInvoice && state.selectedOutlet !== 'all') {
        outletSelect.value = state.selectedOutlet;
      }
    }

    // Customers dropdown
    const custSelect = document.getElementById('inv-customer-select');
    if (custSelect) {
      custSelect.innerHTML = state.master.customers.map(c => `
        <option value="${c.id}" ${existingInvoice && existingInvoice.customerId === c.id ? 'selected' : ''}>
          ${c.name} (${c.type})
        </option>
      `).join('');
    }

    // Category
    const catSelect = document.getElementById('inv-category-select');
    if (catSelect) {
      catSelect.innerHTML = state.master.incomeCategories.map(c => `
        <option value="${c.name}" ${existingInvoice && existingInvoice.category === c.name ? 'selected' : ''}>
          ${c.name}
        </option>
      `).join('');
    }

    // Payment mode
    const paySelect = document.getElementById('inv-payment-select');
    if (paySelect) {
      paySelect.innerHTML = state.master.paymentMethods.map(p => `
        <option value="${p.name}" ${existingInvoice && existingInvoice.paymentMethod === p.name ? 'selected' : ''}>
          ${p.name}
        </option>
      `).join('');
    }

    const dateInput = document.getElementById('inv-date');
    const dueDateInput = document.getElementById('inv-due-date');
    const notesInput = document.getElementById('inv-notes');

    if (existingInvoice) {
      if (dateInput) dateInput.value = existingInvoice.date;
      if (dueDateInput) dueDateInput.value = existingInvoice.dueDate;
      if (notesInput) notesInput.value = existingInvoice.notes || '';

      // Populate existing line items
      const tbody = document.getElementById('invoice-line-items-tbody');
      if (tbody) {
        tbody.innerHTML = existingInvoice.items.map(item => `
          <tr>
            <td>
              <select class="line-item-select form-select">
                <option value="">-- Choose Food Item --</option>
                ${state.master.items.map(mItem => `
                  <option value="${mItem.id}" data-price="${mItem.salePrice}" data-tax="${mItem.taxRate}" ${mItem.id === item.itemId ? 'selected' : ''}>
                    ${mItem.name} (${mItem.sku}) - ${formatCurrency(mItem.salePrice)}
                  </option>
                `).join('')}
              </select>
            </td>
            <td>
              <input type="number" class="line-item-qty form-input text-center" value="${item.qty}" min="1">
            </td>
            <td>
              <input type="number" class="line-item-price form-input text-right" value="${item.unitPrice}" step="0.01">
            </td>
            <td>
              <input type="number" class="line-item-tax form-input text-center" value="${item.taxRate}" step="0.5">
            </td>
            <td class="text-right line-item-total" style="font-weight: 600; padding-top: 10px;">
              ${formatCurrency(item.total)}
            </td>
            <td class="text-center">
              <button type="button" class="btn btn-danger btn-sm" onclick="window.FCW.removeInvoiceLineItem(this)">✕</button>
            </td>
          </tr>
        `).join('');

        tbody.querySelectorAll('tr').forEach(attachInvoiceRowEvents);
        calculateInvoiceModalTotals();
      }
    } else {
      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
      if (dueDateInput) dueDateInput.value = new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10);
      if (notesInput) notesInput.value = 'Thank you for choosing Food Co World!';

      const tbody = document.getElementById('invoice-line-items-tbody');
      if (tbody) {
        tbody.innerHTML = `<tr>${getInvoiceLineItemRowHtml()}</tr>`;
        attachInvoiceRowEvents(tbody.querySelector('tr'));
        calculateInvoiceModalTotals();
      }
    }
  }

  function getInvoiceLineItemRowHtml() {
    const itemOptions = state.master.items.map(item => `
      <option value="${item.id}" data-price="${item.salePrice}" data-tax="${item.taxRate}">
        ${item.name} (${item.sku}) - ${formatCurrency(item.salePrice)}
      </option>
    `).join('');

    return `
      <td>
        <select class="line-item-select form-select">
          <option value="">-- Choose Food Item --</option>
          ${itemOptions}
        </select>
      </td>
      <td>
        <input type="number" class="line-item-qty form-input text-center" value="1" min="1">
      </td>
      <td>
        <input type="number" class="line-item-price form-input text-right" value="0.00" step="0.01">
      </td>
      <td>
        <input type="number" class="line-item-tax form-input text-center" value="5" step="0.5">
      </td>
      <td class="text-right line-item-total" style="font-weight: 600; padding-top: 10px;">
        ₹ 0.00
      </td>
      <td class="text-center">
        <button type="button" class="btn btn-danger btn-sm" onclick="window.FCW.removeInvoiceLineItem(this)">✕</button>
      </td>
    `;
  }

  function attachInvoiceRowEvents(row) {
    const itemSelect = row.querySelector('.line-item-select');
    const qtyInput = row.querySelector('.line-item-qty');
    const priceInput = row.querySelector('.line-item-price');
    const taxInput = row.querySelector('.line-item-tax');

    itemSelect.addEventListener('change', () => {
      const selectedOpt = itemSelect.options[itemSelect.selectedIndex];
      if (selectedOpt && selectedOpt.value) {
        priceInput.value = selectedOpt.getAttribute('data-price') || '0.00';
        taxInput.value = selectedOpt.getAttribute('data-tax') || '0';
      }
      calculateInvoiceModalTotals();
    });

    [qtyInput, priceInput, taxInput].forEach(inp => {
      inp.addEventListener('input', calculateInvoiceModalTotals);
    });
  }

  function calculateInvoiceModalTotals() {
    let sub = 0;
    let tax = 0;

    document.querySelectorAll('#invoice-line-items-tbody tr').forEach(row => {
      const qty = parseFloat(row.querySelector('.line-item-qty').value) || 0;
      const price = parseFloat(row.querySelector('.line-item-price').value) || 0;
      const taxRate = parseFloat(row.querySelector('.line-item-tax').value) || 0;

      const lineSub = qty * price;
      const lineTax = lineSub * (taxRate / 100);
      const lineTotal = lineSub + lineTax;

      row.querySelector('.line-item-total').textContent = formatCurrency(lineTotal);
      sub += lineSub;
      tax += lineTax;
    });

    const grand = sub + tax;
    const subEl = document.getElementById('modal-inv-subtotal');
    const taxEl = document.getElementById('modal-inv-tax');
    const grandEl = document.getElementById('modal-inv-grand');

    if (subEl) subEl.textContent = formatCurrency(sub);
    if (taxEl) taxEl.textContent = formatCurrency(tax);
    if (grandEl) grandEl.textContent = formatCurrency(grand);
  }

  function submitInvoice() {
    const outletId = document.getElementById('inv-outlet-select').value;
    const customerId = document.getElementById('inv-customer-select').value;
    const category = document.getElementById('inv-category-select').value;
    const date = document.getElementById('inv-date').value || new Date().toISOString().slice(0, 10);
    const dueDate = document.getElementById('inv-due-date').value || date;
    const paymentMethod = document.getElementById('inv-payment-select').value;
    const notes = document.getElementById('inv-notes').value.trim();

    const outlet = state.master.outlets.find(o => o.id === outletId);
    const customer = state.master.customers.find(c => c.id === customerId);

    if (!customer) return showToast("Please select a client", "error");

    // Line items
    const lineRows = document.querySelectorAll('#invoice-line-items-tbody tr');
    const items = [];
    let subTotal = 0;
    let taxTotal = 0;

    lineRows.forEach(row => {
      const itemSelect = row.querySelector('.line-item-select');
      const qtyInput = row.querySelector('.line-item-qty');
      const priceInput = row.querySelector('.line-item-price');
      const taxInput = row.querySelector('.line-item-tax');

      if (itemSelect && itemSelect.value) {
        const itemId = itemSelect.value;
        const foundItem = state.master.items.find(i => i.id === itemId);
        const qty = parseFloat(qtyInput.value) || 1;
        const price = parseFloat(priceInput.value) || 0;
        const taxRate = parseFloat(taxInput.value) || 0;

        const lineSub = qty * price;
        const lineTax = lineSub * (taxRate / 100);
        const lineTotal = lineSub + lineTax;

        subTotal += lineSub;
        taxTotal += lineTax;

        items.push({
          itemId,
          description: foundItem ? foundItem.name : "Custom Item",
          qty,
          unitPrice: price,
          taxRate,
          total: lineTotal
        });
      }
    });

    if (items.length === 0) {
      return showToast("Please add at least one food item to the invoice", "error");
    }

    const grandTotal = subTotal + taxTotal;

    // Check if EDITING existing invoice
    if (state.editingInvoiceId) {
      const editReason = document.getElementById('inv-edit-reason').value.trim();
      if (!editReason) {
        showToast("Reason for editing invoice is compulsory!", "error");
        document.getElementById('inv-edit-reason').focus();
        return;
      }

      const inv = state.invoices.find(x => x.id === state.editingInvoiceId);
      if (!inv) return;

      const previousTotal = inv.grandTotal;

      if (!inv.editHistory) inv.editHistory = [];
      inv.editHistory.push({
        date: new Date().toISOString(),
        editedBy: "Accounts Admin",
        reason: editReason,
        prevTotal: previousTotal,
        newTotal: grandTotal
      });

      inv.outletId = outlet ? outlet.id : inv.outletId;
      inv.outletName = outlet ? outlet.name : inv.outletName;
      inv.customerId = customer.id;
      inv.customerName = customer.name;
      inv.category = category;
      inv.date = date;
      inv.dueDate = dueDate;
      inv.paymentMethod = paymentMethod;
      inv.notes = notes;
      inv.items = items;
      inv.subTotal = subTotal;
      inv.taxTotal = taxTotal;
      inv.grandTotal = grandTotal;

      saveData();
      closeAllModals();
      showToast(`Invoice ${inv.id} updated with modification audit logged!`, "success");
      refreshAllViews();
      return;
    }

    // Creating NEW invoice
    const newInvId = `INV-2026-${String(state.invoices.length + 1).padStart(3, '0')}`;
    const newInvoice = {
      id: newInvId,
      date,
      dueDate,
      outletId: outlet ? outlet.id : "OUT-01",
      outletName: outlet ? outlet.name : "Central Kitchen",
      customerId,
      customerName: customer.name,
      category,
      items,
      subTotal,
      taxTotal,
      grandTotal,
      status: "Pending",
      paymentMethod,
      notes: notes || "Thank you for partnering with Food Co World!",
      editHistory: []
    };

    state.invoices.unshift(newInvoice);

    // Update Accounts Receivable
    const arAcc = state.master.chartOfAccounts.find(a => a.code === '1100');
    if (arAcc) arAcc.balance += grandTotal;

    saveData();
    closeAllModals();
    showToast(`Invoice ${newInvId} created successfully for ${outlet ? outlet.name : 'Outlet'}!`, "success");
    refreshAllViews();
  }

  function toggleInvoiceStatus(id) {
    const inv = state.invoices.find(i => i.id === id);
    if (!inv) return;
    inv.status = inv.status === 'Paid' ? 'Pending' : 'Paid';

    const bankAcc = state.master.chartOfAccounts.find(a => a.code === '1020');
    const arAcc = state.master.chartOfAccounts.find(a => a.code === '1100');
    if (inv.status === 'Paid') {
      if (bankAcc) bankAcc.balance += inv.grandTotal;
      if (arAcc) arAcc.balance = Math.max(0, arAcc.balance - inv.grandTotal);
    } else {
      if (bankAcc) bankAcc.balance = Math.max(0, bankAcc.balance - inv.grandTotal);
      if (arAcc) arAcc.balance += inv.grandTotal;
    }

    saveData();
    refreshAllViews();
    showToast(`Invoice ${id} marked as ${inv.status}`, "success");
  }

  function deleteInvoice(id) {
    if (!confirm(`Delete invoice ${id}?`)) return;
    state.invoices = state.invoices.filter(i => i.id !== id);
    saveData();
    refreshAllViews();
    showToast(`Invoice ${id} deleted`, "warning");
  }

  // Invoice Preview (with Brand Logo, Outlet & Edit Audit History)
  function previewInvoice(id) {
    const inv = state.invoices.find(i => i.id === id);
    if (!inv) return;

    const previewBody = document.getElementById('printable-invoice-content');
    if (!previewBody) return;

    const customer = state.master.customers.find(c => c.id === inv.customerId);

    // Edit history block
    let editHistoryHtml = '';
    if (inv.editHistory && inv.editHistory.length > 0) {
      editHistoryHtml = `
        <div class="invoice-edit-history-box">
          <div class="invoice-edit-history-title">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
            Modification Audit Trail (${inv.editHistory.length} Edits Logged)
          </div>
          ${inv.editHistory.map(h => `
            <div class="edit-history-item">
              <div><strong>Modified on:</strong> ${formatDate(h.date)} by <em>${h.editedBy}</em></div>
              <div><span class="edit-history-reason">Reason:</span> ${h.reason}</div>
              <div style="font-size:11px; color:#92400e;">Amount changed from ${formatCurrency(h.prevTotal)} to ${formatCurrency(h.newTotal)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    previewBody.innerHTML = `
      <div style="border-bottom: 2px solid #065f46; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between;">
        <div style="display: flex; gap: 14px; align-items: flex-start;">
          ${state.company.logo ? `<img src="${state.company.logo}" style="max-height: 56px; max-width: 120px; object-fit: contain; border-radius: 6px;">` : ''}
          <div>
            <h2 style="color: #064e3b; font-size: 24px; font-weight: 800;">${state.company.name}</h2>
            <div style="font-size: 12px; color: #475569; margin-top: 2px;">${inv.outletName || state.company.address}</div>
            <div style="font-size: 12px; color: #475569;">${state.company.taxNumber} | Phone: ${state.company.phone}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <h1 style="font-size: 26px; color: #065f46; font-weight: 800; letter-spacing: -0.5px;">TAX INVOICE</h1>
          <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${inv.id}</div>
          <div style="font-size: 12.5px; color: #64748b;">Date: ${formatDate(inv.date)}</div>
          <div style="font-size: 12.5px; color: #64748b;">Due Date: ${formatDate(inv.dueDate)}</div>
          <div style="margin-top: 4px;"><span class="badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-warning'}">${inv.status}</span></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Billed Client:</div>
          <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 2px;">${inv.customerName}</div>
          <div style="font-size: 12px; color: #475569;">${customer && customer.address ? customer.address : '(Address on File)'}</div>
          <div style="font-size: 12px; color: #475569;">Contact: ${customer ? customer.phone || '-' : '-'}</div>
        </div>
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Dispatched From Outlet:</div>
          <div style="font-size: 15px; font-weight: 700; color: #064e3b; margin-top: 2px;">${inv.outletName || 'Central Kitchen'}</div>
          <div style="font-size: 12px; color: #475569;">Payment Method: ${inv.paymentMethod}</div>
          <div style="font-size: 12px; color: #475569;">Sales Stream: ${inv.category}</div>
        </div>
      </div>

      <table class="data-table" style="margin-bottom: 20px;">
        <thead>
          <tr>
            <th>Food Item / Description</th>
            <th class="text-center" style="width: 80px;">Qty</th>
            <th class="text-right" style="width: 120px;">Unit Rate (₹)</th>
            <th class="text-center" style="width: 80px;">GST %</th>
            <th class="text-right" style="width: 140px;">Line Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${inv.items.map(item => `
            <tr>
              <td><strong>${item.description}</strong></td>
              <td class="text-center">${item.qty}</td>
              <td class="text-right">${formatCurrency(item.unitPrice)}</td>
              <td class="text-center">${item.taxRate}%</td>
              <td class="text-right" style="font-weight: 600;">${formatCurrency(item.total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end;">
        <div style="width: 320px; font-size: 13.5px; background:#f8fafc; padding:14px; border-radius:8px;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>Subtotal:</span>
            <span>${formatCurrency(inv.subTotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>Food GST:</span>
            <span>${formatCurrency(inv.taxTotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #0f172a; font-weight: 800; font-size: 17px; color: #065f46;">
            <span>Grand Total:</span>
            <span>${formatCurrency(inv.grandTotal)}</span>
          </div>
        </div>
      </div>

      ${editHistoryHtml}

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #cbd5e1; font-size: 12px; color: #64748b;">
        <strong>Notes / Delivery Ref:</strong> ${inv.notes || 'Goods once delivered in good condition are verified.'}
      </div>
    `;

    openModal('modal-preview-invoice');
  }

  // ==========================================
  // EXPENSES SUBMISSION (WITH OUTLET TAGGING)
  // ==========================================
  function openNewExpenseModal() {
    // Populate Outlets
    const outSelect = document.getElementById('exp-outlet-select');
    if (outSelect) {
      outSelect.innerHTML = state.master.outlets.map(o => `
        <option value="${o.id}">${o.name} [${o.code}]</option>
      `).join('');
      if (state.selectedOutlet !== 'all') outSelect.value = state.selectedOutlet;
    }

    // Populate Vendors
    const venSelect = document.getElementById('exp-vendor-select');
    if (venSelect) {
      venSelect.innerHTML = '<option value="">-- No Vendor / Internal Bill --</option>' + 
        state.master.vendors.map(v => `<option value="${v.id}">${v.name} (${v.category})</option>`).join('');
    }

    // Categories
    const catSelect = document.getElementById('exp-category-select');
    if (catSelect) {
      catSelect.innerHTML = state.master.expenseCategories.map(c => `
        <option value="${c.name}">${c.name} [${c.type}]</option>
      `).join('');
    }

    // Accounts
    const payAccSelect = document.getElementById('exp-pay-account');
    if (payAccSelect) {
      const liquidAccs = state.master.chartOfAccounts.filter(a => a.type === 'Asset');
      payAccSelect.innerHTML = liquidAccs.map(a => `<option value="${a.code}">${a.code} - ${a.name}</option>`).join('');
    }

    // Payment Methods
    const payMethodSelect = document.getElementById('exp-pay-method');
    if (payMethodSelect) {
      payMethodSelect.innerHTML = state.master.paymentMethods.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
    }

    const dateInput = document.getElementById('exp-date');
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);

    openModal('modal-new-expense');
  }

  function submitNewExpense() {
    const outletId = document.getElementById('exp-outlet-select').value;
    const vendorId = document.getElementById('exp-vendor-select').value;
    const category = document.getElementById('exp-category-select').value;
    const date = document.getElementById('exp-date').value || new Date().toISOString().slice(0, 10);
    const amount = parseFloat(document.getElementById('exp-amount').value) || 0;
    const taxRate = parseFloat(document.getElementById('exp-tax-rate').value) || 0;
    const payAccount = document.getElementById('exp-pay-account').value;
    const payMethod = document.getElementById('exp-pay-method').value;
    const refNo = document.getElementById('exp-ref-no').value.trim();
    const notes = document.getElementById('exp-notes').value.trim();

    if (amount <= 0) return showToast("Please enter a valid expense amount in Rupees", "error");

    const outlet = state.master.outlets.find(o => o.id === outletId);
    const vendor = state.master.vendors.find(v => v.id === vendorId);
    const taxAmount = amount * (taxRate / 100);
    const total = amount + taxAmount;

    const newExpId = `EXP-2026-${String(state.expenses.length + 1).padStart(3, '0')}`;

    state.expenses.unshift({
      id: newExpId,
      date,
      outletId: outlet ? outlet.id : "OUT-01",
      outletName: outlet ? outlet.name : "Central Kitchen",
      vendorId: vendor ? vendor.id : null,
      vendorName: vendor ? vendor.name : "Direct Outlet Operational Expense",
      category,
      accountCode: "5010",
      paymentAccount: payAccount,
      paymentMethod: payMethod,
      referenceNo: refNo || `REF-${newExpId}`,
      amount,
      taxAmount,
      total,
      status: "Paid",
      notes
    });

    const payingAcc = state.master.chartOfAccounts.find(a => a.code === payAccount);
    if (payingAcc) payingAcc.balance -= total;

    saveData();
    closeAllModals();
    showToast(`Expense ${newExpId} of ${formatCurrency(total)} recorded for ${outlet ? outlet.name : 'Outlet'}`, "success");
    refreshAllViews();
  }

  function deleteExpense(id) {
    if (!confirm(`Delete expense record ${id}?`)) return;
    state.expenses = state.expenses.filter(e => e.id !== id);
    saveData();
    refreshAllViews();
    showToast(`Expense ${id} deleted`, "warning");
  }

  // ==========================================
  // JOURNAL ENTRIES (DOUBLE-ENTRY BOOKKEEPING)
  // ==========================================
  function openNewJournalModal() {
    populateJournalModalRows();
    openModal('modal-new-journal');
  }

  function populateJournalModalRows() {
    const tbody = document.getElementById('journal-lines-tbody');
    if (!tbody) return;

    tbody.innerHTML = `
      <tr>${getJournalLineRowHtml()}</tr>
      <tr>${getJournalLineRowHtml()}</tr>
    `;

    tbody.querySelectorAll('tr').forEach(attachJournalRowEvents);
    calculateJournalTotals();

    const dateInput = document.getElementById('je-date');
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
  }

  function getJournalLineRowHtml() {
    const accOptions = state.master.chartOfAccounts.map(a => `
      <option value="${a.code}">${a.code} - ${a.name} [${a.type}]</option>
    `).join('');

    return `
      <td>
        <select class="je-account-select form-select">
          <option value="">-- Select Account --</option>
          ${accOptions}
        </select>
      </td>
      <td>
        <input type="number" class="je-debit-input form-input text-right" value="0.00" step="0.01">
      </td>
      <td>
        <input type="number" class="je-credit-input form-input text-right" value="0.00" step="0.01">
      </td>
      <td class="text-center">
        <button type="button" class="btn btn-danger btn-sm" onclick="window.FCW.removeJournalRow(this)">✕</button>
      </td>
    `;
  }

  function attachJournalRowEvents(row) {
    const debit = row.querySelector('.je-debit-input');
    const credit = row.querySelector('.je-credit-input');

    debit.addEventListener('input', () => {
      if (parseFloat(debit.value) > 0) credit.value = "0.00";
      calculateJournalTotals();
    });

    credit.addEventListener('input', () => {
      if (parseFloat(credit.value) > 0) debit.value = "0.00";
      calculateJournalTotals();
    });
  }

  function calculateJournalTotals() {
    let debits = 0;
    let credits = 0;

    document.querySelectorAll('#journal-lines-tbody tr').forEach(r => {
      debits += parseFloat(r.querySelector('.je-debit-input').value) || 0;
      credits += parseFloat(r.querySelector('.je-credit-input').value) || 0;
    });

    const debEl = document.getElementById('je-total-debit');
    const credEl = document.getElementById('je-total-credit');
    const badgeEl = document.getElementById('je-balance-indicator');

    if (debEl) debEl.textContent = formatCurrency(debits);
    if (credEl) credEl.textContent = formatCurrency(credits);

    if (badgeEl) {
      const diff = Math.abs(debits - credits);
      if (diff < 0.01 && debits > 0) {
        badgeEl.className = 'badge badge-success';
        badgeEl.textContent = '✓ Balanced (Debits = Credits)';
      } else {
        badgeEl.className = 'badge badge-danger';
        badgeEl.textContent = `Unbalanced (Difference: ${formatCurrency(diff)})`;
      }
    }
  }

  function submitNewJournal() {
    const date = document.getElementById('je-date').value || new Date().toISOString().slice(0, 10);
    const ref = document.getElementById('je-reference').value.trim();
    const narration = document.getElementById('je-narration').value.trim();

    if (!narration) return showToast("Narration / Explanation is required", "error");

    const rows = document.querySelectorAll('#journal-lines-tbody tr');
    const lines = [];
    let totalDebit = 0;
    let totalCredit = 0;

    rows.forEach(r => {
      const accSelect = r.querySelector('.je-account-select');
      const debitInput = r.querySelector('.je-debit-input');
      const creditInput = r.querySelector('.je-credit-input');

      if (accSelect && accSelect.value) {
        const accountCode = accSelect.value;
        const debit = parseFloat(debitInput.value) || 0;
        const credit = parseFloat(creditInput.value) || 0;

        if (debit > 0 || credit > 0) {
          lines.push({
            accountCode,
            accountName: getAccountNameByCode(accountCode),
            debit,
            credit
          });
          totalDebit += debit;
          totalCredit += credit;
        }
      }
    });

    if (lines.length < 2) return showToast("At least two balancing lines required", "error");
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return showToast(`Entry is unbalanced! Debits must equal Credits. Difference: ${formatCurrency(Math.abs(totalDebit - totalCredit))}`, "error");
    }

    const newJeId = `JE-2026-${String(state.journalEntries.length + 1).padStart(3, '0')}`;
    state.journalEntries.unshift({
      id: newJeId,
      date,
      reference: ref,
      narration,
      lines
    });

    lines.forEach(line => {
      const acc = state.master.chartOfAccounts.find(a => a.code === line.accountCode);
      if (acc) {
        if (['Asset', 'Expense'].includes(acc.type)) {
          acc.balance += (line.debit - line.credit);
        } else {
          acc.balance += (line.credit - line.debit);
        }
      }
    });

    saveData();
    closeAllModals();
    showToast(`Journal voucher ${newJeId} posted!`, "success");
    refreshAllViews();
  }

  function deleteJournal(id) {
    if (!confirm(`Delete journal entry ${id}?`)) return;
    state.journalEntries = state.journalEntries.filter(j => j.id !== id);
    saveData();
    refreshAllViews();
    showToast(`Journal ${id} deleted`, "warning");
  }

  // Fund Transfers
  function openTransferFundsModal() {
    const fromSelect = document.getElementById('transfer-from-select');
    const toSelect = document.getElementById('transfer-to-select');
    const liquidAccs = state.master.chartOfAccounts.filter(a => a.type === 'Asset');

    const opts = liquidAccs.map(a => `<option value="${a.code}">${a.code} - ${a.name} (${formatCurrency(a.balance)})</option>`).join('');

    if (fromSelect) fromSelect.innerHTML = opts;
    if (toSelect) {
      toSelect.innerHTML = opts;
      if (toSelect.options.length > 1) toSelect.selectedIndex = 1;
    }

    const dateInput = document.getElementById('transfer-date');
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);

    openModal('modal-transfer-funds');
  }

  function submitFundTransfer() {
    const fromAccCode = document.getElementById('transfer-from-select').value;
    const toAccCode = document.getElementById('transfer-to-select').value;
    const amount = parseFloat(document.getElementById('transfer-amount').value) || 0;
    const date = document.getElementById('transfer-date').value || new Date().toISOString().slice(0, 10);
    const notes = document.getElementById('transfer-notes').value.trim();

    if (fromAccCode === toAccCode) return showToast("From and To accounts must be different", "error");
    if (amount <= 0) return showToast("Please enter a valid transfer amount in Rupees", "error");

    const fromAcc = state.master.chartOfAccounts.find(a => a.code === fromAccCode);
    const toAcc = state.master.chartOfAccounts.find(a => a.code === toAccCode);

    if (!fromAcc || !toAcc) return showToast("Account not found", "error");

    fromAcc.balance -= amount;
    toAcc.balance += amount;

    state.journalEntries.unshift({
      id: `JE-XFER-${Date.now().toString().slice(-4)}`,
      date,
      reference: "BANK-XFER",
      narration: notes || `Internal fund transfer from ${fromAcc.name} to ${toAcc.name}`,
      lines: [
        { accountCode: toAccCode, accountName: toAcc.name, debit: amount, credit: 0 },
        { accountCode: fromAccCode, accountName: fromAcc.name, debit: 0, credit: amount }
      ]
    });

    saveData();
    closeAllModals();
    showToast(`Transferred ${formatCurrency(amount)} successfully`, "success");
    refreshAllViews();
  }

  // Expose API
  window.FCW = {
    switchView,
    switchMasterTab,
    setOutletFilter,
    resetToDefaults,
    saveCompanySettings,
    uploadLogoFile,
    removeLogo,
    backupJSON,
    restoreJSON,

    // Outlets CRUD
    openAddOutletModal,
    openEditOutletModal,
    submitOutlet,
    deleteOutlet,

    // Customers CRUD (Optional address)
    openAddCustomerModal,
    openEditCustomerModal,
    submitCustomer,
    deleteCustomer,

    // Vendors CRUD (Compulsory address)
    openAddVendorModal,
    openEditVendorModal,
    submitVendor,
    deleteVendor,

    // Expense Categories CRUD
    openAddExpenseCatModal,
    openEditExpenseCatModal,
    submitExpenseCategory,
    deleteExpenseCat,

    // Income Categories CRUD
    openAddIncomeCatModal,
    openEditIncomeCatModal,
    submitIncomeCategory,
    deleteIncomeCat,

    // Food Categories CRUD
    openAddItemCatModal,
    openEditItemCatModal,
    submitItemCategory,
    deleteItemCat,

    // Food Items CRUD
    openAddItemModal,
    openEditItemModal,
    submitFoodItem,
    deleteItem,

    // Accounts CRUD
    openAddAccountModal,
    openEditAccountModal,
    submitAccountHead,
    deleteAccount,

    // Taxes CRUD
    openAddTaxModal,
    openEditTaxModal,
    submitTaxRate,
    deleteTaxRate,

    // Payments CRUD
    openAddPaymentMethodModal,
    openEditPaymentMethodModal,
    submitPaymentMethod,
    deletePaymentMethod,

    // Invoices Operations
    openNewInvoiceModal,
    openEditInvoiceModal,
    submitInvoice,
    toggleInvoiceStatus,
    deleteInvoice,
    previewInvoice,
    addInvoiceLineItem: () => {
      const tbody = document.getElementById('invoice-line-items-tbody');
      if (!tbody) return;
      const tr = document.createElement('tr');
      tr.innerHTML = getInvoiceLineItemRowHtml();
      tbody.appendChild(tr);
      attachInvoiceRowEvents(tr);
    },
    removeInvoiceLineItem: (btn) => {
      const row = btn.closest('tr');
      if (document.querySelectorAll('#invoice-line-items-tbody tr').length > 1) {
        row.remove();
        calculateInvoiceModalTotals();
      } else {
        showToast("Invoice must contain at least 1 food line item", "warning");
      }
    },

    // Expenses Operations
    openNewExpenseModal,
    submitNewExpense,
    deleteExpense,

    // Journal Operations
    openNewJournalModal,
    submitNewJournal,
    deleteJournal,
    addJournalRow: () => {
      const tbody = document.getElementById('journal-lines-tbody');
      if (!tbody) return;
      const tr = document.createElement('tr');
      tr.innerHTML = getJournalLineRowHtml();
      tbody.appendChild(tr);
      attachJournalRowEvents(tr);
    },
    removeJournalRow: (btn) => {
      const row = btn.closest('tr');
      if (document.querySelectorAll('#journal-lines-tbody tr').length > 2) {
        row.remove();
        calculateJournalTotals();
      } else {
        showToast("Journal entry requires at least 2 balancing lines", "warning");
      }
    },

    // Transfers
    openTransferFundsModal,
    submitFundTransfer
  };

  // Bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
