# InvoiceVN

Tool tạo hóa đơn miễn phí dành cho freelancer và shop online Việt Nam — điền thông tin, xem preview realtime, xuất PDF/Word/Excel ngay. **Không cần đăng ký, không cần cài đặt.**

🔗 **Demo:** [invoicevn.vercel.app](https://invoicevn.vercel.app)

---

## Tính năng

- Nhập thông tin người bán & người mua (tên, địa chỉ, MST, SĐT, email)
- Thêm/xóa dòng sản phẩm linh hoạt (tối đa 50 dòng)
- Tính tổng tiền tự động: subtotal, VAT (0% / 5% / 8% / 10%), tổng cộng
- Số hóa đơn tự động theo format `INV-YYYYMMDD-XXXX`
- Preview realtime bên phải form
- Xuất **PDF**, **Word (.docx)**, **Excel (.xlsx)**
- Dark mode
- Responsive, dùng được trên điện thoại

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Frontend | React 18 + Vite |
| Styling | TailwindCSS |
| State | Zustand |
| Export PDF | jsPDF + html2canvas |
| Export Word | docx.js |
| Export Excel | SheetJS |
| Deploy | Vercel |

> Toàn bộ logic chạy **client-side** — không có backend, không lưu dữ liệu người dùng.

## Chạy local

```bash
git clone https://github.com/ath353/Invoice-app-VB.git
cd Invoice-app-VB
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

## Build & Deploy

```bash
npm run build   # build ra thư mục dist/
npm run preview # xem trước bản build
```

Deploy tự động lên Vercel mỗi khi push lên nhánh `main`.

## Cấu trúc thư mục

```
src/
├── features/
│   ├── invoice-form/      # Form nhập thông tin hóa đơn
│   ├── invoice-preview/   # Preview realtime
│   └── invoice-export/    # Xuất PDF / Word / Excel
├── common/
│   ├── components/        # UI components tái sử dụng
│   ├── hooks/             # Custom hooks
│   └── utils/             # Helper functions
├── constants/             # Cấu hình toàn app
└── store/                 # Zustand store
```

## License

MIT
