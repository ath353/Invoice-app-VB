import React from "react";
import LineItemRow from "./LineItemRow";
import { formatVND } from "../../common/utils/formatCurrency";
import { APP_CONFIG } from "../../constants/appConfig";

function LineItemTable({ lineItems, onUpdate, onRemove, onAdd }) {
  const hasItems = lineItems.length > 0;

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-colors duration-150 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">Hàng hóa</h2>

      {!hasItems && (
        <div className="rounded-md border border-dashed border-zinc-200 px-4 py-8 text-center text-sm text-zinc-400 transition-colors duration-150 dark:border-zinc-800 dark:text-zinc-500">
          Chưa có sản phẩm
        </div>
      )}

      {hasItems && (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 transition-colors duration-150 dark:border-zinc-800">
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Mô tả
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Số lượng
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Đơn giá
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Thành tiền
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">
                    {" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <LineItemRow key={item.id} item={item} onUpdate={onUpdate} onRemove={onRemove} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {lineItems.map((item) => {
              const quantity = Number(item.quantity) || 0;
              const unitPrice = Number(item.unitPrice) || 0;
              const amount = quantity * unitPrice;

              return (
                <article
                  key={item.id}
                  className="rounded-md border border-zinc-200 bg-zinc-50 p-3 transition-colors duration-150 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-3">
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Mô tả
                    </label>
                    <input
                      type="text"
                      value={item.description || ""}
                      maxLength={APP_CONFIG.limits.maxDescriptionLength}
                      onChange={(event) => onUpdate(item.id, { description: event.target.value })}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label>
                      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Số lượng
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={item?.quantity === 0 ? "" : item?.quantity}
                        onChange={(event) => {
                          const raw = event.target.value;
                          if (raw === "") {
                            onUpdate(item.id, { quantity: 0 });
                            return;
                          }
                          const num = Number(raw);
                          if (!isNaN(num) && num >= 0) {
                            onUpdate(item.id, { quantity: num });
                          }
                        }}
                        onBlur={(event) => {
                          if (event.target.value === "") {
                            onUpdate(item.id, { quantity: 0 });
                          }
                        }}
                        placeholder="0"
                        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Đơn giá
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={item.unitPrice ?? 0}
                        onChange={(event) =>
                          onUpdate(item.id, { unitPrice: Math.max(0, Number(event.target.value) || 0) })
                        }
                        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </label>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Thành tiền</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatVND(amount)}
                    </span>
                  </div>
                  <div className="mt-3 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors duration-150 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Xóa dòng
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={onAdd}
          className="text-sm font-medium text-emerald-600 transition-colors duration-150 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          ＋ Thêm dòng
        </button>
      </div>
    </section>
  );
}

export default React.memo(LineItemTable);
