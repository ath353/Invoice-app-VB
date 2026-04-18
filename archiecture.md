# ARCHITECTURE.md — Invoice Generator

> Tool tạo hóa đơn/invoice chuyên nghiệp, không cần đăng ký.  
> Toàn bộ logic chạy client-side, không có backend, không lưu dữ liệu.  
> Cập nhật lần cuối: 2024

---

## 1. Tổng quan dự án

**Định nghĩa:** Invoice Generator là tool tạo hóa đơn miễn phí dành cho freelancer và shop online Việt Nam — điền thông tin, preview realtime, xuất PDF/Word/Excel ngay. Không cần đăng ký tài khoản.

**Vấn đề giải quyết:**

- Freelancer và shop online VN tốn thời gian tạo hóa đơn thủ công bằng Word
- Các phần mềm kế toán quá nặng, quá đắt cho SME nhỏ
- Không có tool tiếng Việt đơn giản, đẹp, dùng ngay

**Target user:**

- Freelancer gửi invoice cho khách hàng
- Shop online xuất hóa đơn bán hàng
- SME nhỏ không có phần mềm kế toán

**Core value proposition:**

- Tạo invoice đẹp trong 2 phút
- Không đăng ký, không cài đặt, dùng ngay
- Export PDF / Word / Excel chuẩn

---

## 2. Triết lý thiết kế

```
Đơn giản > Thông minh
Rõ ràng  > Ngắn gọn
Hoạt động > Hoàn hảo
```

- Mỗi file chỉ làm **1 việc duy nhất**
- Đặt tên file/function đủ để hiểu không cần đọc code bên trong
- Không tối ưu sớm — làm chạy được trước, tối ưu sau khi có user thật
- Không thêm abstraction cho đến khi cần dùng lần thứ 3

---

## 3. Tech Stack

| Layer        | Technology          | Lý do                                  |
| ------------ | ------------------- | -------------------------------------- |
| Frontend     | React 18 + Vite     | Nhanh, nhẹ, HMR tốt                    |
| Styling      | TailwindCSS         | Responsive nhanh, không viết CSS riêng |
| State        | Zustand             | Nhẹ, đơn giản, không boilerplate       |
| Export PDF   | jsPDF + html2canvas | Render đúng template HTML → PDF        |
| Export Word  | docx.js             | Tạo .docx chuẩn, không cần server      |
| Export Excel | SheetJS (xlsx)      | Tạo .xlsx chuẩn                        |
| Deploy       | Vercel              | Free, auto deploy từ GitHub            |

> **Không có backend** — toàn bộ tính toán và export chạy trên trình duyệt.  
> **Không có database** — không lưu dữ liệu người dùng.

---

## 4. Cấu trúc thư mục

