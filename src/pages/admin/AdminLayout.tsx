import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplet,
  Users,
  Handshake,
  Search,
  Activity,
  UsersRound,
  HelpCircle,
  Settings,
  ShieldCheck,
  ToggleRight,
  LogOut,
  Menu,
  X,
  WifiOff,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useOnlineStatus } from '../../lib/useOnlineStatus';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV: { group: string; items: NavItem[] }[] = [
  { group: 'Overview', items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }] },
  {
    group: 'Inquiries',
    items: [
      { to: '/admin/donors', label: 'Donors', icon: Droplet },
      { to: '/admin/find-donors', label: 'Find Donors', icon: Search },
      { to: '/admin/requests', label: 'Blood Requests', icon: Activity },
      { to: '/admin/volunteers', label: 'Volunteers', icon: Users },
      { to: '/admin/partners', label: 'Partners', icon: Handshake },
    ],
  },
  {
    group: 'Content',
    items: [
      { to: '/admin/team', label: 'Team', icon: UsersRound },
      { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
    ],
  },
  {
    group: 'Configuration',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
      { to: '/admin/features', label: 'Features', icon: ToggleRight },
      { to: '/admin/admins', label: 'Manage Admins', icon: ShieldCheck },
    ],
  },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const online = useOnlineStatus();

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  const sidebar = (
    <>
      <div className="p-6 flex items-center gap-2 border-b border-white/10">
        <Droplet className="w-6 h-6 text-bcp-red fill-current" />
        <span className="font-bold">BCP Admin</span>
        <button
          onClick={() => setDrawerOpen(false)}
          className="ml-auto lg:hidden p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">{section.group}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-bcp-red text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" /> {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <button
        onClick={handleSignOut}
        className="m-4 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
      >
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-bcp-dark text-white flex-col shrink-0 sticky top-0 h-screen">
        {sidebar}
      </aside>

      {/* Mobile drawer + overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-bcp-dark text-white flex flex-col transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        {sidebar}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-bcp-dark text-white px-4 h-14 shadow-sm">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Droplet className="w-5 h-5 text-bcp-red fill-current" />
          <span className="font-bold">BCP Admin</span>
        </header>

        {!online && (
          <div className="flex items-center gap-2 bg-amber-50 border-b border-amber-200 text-amber-800 px-4 py-2 text-sm">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>You’re offline — showing the last loaded data. New changes and matching need a connection.</span>
          </div>
        )}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
