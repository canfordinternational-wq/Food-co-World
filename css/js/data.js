// Food Co World - Raw Spice Trading Seed Data and Default Configurations (INR)
const DEFAULT_ACCOUNTING_DATA = {
  company: {
    name: "Food Co World",
    tagline: "Raw Indian Spice Trading, Wholesale & Distribution",
    currency: "₹",
    currencyCode: "INR",
    taxNumber: "",
    fiscalYearStart: "2026-04-01",
    address: "",
    phone: "",
    email: "",
    website: "",
    logo: ""
  },

  master: {
    outlets: [
      { id:"OUT-01", code:"WH-01", name:"Food Co World - Central Spice Warehouse", type:"Central Spice Warehouse", manager:"", phone:"", email:"", address:"", status:"Active" },
      { id:"OUT-02", code:"WH-02", name:"Food Co World - Trading Warehouse", type:"Trading Warehouse", manager:"", phone:"", email:"", address:"", status:"Active" },
      { id:"OUT-03", code:"WH-03", name:"Food Co World - Spice Dispatch Warehouse", type:"Spice Dispatch Warehouse", manager:"", phone:"", email:"", address:"", status:"Active" }
    ],

    customers: [
      { id:"CUST-201", name:"Kerala Spice Wholesale", type:"Spice Wholesaler", contact:"", phone:"", email:"", address:"", creditLimit:0 },
      { id:"CUST-202", name:"South India Spice Distributor", type:"Spice Distributor", contact:"", phone:"", email:"", address:"", creditLimit:0 },
      { id:"CUST-203", name:"Export Spice Buyer", type:"Export Buyer", contact:"", phone:"", email:"", address:"", creditLimit:0 },
      { id:"CUST-204", name:"Retail Spice Distributor", type:"Retail Distributor", contact:"", phone:"", email:"", address:"", creditLimit:0 }
    ],

    vendors: [
      { id:"VEN-101", name:"Kerala Pepper Supplier", category:"Raw Spices", contact:"", phone:"", email:"", address:"", creditDays:30, taxId:"" },
      { id:"VEN-102", name:"Indian Chilli Supplier", category:"Raw Spices", contact:"", phone:"", email:"", address:"", creditDays:30, taxId:"" },
      { id:"VEN-103", name:"Cardamom & Whole Spice Supplier", category:"Raw Spices", contact:"", phone:"", email:"", address:"", creditDays:30, taxId:"" },
      { id:"VEN-104", name:"Spice Packaging Supplier", category:"Packaging Materials", contact:"", phone:"", email:"", address:"", creditDays:30, taxId:"" }
    ],

    expenseCategories: [
      { id:"EXP-CAT-1", name:"Raw Spice Purchases / COGS", code:"5010", type:"COGS", description:"Purchase of whole spices, seeds, roots, dried chilli and other raw spice stock" },
      { id:"EXP-CAT-2", name:"Spice Packaging Materials", code:"5020", type:"COGS", description:"Bags, sacks, liners, labels and packing materials" },
      { id:"EXP-CAT-3", name:"Spice Stock Loss / Wastage", code:"5030", type:"COGS", description:"Damage, moisture loss, contamination or stock adjustments" },
      { id:"EXP-CAT-4", name:"Warehouse & Staff Salaries", code:"6010", type:"Operating", description:"Warehouse, accounts, procurement and administration staff" },
      { id:"EXP-CAT-5", name:"Warehouse Electricity & Utilities", code:"6020", type:"Operating", description:"Electricity, water and warehouse utilities" },
      { id:"EXP-CAT-6", name:"Warehouse & Trading Location Rent", code:"6030", type:"Operating", description:"Warehouse and trading premises rent" },
      { id:"EXP-CAT-7", name:"Transport, Freight & Vehicle Costs", code:"6040", type:"Operating", description:"Inbound freight, local transport, loading, unloading and vehicle costs" },
      { id:"EXP-CAT-8", name:"Warehouse Hygiene & Pest Control", code:"6050", type:"Operating", description:"Storage hygiene, pest control and warehouse maintenance" },
      { id:"EXP-CAT-9", name:"Warehouse Equipment Maintenance", code:"6070", type:"Operating", description:"Scales, handling equipment and storage equipment maintenance" },
      { id:"EXP-CAT-10", name:"Marketing, Sampling & Branding", code:"6060", type:"Operating", description:"Trade samples, catalogues, branding and sales promotion" },
      { id:"EXP-CAT-11", name:"Bank Charges & Finance Costs", code:"6080", type:"Operating", description:"Bank charges, payment processing and finance costs" }
    ],

    incomeCategories: [
      { id:"INC-CAT-1", name:"Wholesale Raw Spice Sales", code:"4010", description:"Bulk sales of raw whole spices and seeds" },
      { id:"INC-CAT-2", name:"Domestic Spice Distribution Sales", code:"4020", description:"Sales to distributors and wholesale buyers" },
      { id:"INC-CAT-3", name:"Export Spice Sales", code:"4030", description:"Export and overseas bulk spice sales" },
      { id:"INC-CAT-4", name:"Direct Spice Trading Sales", code:"4040", description:"Direct sales to business customers" },
      { id:"INC-CAT-5", name:"Spice Blends & Specialty Products", code:"4050", description:"Sales of spice blends and specialty raw spice products" },
      { id:"INC-CAT-6", name:"Other Spice Trading Income", code:"4090", description:"Other income related to spice trading" }
    ],

    itemCategories: [
      { id:"ITEM-CAT-1", name:"Whole Spices", description:"Whole raw spices used for trading and further processing" },
      { id:"ITEM-CAT-2", name:"Spice Seeds", description:"Cumin, coriander, mustard, fenugreek and other spice seeds" },
      { id:"ITEM-CAT-3", name:"Dried Chillies", description:"Whole dried red chillies and chilli varieties" },
      { id:"ITEM-CAT-4", name:"Roots & Dried Botanicals", description:"Turmeric, ginger and other dried raw botanicals" },
      { id:"ITEM-CAT-5", name:"Premium Spices", description:"Cardamom, pepper, saffron, mace and premium spices" },
      { id:"ITEM-CAT-6", name:"Raw Spice Blends", description:"Uncooked spice blends and trading mixes" },
      { id:"ITEM-CAT-7", name:"Other Raw Spices", description:"Other whole, dried and raw spice products" }
    ],

    items: [
      { id:"ITM-01", name:"Black Pepper Whole", sku:"SP-001", category:"Whole Spices", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:50 },
      { id:"ITM-02", name:"Green Cardamom", sku:"SP-002", category:"Premium Spices", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:20 },
      { id:"ITM-03", name:"Turmeric Whole", sku:"SP-003", category:"Roots & Dried Botanicals", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:50 },
      { id:"ITM-04", name:"Dry Red Chilli Whole", sku:"SP-004", category:"Dried Chillies", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:50 },
      { id:"ITM-05", name:"Cumin Seeds", sku:"SP-005", category:"Spice Seeds", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:50 },
      { id:"ITM-06", name:"Coriander Seeds", sku:"SP-006", category:"Spice Seeds", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:50 },
      { id:"ITM-07", name:"Cloves Whole", sku:"SP-007", category:"Whole Spices", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:20 },
      { id:"ITM-08", name:"Cinnamon Whole", sku:"SP-008", category:"Whole Spices", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:20 },
      { id:"ITM-09", name:"Fenugreek Seeds", sku:"SP-009", category:"Spice Seeds", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:30 },
      { id:"ITM-10", name:"Mustard Seeds", sku:"SP-010", category:"Spice Seeds", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:30 },
      { id:"ITM-11", name:"Star Anise", sku:"SP-011", category:"Premium Spices", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:15 },
      { id:"ITM-12", name:"Black Cumin (Kalonji)", sku:"SP-012", category:"Spice Seeds", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:20 },
      { id:"ITM-13", name:"Mace (Javitri)", sku:"SP-013", category:"Premium Spices", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:10 },
      { id:"ITM-14", name:"Dried Ginger", sku:"SP-014", category:"Roots & Dried Botanicals", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:25 },
      { id:"ITM-15", name:"Bay Leaf Whole", sku:"SP-015", category:"Whole Spices", unit:"Kg", costPrice:0, salePrice:0, taxRate:0, stockQty:0, reorderLevel:20 }
    ],

    chartOfAccounts: [
      { code:"1010", name:"Cash on Hand", type:"Asset", subType:"Current Asset", balance:0 },
      { code:"1020", name:"Primary Current Bank Account", type:"Asset", subType:"Current Asset", balance:0 },
      { code:"1030", name:"Petty Cash", type:"Asset", subType:"Current Asset", balance:0 },
      { code:"1100", name:"Accounts Receivable (Trade Debtors)", type:"Asset", subType:"Current Asset", balance:0 },
      { code:"1200", name:"Inventory - Raw Spices", type:"Asset", subType:"Current Asset", balance:0 },
      { code:"1220", name:"Inventory - Spice Packaging Materials", type:"Asset", subType:"Current Asset", balance:0 },
      { code:"1500", name:"Warehouse & Spice Handling Equipment", type:"Asset", subType:"Fixed Asset", balance:0 },
      { code:"1590", name:"Accumulated Depreciation", type:"Asset", subType:"Fixed Asset", balance:0 },
      { code:"2010", name:"Accounts Payable (Trade Creditors)", type:"Liability", subType:"Current Liability", balance:0 },
      { code:"2100", name:"GST Payable", type:"Liability", subType:"Current Liability", balance:0 },
      { code:"2200", name:"Staff Payroll Payable", type:"Liability", subType:"Current Liability", balance:0 },
      { code:"2500", name:"Warehouse Equipment Loan", type:"Liability", subType:"Long-term Liability", balance:0 },
      { code:"3010", name:"Promoter & Partner Capital", type:"Equity", subType:"Equity", balance:0 },
      { code:"3020", name:"Retained Earnings", type:"Equity", subType:"Equity", balance:0 },
      { code:"4010", name:"Wholesale Raw Spice Sales Revenue", type:"Revenue", subType:"Operating Revenue", balance:0 },
      { code:"4020", name:"Domestic Spice Distribution Revenue", type:"Revenue", subType:"Operating Revenue", balance:0 },
      { code:"4030", name:"Export Spice Sales Revenue", type:"Revenue", subType:"Operating Revenue", balance:0 },
      { code:"4040", name:"Direct Spice Trading Revenue", type:"Revenue", subType:"Operating Revenue", balance:0 },
      { code:"4090", name:"Other Spice Trading Income", type:"Revenue", subType:"Other Revenue", balance:0 },
      { code:"5010", name:"Cost of Raw Spices (COGS)", type:"Expense", subType:"COGS", balance:0 },
      { code:"5020", name:"Cost of Spice Packaging (COGS)", type:"Expense", subType:"COGS", balance:0 },
      { code:"5030", name:"Spice Stock Loss / Wastage (COGS)", type:"Expense", subType:"COGS", balance:0 },
      { code:"6010", name:"Warehouse & Staff Salaries", type:"Expense", subType:"Operating Expense", balance:0 },
      { code:"6020", name:"Warehouse Electricity & Utilities", type:"Expense", subType:"Operating Expense", balance:0 },
      { code:"6030", name:"Warehouse & Trading Location Rent", type:"Expense", subType:"Operating Expense", balance:0 },
      { code:"6040", name:"Transport, Freight & Vehicle Costs", type:"Expense", subType:"Operating Expense", balance:0 },
      { code:"6050", name:"Warehouse Hygiene & Pest Control", type:"Expense", subType:"Operating Expense", balance:0 },
      { code:"6060", name:"Marketing, Sampling & Branding", type:"Expense", subType:"Operating Expense", balance:0 },
      { code:"6070", name:"Warehouse Equipment Maintenance", type:"Expense", subType:"Operating Expense", balance:0 },
      { code:"6080", name:"Bank Charges & Finance Costs", type:"Expense", subType:"Operating Expense", balance:0 }
    ],

    taxRates: [
      { id:"TAX-0", name:"GST 0% - Configure", rate:0, description:"Use only where applicable under current GST/HSN classification" },
      { id:"TAX-5", name:"GST 5% - Configure", rate:5, description:"Configure according to the applicable spice HSN and packing/branding status" },
      { id:"TAX-12", name:"GST 12% - Configure", rate:12, description:"Configure only where applicable" },
      { id:"TAX-18", name:"GST 18% - Configure", rate:18, description:"Configure only where applicable" }
    ],

    paymentMethods: [
      { id:"PAY-1", name:"Primary Bank Account (NEFT / RTGS / IMPS)", accountCode:"1020", isDefault:true },
      { id:"PAY-2", name:"UPI / Digital Payment", accountCode:"1020", isDefault:false },
      { id:"PAY-3", name:"Cash", accountCode:"1010", isDefault:false },
      { id:"PAY-4", name:"Credit - 30 Days", accountCode:"2010", isDefault:false }
    ]
  },

  invoices: [],
  expenses: [],
  journalEntries: []
};

if (typeof window !== "undefined") {
  window.DEFAULT_ACCOUNTING_DATA = DEFAULT_ACCOUNTING_DATA;
}