```
invoice-generator/
├── src/
│   ├── features/                          # Nhóm theo tính năng
│   │   ├── invoice-form/
│   │   │   ├── InvoiceForm.jsx            # Form nhập thông tin chính
│   │   │   ├── InvoiceForm.hook.js        # State + validation logic
│   │   │   ├── InvoiceForm.util.js        # Pure helpers cho form
│   │   │   ├── SellerSection.jsx          # Phần thông tin người bán
│   │   │   ├── BuyerSection.jsx           # Phần thông tin người mua
│   │   │   ├── LineItemRow.jsx            # 1 dòng sản phẩm/dịch vụ
│   │   │   └── LineItemTable.jsx          # Bảng danh sách sản phẩm
│   │   ├── invoice-preview/
│   │   │   ├── InvoicePreview.jsx         # Container preview realtime
│   │   │   ├── TemplateA.jsx              # Template mặc định (bản free)
│   │   │   └── TemplateB.jsx              # Template Pro
│   │   └── invoice-export/
│   │       ├── ExportButtons.jsx          # Nút export PDF/Word/Excel
│   │       ├── pdf.service.js             # Export PDF dùng html2canvas + jsPDF
│   │       ├── word.service.js            # Export Word dùng docx.js
│   │       └── excel.service.js           # Export Excel dùng SheetJS
│   │
│   ├── common/
│   │   ├── components/                    # UI tái sử dụng
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Textarea.jsx
│   │   │   └── Divider.jsx
│   │   ├── hooks/
│   │   │   ├── useDarkMode.js             # Toggle dark/light mode
│   │   │   └── useDebounce.js             # Debounce input
│   │   └── utils/
│   │       ├── formatCurrency.js          # Format VND / USD
│   │       ├── formatDate.js              # Format ngày DD/MM/YYYY
│   │       ├── generateId.js              # Tạo UUID cho lineItem
│   │       ├── generateInvoiceNumber.js   # Tạo số invoice tự động
│   │       └── sanitize.js               # Sanitize input tránh XSS
│   │
│   ├── constants/
│   │   └── appConfig.js                   # Toàn bộ hằng số — không hardcode ở nơi khác
│   │
│   ├── store/
│   │   └── invoiceStore.js                # Zustand store — state toàn app
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│   └── favicon.png
│
├── vercel.json                            # Security headers + config deploy
├── .env.example                           # Không có secret, để trống
├── ARCHITECTURE.md                        # File này
├── PROMPT_GUIDE.md                        # Bộ prompt chuẩn
└── README.md
```

---

## 5. Nguyên tắc đặt tên

| Loại        | Convention                     | Ví dụ               |
| ----------- | ------------------------------ | ------------------- |
| Component   | PascalCase                     | `InvoiceForm.jsx`   |
| Hook        | camelCase, bắt đầu `use`       | `useInvoiceForm.js` |
| Service     | camelCase, kết thúc `.service` | `pdf.service.js`    |
| Util/Helper | camelCase                      | `formatCurrency.js` |
| Constant    | SCREAMING_SNAKE                | `MAX_LINE_ITEMS`    |
| Store       | camelCase, kết thúc `Store`    | `invoiceStore.js`   |

---

## 6. Core Features (MVP)

**Must-have:**

- Thông tin người bán: tên, địa chỉ, SĐT, email, MST
- Thông tin người mua: tên, địa chỉ, SĐT, email
- Danh sách sản phẩm/dịch vụ: tên, số lượng, đơn giá, thành tiền
- Thêm/xóa dòng sản phẩm linh hoạt (tối đa 50 dòng)
- Tính tổng tiền tự động: subtotal, VAT, tổng cộng
- Số invoice tự động + chỉnh sửa được
- Ngày xuất invoice + hạn thanh toán
- Chọn VAT: 0% / 5% / 8% / 10%
- Ghi chú cuối invoice
- Preview realtime bên phải form
- Export PDF / Word / Excel
- Watermark nhỏ "InvoiceVN.app" bản free
- Dark mode
- Responsive mobile-first

**Won't do (v1):**

- Lưu lịch sử invoice
- Tài khoản người dùng
- Gửi invoice qua email
- Template marketplace
- Chữ ký số
- QR thanh toán MoMo/VNPay
- Multi-currency (chỉ VND trong MVP)

---

## 7. Domain Entities

**Invoice** — tài liệu hóa đơn hoàn chỉnh

```
├── id                UUID       — tạo client-side
├── invoiceNumber     string     — "INV-20240414-001" (tự động + chỉnh được)
├── issueDate         string     — ngày xuất DD/MM/YYYY
├── dueDate           string     — hạn thanh toán (tuỳ chọn)
├── seller            Seller     — thông tin người bán
├── buyer             Buyer      — thông tin người mua
├── lineItems         LineItem[] — danh sách sản phẩm
├── vatRate           number     — % thuế (0 | 5 | 8 | 10)
├── note              string     — ghi chú cuối
├── currency          'VND'      — MVP chỉ VND
└── template          'A' | 'B'  — template đang dùng
```

**Seller / Buyer** — thông tin bên mua/bán

