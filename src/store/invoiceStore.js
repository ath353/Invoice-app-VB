import { create } from "zustand";
import { APP_CONFIG } from "../constants/appConfig";
import { getTodayInputValue } from "../common/utils/dateHelper";

const createUUID = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createInvoiceNumber = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const randomRange = APP_CONFIG.invoice.numberRandomMax - APP_CONFIG.invoice.numberRandomMin + 1;
  const random = Math.floor(Math.random() * randomRange) + APP_CONFIG.invoice.numberRandomMin;

  return `${APP_CONFIG.invoice.numberPrefix}-${yyyy}${mm}${dd}-${random}`;
};

const createDefaultInvoice = () => {
  return {
    id: createUUID(),
    invoiceNumber: createInvoiceNumber(),
    issueDate: getTodayInputValue(),
    dueDate: "",
    seller: {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
    },
    buyer: {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
    },
    lineItems: [],
    vatRate: APP_CONFIG.invoice.defaultVatRate,
    note: "",
    currency: APP_CONFIG.invoice.currency,
    template: APP_CONFIG.invoice.defaultTemplate,
  };
};

export const useInvoiceStore = create((set, get) => ({
  invoice: createDefaultInvoice(),
  isDirty: false,

  /**
   * Cập nhật thông tin người bán
   * @param {Partial<Seller>} fields
   */
  updateSeller: (fields) =>
    set((state) => ({
      invoice: {
        ...state.invoice,
        seller: { ...state.invoice.seller, ...fields },
      },
      isDirty: true,
    })),

  /**
   * Cập nhật thông tin người mua
   * @param {Partial<Buyer>} fields
   */
  updateBuyer: (fields) =>
    set((state) => ({
      invoice: {
        ...state.invoice,
        buyer: { ...state.invoice.buyer, ...fields },
      },
      isDirty: true,
    })),

  /**
   * Thêm một dòng sản phẩm mới
   */
  addLineItem: () =>
    set((state) => {
      if (state.invoice.lineItems.length >= APP_CONFIG.invoice.maxLineItems) {
        return state;
      }

      return {
        invoice: {
          ...state.invoice,
          lineItems: [
            ...state.invoice.lineItems,
            {
              id: createUUID(),
              description: "",
              quantity: 1,
              unitPrice: 0,
            },
          ],
        },
        isDirty: true,
      };
    }),

  /**
   * Cập nhật một dòng sản phẩm
   * @param {string} id
   * @param {Partial<LineItem>} fields
   */
  updateLineItem: (id, fields) =>
    set((state) => {
      const nextFields = { ...fields };

      if ("quantity" in nextFields) {
        const quantity = Number(nextFields.quantity);
        nextFields.quantity = Number.isNaN(quantity) ? 0 : Math.max(0, quantity);
      }

      if ("unitPrice" in nextFields) {
        const unitPrice = Number(nextFields.unitPrice);
        nextFields.unitPrice = Number.isNaN(unitPrice) ? 0 : Math.max(0, unitPrice);
      }

      return {
        invoice: {
          ...state.invoice,
          lineItems: state.invoice.lineItems.map((item) =>
            item.id === id ? { ...item, ...nextFields } : item
          ),
        },
        isDirty: true,
      };
    }),

  /**
   * Xóa một dòng sản phẩm
   * @param {string} id
   */
  removeLineItem: (id) =>
    set((state) => ({
      invoice: {
        ...state.invoice,
        lineItems: state.invoice.lineItems.filter((item) => item.id !== id),
      },
      isDirty: true,
    })),

  /**
   * Cập nhật metadata hóa đơn
   * @param {Partial<Invoice>} fields
   */
  updateInvoiceMeta: (fields) =>
    set((state) => {
      const nextFields = { ...fields };
      const allowedVatRates = APP_CONFIG.invoice.vatRates;

      if ("vatRate" in nextFields) {
        const vatRate = Number(nextFields.vatRate);
        if (!allowedVatRates.includes(vatRate)) {
          nextFields.vatRate = state.invoice.vatRate;
        } else {
          nextFields.vatRate = vatRate;
        }
      }

      return {
        invoice: {
          ...state.invoice,
          ...nextFields,
        },
        isDirty: true,
      };
    }),

  /**
   * Đặt lại toàn bộ hóa đơn về mặc định
   */
  resetInvoice: () =>
    set({
      invoice: createDefaultInvoice(),
      isDirty: false,
    }),

  /**
   * Tính tổng tiền hóa đơn
   * @returns {{subtotal:number, vatAmount:number, total:number}}
   */
  getSummary: () => {
    const { invoice } = get();

    const subtotal = invoice.lineItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);

    const vatRate = Number(invoice.vatRate) || 0;
    const vatAmount = (subtotal * vatRate) / 100;
    const total = subtotal + vatAmount;

    return { subtotal, vatAmount, total };
  },
}));
