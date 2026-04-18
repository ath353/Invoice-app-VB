import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { APP_CONFIG } from '../../constants/appConfig'

export async function exportPDF() {
  const element = document.getElementById('invoice-preview')
  if (!element) throw new Error('Không tìm thấy preview')

  const canvas = await html2canvas(element, { scale: 2, useCORS: true })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

  const today = new Date()
  const dateStr = `${String(today.getDate()).padStart(2,'0')}${String(today.getMonth()+1).padStart(2,'0')}${today.getFullYear()}`
  pdf.save(`${APP_CONFIG.export.filename}-${dateStr}.pdf`)
}
