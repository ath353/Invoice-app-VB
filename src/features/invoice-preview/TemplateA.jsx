import React from "react";

import { APP_CONFIG } from "../../constants/appConfig";
import { formatVND } from "../../common/utils/formatCurrency";
import { formatDate } from "../../common/utils/dateHelper";

function TemplateA({ invoice, summary }) {
  const seller = invoice?.seller || {};
  const buyer = invoice?.buyer || {};
  const lineItems = invoice?.lineItems || [];
  const vatRate = Number(invoice?.vatRate) || 0;

  return (
    <article className="mx-auto w-full max-w-[210mm] bg-white p-8 text-black shadow-sm">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">{seller.name || "Tên công ty / người bán"}</h1>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>Địa chỉ: {seller.address || "-"}</p>
            <p>SĐT: {seller.phone || "-"}</p>
            <p>Email: {seller.email || "-"}</p>
            <p>MST: {seller.taxId || "-"}</p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-3xl font-extrabold tracking-wide">{APP_CONFIG.labels.invoiceTitle}</h2>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <span className="text-slate-600">Số hóa đơn:</span> {invoice?.invoiceNumber || "-"}
            </p>
            <p>
              <span className="text-slate-600">Ngày xuất:</span> {formatDate(invoice?.issueDate)}
            </p>
            <p>
              <span className="text-slate-600">Hạn TT:</span> {formatDate(invoice?.dueDate)}
            </p>
          </div>
        </div>
      </header>

      <div className="my-6 h-px w-full bg-slate-300" />

      <section>
        <p className="text-sm font-semibold">Kính gửi:</p>
        <div className="mt-2 space-y-1 text-sm">
          <p>
            <span className="text-slate-600">Tên:</span> {buyer.name || "-"}
          </p>
          <p>
            <span className="text-slate-600">Địa chỉ:</span> {buyer.address || "-"}
          </p>
          <p>
            <span className="text-slate-600">SĐT:</span> {buyer.phone || "-"}
          </p>
          <p>
            <span className="text-slate-600">Email:</span> {buyer.email || "-"}
          </p>
          <p>
            <span className="text-slate-600">MST:</span> {buyer.taxId || "-"}
          </p>
        </div>
      </section>

      <section className="mt-6">
        <table className="w-full border-collapse border border-slate-300 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-2 py-2 text-center">STT</th>
              <th className="border border-slate-300 px-2 py-2 text-left">Mô tả</th>
              <th className="border border-slate-300 px-2 py-2 text-right">Số lượng</th>
              <th className="border border-slate-300 px-2 py-2 text-right">Đơn giá</th>
              <th className="border border-slate-300 px-2 py-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.length === 0 && (
              <tr>
                <td className="border border-slate-300 px-2 py-3 text-center text-slate-400">1</td>
                <td className="border border-slate-300 px-2 py-3 text-slate-400">....................................</td>
                <td className="border border-slate-300 px-2 py-3 text-right text-slate-400">0</td>
                <td className="border border-slate-300 px-2 py-3 text-right text-slate-400">0 đ</td>
                <td className="border border-slate-300 px-2 py-3 text-right text-slate-400">0 đ</td>
              </tr>
            )}

            {lineItems.map((item, index) => {
              const quantity = Number(item.quantity) || 0;
              const unitPrice = Number(item.unitPrice) || 0;
              const amount = quantity * unitPrice;

              return (
                <tr key={item.id || index}>
                  <td className="border border-slate-300 px-2 py-2 text-center">{index + 1}</td>
                  <td className="border border-slate-300 px-2 py-2">{item.description || "-"}</td>
                  <td className="border border-slate-300 px-2 py-2 text-right">{quantity}</td>
                  <td className="border border-slate-300 px-2 py-2 text-right">{formatVND(unitPrice)}</td>
                  <td className="border border-slate-300 px-2 py-2 text-right">{formatVND(amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="mt-6 ml-auto w-full max-w-sm space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Tổng tiền hàng:</span>
          <span>{formatVND(summary?.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">VAT ({vatRate}%):</span>
          <span>{formatVND(summary?.vatAmount)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-300 pt-2 text-lg font-bold">
          <span>Tổng cộng:</span>
          <span>{formatVND(summary?.total)}</span>
        </div>
      </section>

      {invoice?.note && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold">Ghi chú</h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{invoice.note}</p>
        </section>
      )}

      <footer className="mt-10 text-center text-xs text-slate-400">{APP_CONFIG.labels.appWatermark}</footer>
    </article>
  );
}

export default React.memo(TemplateA);
