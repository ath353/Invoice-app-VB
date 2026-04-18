import InvoiceForm from "./features/invoice-form/InvoiceForm";
import { APP_CONFIG } from "./constants/appConfig";
import useDarkMode from "./common/hooks/useDarkMode";

function App() {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans transition-colors duration-150 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-3 transition-colors duration-150 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="InvoiceVN" className="h-8 w-8 rounded-lg" />
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {APP_CONFIG.name}
            </h1>
          </div>
          <button
            type="button"
            onClick={() =>
              typeof toggleDark === "function" ? toggleDark() : null
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-zinc-500 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Toggle dark mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main>
        <InvoiceForm />
      </main>

      <footer className="py-6 text-center text-xs text-zinc-400 transition-colors duration-150">
        ©{APP_CONFIG.labels.appWatermark} · Miễn phí, không cần đăng ký
      </footer>
    </div>
  );
}

export default App;
