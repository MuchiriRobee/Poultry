import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Skull, DollarSign, Plus, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import {
 XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Area, AreaChart,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const mockProductionData = [
  { day: 'Mon', eggs: 1240, mortality: 12 },
  { day: 'Tue', eggs: 1380, mortality: 8  },
  { day: 'Wed', eggs: 1190, mortality: 15 },
  { day: 'Thu', eggs: 1450, mortality: 9  },
  { day: 'Fri', eggs: 1520, mortality: 11 },
  { day: 'Sat', eggs: 1310, mortality: 7  },
  { day: 'Sun', eggs: 1280, mortality: 10 },
];

const mockRevenueData = [
  { week: 'W1', revenue: 48000 },
  { week: 'W2', revenue: 61000 },
  { week: 'W3', revenue: 55000 },
  { week: 'W4', revenue: 84500 },
];

/* ── Custom chart tooltip ── */
type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: any[];
  label?: string;
};

const ChartTooltip = ({ active, payload, label }: CustomTooltipProps) => {  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'white', border: '1px solid #f1f5f9', borderRadius: 12,
      padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13,
    }}>
      <p style={{ color: '#64748b', marginBottom: 4, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 700, margin: 0 }}>
          {p.name === 'eggs' ? '🥚 ' : p.name === 'mortality' ? '⚠ ' : '💰 '}
          {typeof p.value === 'number' && p.name === 'revenue'
            ? `KSh ${p.value.toLocaleString()}`
            : p.value}
        </p>
      ))}
    </div>
  );
};

/* ── KPI Card ── */
interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  accent: string;
  delay: string;
}

