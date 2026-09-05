# Figma-Ready Wireframe Structure for Tyre Shop CRM App

## 1. Screen List

### A. Authentication
1. Splash / App Launch
2. Login Screen
3. Forgot Password (optional, v1 lightweight)

### B. Main Navigation
4. Dashboard
5. Inventory List
6. Inventory Detail / Record View
7. Add Inventory Entry
8. Upload Inventory Option Modal
9. Camera / File Upload Capture Screen
10. OCR Review & Edit Screen
11. Manual Inventory Form
12. Reception / Billing Screen
13. New Bill Customer Details
14. Add Item to Bill
15. Bill Preview / Save Confirmation
16. Billing History / Search Results
17. Settings Screen
18. Profile Screen

### C. Secondary / Support
19. Search Results Modal / Bottom Sheet
20. Confirmation Dialogs
21. Empty State Screens
22. Sync Status / Offline State

---

## 2. User Flow Sequence

### Primary Flow: Login to Dashboard
1. User opens the app.
2. The app checks if a valid session exists.
3. If logged in, open Dashboard.
4. If not logged in, show Login screen.
5. User enters email and password.
6. System verifies against the user sheet on Google Drive.
7. On success, redirect to Dashboard.
8. If invalid, show inline validation error and allow retry.

### Secondary Flow: Add Inventory Through Batch Upload
1. User opens Inventory screen.
2. User taps Add Inventory.
3. User selects Upload Batch.
4. User chooses Camera, File Storage, or Manual Upload.
5. If scan selected:
   - camera opens or file picker appears
   - receipt image is captured/uploaded
   - OCR extracts available values
   - user reviews/edit data in form
6. If manual selected:
   - user fills form directly
7. User validates required fields.
8. User taps Save.
9. App writes to inventory sheet in Google Drive.
10. Dashboard refreshes summary values.

### Secondary Flow: Add Inventory Through Single Upload
1. User opens Inventory screen.
2. User taps Add Inventory.
3. User selects Upload Single.
4. User chooses Camera, File Storage, or Manual Upload.
5. User fills/edits item fields.
6. System saves record as Upload Type = Stock.
7. App updates stock and summary list.

### Primary Flow: Create a Bill
1. User opens Reception / Billing screen.
2. User enters customer basic details.
3. User adds tyres/items to bill.
4. System checks inventory quantity availability.
5. User selects item and quantity.
6. System calculates subtotal and GST.
7. User reviews final bill total.
8. User taps Save Bill.
9. App writes billing record and reduces inventory quantity.
10. Dashboard updates totals and sales values.

### Primary Flow: Search Inventory or Billing Records
1. User opens Inventory or Reception screen.
2. User chooses search type:
   - Phone Number
   - Purchase Date
   - Registration Date
3. User enters the value.
4. App filters list from spreadsheet data.
5. User selects a record for detail view or update.

### Secondary Flow: Settings and Profile
1. User opens Settings from bottom nav.
2. User can access profile info and app preferences.
3. User edits details if needed.
4. User logs out from profile/settings.
5. App clears session and returns to Login screen.

---

## 3. Screen-by-Screen Wireframe Details

## Screen 1: Splash / App Launch
Purpose:
- Show brand/logo while app checks login/session state.

UI Elements:
- app logo
- brand name
- loading indicator

Actions:
- auto redirect to Login or Dashboard depending on session

Notes for Figma:
- keep it minimal, full screen, centered layout

---

## Screen 2: Login
Purpose:
- Allow existing shop owner to access the app.

Fields:
- Email address
  - type: text input
  - validation: required, email format
- Password
  - type: password input
  - validation: required, min 6 chars
- Show/Hide password toggle
- Remember me (optional)
- Forgot password (optional v1 placeholder)

Buttons:
- Login
- Continue with Google (not required for v1; keep hidden or removed)

Validation Rules:
- disable Login button until fields are valid
- show inline error under wrong email/password

Layout:
- centered card or full-height form
- brand/logo top
- primary CTA in bottom area

---

## Screen 3: Dashboard
Purpose:
- High-level summary view for stock and business activity.

Top Header:
- business name or app title
- profile icon button
- sync indicator

Summary Cards:
- Total Stock Quantity
- Total Purchase Value
- Total Sales Value
- Discarded Items
- Today’s Bills
- Low Stock Items

Quick Action Buttons:
- Add Inventory
- Upload Batch
- Upload Single
- New Bill

