import { Home, Info, Route } from "lucide-react";

const items = [
  { id: "home", label: "Home", icon: Home },
  { id: "routes", label: "Routes", icon: Route },
  { id: "about", label: "About", icon: Info },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900 lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Sections
      </p>
      <div className="space-y-2">
        {items.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </a>
        ))}
      </div>
    </aside>
  );
}
