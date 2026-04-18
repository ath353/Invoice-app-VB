import { lazy, Suspense, useMemo } from "react";
import { APP_CONFIG } from "../../constants/appConfig";
import { sanitizeText } from "../../common/utils/sanitize";
import SellerSection from "./SellerSection";
import BuyerSection from "./BuyerSection";
import LineItemTable from "./LineItemTable";
import useInvoiceForm from "./InvoiceForm.hook";
import InvoicePreview from "../invoice-preview/InvoicePreview";

const ExportButtons = lazy(() => import("../invoice-export/ExportButtons"));

function InvoiceForm() {
  const {
    invoice,
    updateSeller,
    updateBuyer,
    addLineItem,
    updateLineItem,
    removeLineItem,
    updateInvoiceMeta,
    resetInvoice,
  } = useInvoiceForm();

  const formatToDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const parseFromDisplay = (displayStr) => {
    if (!displayStr) return "";
    const parts = displayStr.split("/");
    if (parts.length !== 3) return "";
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const vatRates = useMemo(() => APP_CONFIG.invoice.vatRates, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-4 text-zinc-900 transition-colors duration-150 dark:bg-zinc-950 dark:text-zinc-100 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
          <div className="space-y-6">
            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-colors duration-150 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                  Thông tin hóa đơn
                </h2>
                <button
                  type="button"
                  onClick={resetInvoice}
                  className="text-xs font-medium text-zinc-400 transition-colors duration-150 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                >
                  Đặt lại
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Số hóa đơn
                  </span>
                  <input
                    type="text"
                    value={invoice.invoiceNumber || ""}
                    maxLength={APP_CONFIG.limits.maxNameLength}
                    onChange={(event) =>
                      updateInvoiceMeta({
                        invoiceNumber: sanitizeText(event.target.value).slice(0, APP_CONFIG.limits.maxNameLength),
                      })
                    }
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    VAT (%)
                  </span>
                  <select
                    value={invoice.vatRate}
                    onChange={(event) => updateInvoiceMeta({ vatRate: Number(event.target.value) })}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    {vatRates.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}%
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Ngày xuất
                  </span>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    value={formatToDisplay(invoice.issueDate)}
                    onChange={(e) => {
                      const safeValue = sanitizeText(e.target.value);
                      const raw = safeValue.replace(/[^\d/]/g, "");
                      let formatted = raw;
                      if (raw.length === 2 && !raw.includes("/")) formatted = `${raw}/`;
                      if (raw.length === 5 && raw.split("/").length === 2) formatted = `${raw}/`;

                      const parsed = parseFromDisplay(formatted);
                      if (parsed) updateInvoiceMeta({ issueDate: parsed });
                      else updateInvoiceMeta({ issueDate: formatted });
                    }}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Hạn thanh toán
                  </span>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    value={formatToDisplay(invoice.dueDate)}
                    onChange={(e) => {
                      const safeValue = sanitizeText(e.target.value);
                      const raw = safeValue.replace(/[^\d/]/g, "");
                      let formatted = raw;
                      if (raw.length === 2 && !raw.includes("/")) formatted = `${raw}/`;
                      if (raw.length === 5 && raw.split("/").length === 2) formatted = `${raw}/`;

                      const parsed = parseFromDisplay(formatted);
                      if (parsed) updateInvoiceMeta({ dueDate: parsed });
                      else updateInvoiceMeta({ dueDate: formatted });
                    }}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </label>
              </div>
            </section>

            <SellerSection
              seller={invoice.seller}
              onChange={(field, value) => updateSeller({ [field]: value })}
            />

            <BuyerSection buyer={invoice.buyer} onChange={(field, value) => updateBuyer({ [field]: value })} />

            <LineItemTable
              lineItems={invoice.lineItems}
              onUpdate={updateLineItem}
              onRemove={removeLineItem}
              onAdd={addLineItem}
            />

            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-colors duration-150 dark:border-zinc-800 dark:bg-zinc-900">
              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                  Ghi chú
                </span>
                <textarea
                  rows={4}
                  value={invoice.note || ""}
                  maxLength={APP_CONFIG.limits.maxNoteLength}
                  onChange={(event) => updateInvoiceMeta({ note: sanitizeText(event.target.value) })}
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Thông tin bổ sung cho hóa đơn..."
                />
              </label>
            </section>
          </div>

          <aside className="self-start space-y-4 lg:sticky lg:top-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                Preview
              </h2>
            </div>
            <InvoicePreview />
            <Suspense fallback={null}>
              <ExportButtons />
            </Suspense>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;
