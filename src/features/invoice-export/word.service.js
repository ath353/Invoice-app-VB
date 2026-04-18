import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx'
import { APP_CONFIG } from '../../constants/appConfig'
import { formatVND } from '../../common/utils/formatCurrency'
import { formatDate } from '../../common/utils/dateHelper'

export async function exportWord(invoice, summary) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: APP_CONFIG.labels.invoiceTitle, heading: 'Heading1', alignment: AlignmentType.CENTER }),
        new Paragraph({ text: `Số hóa đơn: ${invoice.invoiceNumber}` }),
        new Paragraph({ text: `Ngày xuất: ${formatDate(invoice.issueDate)}` }),
        new Paragraph({ text: `Hạn TT: ${formatDate(invoice.dueDate)}` }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: APP_CONFIG.labels.sellerTitle, heading: 'Heading2' }),
        new Paragraph({ text: `Tên: ${invoice.seller?.name || '-'}` }),
        new Paragraph({ text: `Địa chỉ: ${invoice.seller?.address || '-'}` }),
        new Paragraph({ text: `SĐT: ${invoice.seller?.phone || '-'}` }),
        new Paragraph({ text: `Email: ${invoice.seller?.email || '-'}` }),
        new Paragraph({ text: `MST: ${invoice.seller?.taxId || '-'}` }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: APP_CONFIG.labels.buyerTitle, heading: 'Heading2' }),
        new Paragraph({ text: `Tên: ${invoice.buyer?.name || '-'}` }),
        new Paragraph({ text: `Địa chỉ: ${invoice.buyer?.address || '-'}` }),
        new Paragraph({ text: `SĐT: ${invoice.buyer?.phone || '-'}` }),
        new Paragraph({ text: `Email: ${invoice.buyer?.email || '-'}` }),
        new Paragraph({ text: `MST: ${invoice.buyer?.taxId || '-'}` }),
        new Paragraph({ text: '' }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: ['STT','Mô tả','Số lượng','Đơn giá','Thành tiền'].map(text =>
                new TableCell({ children: [new Paragraph({ text, alignment: AlignmentType.CENTER })] })
              )
            }),
            ...invoice.lineItems.map((item, index) =>
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: String(index + 1) })] }),
                  new TableCell({ children: [new Paragraph({ text: item.description || '' })] }),
                  new TableCell({ children: [new Paragraph({ text: String(item.quantity) })] }),
                  new TableCell({ children: [new Paragraph({ text: formatVND(item.unitPrice) })] }),
                  new TableCell({ children: [new Paragraph({ text: formatVND(item.quantity * item.unitPrice) })] }),
                ]
              })
            )
          ]
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: `Tổng tiền hàng: ${formatVND(summary.subtotal)}` }),
        new Paragraph({ text: `VAT (${invoice.vatRate}%): ${formatVND(summary.vatAmount)}` }),
        new Paragraph({ text: `Tổng cộng: ${formatVND(summary.total)}`, bold: true }),
        ...(invoice.note ? [new Paragraph({ text: '' }), new Paragraph({ text: `Ghi chú: ${invoice.note}` })] : []),
        new Paragraph({ text: '' }),
        new Paragraph({ text: APP_CONFIG.labels.appWatermark, alignment: AlignmentType.CENTER }),
      ]
    }]
  })

  const blob = await Packer.toBlob(doc)
  const today = new Date()
  const dateStr = `${String(today.getDate()).padStart(2,'0')}${String(today.getMonth()+1).padStart(2,'0')}${today.getFullYear()}`
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${APP_CONFIG.export.filename}-${dateStr}.docx`
  a.click()
  URL.revokeObjectURL(url)
}
