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
    defaultTemplate: "TemplateA",
    numberRandomMin: 1000,
    numberRandomMax: 9999,
  },
  labels: {
    appWatermark: "InvoiceVN.app",
    invoiceTitle: "HÓA ĐƠN",
    sellerTitle: "THÔNG TIN NGƯỜI BÁN",
    buyerTitle: "THÔNG TIN NGƯỜI MUA",
    defaultSheetName: "Hoa don",
  },
  export: {
    filename: "hoa-don-invoicevn",
    watermark: "InvoiceVN.app",
  },
  limits: {
    maxNoteLength: 500,
    maxNameLength: 200,
    maxAddressLength: 300,
    maxDescriptionLength: 200,
  },
  ui: {
    debounceMs: 300,
    toastDurationMs: 3000,
  },
};
