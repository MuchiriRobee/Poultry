import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Plus, FileText,
  BarChart3, Egg, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Flock {
  id: number;
  batch_name: string;
  bird_species: string;
  bird_type?: string;
  breed?: string;
  start_date: string;
  current_count: number;
  age_days: number;
}

interface EggLog {
  id: number;
  log_date: string;
  eggs_collected: number;
  broken_eggs: number;
  trays: number;
  notes?: string;
  production_rate: number;
}

/* ── Helpers ── */
const fmt = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const speciesEmoji: Record<string, string> = {
  Hen: '🐔', Duck: '🦆', Turkey: '🦃', Goose: '🪿', Other: '🐦'
};

const typeColor: Record<string, { bg: string; text: string }> = {
  Broiler:  { bg: '#fef3c7', text: '#92400e' },
  Layer:    { bg: '#dcfce7', text: '#166534' },
  Kienyeji: { bg: '#e0e7ff', text: '#3730a3' },
  Dual:     { bg: '#fce7f3', text: '#9d174d' },
};

const PAGE_SIZE = 8;

/* ── Rate Ring ── */
const RateRing = ({ rate }: { rate: number }) => {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const fill = (rate / 100) * circ;
  const color = rate >= 75 ? '#15803d' : rate >= 50 ? '#d97706' : '#ef4444';
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" style={{ flexShrink: 0 }}>
      <circle cx={26} cy={26} r={r} fill="none" stroke="#f1f5f9" strokeWidth={4} />
      <circle
        cx={26} cy={26} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x={26} y={30} textAnchor="middle" fontSize={10} fontWeight={700} fill={color} fontFamily="DM Sans, sans-serif">
        {rate}%
      </text>
    </svg>
  );
};

