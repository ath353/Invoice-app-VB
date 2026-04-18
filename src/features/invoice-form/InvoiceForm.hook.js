
import { useInvoiceStore } from "../../store/invoiceStore";

export const useInvoiceForm = () => {
  const invoice = useInvoiceStore((state) => state.invoice);
  const getSummary = useInvoiceStore((state) => state.getSummary);
  const summary = getSummary();

  const updateSeller = useInvoiceStore((state) => state.updateSeller);
  const updateBuyer = useInvoiceStore((state) => state.updateBuyer);
  const addLineItem = useInvoiceStore((state) => state.addLineItem);
  const updateLineItem = useInvoiceStore((state) => state.updateLineItem);
  const removeLineItem = useInvoiceStore((state) => state.removeLineItem);
  const updateInvoiceMeta = useInvoiceStore((state) => state.updateInvoiceMeta);
  const resetInvoice = useInvoiceStore((state) => state.resetInvoice);

  return {
    invoice,
    summary,
    updateSeller,
    updateBuyer,
    addLineItem,
    updateLineItem,
    removeLineItem,
    updateInvoiceMeta,
    resetInvoice,
  };
};

export default useInvoiceForm;
