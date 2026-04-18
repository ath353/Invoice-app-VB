import { useState } from 'react'
import { useInvoiceStore } from '../../store/invoiceStore'
import { getSafeErrorMessage } from '../../common/utils/errorHandler'
import { exportPDF } from './pdf.service'
import { exportWord } from './word.service'
import { exportExcel } from './excel.service'

export default function ExportButtons() {
  const invoice = useInvoiceStore(state => state.invoice)
  const getSummary = useInvoiceStore(state => state.getSummary)
  const summary = getSummary()

  const [loading, setLoading] = useState({ pdf: false, word: false, excel: false })
  const [error, setError] = useState('')

  async function handleExportPDF() {
    setError('')
    setLoading(prev => ({ ...prev, pdf: true }))
    try {
      await exportPDF()
    } catch (err) {
      setError(getSafeErrorMessage(err))
    } finally {
      setLoading(prev => ({ ...prev, pdf: false }))
    }
  }

  async function handleExportWord() {
    setError('')
    setLoading(prev => ({ ...prev, word: true }))
    try {
      await exportWord(invoice, summary)
    } catch (err) {
      setError(getSafeErrorMessage(err))
    } finally {
      setLoading(prev => ({ ...prev, word: false }))
    }
  }

  async function handleExportExcel() {
    setError('')
    setLoading(prev => ({ ...prev, excel: true }))
    try {
      await exportExcel(invoice, summary)
    } catch (err) {
      setError(getSafeErrorMessage(err))
    } finally {
      setLoading(prev => ({ ...prev, excel: false }))
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-2">
        <button
          onClick={handleExportPDF}
          disabled={loading.pdf}
          className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading.pdf ? 'Đang xuất...' : 'Xuất PDF'}
        </button>
        <button
          onClick={handleExportWord}
          disabled={loading.word}
          className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {loading.word ? 'Đang xuất...' : 'Xuất Word'}
        </button>
        <button
          onClick={handleExportExcel}
          disabled={loading.excel}
          className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {loading.excel ? 'Đang xuất...' : 'Xuất Excel'}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500 transition-colors duration-150">{error}</p>
      )}
    </div>
  )
}
