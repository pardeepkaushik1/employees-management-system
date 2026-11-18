import { Bell, Menu } from "lucide-react";

function Navbar({ onMenuClick }) {
  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
        >
          <Menu size={21} />
        </button>
        <h2 className="truncate text-base font-semibold tracking-tight text-slate-800 sm:text-lg">
          Employee Management
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3 sm:gap-3 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white shadow-sm">
            P
          </div>
          <span className="hidden text-sm font-medium text-slate-700 sm:inline">
            Pardeep
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
