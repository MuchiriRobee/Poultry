import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFarms, setCurrentFarm } from '../features/farmSlice';
import { logout } from '../features/authSlice';
import { toast } from 'sonner';
import {
  Home,
  Users,
  Egg,
  TrendingUp,
  Skull,
  Wheat,
  Heart,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import axios from 'axios';
const navItems = [
  { icon: Home,        label: 'Dashboard',       path: '/dashboard',                 group: 'main' },
  { icon: Users,       label: 'Flocks & Batches', path: '/dashboard/flocks',          group: 'main' },
  { icon: Egg,         label: 'Egg Production',   path: '/dashboard/egg-production',  group: 'production' },
  { icon: TrendingUp,  label: 'Hatch Rate',        path: '/dashboard/hatch-rate',      group: 'production' },
  { icon: Skull,       label: 'Mortality',         path: '/dashboard/mortality',       group: 'production' },
  { icon: Wheat,       label: 'Feed',              path: '/dashboard/feed',            group: 'production' },
  { icon: Heart,       label: 'Health',            path: '/dashboard/health',          group: 'health' },
  { icon: DollarSign,  label: 'Sales & Revenue',   path: '/dashboard/sales',           group: 'finance' },
  { icon: Settings,    label: 'Settings',          path: '/dashboard/settings',        group: 'system' },
];

const groupLabels: Record<string, string> = {
  main:       'Overview',
  production: 'Production',
  health:     'Health',
  finance:    'Finance',
  system:     'System',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { theme, setTheme } = useTheme();

// Farm State
// Inside DashboardLayout component, replace the farm state and useEffect with this:
const { farms, currentFarm } = useSelector((state: any) => state.farm);
const [loadingFarms, setLoadingFarms] = useState(true);

// Fetch farms and update Redux
useEffect(() => {
  const fetchUserFarms = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const res = await axios.get(`${API_URL}/farms`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.farms) {
        dispatch(setFarms(res.data.farms));
        if (res.data.farms.length > 0 && !currentFarm) {
          dispatch(setCurrentFarm(res.data.farms[0]));
        }
      }
    } catch (error) {
      console.error("Failed to fetch farms:", error);
    } finally {
      setLoadingFarms(false);
    }
  };

  fetchUserFarms();
}, [user, dispatch, currentFarm]);