Recent Activity Section:
- latest inventory additions
- latest sales entries
- recent stock changes

Navigation:
- bottom navigation with tabs:
  - Dashboard
  - Inventory
  - Reception
  - Settings

Notes for Figma:
- use 2x2 or 3x2 card grid depending on mobile width
- make KPI cards visually consistent

---

## Screen 4: Inventory List
Purpose:
- Display all inventory records in a searchable and filterable list.

Top Bar:
- page title: Inventory
- Add button (+)
- search icon

Search Area:
- radio buttons or segmented control:
  - Search by Phone Number
  - Search by Purchase Date
  - Search by Registration Date
- text field for input value
- search button

Record Card Fields Per Item:
- tyre image thumbnail
- product name
- category / sub-category
- batch id
- quantity
- selling price
- status chip: In Stock / Low Stock / Sold Out

Action Buttons:
- filter
- sort
- view detail
- edit

List Behavior:
- default list sorted by newest record first
- empty state if no data matches filter

---

## Screen 5: Inventory Detail / Record View
Purpose:
- Show all item metadata for a selected inventory row.

Fields to Display:
- Id
- Name
- Description
- Category
- Sub-Category
- Cost Price
- Selling Price
- Image
- BatchId
- Quantity
- Reg. No.
- Date
- SAP Warranty Number
- Warranty Type
- Serial Number
- GST
- BillNo
- Upload Type

Action Buttons:
- Edit Item
- Delete / Archive (if needed)
- Back

Layout:
- top section with image and basic product info
- detail grid with labels and values
- bottom action buttons

---

## Screen 6: Add Inventory Entry
Purpose:
- Select inventory entry path.

Options:
- Upload Batch
- Upload Single

Secondary Prompt:
- Use Camera
- Use File Storage
- Manual Upload

Layout:
- modal bottom sheet or full-screen choice card
- large icon + text for each option

---

## Screen 7: Camera / File Upload Capture Screen
Purpose:
- Allow user to capture or upload a bill/invoice image.

UI Elements:
- camera preview or uploaded file preview
- capture button
- choose from gallery/file storage
- retake button
- continue button

Flow:
- after capture/upload, redirect to OCR review screen

Validation:
- accept image only
- show error if file unsupported

---

## Screen 8: OCR Review & Edit Screen
Purpose:
- Review and correct extracted values before saving an inventory record.

Fields to Display:
- Name
- Description
- Category
- Sub-Category
- Cost Price
- Selling Price
- Quantity
- BatchId
- Reg. No.
- Date
- SAP Warranty Number
- Warranty Type
- Serial Number
- GST
- BillNo
- Image preview

Actions:
- Edit each field manually
- Save Record
- Discard
- Retake Scan

Validation:
- required fields highlighted
- ability to correct missing/incorrect OCR results

---

## Screen 9: Manual Inventory Form
Purpose:
- Create a new inventory row by manual data entry.

Fields:
- Id (auto generated or manual if needed)
- Name
- Description
- Category
- Sub-Category
- Cost Price
- Selling Price
- Image picker
- BatchId
- Quantity
- Reg. No.
- Date
- SAP Warranty Number
- Warranty Type
- Serial Number
- GST
- BillNo
- Upload Type (Batch or Stock)
- Additional notes (optional)

Buttons:
- Save
- Cancel
- Add Image

Validation Rules:
- required: Name, Category, Quantity, Selling Price, Date
- GST and price should accept numeric values
- quantity should be greater than 0

---

## Screen 10: Reception / Billing Screen
Purpose:
- Create a new sales bill for a customer.

Header:
- New Bill
- customer profile icon
- save button

Customer Section Fields:
- Customer Name
- Customer Phone Number
- Date
- GST Number (if applicable)
- Invoice / Bill Number

Items Section:
- add item button
- item table with columns:
  - product name
  - batch id
  - quantity
  - selling price
  - GST %
  - line total

Subtotal Summary:
- subtotal
- GST amount
- final total

Buttons:
- Add Item
- Save Bill
- Cancel

---

## Screen 11: New Bill Customer Details
Purpose:
- Enter customer-level billing information.

Fields:
- Customer Name
- Phone Number
- GST Number
- Purchase Date
- Bill Number
- Payment Method (optional)
- Notes / Remarks (optional)

Validation:
- phone number required for search tracking
- customer name required

