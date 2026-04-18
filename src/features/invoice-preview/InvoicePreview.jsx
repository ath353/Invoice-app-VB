
import { useInvoiceStore } from "../../store/invoiceStore";
import TemplateA from "./TemplateA";

function InvoicePreview() {
  const invoice = useInvoiceStore((state) => state.invoice);
  const getSummary = useInvoiceStore((state) => state.getSummary);
  const summary = getSummary();

  return (
    <div
      id="invoice-preview"
      className="mx-auto max-w-2xl overflow-auto rounded-lg border border-zinc-200 bg-white shadow-sm transition-colors duration-150"
    >
      <TemplateA invoice={invoice} summary={summary} />
    </div>
  );
}

export default InvoicePreview;