```
├── name              string     — tên cá nhân/công ty
├── address           string     — địa chỉ
├── phone             string     — số điện thoại
├── email             string     — email
└── taxId             string     — mã số thuế (tuỳ chọn)
```

**LineItem** — 1 dòng sản phẩm/dịch vụ

```
├── id                UUID       — tạo client-side
├── description       string     — tên sản phẩm/dịch vụ
├── quantity          number     — số lượng (cho phép thập phân)
├── unitPrice         number     — đơn giá
└── amount            number     — tính tự động: quantity × unitPrice
```

**InvoiceSummary** — tổng kết tài chính

```
├── subtotal          number     — tổng trước thuế
├── vatAmount         number     — tiền thuế VAT
└── total             number     — tổng cộng thanh toán
```

---

## 8. Luồng dữ liệu

```
[1] User điền form
    InvoiceForm.jsx
    → InvoiceForm.hook.js (validate + update state)
    → invoiceStore.js (Zustand — lưu toàn bộ invoice)
         ↓
[2] Preview realtime (tự động re-render khi store thay đổi)
    InvoicePreview.jsx
    → TemplateA.jsx / TemplateB.jsx
         ↓
[3] Export (khi user nhấn nút)
    ExportButtons.jsx
    → pdf.service.js    → html2canvas chụp preview → jsPDF → download .pdf
    → word.service.js   → docx.js tạo document → download .docx
    → excel.service.js  → SheetJS tạo workbook → download .xlsx
```

---

## 9. Logic tính toán

> **Quy tắc cứng:** Mọi hằng số (VAT rates, limits...) phải nằm trong `constants/appConfig.js`.  
> Không hardcode ở bất kỳ file nào khác.

```javascript
// Tính tự động, realtime khi user gõ
lineItem.amount = Math.round(quantity × unitPrice)

subtotal  = lineItems.reduce((sum, item) => sum + item.amount, 0)
vatAmount = Math.round(subtotal × (vatRate / 100))
total     = subtotal + vatAmount

// Số invoice tự động
// Format: INV-YYYYMMDD-XXX
generateInvoiceNumber() → "INV-20240414-001"

// Format tiền VND
formatVND(10_000_000) → "10.000.000 đ"
formatVND(0)          → "0 đ"

// Format ngày
formatDate(new Date()) → "14/04/2024"
```

---

## 10. Constants — appConfig.js

```javascript
// constants/appConfig.js
export const APP_CONFIG = {
  name: "InvoiceVN",
  version: "1.0.0",
  storageKey: "invoicevn-theme",

  invoice: {
    maxLineItems: 50,
    defaultVatRate: 10,
    vatRates: [0, 5, 8, 10],
    currency: "VND",
    numberPrefix: "INV",
  },

  export: {
    filename: "hoa-don-invoicevn", // tên file khi download
    watermark: "InvoiceVN.app", // watermark bản free
  },

  limits: {
    maxNoteLength: 500,
    maxNameLength: 200,
    maxAddressLength: 300,
    maxDescriptionLength: 200,
  },
};
```

---

## 11. Zustand Store

```javascript
// store/invoiceStore.js
{
  // State
  invoice: Invoice,          // toàn bộ data invoice
  isDirty: boolean,          // đã thay đổi chưa

  // Actions
  updateSeller(fields),      // cập nhật thông tin người bán
  updateBuyer(fields),       // cập nhật thông tin người mua
  addLineItem(),             // thêm dòng sản phẩm mới
  updateLineItem(id, fields),// cập nhật 1 dòng sản phẩm
  removeLineItem(id),        // xóa 1 dòng sản phẩm
  updateInvoiceMeta(fields), // cập nhật số hóa đơn, ngày, VAT, ghi chú
  resetInvoice(),            // tạo mới hoàn toàn

  // Computed (selector)
  getSummary(),              // tính subtotal, vatAmount, total
}
```

---

## 12. Bảo mật

> Dự án không có backend, không database, không lưu dữ liệu người dùng.  
> Bề mặt tấn công gần như bằng 0.

