// Food Co World - Initial Seed Data and Default Configurations (Rupees & Indian GST Architecture)
const DEFAULT_ACCOUNTING_DATA = {
  company: {
    name: "Food Co World",
    tagline: "Quality Food Manufacturing, Outlets, Catering & Distribution",
    currency: "₹",
    currencyCode: "INR",
    taxNumber: "GSTIN: 27AABCF9823F1Z5",
    fiscalYearStart: "2026-04-01",
    address: "Central Culinary Hub, Unit 400, Food Logistics Park, Mumbai 400072",
    phone: "+91 (022) 5550-FOOD / +91 98200 12345",
    email: "accounts@foodcoworld.com",
    website: "www.foodcoworld.com",
    logo: "" // Base64 logo data
  },
  
  // Master Categories & Central Entities
  master: {
    // 1. Food Co World Internal Outlets & Kitchen Branches
    outlets: [
      {
        id: "OUT-01",
        code: "CBK-01",
        name: "Food Co World - Central Base Kitchen (Andheri)",
        type: "Base Production Kitchen",
        manager: "Chef Rahul Nair",
        phone: "+91 98201 11223",
        email: "cbk.andheri@foodcoworld.com",
        address: "Plot 12, MIDC Industrial Area, Andheri East, Mumbai 400093",
        status: "Active"
      },
      {
        id: "OUT-02",
        code: "BGO-02",
        name: "Food Co World - Bandra Gourmet Outlet",
        type: "Retail & Dine-in Kiosk",
        manager: "Pooja Sharma",
        phone: "+91 98202 22334",
        email: "bandra.store@foodcoworld.com",
        address: "Shop 4, Hill Road, Near Mehboob Studio, Bandra West, Mumbai 400050",
        status: "Active"
      },
      {
        id: "OUT-03",
        code: "BKC-03",
        name: "Food Co World - BKC Cloud Kitchen Hub",
        type: "Delivery Hub & Cloud Kitchen",
        manager: "Sameer Joshi",
        phone: "+91 98203 33445",
        email: "bkc.kitchen@foodcoworld.com",
        address: "Tower 2, Trade Centre Basement, G-Block BKC, Mumbai 400051",
        status: "Active"
      },
      {
        id: "OUT-04",
        code: "PTK-04",
        name: "Food Co World - Powai Tech Park Kiosk",
        type: "Corporate Cafeteria Kiosk",
        manager: "Ananya Roy",
        phone: "+91 98204 44556",
        email: "powai.kiosk@foodcoworld.com",
        address: "Hiranandani Business Park, Technology Street, Powai, Mumbai 400076",
        status: "Active"
      }
    ],

    // 2. Customers / External Food Clients & Outlets Billed
    customers: [
      {
        id: "CUST-201",
        name: "The Grand Royal Bistro & Lounge",
        type: "Wholesale Restaurant",
        contact: "Chef Antoine Laurent",
        phone: "+91 98111 22334",
        email: "chef@grandroyalbistro.in",
        address: "Colaba Causeway, Near Gateway of India, Mumbai 400001", // Optional
        creditLimit: 300000
      },
      {
        id: "CUST-202",
        name: "Sunrise Bakery & Specialty Cafe",
        type: "Wholesale Cafe",
        contact: "Sarah Jenkins",
        phone: "+91 98222 33445",
        email: "sarah@sunrisecafe.in",
        address: "Juhu Tara Road, Juhu, Mumbai 400049", // Optional
        creditLimit: 150000
      },
      {
        id: "CUST-203",
        name: "Pacific Luxury Hotels & Banquets",
        type: "Corporate Catering",
        contact: "Liam Thorne (Procurement Head)",
        phone: "+91 98333 44556",
        email: "procurement@pacifichotels.in",
        address: "Marine Drive Promenade, Nariman Point, Mumbai 400021", // Optional
        creditLimit: 750000
      },
      {
        id: "CUST-204",
        name: "Nature Fresh Gourmet Supermarket Chain",
        type: "Retail Distributor",
        contact: "Deborah Cruz",
        phone: "+91 98444 55667",
        email: "dcruz@naturefreshmarts.in",
        address: "Linking Road, Santacruz West, Mumbai", // Optional
        creditLimit: 500000
      },
      {
        id: "CUST-205",
        name: "Apex Tech Campus Cafeteria Services",
        type: "Corporate Catering",
        contact: "Robert Henderson",
        phone: "+91 98555 66778",
        email: "admin@apextechcampus.in",
        address: "", // Optional left empty intentionally
        creditLimit: 400000
      }
    ],

    // 3. Suppliers / Food Vendors (Mandatory Registered Address)
    vendors: [
      {
        id: "VEN-101",
        name: "Sahyadri Agro & Organic Farm Produce",
        category: "Raw Ingredients",
        contact: "Marcus Vance",
        phone: "+91 98901 12345",
        email: "orders@sahyadriagro.in",
        address: "Gat No. 142, Dindori Agro Processing Belt, Nashik, Maharashtra 422202", // Compulsory
        creditDays: 14,
        taxId: "27AABCS8910F1Z2"
      },
      {
        id: "VEN-102",
        name: "Apex Food-Grade Eco Packaging Co.",
        category: "Packaging & Disposables",
        contact: "Elena Rostova",
        phone: "+91 98902 23456",
        email: "sales@apexpackaging.in",
        address: "Shed 44, Waluj MIDC Industrial Area, Aurangabad, Maharashtra 431136", // Compulsory
        creditDays: 30,
        taxId: "27AAACP7734E1Z8"
      },
      {
        id: "VEN-103",
        name: "Konkan Marine Meats & Cold Supply",
        category: "Raw Ingredients",
        contact: "Captain Dave Kelly",
        phone: "+91 98903 34567",
        email: "orders@konkanmarine.in",
        address: "Sassoon Docks Fish Harbor Yard 18, Colaba, Mumbai 400005", // Compulsory
        creditDays: 7,
        taxId: "27AABCK2309C1Z1"
      },
      {
        id: "VEN-104",
        name: "Mahanagar Gas Commercial Energy Ltd.",
        category: "Kitchen Utilities",
        contact: "Commercial Billing Desk",
        phone: "+91 98904 45678",
        email: "commercial@mahanagargas.in",
        address: "MGL House, Block G-33, Bandra-Kurla Complex, Bandra East, Mumbai 400051", // Compulsory
        creditDays: 30,
        taxId: "27AAACM1002B1Z6"
      },
      {
        id: "VEN-105",
        name: "Deccan Flour Mills & Spice Hub",
        category: "Raw Ingredients",
        contact: "Samir Patel",
        phone: "+91 98905 56789",
        email: "samir@deccanflourmills.in",
        address: "Plot 88, Sector 19, APMC Grain Market, Vashi, Navi Mumbai 400705", // Compulsory
        creditDays: 21,
        taxId: "27AABCD5521A1Z4"
      }
    ],

    // 4. Expense Categories
    expenseCategories: [
      { id: "EXP-CAT-1", name: "Raw Ingredients & Fresh Produce", code: "5010", type: "COGS", description: "Vegetables, meat, poultry, dairy, flour, spices, oils" },
      { id: "EXP-CAT-2", name: "Food Packaging & Disposables", code: "5020", type: "COGS", description: "Meal boxes, biodegradable trays, pouches, labels" },
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
      { id: "INC-CAT-1", name: "Wholesale Food Supply", code: "4010", description: "Bulk food & bakery deliveries to restaurants & hotels" },
      { id: "INC-CAT-2", name: "Retail & Outlet Counter Sales", code: "4020", description: "Direct retail sales at food kiosks and outlets" },
      { id: "INC-CAT-3", name: "Corporate Catering & Events", code: "4030", description: "Full-service food catering contracts and banquets" },
      { id: "INC-CAT-4", name: "Online Orders & Food Aggregators", code: "4040", description: "Zomato, Swiggy, and direct website delivery orders" },
      { id: "INC-CAT-5", name: "Specialty Bakery & Confectionery", code: "4050", description: "Artisan sourdough, brioche, and celebration cakes" },
      { id: "INC-CAT-6", name: "Culinary Consulting & Menu Licensing", code: "4090", description: "Institutional menu engineering and culinary workshops" }
    ],

    // 6. Food Product Categories
    itemCategories: [
      { id: "ITEM-CAT-1", name: "Bakery & Artisan Bread", description: "Sourdough, baguettes, croissants, brioche, buns" },
      { id: "ITEM-CAT-2", name: "Meat, Poultry & Seafood", description: "Marinated cuts, burger patties, smoked chicken, fish" },
      { id: "ITEM-CAT-3", name: "Dairy, Cheeses & Butter", description: "Artisan cultured butter, paneer, mozzarella, cream" },
      { id: "ITEM-CAT-4", name: "Organic Produce & Greens", description: "Hydroponic lettuce, microgreens, washed vegetables" },
      { id: "ITEM-CAT-5", name: "Grains, Spices & Dry Staples", description: "Basmati rice, whole spices, pulses, specialty flours" },
      { id: "ITEM-CAT-6", name: "Ready-to-Eat Gourmet Meals", description: "Sous-vide curry packs, frozen snack kits, meal trays" },
      { id: "ITEM-CAT-7", name: "Specialty Beverages & Juices", description: "Cold-pressed citrus, kombucha, iced teas, syrups" },
      { id: "ITEM-CAT-8", name: "Eco Packaging & Disposables", description: "Bagasse containers, wooden cutlery, kraft boxes" }
    ],

    // 7. Food Catalog Items (Prices in INR ₹)
    items: [
      { id: "ITM-01", name: "Artisan Sourdough Loaf (Box of 12)", sku: "SD-12B", category: "Bakery & Artisan Bread", unit: "Box", costPrice: 950.00, salePrice: 1900.00, taxRate: 5, stockQty: 180, reorderLevel: 30 },
      { id: "ITM-02", name: "Gourmet Angus Beef/Mutton Patties (10kg)", sku: "BF-PAT-10", category: "Meat, Poultry & Seafood", unit: "Crate", costPrice: 4200.00, salePrice: 6800.00, taxRate: 5, stockQty: 45, reorderLevel: 15 },
      { id: "ITM-03", name: "Organic Farm Fresh Milk (20L Can)", sku: "MLK-CR-20", category: "Dairy, Cheeses & Butter", unit: "Can", costPrice: 1100.00, salePrice: 1650.00, taxRate: 0, stockQty: 85, reorderLevel: 25 },
      { id: "ITM-04", name: "Cold-Pressed Citrus Juice (Case of 24)", sku: "JUICE-24C", category: "Specialty Beverages & Juices", unit: "Case", costPrice: 1400.00, salePrice: 2800.00, taxRate: 12, stockQty: 110, reorderLevel: 20 },
      { id: "ITM-05", name: "Sous-Vide Herb Salmon Meal Kit (Pack 10)", sku: "SAL-KIT-10", category: "Ready-to-Eat Gourmet Meals", unit: "Pack", costPrice: 3200.00, salePrice: 5800.00, taxRate: 5, stockQty: 40, reorderLevel: 10 },
      { id: "ITM-06", name: "Artisan Cultured Truffle Butter (5kg Tub)", sku: "TRUF-BTR-5", category: "Dairy, Cheeses & Butter", unit: "Tub", costPrice: 2800.00, salePrice: 4900.00, taxRate: 12, stockQty: 35, reorderLevel: 8 },
      { id: "ITM-07", name: "Microgreens & Herb Blend (5kg Box)", sku: "MCR-GRN-5", category: "Organic Produce & Greens", unit: "Box", costPrice: 1600.00, salePrice: 3100.00, taxRate: 0, stockQty: 50, reorderLevel: 15 },
      { id: "ITM-08", name: "Eco Compostable Lunch Bowls (Pack 250)", sku: "ECO-BWL-250", category: "Eco Packaging & Disposables", unit: "Pack", costPrice: 1850.00, salePrice: 2950.00, taxRate: 18, stockQty: 140, reorderLevel: 30 }
    ],

    // 8. Chart of Accounts (COA)
    chartOfAccounts: [
      { code: "1010", name: "Cash on Hand (Outlet Cash Registers)", type: "Asset", subType: "Current Asset", balance: 85000.00 },
      { code: "1020", name: "HDFC Primary Current Bank Account", type: "Asset", subType: "Current Asset", balance: 1450000.00 },
      { code: "1030", name: "Petty Cash (Outlet Emergency)", type: "Asset", subType: "Current Asset", balance: 35000.00 },
      { code: "1100", name: "Accounts Receivable (Trade Debtors)", type: "Asset", subType: "Current Asset", balance: 345000.00 },
      { code: "1200", name: "Inventory - Raw Ingredients", type: "Asset", subType: "Current Asset", balance: 480000.00 },
      { code: "1210", name: "Inventory - Finished Food Products", type: "Asset", subType: "Current Asset", balance: 290000.00 },
      { code: "1220", name: "Inventory - Packaging Materials", type: "Asset", subType: "Current Asset", balance: 120000.00 },
      { code: "1500", name: "Commercial Kitchen Equipment", type: "Asset", subType: "Fixed Asset", balance: 2800000.00 },
      { code: "1510", name: "Refrigerated Delivery Vans", type: "Asset", subType: "Fixed Asset", balance: 1600000.00 },
      { code: "1590", name: "Accumulated Depreciation", type: "Asset", subType: "Fixed Asset", balance: -450000.00 },

      { code: "2010", name: "Accounts Payable (Trade Creditors)", type: "Liability", subType: "Current Liability", balance: 320000.00 },
      { code: "2100", name: "GST / Food Tax Payable", type: "Liability", subType: "Current Liability", balance: 85000.00 },
      { code: "2200", name: "Accrued Outlet Payroll", type: "Liability", subType: "Current Liability", balance: 240000.00 },
      { code: "2500", name: "Commercial Kitchen Machinery Loan", type: "Liability", subType: "Long-term Liability", balance: 950000.00 },

      { code: "3010", name: "Promoter & Partner Capital", type: "Equity", subType: "Equity", balance: 4000000.00 },
      { code: "3020", name: "Retained Earnings", type: "Equity", subType: "Equity", balance: 1160000.00 },

      { code: "4010", name: "Wholesale Food Supply Revenue", type: "Revenue", subType: "Operating Revenue", balance: 0 },
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
  invoices: [
    {
      id: "INV-2026-001",
      date: "2026-09-15",
      dueDate: "2026-09-30",
      outletId: "OUT-01",
      outletName: "Food Co World - Central Base Kitchen (Andheri)",
      customerId: "CUST-201",
      customerName: "The Grand Royal Bistro & Lounge",
      category: "Wholesale Food Supply",
      items: [
        { itemId: "ITM-01", description: "Artisan Sourdough Loaf (Box of 12)", qty: 25, unitPrice: 1900.00, taxRate: 5, total: 49875.00 },
        { itemId: "ITM-02", description: "Gourmet Angus Beef/Mutton Patties (10kg)", qty: 15, unitPrice: 6800.00, taxRate: 5, total: 107100.00 }
      ],
      subTotal: 149500.00,
      taxTotal: 7475.00,
      grandTotal: 156975.00,
      status: "Paid",
      paymentMethod: "HDFC Primary Bank Account (NEFT / RTGS / IMPS)",
      notes: "Weekly recurring supply delivery dispatched from Andheri Central Kitchen.",
      editHistory: []
    },
    {
      id: "INV-2026-002",
      date: "2026-09-20",
      dueDate: "2026-10-05",
      outletId: "OUT-03",
      outletName: "Food Co World - BKC Cloud Kitchen Hub",
      customerId: "CUST-203",
      customerName: "Pacific Luxury Hotels & Banquets",
      category: "Corporate Catering & Events",
      items: [
        { itemId: "ITM-05", description: "Sous-Vide Herb Salmon Meal Kit (Pack 10)", qty: 30, unitPrice: 5800.00, taxRate: 5, total: 182700.00 },
        { itemId: "ITM-04", description: "Cold-Pressed Citrus Juice (Case of 24)", qty: 20, unitPrice: 2800.00, taxRate: 12, total: 62720.00 }
      ],
      subTotal: 230000.00,
      taxTotal: 15420.00,
      grandTotal: 245420.00,
      status: "Pending",
      paymentMethod: "Net 30 Days Credit Term",
      notes: "Annual Culinary Gala Catering. Due in 15 days.",
      editHistory: []
    },
    {
      id: "INV-2026-003",
      date: "2026-09-24",
      dueDate: "2026-10-08",
      outletId: "OUT-02",
      outletName: "Food Co World - Bandra Gourmet Outlet",
      customerId: "CUST-202",
      customerName: "Sunrise Bakery & Specialty Cafe",
      category: "Specialty Bakery & Confectionery",
      items: [
        { itemId: "ITM-01", description: "Artisan Sourdough Loaf (Box of 12)", qty: 18, unitPrice: 1900.00, taxRate: 5, total: 35910.00 },
        { itemId: "ITM-06", description: "Artisan Cultured Truffle Butter (5kg Tub)", qty: 6, unitPrice: 4900.00, taxRate: 12, total: 32928.00 }
      ],
      subTotal: 63600.00,
      taxTotal: 5238.00,
      grandTotal: 68838.00,
      status: "Paid",
      paymentMethod: "UPI QR Code (GPay / PhonePe / Paytm)",
      notes: "Immediate UPI settlement at Bandra retail counter.",
      editHistory: []
    },
    {
      id: "INV-2026-004",
      date: "2026-09-28",
      dueDate: "2026-10-12",
      outletId: "OUT-04",
      outletName: "Food Co World - Powai Tech Park Kiosk",
      customerId: "CUST-204",
      customerName: "Nature Fresh Gourmet Supermarket Chain",
      category: "Retail & Outlet Counter Sales",
      items: [
        { itemId: "ITM-04", description: "Cold-Pressed Citrus Juice (Case of 24)", qty: 45, unitPrice: 2800.00, taxRate: 12, total: 141120.00 },
        { itemId: "ITM-07", description: "Microgreens & Herb Blend (5kg Box)", qty: 20, unitPrice: 3100.00, taxRate: 0, total: 62000.00 }
      ],
      subTotal: 188000.00,
      taxTotal: 15120.00,
      grandTotal: 203120.00,
      status: "Pending",
      paymentMethod: "Net 30 Days Credit Term",
      notes: "Delivered to Powai distribution point.",
      editHistory: []
    }
  ],

  // Expenses with Outlet Tagging
  expenses: [
    {
      id: "EXP-2026-001",
      date: "2026-09-12",
      outletId: "OUT-01",
      outletName: "Food Co World - Central Base Kitchen (Andheri)",
      vendorId: "VEN-101",
      vendorName: "Sahyadri Agro & Organic Farm Produce",
      category: "Raw Ingredients & Fresh Produce",
      accountCode: "5010",
      paymentAccount: "1020",
      paymentMethod: "HDFC Primary Bank Account (NEFT / RTGS / IMPS)",
      referenceNo: "PO-77102",
      amount: 142000.00,
      taxAmount: 7100.00,
      total: 149100.00,
      status: "Paid",
      notes: "Bulk organic vegetables, culinary herbs, and microgreens batch."
    },
    {
      id: "EXP-2026-002",
      date: "2026-09-16",
      outletId: "OUT-01",
      outletName: "Food Co World - Central Base Kitchen (Andheri)",
      vendorId: "VEN-102",
      vendorName: "Apex Food-Grade Eco Packaging Co.",
      category: "Food Packaging & Disposables",
      accountCode: "5020",
      paymentAccount: "1020",
      paymentMethod: "HDFC Primary Bank Account (NEFT / RTGS / IMPS)",
      referenceNo: "INV-AP-8921",
      amount: 68000.00,
      taxAmount: 12240.00,
      total: 80240.00,
      status: "Paid",
      notes: "Eco-friendly takeaway meal containers and compostable trays."
    },
    {
      id: "EXP-2026-003",
      date: "2026-09-22",
      outletId: "OUT-01",
      outletName: "Food Co World - Central Base Kitchen (Andheri)",
      vendorId: "VEN-103",
      vendorName: "Konkan Marine Meats & Cold Supply",
      category: "Raw Ingredients & Fresh Produce",
      accountCode: "5010",
      paymentAccount: "1020",
      paymentMethod: "HDFC Primary Bank Account (NEFT / RTGS / IMPS)",
      referenceNo: "KM-9021",
      amount: 128000.00,
      taxAmount: 6400.00,
      total: 134400.00,
      status: "Paid",
      notes: "Fresh Atlantic salmon, marinated mutton cuts, organic chicken."
    },
    {
      id: "EXP-2026-004",
      date: "2026-09-25",
      outletId: "OUT-02",
      outletName: "Food Co World - Bandra Gourmet Outlet",
      vendorId: "VEN-104",
      vendorName: "Mahanagar Gas Commercial Energy Ltd.",
      category: "Kitchen Gas, Power & Utilities",
      accountCode: "6020",
      paymentAccount: "1020",
      paymentMethod: "HDFC Primary Bank Account (NEFT / RTGS / IMPS)",
      referenceNo: "MGL-SEP-26",
      amount: 38500.00,
      taxAmount: 0.00,
      total: 38500.00,
      status: "Paid",
      notes: "Commercial gas pipeline meter bill for Bandra outlet ovens."
    },
    {
      id: "EXP-2026-005",
      date: "2026-09-27",
      outletId: "OUT-03",
      outletName: "Food Co World - BKC Cloud Kitchen Hub",
      vendorId: null,
      vendorName: "BKC Cloud Kitchen Staff Payroll",
      category: "Kitchen & Outlet Staff Salaries",
      accountCode: "6010",
      paymentAccount: "1020",
      paymentMethod: "HDFC Primary Bank Account (NEFT / RTGS / IMPS)",
      referenceNo: "PAY-SEP-26-BKC",
      amount: 185000.00,
      taxAmount: 0.00,
      total: 185000.00,
      status: "Paid",
      notes: "Monthly chef & kitchen helper payroll batch."
    },
    {
      id: "EXP-2026-006",
      date: "2026-09-29",
      outletId: "OUT-04",
      outletName: "Food Co World - Powai Tech Park Kiosk",
      vendorId: null,
      vendorName: "City Logistics & Delivery Fleet",
      category: "Logistics, Delivery Fleet & Fuel",
      accountCode: "6040",
      paymentAccount: "1030",
      paymentMethod: "Outlet Cash Register Drawer",
      referenceNo: "FUEL-MUM-99",
      amount: 14500.00,
      taxAmount: 0.00,
      total: 14500.00,
      status: "Paid",
      notes: "Refrigerated inter-outlet delivery van diesel receipts."
    },
    {
      id: "EXP-2026-007",
      date: "2026-09-30",
      outletId: "OUT-01",
      outletName: "Food Co World - Central Base Kitchen (Andheri)",
      vendorId: "VEN-101",
      vendorName: "Sahyadri Agro & Organic Farm Produce",
      category: "Food Spoilage & Wastage Write-Off",
      accountCode: "5030",
      paymentAccount: "1200",
      paymentMethod: "Inventory Write-off",
      referenceNo: "SPOIL-SEP-26",
      amount: 16500.00,
      taxAmount: 0.00,
      total: 16500.00,
      status: "Paid",
      notes: "End-of-month fresh herbs and perishable greens shrinkage audit."
    }
  ],

  // Double-Entry Journals
  journalEntries: [
    {
      id: "JE-2026-001",
      date: "2026-09-01",
      reference: "BAL-FWD-2026",
      narration: "Opening Balance forward entry for September 2026",
      lines: [
        { accountCode: "1020", accountName: "HDFC Primary Current Bank Account", debit: 1450000.00, credit: 0.00 },
        { accountCode: "1200", accountName: "Inventory - Raw Ingredients", debit: 480000.00, credit: 0.00 },
        { accountCode: "1500", accountName: "Commercial Kitchen Equipment", debit: 2800000.00, credit: 0.00 },
        { accountCode: "3010", accountName: "Promoter & Partner Capital", debit: 0.00, credit: 4000000.00 },
        { accountCode: "2500", accountName: "Commercial Kitchen Machinery Loan", debit: 0.00, credit: 730000.00 }
      ]
    },
    {
      id: "JE-2026-002",
      date: "2026-09-15",
      reference: "INV-2026-001-REC",
      narration: "Record Invoice #INV-2026-001 Receipt from The Grand Royal Bistro",
      lines: [
        { accountCode: "1020", accountName: "HDFC Primary Current Bank Account", debit: 156975.00, credit: 0.00 },
        { accountCode: "4010", accountName: "Wholesale Food Supply Revenue", debit: 0.00, credit: 149500.00 },
        { accountCode: "2100", accountName: "GST / Food Tax Payable", debit: 0.00, credit: 7475.00 }
      ]
    },
    {
      id: "JE-2026-003",
      date: "2026-09-24",
      reference: "INV-2026-003-REC",
      narration: "Record Invoice #INV-2026-003 UPI Payment from Sunrise Bakery",
      lines: [
        { accountCode: "1020", accountName: "HDFC Primary Current Bank Account", debit: 68838.00, credit: 0.00 },
        { accountCode: "4020", accountName: "Retail & Outlet Counter Sales", debit: 0.00, credit: 63600.00 },
        { accountCode: "2100", accountName: "GST / Food Tax Payable", debit: 0.00, credit: 5238.00 }
      ]
    }
  ]
};

// Export to window
if (typeof window !== "undefined") {
  window.DEFAULT_ACCOUNTING_DATA = DEFAULT_ACCOUNTING_DATA;
}