const KpiCard = ({ label, value, sub, subColor, icon, trend, accent, delay }: KpiCardProps) => (
  <div className="kpi-card" style={{ animationDelay: delay }}>
    <div className="kpi-top">
      <span className="kpi-label">{label}</span>
      <div className="kpi-icon-wrap" style={{ background: accent + '18' }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
    </div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-sub" style={{ color: subColor }}>
      {trend === 'up' && <ArrowUpRight size={13} style={{ display: 'inline', marginRight: 3 }} />}
      {trend === 'down' && <ArrowDownRight size={13} style={{ display: 'inline', marginRight: 3 }} />}
      {sub}
    </div>
    <div className="kpi-bar" style={{ background: accent + '22' }}>
      <div className="kpi-bar-fill" style={{ background: accent }} />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate   = useNavigate();
const [hasFarm, setHasFarm] = useState(true);
const [isLoading, setIsLoading] = useState(true);
const [stats, setStats] = useState<any>(null);

useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
      

        const response = await axios.get(`${API_URL}/farms/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { hasFarm, stats: dashboardStats } = response.data.data;
        
        setHasFarm(hasFarm);           // Keep for no-farm check
        setStats(dashboardStats);

} catch (error: any) {
  console.error("Dashboard data fetch failed:", error);
  setHasFarm(false);     // Fallback to no-farm view instead of crashing
  setStats(null);
} finally {
  setIsLoading(false);
}
    };

    fetchDashboardData();
  }, []);

  /* ── No Farm ── */
  if (!hasFarm) return (
    <>
      <style>{STYLES}</style>
      <div className="no-farm-wrap">
        <div className="no-farm-icon">🐔</div>
        <h1 className="no-farm-title">No Farm Yet</h1>
        <p className="no-farm-desc">
          You haven't created any farm yet. Let's get started by setting up your first poultry farm.
        </p>
        <button className="no-farm-btn" onClick={() => navigate('/dashboard/create-farm')}>
          <Plus size={20} />
          Create Your First Farm
        </button>
        <p className="no-farm-hint">
          Once created, you'll be able to track egg production, mortality, feed, sales and more.
        </p>
      </div>
    </>
  );

  /* ── Main Dashboard ── */
  return (
    <>
      <style>{STYLES}</style>

      <div className="dash-root">

        {/* ── Page header ── */}
        <div className="dash-header">
          <div>
            <div className="dash-eyebrow">Main Farm · Nakuru</div>
            <h1 className="dash-title">
              Farm <em className="dash-title-em">Overview</em>
            </h1>
            <p className="dash-subtitle">
              Here's how your farm is performing today,{' '}
              {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}.
            </p>
          </div>
          <div className="dash-header-actions">
            <button className="dash-btn-outline" onClick={() => navigate('/dashboard/egg-production')}>
              <Activity size={15} />
              Log Today
            </button>
            <button className="dash-btn-primary" onClick={() => navigate('/dashboard/flocks')}>
              <Plus size={15} />
              New Flock
            </button>
          </div>
        </div>

{/* KPI Cards - Using Real Data */}
<div className="kpi-grid">
  <KpiCard
    label="Total Birds"
    value={stats?.total_birds ? stats.total_birds.toLocaleString() : "0"}
    sub={stats?.total_birds ? "Current flock size" : "No data yet"}
    subColor="#15803d"
    icon="🐔"
    trend="up"
    accent="#15803d"
    delay="0ms"
  />

  <KpiCard
    label="Eggs Today"
    value={stats?.eggs_today ? stats.eggs_today.toLocaleString() : "0"}
    sub="Today's collection"
    subColor="#15803d"
    icon="🥚"
    trend="up"
    accent="#d97706"
    delay="80ms"
  />

  <KpiCard
    label="Mortality Today"
    value="11"                    // You can expand backend later
    sub="Rate: 0.45% of flock"
    subColor="#ef4444"
    icon="⚠️"
    trend="down"
    accent="#ef4444"
    delay="160ms"
  />

  <KpiCard
    label="Revenue This Month"
    value="KSh 248,500"           // Expand in backend later
    sub="↑ 18% vs last month"
    subColor="#15803d"
    icon="💰"
    trend="up"
    accent="#7c3aed"
    delay="240ms"
  />
</div>

        {/* ── Charts ── */}
        <div className="charts-grid">

          {/* Egg production area chart */}
          <div className="chart-card chart-lg">
            <div className="chart-header">
              <div>
                <p className="chart-eyebrow">Last 7 Days</p>
                <h2 className="chart-title">Egg Production Trend</h2>
              </div>
              <div className="chart-badge chart-badge-green">
                <TrendingUp size={13}/> +8% avg
              </div>
            </div>
            <div className="chart-body" style={{ height: "280px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockProductionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="eggGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#15803d" stopOpacity={0.22}/>
                      <stop offset="100%" stopColor="#15803d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip />}/>
                  <Area type="natural" dataKey="eggs" stroke="#15803d" strokeWidth={2.5} fill="url(#eggGrad)" dot={{ fill: '#15803d', r: 4, strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mortality bar chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <p className="chart-eyebrow">Last 7 Days</p>
                <h2 className="chart-title">Mortality Trend</h2>
              </div>
              <div className="chart-badge chart-badge-red">
                <Skull size={12}/> 72 total
              </div>
            </div>
            <div className="chart-body" style={{ height: "280px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockProductionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip />}/>
                  <Bar dataKey="mortality" fill="#ef4444" radius={[6, 6, 0, 0]} opacity={0.85}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly revenue */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <p className="chart-eyebrow">This Month</p>
                <h2 className="chart-title">Revenue by Week</h2>
              </div>
              <div className="chart-badge chart-badge-purple">
                <DollarSign size={12}/> KSh 248.5k
              </div>
            </div>
            <div className="chart-body" style={{ height: "280px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip />}/>
                  <Area type="natural" dataKey="revenue" stroke="#7c3aed" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: '#7c3aed', r: 4, strokeWidth: 2, stroke: 'white' }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Quick Actions + Activity Feed ── */}
        <div className="bottom-grid">

          {/* Quick actions */}
          <div className="qa-col">
            <h2 className="section-title">Quick Actions</h2>
            <div className="qa-grid">
              {[
                { emoji:'🥚', title:'Log Daily Production', desc:'Record today\'s eggs, feed and mortality data', path:'/dashboard/egg-production', accent:'#15803d' },
                { emoji:'🐔', title:'Add New Flock',        desc:'Start tracking a new batch of birds',         path:'/dashboard/flocks',          accent:'#d97706' },
                { emoji:'🩺', title:'Health Record',        desc:'Log vaccinations or health treatments',        path:'/dashboard/health',           accent:'#7c3aed' },
                { emoji:'💰', title:'Record a Sale',        desc:'Log egg or bird sales for this period',        path:'/dashboard/sales',            accent:'#0369a1' },
              ].map((qa, i) => (
                <button key={i} className="qa-card" onClick={() => navigate(qa.path)} style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="qa-icon" style={{ background: qa.accent + '15' }}>
                    <span>{qa.emoji}</span>
                  </div>
                  <div className="qa-text">
                    <div className="qa-title">{qa.title}</div>
                    <div className="qa-desc">{qa.desc}</div>
                  </div>
                  <ArrowUpRight size={15} className="qa-arrow" style={{ color: qa.accent }}/>
                </button>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="activity-col">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {[
                { icon:'🥚', text:'1,520 eggs logged for today',            time:'2 hours ago',  color:'#15803d' },
                { icon:'💊', text:'Newcastle vaccination administered',      time:'Yesterday',    color:'#7c3aed' },
                { icon:'💰', text:'Sale of 400 trays — KSh 48,000',         time:'2 days ago',   color:'#0369a1' },
                { icon:'🐔', text:'New flock "Batch 12" added — 500 birds', time:'3 days ago',   color:'#d97706' },
                { icon:'⚠️', text:'11 mortality cases logged',              time:'3 days ago',   color:'#ef4444' },
                { icon:'🌾', text:'Feed stock replenished — 200 kg',         time:'4 days ago',   color:'#92400e' },
              ].map((item, i) => (
                <div key={i} className="activity-item" style={{ animationDelay: `${i * 50 + 100}ms` }}>
                  <div className="activity-dot" style={{ background: item.color + '20', color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="activity-body">
                    <p className="activity-text">{item.text}</p>
                    <p className="activity-time">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  /* ── Root ── */
  .dash-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-bottom: 40px;
  }

  .chart-body {
  height: 280px !important;
  min-height: 280px;
  }

  /* ── Loading ── */
  .dash-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; gap: 16px;
  }
  .dash-spinner {
    width: 40px; height: 40px;
    border: 3px solid #dcfce7;
    border-top-color: #15803d;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .dash-loading-text {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14px; color: #64748b; font-weight: 500;
  }

  /* ── No Farm ── */
  .no-farm-wrap {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 70vh; text-align: center; padding: 24px;
  }
  .no-farm-icon {
    width: 96px; height: 96px; background: #dcfce7;
    border-radius: 28px; display: flex; align-items: center; justify-content: center;
    font-size: 52px; margin-bottom: 28px; border: 2px solid #bbf7d0;
  }
  .no-farm-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 42px; font-weight: 700; color: #0f172a; margin: 0 0 12px;
  }
  .no-farm-desc { max-width: 400px; color: #64748b; font-size: 16px; line-height: 1.7; margin: 0 0 32px; }
  .no-farm-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 15px 36px; border-radius: 16px; background: #15803d; color: white;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 16px; font-weight: 600; border: none; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 4px 20px rgba(21,128,61,0.3);
  }
  .no-farm-btn:hover { background: #166534; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(21,128,61,0.4); }
  .no-farm-hint { font-size: 12px; color: #94a3b8; margin-top: 24px; max-width: 280px; line-height: 1.6; }

  /* ── Page header ── */
  .dash-header {
    display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 16px;
    animation: dashIn 0.55s cubic-bezier(.22,1,.36,1) both;
  }
  .dash-eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #15803d; margin-bottom: 6px;
  }
  .dash-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(30px, 4vw, 44px); font-weight: 700; margin: 0;
    color: #0f172a; line-height: 1.1;
  }
  .dark .dash-title { color: #f8fafc; }
  .dash-title-em { color: #15803d; font-style: italic; }
  .dash-subtitle { font-size: 13.5px; color: #94a3b8; margin: 6px 0 0; font-weight: 400; }
  .dash-header-actions { display: flex; align-items: center; gap: 10px; }
  .dash-btn-outline {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 12px;
    border: 1.5px solid #e2e8f0; background: white; color: #475569;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .dash-btn-outline:hover { border-color: #15803d; color: #15803d; background: #f0fdf4; }
  .dark .dash-btn-outline { background: #1e293b; border-color: #334155; color: #94a3b8; }
  .dash-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 12px;
    background: #15803d; color: white;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13.5px; font-weight: 600; border: none; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 3px 12px rgba(21,128,61,0.25);
  }
  .dash-btn-primary:hover { background: #166534; transform: translateY(-1px); box-shadow: 0 5px 18px rgba(21,128,61,0.35); }

  /* ── KPI Grid ── */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  .kpi-card {
    background: white;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    padding: 22px 22px 18px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
    transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s;
    animation: dashIn 0.55s cubic-bezier(.22,1,.36,1) both;
    position: relative; overflow: hidden;
  }
  .kpi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.09); }
  .kpi-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .kpi-label { font-size: 12px; font-weight: 600; color: #94a3b8; letter-spacing: 0.04em; text-transform: uppercase; }
  .kpi-icon-wrap {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .kpi-value {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(22px, 3vw, 30px); font-weight: 700;
    color: #67696c; margin-bottom: 6px; line-height: 1;
  }
  .dark .kpi-value { color: #f8fafc; }
  .kpi-sub { font-size: 12px; font-weight: 500; display: flex; align-items: center; margin-bottom: 16px; }
  .kpi-bar { height: 4px; border-radius: 4px; overflow: hidden; margin-top: 4px; }
  .kpi-bar-fill { height: 100%; width: 72%; border-radius: 4px; }

  /* ── Charts ── */
  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 16px;
  }
  .chart-card {
    background: white;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    padding: 22px 24px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.045);
    animation: dashIn 0.55s cubic-bezier(.22,1,.36,1) 0.1s both;
    transition: box-shadow 0.25s;
  }
  .chart-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
  .chart-lg { grid-column: 1 / -1; }
  .chart-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 20px;
  }
  .chart-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin: 0 0 4px; }
  .chart-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 18px; font-weight: 700; color: #0f172a; margin: 0;
  }
  .dark .chart-title { color: #f8fafc; }
  .chart-body { height: 220px; }
  .chart-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11.5px; font-weight: 700; padding: 5px 11px; border-radius: 999px;
  }
  .chart-badge-green { background: #dcfce7; color: #15803d; }
  .chart-badge-red   { background: #fee2e2; color: #dc2626; }
  .chart-badge-purple{ background: #ede9fe; color: #7c3aed; }

  /* ── Bottom grid ── */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 900px) {
    .bottom-grid { grid-template-columns: 1fr; }
    .charts-grid { grid-template-columns: 1fr; }
    .chart-lg { grid-column: 1; }
  }

  /* ── Section title ── */
  .section-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 14px;
  }
  .dark .section-title { color: #f8fafc; }

  /* ── Quick Actions ── */
  .qa-col {}
  .qa-grid { display: flex; flex-direction: column; gap: 10px; }
  .qa-card {
    display: flex; align-items: center; gap: 14px;
    padding: 15px 16px;
    background: white; border: 1.5px solid #f1f5f9; border-radius: 16px;
    cursor: pointer; text-align: left; width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    animation: dashIn 0.5s cubic-bezier(.22,1,.36,1) both;
    box-shadow: 0 1px 6px rgba(0,0,0,0.03);
  }
  .qa-card:hover { border-color: #bbf7d0; box-shadow: 0 6px 20px rgba(21,128,61,0.1); transform: translateX(3px); }
  .qa-icon {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 22px;
  }
  .qa-text { flex: 1; }
  .qa-title { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
  .dark .qa-title { color: #f1f5f9; }
  .qa-desc { font-size: 12px; color: #94a3b8; }
  .qa-arrow { flex-shrink: 0; opacity: 0; transition: opacity 0.2s; }
  .qa-card:hover .qa-arrow { opacity: 1; }

  /* ── Activity feed ── */
  .activity-col {}
  .activity-list {
    background: white;
    border: 1px solid #f1f5f9; border-radius: 20px;
    padding: 6px 0;
    box-shadow: 0 2px 16px rgba(0,0,0,0.04);
    overflow: hidden;
  }
  .activity-item {
    display: flex; align-items: flex-start; gap: 13px;
    padding: 13px 18px;
    border-bottom: 1px solid #f8fafc;
    animation: dashIn 0.5s cubic-bezier(.22,1,.36,1) both;
    transition: background 0.15s;
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-item:hover { background: #f8fafc; }
  .activity-dot {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .activity-body { flex: 1; }
  .activity-text { font-size: 13px; font-weight: 500; color: #334155; line-height: 1.4; margin: 0 0 3px; }
  .dark .activity-text { color: #cbd5e1; }
  .activity-time { font-size: 11px; color: #94a3b8; }

  /* ── Entry animation ── */
  @keyframes dashIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Dark mode overrides ── */
  @media (prefers-color-scheme: dark) {
    .kpi-card, .chart-card, .activity-list { background: #ffffff; border-color: #ffffff; }
    .qa-card { background: #ffffff; border-color: #ffffff; }
    .activity-item:hover { background: #0f172a; }
    .activity-item { border-bottom-color: #1e293b; }
  }
  .dark .kpi-card, .dark .chart-card, .dark .activity-list { background: #1e293b; border-color: #334155; }
  .dark .qa-card { background: #1e293b; border-color: #334155; }
  .dark .activity-item { border-bottom-color: #0f172a; }
  .dark .activity-item:hover { background: #0f172a; }
`;

export default Dashboard;