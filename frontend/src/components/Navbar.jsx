import { LogOut, Moon, Sun, TrainFront } from "lucide-react";

export default function Navbar({ darkMode, onToggleDarkMode, onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2 text-left">
          <TrainFront className="h-6 w-6 text-brand-500" />
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">Dashboard</p>
            <h1 className="text-base font-bold md:text-lg">Optimized Railway Routing System</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
          <a href="#home" className="text-slate-600 transition hover:text-brand-500 dark:text-slate-300">
            Home
          </a>
          <a href="#routes" className="text-slate-600 transition hover:text-brand-500 dark:text-slate-300">
            Routes
          </a>
          <a href="#about" className="text-slate-600 transition hover:text-brand-500 dark:text-slate-300">
            About
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="rounded-full border border-slate-200 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
            type="button"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            aria-label="Logout"
            type="button"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
