import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Wallet,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Employees", path: "/employees", icon: Users },
  { name: "Departments", path: "/departments", icon: Building2 },
  { name: "Attendance", path: "/attendance", icon: CalendarCheck },
  { name: "Salaries", path: "/salaries", icon: Wallet },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col overflow-y-auto bg-slate-950 p-5 text-white shadow-xl transition-transform duration-200 md:static md:z-auto md:h-full md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-9 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-950/30">
            EM
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide">PeopleDesk</h2>
            <p className="mt-0.5 text-xs text-slate-400">Management portal</p>
          </div>
        </div>

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Workspace
        </p>
        <nav className="space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-950/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <link.icon size={19} />
              {link.name}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto px-3 pt-8 text-xs text-slate-500">
          Employee Management
        </p>
      </aside>
    </>
  );
}

export default Sidebar;