// Update handleFarmSwitch
const handleFarmSwitch = (farm: any) => {
  dispatch(setCurrentFarm(farm));
  toast.success(`Switched to ${farm.name}`);
};
  
  // Close mobile sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Build grouped nav
  const groups = [...new Set(navItems.map(n => n.group))];

  const activePage = navItems.find(n => isActive(n.path))?.label ?? 'Dashboard';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        /* ── Sidebar variables ── */
        :root {
          --sidebar-w: 268px;
          --sidebar-w-collapsed: 72px;
          --header-h: 64px;
          --pp-green: #15803d;
          --pp-green-light: #22c55e;
        }

        /* ── Sidebar ── */
        .pp-sidebar {
          width: var(--sidebar-w);
          transition: width 0.3s cubic-bezier(.22,1,.36,1), transform 0.3s cubic-bezier(.22,1,.36,1);
          flex-shrink: 0;
        }
        .pp-sidebar.collapsed { width: var(--sidebar-w-collapsed); }

        /* ── Nav item ── */
        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, transform 0.15s;
          white-space: nowrap;
          overflow: hidden;
          border: none;
          background: transparent;
          font-family: 'DM Sans', system-ui, sans-serif;
          text-align: left;
        }
        .nav-item:hover {
          background: #f0fdf4;
          color: #15803d;
          transform: translateX(2px);
        }
        .dark .nav-item:hover { background: rgba(21,128,61,0.1); color: #4ade80; }
        .nav-item.active {
          background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%);
          color: #15803d;
          font-weight: 600;
        }
        .dark .nav-item.active { background: rgba(21,128,61,0.18); color: #4ade80; }
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 3px;
          background: #15803d;
          border-radius: 0 3px 3px 0;
        }
        .dark .nav-item.active::before { background: #4ade80; }

        .nav-icon {
          flex-shrink: 0;
          width: 20px; height: 20px;
        }
        .nav-label {
          transition: opacity 0.2s, transform 0.2s;
          transform-origin: left;
        }
        .pp-sidebar.collapsed .nav-label { opacity: 0; transform: scaleX(0); pointer-events: none; }

        /* ── Group heading ── */
        .nav-group-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 0 12px;
          margin-bottom: 4px;
          margin-top: 20px;
          display: block;
          transition: opacity 0.2s;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .pp-sidebar.collapsed .nav-group-label { opacity: 0; }

        /* ── Tooltip for collapsed state ── */
        .nav-tooltip {
          position: absolute;
          left: calc(var(--sidebar-w-collapsed) + 8px);
          top: 50%; transform: translateY(-50%);
          background: #1e293b;
          color: white;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 100;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .pp-sidebar.collapsed .nav-item:hover .nav-tooltip { opacity: 1; }

        /* ── Collapse toggle button ── */
        .collapse-btn {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: white;
          border: 1.5px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.3s;
          color: #64748b;
          flex-shrink: 0;
        }
        .collapse-btn:hover { background: #f0fdf4; border-color: #15803d; color: #15803d; }
        .dark .collapse-btn { background: #1e293b; border-color: #334155; color: #94a3b8; }
        .collapse-btn.rotated { transform: rotate(180deg); }

        /* ── Scrollbar ── */
        .pp-nav-scroll::-webkit-scrollbar { width: 4px; }
        .pp-nav-scroll::-webkit-scrollbar-track { background: transparent; }
        .pp-nav-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .dark .pp-nav-scroll::-webkit-scrollbar-thumb { background: #334155; }

        /* ── Header ── */
        .pp-header {
          height: var(--header-h);
          background: white;
          border-bottom: 1px solid #f1f5f9;
        }
        .dark .pp-header { background: #0f172a; border-bottom-color: #1e293b; }

        /* ── Notification dot ── */
        @keyframes pulse-dot { 0%,100% { transform:scale(1); } 50% { transform:scale(1.4); } }
        .notif-dot { animation: pulse-dot 2s ease-in-out infinite; }

        /* ── Breadcrumb separator ── */
        .breadcrumb-sep { opacity: 0.35; }

        /* ── Avatar ring ── */
        .avatar-ring {
          background: linear-gradient(135deg, #22c55e, #15803d);
          padding: 2px;
          border-radius: 50%;
        }
        .avatar-inner {
          background: white;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          display: flex; align-items: center; justify-content: center;
        }
        .dark .avatar-inner { background: #0f172a; }

        /* ── Page entry animation ── */
        @keyframes pageIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .page-content { animation: pageIn 0.45s cubic-bezier(.22,1,.36,1) both; }

        /* ── Farm badge ── */
        .farm-badge {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 10px 12px;
        }
        .dark .farm-badge { background: rgba(21,128,61,0.1); border-color: rgba(21,128,61,0.25); }

        /* ── Grain overlay ── */
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* ── User card ── */
        .user-card {
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          padding: 12px 14px;
          overflow: hidden;
        }
        .dark .user-card { background: #1e293b; border-color: #334155; }

        /* ── Logout btn ── */
        .logout-btn {
          width: 100%;
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: #ef4444;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.18s;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .logout-btn:hover { background: #fef2f2; }
        .dark .logout-btn:hover { background: rgba(239,68,68,0.1); }

        .logo-pulse { animation: pulseGlow 3s ease-in-out infinite; }
        @keyframes pulseGlow { 0%,100% { box-shadow:0 0 0 0 rgba(21,128,61,0.25); } 50% { box-shadow:0 0 0 10px rgba(21,128,61,0); } }
      `}</style>

      <div className="font-body min-h-screen flex bg-slate-50 dark:bg-slate-950 overflow-hidden">

        {/* ════════ SIDEBAR ════════ */}
        <aside
          className={`
            pp-sidebar ${collapsed ? 'collapsed' : ''}
            fixed lg:static inset-y-0 left-0 z-50
            flex flex-col
            bg-white dark:bg-slate-900
            border-r border-slate-100 dark:border-slate-800
            shadow-[2px_0_24px_rgba(0,0,0,0.04)]
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-[width,transform]
          `}
        >
          {/* ── Logo header ── */}
          <div className="h-16 flex items-center px-4 border-b border-slate-100 dark:border-slate-800 gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-lg flex-shrink-0 logo-pulse">
              🐔
            </div>
            <div className="nav-label overflow-hidden">
              <div className="font-display font-700 text-[18px] leading-tight text-slate-900 dark:text-white tracking-tight">PoultryPro</div>
              <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-widest uppercase -mt-0.5">Farm Management</div>
            </div>

            {/* Collapse toggle — desktop only */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`collapse-btn hidden lg:flex ml-auto ${collapsed ? 'rotated' : ''}`}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight size={13}/>
            </button>

            {/* Close — mobile only */}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20}/>
            </button>
          </div>

          {/* ── Farm badge ── */}
{/* UPDATED FARM SECTION */}
          <div className={`px-3 py-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 transition-all ${collapsed ? 'opacity-0 pointer-events-none h-0 py-0 overflow-hidden' : ''}`}>
            {loadingFarms ? (
              <div className="text-xs text-slate-500 py-2">Loading farms...</div>
            ) : farms.length === 0 ? (
              <div className="farm-badge">
                <p className="text-[10px] font-semibold uppercase text-amber-600">No Farms Yet</p>
                <button 
                  onClick={() => navigate('/dashboard/create-farm')}
                  className="text-emerald-600 text-xs font-medium hover:underline mt-1 block"
                >
                  Create your first farm →
                </button>
              </div>
            ) : (
              <div className="farm-badge">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9.5px] font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-0.5">CURRENT FARM</p>
                    <p className="font-display font-600 text-[14px] text-slate-800 dark:text-white leading-tight">
                      {currentFarm?.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentFarm?.location}</p>
                  </div>

                  {farms.length > 1 && (
                    <div className="relative group">
                      <button className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2">
                        Switch
                      </button>
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 hidden group-hover:block">
                        {farms.map((farm: any) => (
                          <button
                            key={farm.id}
                            onClick={() => handleFarmSwitch(farm)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${currentFarm?.id === farm.id ? 'text-emerald-600 font-medium' : ''}`}
                          >
                            {farm.name}
                            <span className="text-xs text-slate-500 block">{farm.location}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 overflow-y-auto pp-nav-scroll px-3 py-3">
            {groups.map(group => {
              const items = navItems.filter(n => n.group === group);
              return (
                <div key={group}>
                  <span className="nav-group-label">{groupLabels[group]}</span>
                  {items.map(item => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="nav-icon" strokeWidth={isActive(item.path) ? 2.2 : 1.8}/>
                      <span className="nav-label flex-1">{item.label}</span>
                      {isActive(item.path) && !collapsed && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"/>
                      )}
                      {/* Tooltip shown only when collapsed */}
                      <span className="nav-tooltip">{item.label}</span>
                    </button>
                  ))}
                </div>
              );
            })}
          </nav>

          {/* ── Bottom: user card + logout ── */}
          <div className="px-3 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 space-y-2">
            {!collapsed && (
              <div className="user-card">
                <div className="flex items-center gap-3">
                  <div className="avatar-ring w-9 h-9 flex-shrink-0">
                    <div className="avatar-inner w-full h-full text-emerald-700 dark:text-emerald-300 text-sm font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={17} className="flex-shrink-0"/>
              <span className="nav-label">Logout</span>
            </button>
          </div>
        </aside>

        {/* ════════ MAIN CONTENT ════════ */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

          {/* ── Top header ── */}
          <header className="pp-header sticky top-0 z-40 px-5 lg:px-8 flex items-center justify-between flex-shrink-0">
            {/* Left: hamburger + breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu size={20}/>
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 dark:text-slate-500 font-medium">PoultryPro</span>
                <ChevronRight size={13} className="breadcrumb-sep text-slate-400"/>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{activePage}</span>
              </div>
            </div>

            {/* Right: greeting + actions */}
            <div className="flex items-center gap-3">
              {/* Greeting — hidden on mobile */}
              <div className="hidden md:block text-[13px] text-slate-500 dark:text-slate-400 font-light">
                {greeting()},{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.firstName}</span>
                {' '}👋
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-5 bg-slate-200 dark:bg-slate-700"/>

              {/* Bell */}
              <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell size={18}/>
                <span className="notif-dot absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"/>
              </button>
                            <button
                              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                            </button>

              {/* Avatar */}
              <div className="avatar-ring w-9 h-9 cursor-pointer hover:opacity-90 transition-opacity">
                <div className="avatar-inner font-display font-bold text-[13px] text-emerald-700 dark:text-emerald-300">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </div>
            </div>
          </header>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-auto p-5 lg:p-8 relative">
            {/* Subtle background grain */}
            <div className="grain-overlay absolute inset-0 pointer-events-none"/>
            <div className="page-content relative z-10">
              <Outlet key={currentFarm?.id} />
            </div>
          </main>
        </div>

        {/* ── Mobile backdrop ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] lg:hidden z-40 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default DashboardLayout;