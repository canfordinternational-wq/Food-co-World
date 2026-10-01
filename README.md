# Food Co World | Spice Trading Accounting & Business Portal

A specialized financial management and multi-outlet ERP portal built specifically for **Food Co World** to maintain accounts in Indian Rupees (₹), record outlet performance separately, track spice inventory, enforce double-entry bookkeeping, and manage business master records.

---

## 🌟 Key Updates & Features

### 1. 🇮🇳 Currency in Indian Rupees (₹)
- All financial metrics, prices, vouchers, invoices, ledgers, and financial statements are denominated in **Indian Rupees (₹)**.
- Formatted using the Indian numbering system (Lakhs and Crores, e.g., `₹ 1,56,975.00`).

---

### 2. ✏️ Full Editing in Master Categories
Every entry across all 10 master sections can now be edited at any time:
- **Business Outlets & Warehouses**: Edit outlet name, code, facility type, branch manager, phone, email, and premises address.
- **Customers & Buyers**: Edit client name, buyer type, contact, phone, email, optional address, and credit limit.
- **Suppliers & Vendors**: Edit company name, category, GSTIN, credit terms, contact, and compulsory address.
- **Spice Product Catalog**: Edit product name, SKU, category, measurement unit, cost price, selling price, GST rate %, and active inventory stock.
- **Expense Categories**: Edit category name, ledger code, COGS/Operating classification, and description.
- **Revenue Categories**: Edit stream name, ledger code, and description.
- **Spice Product Categories**: Edit category title and culinary scope.
- **Chart of Accounts**: Edit account name, type, sub-classification, and opening balance.
- **Tax Rates**: Edit GST bracket name, rate %, and applicability.
- **Payment Modes**: Edit payment method title and linked ledger account.

---

### 3. 📝 Invoice Editing with Mandatory Reason & Audit History
- Any existing sales invoice can be edited by clicking **Edit with Reason**.
- Requires a mandatory **Reason for Edit / Modification Note** (e.g., *"Updated sourdough loaf quantity from 18 to 22 as per delivery challan #881"*).
- The system automatically logs an **Invoice Modification Audit Trail** storing:
  - Timestamp of modification
  - Editor identifier (`Accounts Admin`)
  - Previous grand total vs Updated grand total
  - Stated reason for revision
- The audit history is displayed on the invoice preview screen and printed on the invoice record.

---

### 4. 🏢 Separation of Outlets and Customers
- **Outlets**: Food Co World's internal physical locations, central production kitchens, delivery hubs, and retail counters:
  - *Example outlet / warehouse (added by user)*
  - *Example outlet / warehouse (added by user)*
  - *Example outlet / warehouse (added by user)*
  - *Example outlet / warehouse (added by user)*
- **Customers**: External buyers, wholesale restaurants, supermarkets, and corporate banquet clients:
  - *Example customer (not preloaded)*
  - *Example customer (not preloaded)*
  - *Example customer (not preloaded)*
  - *Example customer (not preloaded)*

---

### 5. 📊 Separate Accounts Recording for Outlets
- In the top navigation bar, an **Outlet Selector Dropdown** lets you filter the entire portal:
  - **All Outlets (Consolidated)**: View global company-wide finances.
  - **Specific Outlet** (e.g. *Central Base Kitchen* vs *Bandra Gourmet Outlet*):
    - **Dashboard KPIs**: Revenue, Expenses, Net Profit, and Receivables calculated specifically for that branch.
    - **Profit & Loss Statement**: Shows the individual profit & loss, gross margin, and operating costs of that specific outlet.
    - **Invoices & Bills**: Filtered to transactions incurred by or delivered from that outlet.
- Every invoice and expense includes an **Outlet / Branch selector** to ensure all transactions are attributed to the correct kitchen.

---

### 6. 🏠 Client Address: Optional
- When adding or editing a Client / Customer, the **Delivery Address / Location** field is marked as **(Optional)**. Clients can be saved with or without an address.

---

### 7. 🚨 Supplier Address: Compulsory
- When adding or editing a Supplier / Vendor, the **Registered Supplier Address** field is marked as **Compulsory (*)**.
- Form validation ensures a supplier cannot be registered without providing their registered address (ensuring food traceability and FSSAI compliance).

---

### 8. 🖼️ Direct Brand Logo Upload
- Under **Settings & Logo**, users can upload their company logo directly from their computer (PNG, JPG, SVG, WebP).
- The uploaded logo automatically appears on:
  - The **Sidebar header**
  - **Printable Invoices**
  - **Official Financial Reports & Statements**
- A **Remove Logo** button allows reverting to default branding at any time.

---

## 🚀 How to Access the Portal

You can open either of the following files directly in your Documents folder:

### 1. Standalone Portal (Single File)
Double-click:
```
C:\Users\fathi\OneDrive\Documents\FoodCoWorld_Accounting_Portal.html
```

### 2. Modular App Folder
Double-click:
```
C:\Users\fathi\OneDrive\Documents\FoodCoWorld-Accounting\index.html
```


## Clean Starter Data

This distribution contains no demo customers, suppliers, products, outlets, invoices, expenses, journal entries, or opening account balances. Add your own business data from the Master, Sales, Expenses, Banking, and Settings sections.

All changes are saved automatically in the browser. Use the Backup/Restore feature regularly if the application is used as a local browser-based accounting system.