**Checklist bắt buộc:**

```
□ Không có API key nào trong project
□ Không gửi dữ liệu người dùng lên server bất kỳ
□ Sanitize toàn bộ input trước khi render vào template
□ Không dùng dangerouslySetInnerHTML
□ Giới hạn độ dài input (maxLength theo APP_CONFIG.limits)
□ Validate số lượng và đơn giá: không âm, không NaN
□ Dependencies tối thiểu — ít lib = ít lỗ hổng
```

**vercel.json — Security headers:**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```

---

## 13. Performance

> Không có backend nên khả năng chịu tải phụ thuộc hoàn toàn vào Vercel CDN.

```
□ Lazy load ExportButtons — chỉ load jsPDF/docx/SheetJS khi user click
□ Code splitting theo feature với dynamic import()
□ Debounce 300ms khi user gõ vào form (tránh re-render liên tục)
□ Tính toán tổng tiền dùng useMemo() tránh tính lại không cần thiết
□ html2canvas chỉ chạy khi export PDF, không chạy realtime
□ Bundle size target: main bundle < 200KB gzipped
□ TailwindCSS purge — chỉ giữ class đang dùng
```

---

## 14. Monetize

**MVP — Hoàn toàn miễn phí:**

- Tạo invoice không giới hạn
- Export PDF / Word / Excel
- Watermark nhỏ "InvoiceVN.app" ở góc dưới

**v2 — Trả phí một lần (49.000đ):**

- Export không watermark
- Lưu thông tin người bán (không cần nhập lại)
- Thêm logo công ty trên invoice
- Template Pro (TemplateB)

**Công cụ thu tiền không cần auth:**

```javascript
// Gumroad hoặc LemonSqueezy bán license key
// User nhập key → lưu localStorage → unlock Pro
localStorage.setItem("invoicevn-license", key);
```

---

## 15. Khả năng mở rộng

**v2 — Sau khi có user thật:**

```
□ Lưu thông tin người bán vào localStorage
□ Lịch sử invoice (IndexedDB)
□ Thêm template Pro
□ Logo công ty
□ QR thanh toán MoMo/VNPay
```

**v3 — Khi có doanh thu:**

```
□ Tài khoản người dùng — cloud sync
□ Gửi invoice qua email
□ Multi-currency (USD, EUR)
□ Chữ ký số
□ API cho developer tích hợp
```

**Quy tắc mở rộng:**

```
Thêm feature mới:
□ Tạo folder features/[tên-feature]/ riêng
□ Không sửa store hiện tại — extend thêm actions mới
□ Hằng số mới → thêm vào appConfig.js
□ Cập nhật file ARCHITECTURE.md trước khi code
```

---

## 16. Checklist trước khi ship

**Logic:**

```
□ Test tính tổng đúng với 1, 5, 10 dòng sản phẩm
□ Test VAT 0%, 5%, 8%, 10%
□ Test thêm/xóa dòng sản phẩm
□ Test số lượng thập phân (0.5, 1.5, 2.75)
□ Test đơn giá 0đ
□ Test invoice không có dòng sản phẩm nào
```

**UI/UX:**

```
□ Preview đúng với form (realtime, không delay)
□ Responsive đẹp trên iPhone SE (320px)
□ Dark mode không bị lỗi màu
□ Format số VND đúng (dấu chấm phân cách)
□ Số invoice tự động đúng format INV-YYYYMMDD-XXX
```

**Export:**

```
□ PDF render đúng template, không bị cắt
□ Word mở được trên cả Windows và macOS
□ Excel đúng số liệu, format tiền đúng
□ Watermark hiển thị đúng vị trí
□ Tên file download đúng format
```

**Deploy:**

```
□ npm run build không có lỗi
□ vercel.json security headers đầy đủ
□ Lighthouse score > 90
□ Test trên Chrome, Safari, Firefox
□ Test trên Android và iOS
```
