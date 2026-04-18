import { APP_CONFIG } from "../../constants/appConfig";
import { sanitizeText } from "../../common/utils/sanitize";

function SellerSection({ seller, onChange }) {
  const maxNameLength = APP_CONFIG.limits.maxNameLength;
  const maxAddressLength = APP_CONFIG.limits.maxAddressLength;

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-colors duration-150 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-5 text-xs font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
        Thông tin người bán
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Tên người bán / công ty *
          </span>
          <input
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            type="text"
            value={seller?.name || ""}
            maxLength={maxNameLength}
            onChange={(event) => onChange("name", sanitizeText(event.target.value))}
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Địa chỉ
          </span>
          <input
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            type="text"
            value={seller?.address || ""}
            maxLength={maxAddressLength}
            onChange={(event) => onChange("address", sanitizeText(event.target.value))}
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Số điện thoại
          </span>
          <input
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            type="tel"
            value={seller?.phone || ""}
            onChange={(event) => onChange("phone", sanitizeText(event.target.value))}
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Email
          </span>
          <input
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            type="email"
            value={seller?.email || ""}
            onChange={(event) => onChange("email", sanitizeText(event.target.value))}
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Mã số thuế
          </span>
          <input
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            type="text"
            value={seller?.taxId || ""}
            onChange={(event) => onChange("taxId", sanitizeText(event.target.value))}
          />
        </label>
      </div>
    </section>
  );
}

export default SellerSection;
