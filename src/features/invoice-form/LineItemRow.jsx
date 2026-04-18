import React, { useEffect, useState } from "react";
import { formatVND, parseVND } from "../../common/utils/formatCurrency";
import { APP_CONFIG } from "../../constants/appConfig";

function LineItemRow({ item, onUpdate, onRemove }) {
  const [unitPriceInput, setUnitPriceInput] = useState(
    item?.unitPrice === 0 ? "" : formatVND(item?.unitPrice)
  );

  useEffect(() => {
    if (item?.unitPrice === 0) {
      setUnitPriceInput("");
    } else {
      setUnitPriceInput(formatVND(item?.unitPrice));
    }
  }, [item?.unitPrice]);

  const quantity = Number(item?.quantity) || 0;
  const unitPrice = Number(item?.unitPrice) || 0;
  const amount = quantity * unitPrice;

  return (
    <tr className="border-t border-zinc-100 transition-colors duration-150 dark:border-zinc-800">
      <td className="px-3 py-2 align-top">
        <input
          type="text"
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:bg-white focus:ring-0 dark:border-zinc-700 dark:text-zinc-100 dark:focus:bg-zinc-800"
          value={item?.description || ""}
          maxLength={APP_CONFIG.limits.maxDescriptionLength}
          onChange={(event) => onUpdate(item.id, { description: event.target.value })}
          placeholder="Mô tả sản phẩm/dịch vụ"
        />
      </td>
      <td className="px-3 py-2 align-top">
        <input
          type="number"
          min={0}
          className="w-24 rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:bg-white focus:ring-0 dark:border-zinc-700 dark:text-zinc-100 dark:focus:bg-zinc-800"
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
        />
      </td>
      <td className="px-3 py-2 align-top">
        <input
          type="text"
          className="w-36 rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-right text-sm text-zinc-900 outline-none transition-colors duration-150 focus:border-emerald-500 focus:bg-white focus:ring-0 dark:border-zinc-700 dark:text-zinc-100 dark:focus:bg-zinc-800"
          value={unitPriceInput}
          onChange={(event) => setUnitPriceInput(event.target.value)}
          onBlur={() => {
            const value = parseVND(unitPriceInput);
            onUpdate(item.id, { unitPrice: value });
            if (value === 0) {
              setUnitPriceInput("");
            } else {
              setUnitPriceInput(formatVND(value));
            }
          }}
        />
      </td>
      <td className="px-3 py-2 align-top text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {formatVND(amount)}
      </td>
      <td className="px-3 py-2 align-top text-right">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          onClick={() => onRemove(item.id)}
          aria-label="Xóa dòng"
        >
          ×
        </button>
      </td>
    </tr>
  );
}

export default React.memo(LineItemRow);