---

## Screen 12: Add Item to Bill
Purpose:
- Select sold tyre and quantity in a customer transaction.

Fields:
- Search item by name or batch id
- Item list from inventory
- Quantity selector
- Selling Price display
- Available Stock indicator
- GST % field
- Total in line item

Validation Rules:
- quantity cannot exceed available stock
- if stock unavailable, show warning and disable add

---

## Screen 13: Bill Preview / Save Confirmation
Purpose:
- Final review before record is saved.

UI Elements:
- customer summary
- itemized list
- subtotal
- GST breakdown
- final total
- save bill button
- edit bill button

Confirmation State:
- success toast after saving
- redirect to billing history or receipt summary

---

## Screen 14: Billing History / Search Results
Purpose:
- View all prior bills or search results.

Fields in List Card:
- Bill Number
- Customer Name
- Phone Number
- Date
- Number of Items
- Total Amount
- Payment state

Search Options:
- Phone Number
- Purchase Date
- Registration Date

Actions:
- Open bill detail
- Reprint or view summary

---

## Screen 15: Settings
Purpose:
- System preferences and app-level settings.

Options:
- Sync with Google Drive
- Auto sync on app open
- Storage permissions
- App theme / dark mode (optional)
- Notification preferences
- About app / version
- Logout

Layout:
- list of toggle settings and informational rows

---

## Screen 16: Profile
Purpose:
- Show user account details and edit them.

Fields:
- Full Name
- Email
- Phone Number
- Business Name
- Profile Image

Action Buttons:
- Edit Profile
- Save Changes
- Logout

---

## Screen 17: Search Results Bottom Sheet
Purpose:
- Provide quick filtered lookup without leaving the page.

UI Elements:
- list of matching records
- result card with key metadata
- select action

Use Cases:
- search customer by phone number
- search stock by date
- search item by batch id

---

## Screen 18: Empty State Screens
Purpose:
- Handle no-data conditions gracefully.

Examples:
- no inventory records
- no bills found
- no stock available
- sync failed

UI Components:
- icon
- message text
- CTA like Add Inventory or Create Bill

---

## 4. Recommended Navigation Structure

### Bottom Navigation
- Dashboard
- Inventory
- Reception
- Settings

### Inventory Subflow
- Inventory List
- Add Inventory
- Manual Form or Scan Review
- Inventory Detail

### Reception Subflow
- Reception Screen
- Customer Details
- Add Item
- Bill Preview
- Save Success

### Account Subflow
- Login
- Profile
- Settings
- Logout

---

## 5. Field-Level Validation Matrix

### Common Validation Rules
- all required text fields must have label and error text
- numeric fields must use decimal and currency formatting
- date fields should use consistent MM/DD/YYYY or DD/MM/YYYY pattern
- quantity cannot be negative
- selling price cannot be zero or negative
- phone number must match Indian mobile format as a reasonable default

### Inventory Form Validation
- Name: required
- Category: required
- Quantity: required > 0
- Selling Price: required > 0
- Cost Price: required > 0
- GST: optional or required depending on local tax rules
- Date: required

### Billing Validation
- customer name: required
- phone number: required
- item quantity: required and <= available stock
- GST calculation: auto computed
- total amount: auto computed from line items

---

## 6. Figma Notes for UI Construction

### Design System Recommendations
- primary color: deep blue / dark navy for app branding
- accent color: orange or green for sales and stock status
- neutral background: off-white or light gray
- success color: green for stock available and saved status
- warning color: amber for low stock or validation warnings
- danger color: red for discard or invalid input

### Cards and Components
- rounded cards with 12-16px radii
- tabs with segmented control styling
- search bar with icon on left
- chips for status tags
- input fields with floating labels or labeled fields
- bottom action sheet for upload methods

### Mobile-first Layout Guidance
- single-column form layout for small screens
- summary cards in 2-column grid when space allows
- avoid dense tables on mobile; use card lists with expandable details

---

## 7. Suggested Screen Order for Figma Pages
1. Login
2. Dashboard
3. Inventory List
4. Add Inventory Action Sheet
5. Manual Inventory Form
6. Scan Capture
7. OCR Review
8. Inventory Detail
9. Reception / Billing Screen
10. Customer Details
11. Add Item to Bill
12. Bill Preview
13. Billing History
14. Settings
15. Profile

This order provides a clean implementation sequence for Figma designers and developers.
