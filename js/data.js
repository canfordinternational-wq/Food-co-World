// Food Co World - Initial Seed Data and Default Configurations (Rupees & Indian GST Architecture)
const DEFAULT_ACCOUNTING_DATA = {
  company: {
    name: "Food Co World",
    tagline: "Spice Trading & Accounting",
    currency: "₹",
    currencyCode: "INR",
    taxNumber: "",
    fiscalYearStart: "2026-04-01",
    address: "",
    phone: "",
    email: "",
    website: "",
    logo: "" // Base64 logo data
  },
  
  // Master Categories & Central Entities
  master: {
    // 1. Food Co World Internal Outlets & Kitchen Branches
    outlets: [],

    // 2. Customers / External Food Clients & Outlets Billed
    customers: [],

    // 3. Suppliers / Food Vendors (Mandatory Registered Address)
    vendors: [],

    // 4. Expense Categories
    expenseCategories: [
      { id: "EXP-CAT-1", name: "Spice Purchases & Raw Materials", code: "5010", type: "COGS", description: "Vegetables, meat, poultry, dairy, flour, spices, oils" },
      { id: "EXP-CAT-2", name: "Spice Packaging & Packing", code: "5020", type: "COGS", description: "Meal boxes, biodegradable trays, pouches, labels" },
      { id: "EXP-CAT-3", name: "Food Spoilage & Wastage Write-Off", code: "5030", type: "COGS", description: "Expired or damaged kitchen stock write-offs" },
      { id: "EXP-CAT-4", name: "Kitchen & Outlet Staff Salaries", code: "6010", type: "Operating", description: "Head chefs, prep cooks, outlet managers, cashier crew" },
      { id: "EXP-CAT-5", name: "Kitchen Gas, Power & Utilities", code: "6020", type: "Operating", description: "Commercial piped gas (PNG), cold room electricity, water" },
      { id: "EXP-CAT-6", name: "Outlet & Cold Storage Rent", code: "6030", type: "Operating", description: "Commercial lease for central kitchen and outlet counters" },
      { id: "EXP-CAT-7", name: "Logistics, Delivery Fleet & Fuel", code: "6040", type: "Operating", description: "Refrigerated van diesel, inter-outlet transfer costs" },
      { id: "EXP-CAT-8", name: "Hygiene, Sanitization & Pest Control", code: "6050", type: "Operating", description: "FSSAI compliance, kitchen deep sterilization" },
      { id: "EXP-CAT-9", name: "Kitchen Machinery Maintenance", code: "6070", type: "Operating", description: "Combi-oven servicing, chillers, blast freezers repair" },
      { id: "EXP-CAT-10", name: "Marketing, Branding & Food Sampling", code: "6060", type: "Operating", description: "Tasting stalls, food aggregator ads, social promotions" }
    ],

    // 5. Income / Revenue Categories
    incomeCategories: [
      { id: "INC-CAT-1", name: "Wholesale Spice Sales", code: "4010", description: "Bulk food & bakery deliveries to restaurants & hotels" },
      { id: "INC-CAT-2", name: "Retail & Outlet Counter Sales", code: "4020", description: "Direct retail sales at food kiosks and outlets" },
      { id: "INC-CAT-3", name: "Corporate Catering & Events", code: "4030", description: "Full-service food catering contracts and banquets" },
      { id: "INC-CAT-4", name: "Online Orders & Food Aggregators", code: "4040", description: "Zomato, Swiggy, and direct website delivery orders" },
      { id: "INC-CAT-5", name: "Private Label Spice Sales", code: "4050", description: "Artisan sourdough, brioche, and celebration cakes" },
      { id: "INC-CAT-6", name: "Culinary Consulting & Menu Licensing", code: "4090", description: "Institutional menu engineering and culinary workshops" }
    ],

    // 6. Food Product Categories
    itemCategories: [
      { id: "ITEM-CAT-1", name: "Whole Spices", description: "Whole spices such as pepper, cumin, coriander and fennel" },
      { id: "ITEM-CAT-2", name: "Ground Spices & Blends", description: "Ground spices, masalas and custom spice blends" },
      { id: "ITEM-CAT-3", name: "Pepper & Premium Spices", description: "Premium pepper, cardamom, cinnamon and other high-value spices" },
      { id: "ITEM-CAT-4", name: "Dried Herbs & Botanicals", description: "Dried herbs, leaves and botanical ingredients" },
      { id: "ITEM-CAT-5", name: "Seeds, Whole Spices & Dry Goods", description: "Seeds, dry spices and other bulk trading goods" },
      { id: "ITEM-CAT-6", name: "Spice Blends & Seasonings", description: "Blended spices, seasonings and private-label mixes" },
      { id: "ITEM-CAT-7", name: "Extracts, Oils & Oleoresins", description: "Spice extracts, oils and oleoresins" },
      { id: "ITEM-CAT-8", name: "Packaging Materials", description: "Food-grade spice bags, pouches, labels and cartons" }
    ],

    // 7. Food Catalog Items (Prices in INR ₹)
    items: [],

    // 8. Chart of Accounts (COA)
    chartOfAccounts: [
      { code: "1010", name: "Cash on Hand (Outlet Cash Registers)", type: "Asset", subType: "Current Asset", balance: 0 },
      { code: "1020", name: "HDFC Primary Current Bank Account", type: "Asset", subType: "Current Asset", balance: 0 },
      { code: "1030", name: "Petty Cash (Outlet Emergency)", type: "Asset", subType: "Current Asset", balance: 0 },
      { code: "1100", name: "Accounts Receivable (Trade Debtors)", type: "Asset", subType: "Current Asset", balance: 0 },
      { code: "1200", name: "Inventory - Raw Ingredients", type: "Asset", subType: "Current Asset", balance: 0 },
      { code: "1210", name: "Inventory - Finished Food Products", type: "Asset", subType: "Current Asset", balance: 0 },
      { code: "1220", name: "Inventory - Packaging Materials", type: "Asset", subType: "Current Asset", balance: 0 },
      { code: "1500", name: "Commercial Kitchen Equipment", type: "Asset", subType: "Fixed Asset", balance: 0 },
      { code: "1510", name: "Refrigerated Delivery Vans", type: "Asset", subType: "Fixed Asset", balance: 0 },
      { code: "1590", name: "Accumulated Depreciation", type: "Asset", subType: "Fixed Asset", balance: 0 },

      { code: "2010", name: "Accounts Payable (Trade Creditors)", type: "Liability", subType: "Current Liability", balance: 0 },
      { code: "2100", name: "GST / Food Tax Payable", type: "Liability", subType: "Current Liability", balance: 0 },
      { code: "2200", name: "Accrued Outlet Payroll", type: "Liability", subType: "Current Liability", balance: 0 },
      { code: "2500", name: "Commercial Kitchen Machinery Loan", type: "Liability", subType: "Long-term Liability", balance: 0 },

      { code: "3010", name: "Promoter & Partner Capital", type: "Equity", subType: "Equity", balance: 0 },
      { code: "3020", name: "Retained Earnings", type: "Equity", subType: "Equity", balance: 0 },

      { code: "4010", name: "Wholesale Spice Sales Revenue", type: "Revenue", subType: "Operating Revenue", balance: 0 },
      { code: "4020", name: "Retail & Outlet Counter Sales", type: "Revenue", subType: "Operating Revenue", balance: 0 },
      { code: "4030", name: "Corporate Catering Revenue", type: "Revenue", subType: "Operating Revenue", balance: 0 },
      { code: "4040", name: "Online Delivery Aggregator Revenue", type: "Revenue", subType: "Operating Revenue", balance: 0 },
      { code: "4090", name: "Culinary Consulting & Other Income", type: "Revenue", subType: "Other Revenue", balance: 0 },

      { code: "5010", name: "Cost of Raw Ingredients (COGS)", type: "Expense", subType: "COGS", balance: 0 },
      { code: "5020", name: "Cost of Packaging (COGS)", type: "Expense", subType: "COGS", balance: 0 },
      { code: "5030", name: "Food Spoilage & Wastage (COGS)", type: "Expense", subType: "COGS", balance: 0 },

      { code: "6010", name: "Kitchen & Staff Salaries", type: "Expense", subType: "Operating Expense", balance: 0 },
      { code: "6020", name: "Commercial Gas & Electricity", type: "Expense", subType: "Operating Expense", balance: 0 },
      { code: "6030", name: "Kitchen & Outlet Rent", type: "Expense", subType: "Operating Expense", balance: 0 },
      { code: "6040", name: "Delivery Van Fuel & Maintenance", type: "Expense", subType: "Operating Expense", balance: 0 },
      { code: "6050", name: "Sanitization & Pest Compliance", type: "Expense", subType: "Operating Expense", balance: 0 },
      { code: "6060", name: "Marketing, Tasting & Branding", type: "Expense", subType: "Operating Expense", balance: 0 },
      { code: "6070", name: "Kitchen Machinery Servicing", type: "Expense", subType: "Operating Expense", balance: 0 }
    ],

    // 9. Tax Rates (GST Brackets)
    taxRates: [
      { id: "TAX-0", name: "Zero Food Tax (0% GST)", rate: 0, description: "Fresh unbranded farm produce, grains, raw milk" },
      { id: "TAX-5", name: "Standard Food GST (5%)", rate: 5, description: "Prepared food, bakery items, cooked meal packs" },
      { id: "TAX-12", name: "Processed Foods GST (12%)", rate: 12, description: "Processed juices, butter, cheeses, preserved items" },
      { id: "TAX-18", name: "Commercial Packaging & Goods (18%)", rate: 18, description: "Non-food consumables, packaging trays, event supplies" }
    ],

    // 10. Payment Methods
    paymentMethods: [
      { id: "PAY-1", name: "HDFC Primary Bank Account (NEFT / RTGS / IMPS)", accountCode: "1020", isDefault: true },
      { id: "PAY-2", name: "Outlet POS Card Machine", accountCode: "1020", isDefault: false },
      { id: "PAY-3", name: "UPI QR Code (GPay / PhonePe / Paytm)", accountCode: "1020", isDefault: false },
      { id: "PAY-4", name: "Outlet Cash Register Drawer", accountCode: "1010", isDefault: false },
      { id: "PAY-5", name: "Net 30 Days Credit Term", accountCode: "2010", isDefault: false }
    ]
  },

  // Transactions with Outlet Associations & Edit Tracking
  invoices: [],

  // Expenses with Outlet Tagging
  expenses: [],

  // Double-Entry Journals
  journalEntries: []
};

// Export to window
if (typeof window !== "undefined") {
  window.DEFAULT_ACCOUNTING_DATA = DEFAULT_ACCOUNTING_DATA;
}