/* ── Log Form ── */
const LogForm = ({
  flock,
  onClose,
  onSuccess,
  farmId,
}: {
  flock: Flock;
  onClose: () => void;
  onSuccess: () => void;
  farmId: number;
}) => {
  const [form, setForm] = useState({ eggs_collected: 0, broken_eggs: 0, notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const rate = flock.current_count > 0
    ? Math.round(((form.eggs_collected - form.broken_eggs) / flock.current_count) * 100)
    : 0;
  const trays = Math.floor(form.eggs_collected / 30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/eggs`, {
        farm_id: farmId,
        flock_id: flock.id,
        eggs_collected: form.eggs_collected,
        broken_eggs: form.broken_eggs,
        notes: form.notes,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Egg production logged successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to log eggs");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ep-form">

      {/* Flock Hero */}
      <div className="ep-form-hero">
        <span className="ep-form-hero-emoji">{speciesEmoji[flock.bird_species] ?? '🐦'}</span>
        <div>
          <div className="ep-form-hero-name">{flock.batch_name}</div>
          <div className="ep-form-hero-meta">
            {flock.bird_species}{flock.bird_type ? ` · ${flock.bird_type}` : ''} &nbsp;·&nbsp; {flock.current_count.toLocaleString()} birds
          </div>
        </div>
        <div className="ep-form-date">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
      </div>

      {/* Inputs */}
      <div className="ep-form-row">
        <div className="ep-form-group">
          <label className="ep-form-label"><Egg size={12} /> Eggs Collected</label>
          <input
            className="ep-input ep-input-lg"
            type="number"
            min={0}
            value={form.eggs_collected}
            onChange={e => set('eggs_collected', parseInt(e.target.value) || 0)}
            required
          />
        </div>
        <div className="ep-form-group">
          <label className="ep-form-label">Broken Eggs</label>
          <input
            className="ep-input"
            type="number"
            min={0}
            value={form.broken_eggs}
            onChange={e => set('broken_eggs', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Auto-computed */}
      <div className="ep-form-computed">
        <div className="ep-computed-item">
          <span className="ep-computed-lbl">Trays (÷30)</span>
          <span className="ep-computed-val">{trays}</span>
        </div>
        <div className="ep-computed-div" />
        <div className="ep-computed-item">
          <span className="ep-computed-lbl">Net Eggs</span>
          <span className="ep-computed-val">{Math.max(0, form.eggs_collected - form.broken_eggs).toLocaleString()}</span>
        </div>
        <div className="ep-computed-div" />
        <div className="ep-computed-item ep-computed-rate">
          <span className="ep-computed-lbl">Production Rate</span>
          <RateRing rate={Math.min(100, Math.max(0, rate))} />
        </div>
      </div>

      <div className="ep-form-group">
        <label className="ep-form-label"><FileText size={12} /> Notes <span className="ep-optional">(optional)</span></label>
        <textarea
          className="ep-textarea"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Any observations for today..."
          rows={3}
        />
      </div>

      <div className="ep-form-actions">
        <button type="button" className="ep-btn-cancel" onClick={onClose}>Cancel</button>
        <button type="submit" className="ep-btn-submit" disabled={submitting}>
          {submitting ? <span className="ep-spinner" /> : 'Save Production Log'}
        </button>
      </div>
    </form>
  );
};

/* ── History Modal ── */
const HistoryModal = ({ flock, logs }: { flock: Flock; logs: EggLog[] }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const paginated = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const avgRate = logs.length > 0
    ? Math.round(logs.reduce((s, l) => s + l.production_rate, 0) / logs.length)
    : 0;
  const totalEggs = logs.reduce((s, l) => s + l.eggs_collected, 0);
  const totalTrays = logs.reduce((s, l) => s + (l.trays || 0), 0);

  return (
    <div className="ep-history">

      {/* Summary row */}
      <div className="ep-hist-summary">
        <div className="ep-hist-stat">
          <span className="ep-hist-stat-val">{logs.length}</span>
          <span className="ep-hist-stat-lbl">Log Days</span>
        </div>
        <div className="ep-hist-div" />
        <div className="ep-hist-stat">
          <span className="ep-hist-stat-val">{totalEggs.toLocaleString()}</span>
          <span className="ep-hist-stat-lbl">Total Eggs</span>
        </div>
        <div className="ep-hist-div" />
        <div className="ep-hist-stat">
          <span className="ep-hist-stat-val">{totalTrays.toLocaleString()}</span>
          <span className="ep-hist-stat-lbl">Total Trays</span>
        </div>
        <div className="ep-hist-div" />
        <div className="ep-hist-stat">
          <RateRing rate={avgRate} />
          <span className="ep-hist-stat-lbl">Avg Rate</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="ep-hist-empty">
          <span style={{ fontSize: 40 }}>🥚</span>
          <p>No egg logs yet for this flock.</p>
        </div>
      ) : (
        <>
          <div className="ep-table-wrap">
            <table className="ep-table">
              <thead>
                <tr>
                  <th className="ep-th">Date</th>
                  <th className="ep-th">Collected</th>
                  <th className="ep-th">Broken</th>
                  <th className="ep-th">Net</th>
                  <th className="ep-th">Trays</th>
                  <th className="ep-th">Rate</th>
                  <th className="ep-th">Notes</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((log, i) => {
                  const net = log.eggs_collected - log.broken_eggs;
                  const rateColor = log.production_rate >= 75 ? '#15803d' : log.production_rate >= 50 ? '#d97706' : '#ef4444';
                  const rateBg   = log.production_rate >= 75 ? '#dcfce7' : log.production_rate >= 50 ? '#fef3c7' : '#fee2e2';
                  return (
                    <tr key={log.id} className="ep-tr" style={{ animationDelay: `${i * 25}ms` }}>
                      <td className="ep-td ep-td-date">{fmt(log.log_date)}</td>
                      <td className="ep-td ep-td-num">{log.eggs_collected.toLocaleString()}</td>
                      <td className="ep-td ep-td-broken">{log.broken_eggs}</td>
                      <td className="ep-td ep-td-net">{net.toLocaleString()}</td>
                      <td className="ep-td ep-td-num">{log.trays}</td>
                      <td className="ep-td">
                        <span className="ep-rate-badge" style={{ background: rateBg, color: rateColor }}>
                          {log.production_rate}%
                        </span>
                      </td>
                      <td className="ep-td ep-td-notes">{log.notes || <span className="ep-dash">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {logs.length > PAGE_SIZE && (
            <div className="ep-pagination">
              <span className="ep-page-info">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, logs.length)} of {logs.length}
              </span>
              <div className="ep-page-btns">
                <button className="ep-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`ep-page-num ${n === page ? 'ep-page-num-active' : ''}`}
                    onClick={() => setPage(n)}
                  >{n}</button>
                ))}
                <button className="ep-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ── Main ── */
const EggProduction = () => {
  const { currentFarm } = useSelector((state: any) => state.farm);
  const [flocks, setFlocks]                 = useState<Flock[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedFlock, setSelectedFlock]   = useState<Flock | null>(null);
  const [eggLogs, setEggLogs]               = useState<EggLog[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchFlocks = async () => {
    if (!currentFarm?.id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/flocks?farm_id=${currentFarm.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const enriched = res.data.flocks.map((f: any) => ({
          ...f,
          age_days: Math.floor((Date.now() - new Date(f.start_date).getTime()) / 86400000)
        }));
        setFlocks(enriched);
      }
    } catch {
      toast.error("Failed to load flocks");
    } finally {
      setLoading(false);
    }
  };

  const fetchEggLogs = async (flock: Flock) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/eggs/flock/${flock.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const withRate = res.data.logs.map((log: any) => ({
          ...log,
          production_rate: log.eggs_collected > 0
            ? Math.round(((log.eggs_collected - log.broken_eggs) / flock.current_count) * 100)
            : 0
        }));
        setEggLogs(withRate);
      }
    } catch {
      toast.error("Failed to load egg history");
    }
  };

  useEffect(() => { fetchFlocks(); }, [currentFarm]);

  const openLog = (flock: Flock) => { setSelectedFlock(flock); setIsLogModalOpen(true); };
  const openView = async (flock: Flock) => {
    setSelectedFlock(flock);
    await fetchEggLogs(flock);
    setIsViewModalOpen(true);
  };

  // Summary pills across all flocks
  const totalBirds = flocks.reduce((s, f) => s + f.current_count, 0);

  return (
    <>
      <style>{STYLES}</style>

      <div className="ep-root">

        {/* ── Header ── */}
        <div className="ep-header">
          <div>
            <div className="ep-eyebrow">Daily Tracking</div>
            <h1 className="ep-title">Egg <em className="ep-title-em">Production</em></h1>
            <p className="ep-subtitle">Log and track daily egg collection across all your flocks</p>
          </div>
        </div>

        {/* ── Summary Pills ── */}
        <div className="ep-pills">
          {[
            { label: 'Active Flocks',  val: flocks.length,             color: '#15803d', bg: '#dcfce7' },
            { label: 'Total Birds',    val: totalBirds.toLocaleString(), color: '#d97706', bg: '#fef3c7' },
            { label: 'Logged Today',   val: '—',                        color: '#7c3aed', bg: '#ede9fe' },
            { label: 'Avg Rate',       val: '—',                        color: '#0369a1', bg: '#e0f2fe' },
          ].map(p => (
            <div key={p.label} className="ep-pill" style={{ background: p.bg }}>
              <span className="ep-pill-val" style={{ color: p.color }}>{p.val}</span>
              <span className="ep-pill-lbl">{p.label}</span>
            </div>
          ))}
        </div>

        {/* ── Flocks Table ── */}
        <div className="ep-card">
          <div className="ep-card-header">
            <div>
              <div className="ep-card-eyebrow">All Flocks</div>
              <h2 className="ep-card-title">Select a flock to log or view production</h2>
            </div>
            <span className="ep-card-count">{flocks.length} flock{flocks.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="ep-loading-wrap">
              {[0,1,2,3].map(i => <div key={i} className="ep-skeleton" style={{ animationDelay: `${i * 70}ms` }} />)}
            </div>
          ) : flocks.length === 0 ? (
            <div className="ep-empty">
              <span className="ep-empty-icon">🥚</span>
              <p className="ep-empty-title">No flocks found</p>
              <p className="ep-empty-sub">Create a flock first to start logging egg production.</p>
            </div>
          ) : (
            <div className="ep-table-wrap">
              <table className="ep-table">
                <thead>
                  <tr>
                    <th className="ep-th">Flock</th>
                    <th className="ep-th">Species</th>
                    <th className="ep-th">Type</th>
                    <th className="ep-th">Breed</th>
                    <th className="ep-th">Age</th>
                    <th className="ep-th">Birds</th>
                    <th className="ep-th ep-th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flocks.map((flock, i) => {
                    const tc = typeColor[flock.bird_type ?? ''];
                    return (
                      <tr key={flock.id} className="ep-tr" style={{ animationDelay: `${i * 35}ms` }}>
                        <td className="ep-td ep-td-name">
                          <span className="ep-species-dot">{speciesEmoji[flock.bird_species] ?? '🐦'}</span>
                          {flock.batch_name}
                        </td>
                        <td className="ep-td">{flock.bird_species}</td>
                        <td className="ep-td">
                          {flock.bird_type
                            ? <span className="ep-type-badge" style={tc ? { background: tc.bg, color: tc.text } : {}}>{flock.bird_type}</span>
                            : <span className="ep-dash">—</span>}
                        </td>
                        <td className="ep-td">{flock.breed || <span className="ep-dash">—</span>}</td>
                        <td className="ep-td"><span className="ep-age-chip">{flock.age_days}d</span></td>
                        <td className="ep-td ep-td-birds">{flock.current_count.toLocaleString()}</td>
                        <td className="ep-td ep-td-actions">
                          <button
                            className="ep-action-btn ep-action-log"
                            title="Log today's eggs"
                            onClick={() => openLog(flock)}
                          >
                            <Plus size={14} />
                            <span>Log</span>
                          </button>
                          <button
                            className="ep-action-btn ep-action-view"
                            title="View history"
                            onClick={() => openView(flock)}
                          >
                            <BarChart3 size={14} />
                            <span>History</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ── Log Modal ── */}
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22 }}>
              Log Daily Production
            </DialogTitle>
            <DialogDescription style={{ fontSize: 13 }}>
              Recording for <strong>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
            </DialogDescription>
          </DialogHeader>
          {selectedFlock && (
            <LogForm
              flock={selectedFlock}
              farmId={currentFarm.id}
              onClose={() => setIsLogModalOpen(false)}
              onSuccess={fetchFlocks}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── History Modal ── */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22 }}>
              Production History
            </DialogTitle>
            <DialogDescription style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{speciesEmoji[selectedFlock?.bird_species ?? ''] ?? '🐦'}</span>
              <strong>{selectedFlock?.batch_name}</strong>
              {selectedFlock?.bird_type && <span>· {selectedFlock.bird_type}</span>}
            </DialogDescription>
          </DialogHeader>
          {selectedFlock && <HistoryModal flock={selectedFlock} logs={eggLogs} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

/* ════════════════════════════════════════════
   STYLES  — move to index.css
════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

  /* ── Root ── */
  .ep-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    display: flex; flex-direction: column; gap: 24px;
  }

  /* ── Header ── */
  .ep-header {
    display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 16px;
    animation: epIn 0.55s cubic-bezier(.22,1,.36,1) both;
  }
  .ep-eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #15803d; margin-bottom: 6px;
  }
  .ep-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(28px, 4vw, 42px); font-weight: 700; margin: 0;
    color: #0f172a; line-height: 1.1;
  }
  .dark .ep-title { color: #f8fafc; }
  .ep-title-em { color: #15803d; font-style: italic; }
  .ep-subtitle { font-size: 13.5px; color: #94a3b8; margin: 6px 0 0; }

  /* ── Pills ── */
  .ep-pills {
    display: flex; gap: 12px; flex-wrap: wrap;
    animation: epIn 0.55s cubic-bezier(.22,1,.36,1) 0.06s both;
  }
  .ep-pill {
    display: flex; flex-direction: column; align-items: center;
    padding: 12px 22px; border-radius: 16px; min-width: 90px;
    transition: transform 0.2s;
  }
  .ep-pill:hover { transform: translateY(-2px); }
  .ep-pill-val {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px; font-weight: 700; line-height: 1;
  }
  .ep-pill-lbl {
    font-size: 11px; font-weight: 600; color: #64748b; margin-top: 4px;
    text-transform: uppercase; letter-spacing: 0.05em;
  }

  /* ── Card ── */
  .ep-card {
    background: white; border: 1px solid #f1f5f9; border-radius: 20px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.05); overflow: hidden;
    animation: epIn 0.55s cubic-bezier(.22,1,.36,1) 0.1s both;
  }
  .dark .ep-card { background: #1e293b; border-color: #334155; }
  .ep-card-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 20px 22px 16px; border-bottom: 1px solid #f8fafc;
  }
  .dark .ep-card-header { border-bottom-color: #334155; }
  .ep-card-eyebrow {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #94a3b8; margin-bottom: 3px;
  }
  .ep-card-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 17px; font-weight: 700; color: #0f172a; margin: 0;
  }
  .dark .ep-card-title { color: #f1f5f9; }
  .ep-card-count {
    font-size: 12px; font-weight: 600; color: #94a3b8;
    background: #f8fafc; padding: 4px 10px; border-radius: 99px;
    border: 1px solid #f1f5f9;
  }

  /* ── Table ── */
  .ep-table-wrap { overflow-x: auto; }
  .ep-table { width: 100%; border-collapse: collapse; }
  .ep-th {
    padding: 11px 16px; text-align: left;
    font-size: 11px; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    border-bottom: 1px solid #f1f5f9;
    background: #fafbfc; white-space: nowrap;
  }
  .dark .ep-th { background: #172033; border-bottom-color: #334155; color: #64748b; }
  .ep-th-right { text-align: right; }
  .ep-tr {
    border-bottom: 1px solid #f8fafc;
    transition: background 0.15s;
    animation: epIn 0.4s cubic-bezier(.22,1,.36,1) both;
  }
  .dark .ep-tr { border-bottom-color: #1e293b; }
  .ep-tr:last-child { border-bottom: none; }
  .ep-tr:hover { background: #f8fffe; }
  .dark .ep-tr:hover { background: #172033; }
  .ep-td {
    padding: 14px 16px; font-size: 13.5px; color: #475569; vertical-align: middle;
  }
  .dark .ep-td { color: #94a3b8; }
  .ep-td-name {
    font-weight: 600; color: #0f172a; display: flex; align-items: center; gap: 8px; white-space: nowrap;
  }
  .dark .ep-td-name { color: #f1f5f9; }
  .ep-td-birds { font-weight: 700; color: #0f172a; font-variant-numeric: tabular-nums; }
  .dark .ep-td-birds { color: #f1f5f9; }
  .ep-td-actions { text-align: right; white-space: nowrap; }
  .ep-td-date { font-variant-numeric: tabular-nums; font-size: 13px; white-space: nowrap; }
  .ep-td-num { font-variant-numeric: tabular-nums; font-weight: 600; }
  .ep-td-broken { color: #ef4444; font-variant-numeric: tabular-nums; }
  .ep-td-net { color: #15803d; font-weight: 700; font-variant-numeric: tabular-nums; }
  .ep-td-notes { max-width: 180px; font-size: 12.5px; color: #94a3b8; }

  .ep-species-dot { font-size: 18px; }
  .ep-age-chip {
    display: inline-flex; padding: 3px 8px; border-radius: 8px;
    background: #e0e7ff; color: #3730a3; font-size: 11.5px; font-weight: 700;
  }
  .ep-type-badge {
    display: inline-flex; padding: 3px 9px; border-radius: 999px;
    font-size: 11px; font-weight: 700; background: #f1f5f9; color: #64748b;
  }
  .ep-rate-badge {
    display: inline-flex; padding: 3px 9px; border-radius: 999px;
    font-size: 11.5px; font-weight: 700;
  }
  .ep-dash { color: #cbd5e1; }

  /* ── Action Buttons ── */
  .ep-action-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 9px; font-size: 12.5px; font-weight: 600;
    border: none; cursor: pointer; margin-left: 6px;
    font-family: 'DM Sans', system-ui, sans-serif;
    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  }
  .ep-action-btn:hover { transform: translateY(-1px); }
  .ep-action-log {
    background: #dcfce7; color: #166534;
  }
  .ep-action-log:hover { background: #bbf7d0; box-shadow: 0 3px 10px rgba(21,128,61,0.2); }
  .ep-action-view {
    background: #eff6ff; color: #2563eb;
  }
  .ep-action-view:hover { background: #dbeafe; box-shadow: 0 3px 10px rgba(37,99,235,0.2); }

  /* ── Empty / Loading ── */
  .ep-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 56px 20px; text-align: center; gap: 8px;
  }
  .ep-empty-icon { font-size: 48px; }
  .ep-empty-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 19px; color: #0f172a; margin: 0;
  }
  .dark .ep-empty-title { color: #f1f5f9; }
  .ep-empty-sub { font-size: 13.5px; color: #94a3b8; margin: 0; }
  .ep-loading-wrap { display: flex; flex-direction: column; gap: 10px; padding: 16px 20px; }
  .ep-skeleton {
    height: 50px; border-radius: 10px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite, epIn 0.4s ease both;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ── Log Form ── */
  .ep-form {
    display: flex; flex-direction: column; gap: 16px;
    font-family: 'DM Sans', system-ui, sans-serif;
    padding-top: 4px;
  }
  .ep-form-hero {
    display: flex; align-items: center; gap: 12px;
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border-radius: 14px; padding: 14px 16px;
  }
  .ep-form-hero-emoji { font-size: 30px; }
  .ep-form-hero-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 2px;
  }
  .ep-form-hero-meta { font-size: 12px; color: #64748b; }
  .ep-form-date {
    margin-left: auto; font-size: 12px; font-weight: 600; color: #94a3b8;
    white-space: nowrap;
  }
  .ep-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ep-form-group { display: flex; flex-direction: column; gap: 6px; }
  .ep-form-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.07em;
  }
  .ep-optional { font-weight: 400; font-size: 11px; color: #b0bec5; text-transform: none; letter-spacing: 0; }
  .ep-input {
    padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14px; color: #0f172a; background: #fafafa;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    width: 100%; box-sizing: border-box;
  }
  .ep-input-lg { font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .ep-input:focus { border-color: #15803d; box-shadow: 0 0 0 3px rgba(21,128,61,0.09); background: white; }
  .ep-textarea {
    padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14px; color: #0f172a; background: #fafafa;
    outline: none; resize: vertical; line-height: 1.6;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%; box-sizing: border-box;
  }
  .ep-textarea:focus { border-color: #15803d; box-shadow: 0 0 0 3px rgba(21,128,61,0.09); background: white; }

  /* ── Computed row ── */
  .ep-form-computed {
    display: flex; align-items: center; justify-content: space-around;
    background: #fafafa; border: 1px solid #f1f5f9; border-radius: 14px; padding: 14px 10px;
  }
  .ep-computed-item {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .ep-computed-rate { gap: 2px; }
  .ep-computed-lbl { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; }
  .ep-computed-val {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1;
  }
  .ep-computed-div { width: 1px; height: 40px; background: #e2e8f0; }

  /* ── Form Buttons ── */
  .ep-form-actions { display: flex; gap: 10px; padding-top: 4px; }
  .ep-btn-cancel {
    flex: 1; padding: 11px; border: 1.5px solid #e2e8f0; border-radius: 12px;
    background: white; color: #64748b;
    font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; font-weight: 600; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .ep-btn-cancel:hover { border-color: #cbd5e1; background: #f8fafc; }
  .ep-btn-submit {
    flex: 2; padding: 11px; background: #15803d; color: white; border: none; border-radius: 12px;
    font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; font-weight: 700; cursor: pointer;
    box-shadow: 0 3px 12px rgba(21,128,61,0.28);
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .ep-btn-submit:hover:not(:disabled) { background: #166534; transform: translateY(-1px); box-shadow: 0 5px 18px rgba(21,128,61,0.38); }
  .ep-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .ep-spinner {
    width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.35);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── History Modal ── */
  .ep-history { display: flex; flex-direction: column; gap: 16px; padding-top: 4px; }
  .ep-hist-summary {
    display: flex; align-items: center; justify-content: space-around;
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border-radius: 16px; padding: 16px;
  }
  .ep-hist-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .ep-hist-stat-val {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1;
  }
  .ep-hist-stat-lbl {
    font-size: 10.5px; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.07em;
  }
  .ep-hist-div { width: 1px; height: 40px; background: rgba(21,128,61,0.15); }
  .ep-hist-empty {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 40px 20px; color: #94a3b8; font-size: 14px;
  }

  /* ── Pagination ── */
  .ep-pagination {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
    padding: 12px 16px; border-top: 1px solid #f1f5f9;
  }
  .dark .ep-pagination { border-top-color: #334155; }
  .ep-page-info { font-size: 12px; color: #94a3b8; }
  .ep-page-btns { display: flex; align-items: center; gap: 4px; }
  .ep-page-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 8px;
    border: 1.5px solid #e2e8f0; background: white; color: #475569;
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
  }
  .ep-page-btn:hover:not(:disabled) { border-color: #15803d; color: #15803d; background: #f0fdf4; }
  .ep-page-btn:disabled { opacity: 0.35; cursor: default; }
  .ep-page-num {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 30px; height: 30px; border-radius: 8px; padding: 0 4px;
    border: 1.5px solid #e2e8f0; background: white;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13px; font-weight: 600; color: #475569; cursor: pointer;
    transition: all 0.2s;
  }
  .ep-page-num:hover { border-color: #15803d; color: #15803d; background: #f0fdf4; }
  .ep-page-num-active { background: #15803d !important; color: white !important; border-color: #15803d !important; }

  /* ── Animation ── */
  @keyframes epIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default EggProduction;