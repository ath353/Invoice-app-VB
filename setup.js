const fs = require('fs');
const dirs = [
  'src/features/invoice-form', 'src/features/invoice-preview', 'src/features/invoice-export',
  'src/common/components', 'src/common/hooks', 'src/common/utils', 'src/constants', 'src/store'
];
dirs.forEach(d => fs.mkdirSync(d, {recursive: true}));
const files = [
  'src/features/invoice-form/InvoiceForm.jsx', 'src/features/invoice-form/InvoiceForm.hook.js', 'src/features/invoice-form/InvoiceForm.util.js', 'src/features/invoice-form/SellerSection.jsx', 'src/features/invoice-form/BuyerSection.jsx', 'src/features/invoice-form/LineItemRow.jsx', 'src/features/invoice-form/LineItemTable.jsx', 'src/features/invoice-preview/InvoicePreview.jsx', 'src/features/invoice-preview/TemplateA.jsx', 'src/features/invoice-preview/TemplateB.jsx', 'src/features/invoice-export/ExportButtons.jsx', 'src/features/invoice-export/pdf.service.js', 'src/features/invoice-export/word.service.js', 'src/features/invoice-export/excel.service.js', 'src/common/components/Button.jsx', 'src/common/components/Input.jsx', 'src/common/components/Select.jsx', 'src/common/components/Textarea.jsx', 'src/common/components/Divider.jsx', 'src/common/hooks/useDarkMode.js', 'src/common/hooks/useDebounce.js', 'src/common/utils/formatCurrency.js', 'src/common/utils/formatDate.js', 'src/common/utils/generateId.js', 'src/common/utils/generateInvoiceNumber.js', 'src/common/utils/sanitize.js', 'src/App.jsx', 'src/main.jsx'
];
files.forEach(f => {
  if (!fs.existsSync(f)) {
    fs.writeFileSync(f, '');
  }
});
