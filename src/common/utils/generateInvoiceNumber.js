
import { APP_CONFIG } from "../../constants/appConfig";

export const generateInvoiceNumber = (prefix = APP_CONFIG.invoice.numberPrefix) => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random4 = Math.floor(Math.random() * 9000 + 1000);

  return `${prefix}-${yyyy}${mm}${dd}-${random4}`;
};
