import * as XLSX from 'xlsx'
import { APP_CONFIG } from '../../constants/appConfig'
import { formatDate } from '../../common/utils/dateHelper'

export function exportExcel(invoice, summary) {
  const rows = [
    [APP_CONFIG.labels.invoiceTitle, ''],
    ['Số hóa đơn', invoice.invoiceNumber],
    ['Ngày xuất', formatDate(invoice.issueDate)],
    ['Hạn TT', formatDate(invoice.dueDate)],
    [''],
    [APP_CONFIG.labels.sellerTitle, ''],
    ['Tên', invoice.seller?.name || '-'],
    ['Địa chỉ', invoice.seller?.address || '-'],
    ['SĐT', invoice.seller?.phone || '-'],
    ['Email', invoice.seller?.email || '-'],
    ['MST', invoice.seller?.taxId || '-'],
    [''],
    [APP_CONFIG.labels.buyerTitle, ''],
    ['Tên', invoice.buyer?.name || '-'],
    ['Địa chỉ', invoice.buyer?.address || '-'],
    ['SĐT', invoice.buyer?.phone || '-'],
    ['Email', invoice.buyer?.email || '-'],
    ['MST', invoice.buyer?.taxId || '-'],
    [''],
    ['STT', 'Mô tả', 'Số lượng', 'Đơn giá', 'Thành tiền'],
    ...invoice.lineItems.map((item, i) => [
      i + 1,
      item.description,
      item.quantity,
      item.unitPrice,
      item.quantity * item.unitPrice
    ]),
    [''],
    ['Tổng tiền hàng', summary.subtotal],
    [`VAT (${invoice.vatRate}%)`, summary.vatAmount],
    ['Tổng cộng', summary.total],
    ...(invoice.note ? [[''], ['Ghi chú', invoice.note]] : []),
    [''],
    [APP_CONFIG.labels.appWatermark, ''],
  ]

  const ws = XLSX.utils.aoa_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, APP_CONFIG.labels.defaultSheetName)

  const today = new Date()
  const dateStr = `${String(today.getDate()).padStart(2,'0')}${String(today.getMonth()+1).padStart(2,'0')}${today.getFullYear()}`
  XLSX.writeFile(wb, `${APP_CONFIG.export.filename}-${dateStr}.xlsx`)
}
