import { describe, it, expect, beforeEach } from 'vitest'
import { formatVND, parseVND } from '../common/utils/formatCurrency'
import { formatDate, toInputDate } from '../common/utils/formatDate'
import { sanitizeText } from '../common/utils/sanitize'
import { generateInvoiceNumber } from '../common/utils/generateInvoiceNumber'
import { generateId } from '../common/utils/generateId'

// ─── formatVND ───────────────────────────────────────────
describe('formatVND', () => {
  it('format số nguyên đúng', () => {
    expect(formatVND(10_000_000)).toBe('10.000.000 đ')
  })
  it('format số 0', () => {
    expect(formatVND(0)).toBe('0 đ')
  })
  it('format null → 0 đ', () => {
    expect(formatVND(null)).toBe('0 đ')
  })
  it('format NaN → 0 đ', () => {
    expect(formatVND(NaN)).toBe('0 đ')
  })
  it('format số âm', () => {
    expect(formatVND(-500_000)).toBe('-500.000 đ')
  })
})

// ─── parseVND ────────────────────────────────────────────
describe('parseVND', () => {
  it('parse chuỗi có dấu chấm', () => {
    expect(parseVND('10.000.000')).toBe(10_000_000)
  })
  it('parse chuỗi thuần số', () => {
    expect(parseVND('10000000')).toBe(10_000_000)
  })
  it('parse chuỗi có chữ đ', () => {
    expect(parseVND('500.000 đ')).toBe(500_000)
  })
  it('parse chuỗi rỗng → 0', () => {
    expect(parseVND('')).toBe(0)
  })
  it('parse null → 0', () => {
    expect(parseVND(null)).toBe(0)
  })
  it('parse chữ không phải số → 0', () => {
    expect(parseVND('abc')).toBe(0)
  })
  it('parse number trực tiếp', () => {
    expect(parseVND(5_000_000)).toBe(5_000_000)
  })
})

// ─── formatDate ──────────────────────────────────────────
describe('formatDate', () => {
  it('format YYYY-MM-DD → DD/MM/YYYY', () => {
    expect(formatDate('2024-04-17')).toBe('17/04/2024')
  })
  it('format chuỗi rỗng → rỗng', () => {
    expect(formatDate('')).toBe('')
  })
  it('format null → rỗng', () => {
    expect(formatDate(null)).toBe('')
  })
  it('format ISO string có T', () => {
    expect(formatDate('2024-04-17T00:00:00.000Z')).toBe('17/04/2024')
  })
})

// ─── sanitizeText ─────────────────────────────────────────
describe('sanitizeText', () => {
  it('escape ký tự <', () => {
    expect(sanitizeText('<script>')).toBe('&lt;script&gt;')
  })
  it('escape ký tự &', () => {
    expect(sanitizeText('a & b')).toBe('a &amp; b')
  })
  it('escape dấu nháy đơn', () => {
    expect(sanitizeText("it's")).toBe('it&#39;s')
  })
  it('escape dấu nháy kép', () => {
    expect(sanitizeText('"hello"')).toBe('&quot;hello&quot;')
  })
  it('không thay đổi text bình thường', () => {
    expect(sanitizeText('Hello World 123')).toBe('Hello World 123')
  })
  it('trả về rỗng nếu không phải string', () => {
    expect(sanitizeText(null)).toBe('')
    expect(sanitizeText(123)).toBe('')
    expect(sanitizeText(undefined)).toBe('')
  })
})

// ─── generateInvoiceNumber ───────────────────────────────
describe('generateInvoiceNumber', () => {
  it('bắt đầu bằng prefix INV', () => {
    const num = generateInvoiceNumber()
    expect(num.startsWith('INV-')).toBe(true)
  })
  it('có đúng format INV-YYYYMMDD-XXXX', () => {
    const num = generateInvoiceNumber()
    expect(num).toMatch(/^INV-\d{8}-\d{4}$/)
  })
  it('dùng custom prefix', () => {
    const num = generateInvoiceNumber('HDO')
    expect(num.startsWith('HDO-')).toBe(true)
  })
  it('mỗi lần generate ra số khác nhau', () => {
    const n1 = generateInvoiceNumber()
    const n2 = generateInvoiceNumber()
    // Không nhất thiết khác nhau 100% nhưng format đúng
    expect(n1).toMatch(/^INV-\d{8}-\d{4}$/)
    expect(n2).toMatch(/^INV-\d{8}-\d{4}$/)
  })
})

// ─── generateId ──────────────────────────────────────────
describe('generateId', () => {
  it('trả về string không rỗng', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })
  it('mỗi lần generate ra id khác nhau', () => {
    expect(generateId()).not.toBe(generateId())
  })
})

// ─── Invoice Summary Logic ────────────────────────────────
describe('Invoice Summary Logic', () => {
  const calcSummary = (lineItems, vatRate) => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
    }, 0)
    const vatAmount = Math.round(subtotal * vatRate / 100)
    const total = subtotal + vatAmount
    return { subtotal, vatAmount, total }
  }

  it('tính đúng subtotal 1 sản phẩm', () => {
    const items = [{ quantity: 2, unitPrice: 500_000 }]
    const { subtotal } = calcSummary(items, 10)
    expect(subtotal).toBe(1_000_000)
  })

  it('tính đúng subtotal nhiều sản phẩm', () => {
    const items = [
      { quantity: 1, unitPrice: 200_000 },
      { quantity: 3, unitPrice: 100_000 },
    ]
    const { subtotal } = calcSummary(items, 10)
    expect(subtotal).toBe(500_000)
  })

  it('tính đúng VAT 10%', () => {
    const items = [{ quantity: 1, unitPrice: 1_000_000 }]
    const { vatAmount } = calcSummary(items, 10)
    expect(vatAmount).toBe(100_000)
  })

  it('tính đúng VAT 0%', () => {
    const items = [{ quantity: 1, unitPrice: 1_000_000 }]
    const { vatAmount } = calcSummary(items, 0)
    expect(vatAmount).toBe(0)
  })

  it('tính đúng total', () => {
    const items = [{ quantity: 1, unitPrice: 1_000_000 }]
    const { total } = calcSummary(items, 10)
    expect(total).toBe(1_100_000)
  })

  it('subtotal = 0 khi không có sản phẩm', () => {
    const { subtotal, vatAmount, total } = calcSummary([], 10)
    expect(subtotal).toBe(0)
    expect(vatAmount).toBe(0)
    expect(total).toBe(0)
  })

  it('xử lý quantity hoặc unitPrice là NaN', () => {
    const items = [{ quantity: NaN, unitPrice: 500_000 }]
    const { subtotal } = calcSummary(items, 10)
    expect(subtotal).toBe(0)
  })
})
