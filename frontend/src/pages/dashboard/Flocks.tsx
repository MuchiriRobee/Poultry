import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Plus, Eye, Edit2, Trash2, Search, ChevronLeft, ChevronRight,
  ChevronDown, X, Bird, Calendar, Hash, Layers, SlidersHorizontal,
  ArrowUpDown, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Flock {
  id: number;
  batch_name: string;
  bird_species: string;
  bird_type?: string;
  breed?: string;
  start_date: string;
  initial_count: number;
  current_count: number;
  status: string;
  notes?: string;
  age_days: number;
}

/* ── Helpers ── */
const fmt = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const fmtInput = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`; // ISO for input[type=date]
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

const PAGE_SIZE = 10;

/* ── Status badge ── */
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { icon: React.ReactNode; bg: string; text: string; label: string }> = {
    active:   { icon: <CheckCircle2 size={11} />, bg: '#dcfce7', text: '#166534', label: 'Active' },
    inactive: { icon: <Clock size={11} />,        bg: '#f1f5f9', text: '#64748b', label: 'Inactive' },
    sold:     { icon: <AlertCircle size={11} />,  bg: '#fef3c7', text: '#92400e', label: 'Sold' },
  };
  const cfg = map[status?.toLowerCase()] ?? map.inactive;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: cfg.bg, color: cfg.text,
      fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999,
      letterSpacing: '0.03em'
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

/* ── Flock Form ── */
const FlockForm = ({
  editingFlock,
  farmId,
  onClose,
  onSuccess,
}: {
  editingFlock: Flock | null;
  farmId: number | undefined;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    batch_name:    editingFlock?.batch_name    || '',
    bird_species:  editingFlock?.bird_species  || 'Hen',
    bird_type:     editingFlock?.bird_type     || '',
    breed:         editingFlock?.breed         || '',
    start_date:    editingFlock ? fmtInput(editingFlock.start_date) : '',
    initial_count: editingFlock?.initial_count || 500,
    notes:         editingFlock?.notes         || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, val: any) => setFormData(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData, farm_id: farmId };
      if (editingFlock) {
        await axios.put(`${API_URL}/flocks/${editingFlock.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Flock updated successfully");
      } else {
        await axios.post(`${API_URL}/flocks`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Flock created successfully");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const isHen = formData.bird_species === 'Hen';

  return (
    <>
      <style>{FORM_STYLES}</style>
      <form onSubmit={handleSubmit} className="flock-form">

        {/* Batch Name */}
        <div className="ff-group">
          <label className="ff-label"><Hash size={12} className="ff-label-icon" /> Flock Name / Batch</label>
          <div className="ff-input-wrap">
            <input
              className="ff-input"
              value={formData.batch_name}
              onChange={e => set('batch_name', e.target.value)}
              placeholder="e.g. Batch 01/04"
              required
            />
          </div>
        </div>

        {/* Species + Type */}
        <div className="ff-row">
          <div className="ff-group">
            <label className="ff-label"><Bird size={12} className="ff-label-icon" /> Bird Species</label>
            <div className="ff-select-wrap">
              <select className="ff-select" value={formData.bird_species} onChange={e => set('bird_species', e.target.value)}>
                {['Hen','Duck','Turkey','Goose','Other'].map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="ff-select-arrow" />
            </div>
          </div>

          <div className="ff-group">
            <label className={`ff-label ${!isHen ? 'ff-label-dim' : ''}`}><Layers size={12} className="ff-label-icon" /> Bird Type</label>
            <div className="ff-select-wrap">
              <select
                className={`ff-select ${!isHen ? 'ff-select-disabled' : ''}`}
                value={formData.bird_type}
                onChange={e => set('bird_type', e.target.value)}
                disabled={!isHen}
              >
                <option value="">Select type</option>
                <option value="Broiler">Broiler</option>
                <option value="Layer">Layer</option>
                <option value="Kienyeji">Kienyeji</option>
                <option value="Dual">Dual Purpose</option>
              </select>
              <ChevronDown size={14} className="ff-select-arrow" />
            </div>
          </div>
        </div>

        {/* Breed */}
        <div className="ff-group">
          <label className={`ff-label ${!isHen ? 'ff-label-dim' : ''}`}>Breed</label>
          <input
            className={`ff-input ${!isHen ? 'ff-input-disabled' : ''}`}
            value={formData.breed}
            onChange={e => set('breed', e.target.value)}
            placeholder="Kuroiler, Kenchic, Sasso..."
            disabled={!isHen}
          />
        </div>

        {/* Date + Count */}
        <div className="ff-row">
          <div className="ff-group">
            <label className="ff-label"><Calendar size={12} className="ff-label-icon" /> Day 1 (Start Date)</label>
            <input
              className="ff-input"
              type="date"
              value={formData.start_date}
              onChange={e => set('start_date', e.target.value)}
              required
            />
          </div>
          <div className="ff-group">
            <label className="ff-label">Initial Count</label>
            <input
              className="ff-input ff-input-num"
              type="number"
              value={formData.initial_count}
              onChange={e => set('initial_count', parseInt(e.target.value))}
              required
              min={1}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="ff-group">
          <label className="ff-label">Notes <span className="ff-optional">(optional)</span></label>
          <textarea
            className="ff-textarea"
            value={formData.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Any additional information about this flock..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="ff-actions">
          <button type="button" className="ff-btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="ff-btn-submit" disabled={submitting}>
            {submitting
              ? <span className="ff-spinner" />
              : editingFlock ? 'Update Flock' : 'Create Flock'
            }
          </button>
        </div>

      </form>
    </>
  );
};

/* ── View Modal ── */
const FlockViewModal = ({ flock, onClose }: { flock: Flock; onClose: () => void }) => (
  <>
    <style>{FORM_STYLES}</style>
    <div className="fv-root">
      {/* Hero */}
      <div className="fv-hero">
        <div className="fv-emoji">{speciesEmoji[flock.bird_species] ?? '🐦'}</div>
        <div>
          <h2 className="fv-name">{flock.batch_name}</h2>
          <div className="fv-meta">
            {flock.bird_species} {flock.bird_type ? `· ${flock.bird_type}` : ''} {flock.breed ? `· ${flock.breed}` : ''}
          </div>
        </div>
        <StatusBadge status={flock.status} />
      </div>

      {/* Stats row */}
      <div className="fv-stats">
        <div className="fv-stat">
          <span className="fv-stat-val">{flock.age_days}</span>
          <span className="fv-stat-lbl">Days Old</span>
        </div>
        <div className="fv-stat-div" />
        <div className="fv-stat">
          <span className="fv-stat-val">{flock.initial_count.toLocaleString()}</span>
          <span className="fv-stat-lbl">Initial</span>
        </div>
        <div className="fv-stat-div" />
        <div className="fv-stat">
          <span className="fv-stat-val fv-stat-green">{flock.current_count.toLocaleString()}</span>
          <span className="fv-stat-lbl">Current</span>
        </div>
        <div className="fv-stat-div" />
        <div className="fv-stat">
          <span className="fv-stat-val fv-stat-red">
            {flock.initial_count - flock.current_count}
          </span>
          <span className="fv-stat-lbl">Mortality</span>
        </div>
      </div>

      {/* Detail grid */}
      <div className="fv-grid">
        {[
          { label: 'Batch Name', val: flock.batch_name },
          { label: 'Species',    val: flock.bird_species },
          { label: 'Type',       val: flock.bird_type  || '—' },
          { label: 'Breed',      val: flock.breed      || '—' },
          { label: 'Start Date', val: fmt(flock.start_date) },
          { label: 'Status',     val: <StatusBadge status={flock.status} /> },
        ].map(row => (
          <div key={row.label} className="fv-row">
            <span className="fv-row-lbl">{row.label}</span>
            <span className="fv-row-val">{row.val}</span>
          </div>
        ))}
      </div>

      {flock.notes && (
        <div className="fv-notes">
          <span className="fv-notes-lbl">Notes</span>
          <p className="fv-notes-text">{flock.notes}</p>
        </div>
      )}

      <button className="ff-btn-cancel" style={{ width: '100%', marginTop: 4 }} onClick={onClose}>Close</button>
    </div>
  </>
);

/* ── Main Component ── */
const Flocks = () => {
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlock, setEditingFlock] = useState<Flock | null>(null);
  const [viewFlock, setViewFlock] = useState<Flock | null>(null);
  const { currentFarm } = useSelector((state: any) => state.farm);
  const farmId = currentFarm?.id;

  // Filter / Search state
  const [search, setSearch] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey, setSortKey] = useState<keyof Flock>('batch_name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchFlocks = async () => {
    if (!farmId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/flocks?farm_id=${farmId}`, {
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

  useEffect(() => { fetchFlocks(); }, []);

  const handleDelete = async (flockId: number) => {
    if (!confirm("Delete this flock? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/flocks/${flockId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Flock deleted");
      fetchFlocks();
    } catch {
      toast.error("Failed to delete flock");
    }
  };

  const toggleSort = (key: keyof Flock) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let list = [...flocks];
    if (search)        list = list.filter(f => f.batch_name.toLowerCase().includes(search.toLowerCase()) || f.breed?.toLowerCase().includes(search.toLowerCase()));
    if (filterSpecies) list = list.filter(f => f.bird_species === filterSpecies);
    if (filterType)    list = list.filter(f => f.bird_type === filterType);
    if (filterStatus)  list = list.filter(f => f.status?.toLowerCase() === filterStatus);
    list.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv), undefined, { numeric: true })
        : String(bv).localeCompare(String(av), undefined, { numeric: true });
    });
    return list;
  }, [flocks, search, filterSpecies, filterType, filterStatus, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = search || filterSpecies || filterType || filterStatus;

  const clearFilters = () => { setSearch(''); setFilterSpecies(''); setFilterType(''); setFilterStatus(''); setPage(1); };

  const SortIcon = ({ col }: { col: keyof Flock }) => (
    <ArrowUpDown size={11} style={{ opacity: sortKey === col ? 1 : 0.3, color: sortKey === col ? '#15803d' : 'inherit', marginLeft: 4, flexShrink: 0 }} />
  );

  return (
    <>
      <style>{PAGE_STYLES}</style>

      <div className="fl-root">

        {/* ── Page Header ── */}
        <div className="fl-header">
          <div>
            <div className="fl-eyebrow">Poultry Management</div>
            <h1 className="fl-title">Flocks &amp; <em className="fl-title-em">Batches</em></h1>
            <p className="fl-subtitle">Track and manage all your bird batches in one place</p>
          </div>
          <button className="fl-btn-primary" onClick={() => { setEditingFlock(null); setIsModalOpen(true); }}>
            <Plus size={16} /> New Flock
          </button>
        </div>

        {/* ── Summary Pills ── */}
        <div className="fl-pills">
          {[
            { label: 'Total Flocks', val: flocks.length, color: '#15803d', bg: '#dcfce7' },
            { label: 'Active', val: flocks.filter(f => f.status?.toLowerCase() === 'active').length, color: '#166534', bg: '#bbf7d0' },
            { label: 'Total Birds', val: flocks.reduce((s, f) => s + (f.current_count || 0), 0).toLocaleString(), color: '#d97706', bg: '#fef3c7' },
            { label: 'Avg Age', val: flocks.length ? `${Math.round(flocks.reduce((s, f) => s + f.age_days, 0) / flocks.length)}d` : '—', color: '#7c3aed', bg: '#ede9fe' },
          ].map(p => (
            <div key={p.label} className="fl-pill" style={{ background: p.bg }}>
              <span className="fl-pill-val" style={{ color: p.color }}>{p.val}</span>
              <span className="fl-pill-lbl">{p.label}</span>
            </div>
          ))}
        </div>

        {/* ── Table Card ── */}
        <div className="fl-card">

          {/* Toolbar */}
          <div className="fl-toolbar">
            <div className="fl-search-wrap">
              <Search size={14} className="fl-search-icon" />
              <input
                className="fl-search"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search flocks or breeds..."
              />
              {search && <button className="fl-search-clear" onClick={() => { setSearch(''); setPage(1); }}><X size={13} /></button>}
            </div>

            <button
              className={`fl-filter-btn ${filtersOpen || (filterSpecies || filterType || filterStatus) ? 'fl-filter-btn-active' : ''}`}
              onClick={() => setFiltersOpen(o => !o)}
            >
              <SlidersHorizontal size={14} />
              Filters
              {(filterSpecies || filterType || filterStatus) && (
                <span className="fl-filter-badge">
                  {[filterSpecies, filterType, filterStatus].filter(Boolean).length}
                </span>
              )}
            </button>

            {hasFilters && (
              <button className="fl-clear-btn" onClick={clearFilters}><X size={12} /> Clear</button>
            )}

            <span className="fl-count">{filtered.length} flock{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Filter Dropdowns */}
          {filtersOpen && (
            <div className="fl-filters-bar">
              {[
                { label: 'Species', val: filterSpecies, set: setFilterSpecies, options: ['Hen', 'Duck', 'Turkey', 'Goose', 'Other'] },
                { label: 'Type',    val: filterType,    set: setFilterType,    options: ['Broiler', 'Layer', 'Kienyeji', 'Dual'] },
                { label: 'Status',  val: filterStatus,  set: setFilterStatus,  options: ['active', 'inactive', 'sold'] },
              ].map(f => (
                <div key={f.label} className="fl-filter-group">
                  <label className="fl-filter-lbl">{f.label}</label>
                  <div className="fl-select-wrap">
                    <select className="fl-select" value={f.val} onChange={e => { f.set(e.target.value); setPage(1); }}>
                      <option value="">All</option>
                      {f.options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                    </select>
                    <ChevronDown size={12} className="fl-select-arrow" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="fl-empty">
              <div className="fl-loading-wrap">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="fl-skeleton" style={{ animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="fl-empty">
              <div className="fl-empty-icon">🐔</div>
              <p className="fl-empty-title">{hasFilters ? 'No flocks match your filters' : 'No flocks yet'}</p>
              <p className="fl-empty-sub">{hasFilters ? 'Try adjusting your search or filters.' : 'Get started by creating your first flock batch.'}</p>
              {!hasFilters && (
                <button className="fl-btn-primary" style={{ marginTop: 16 }} onClick={() => { setEditingFlock(null); setIsModalOpen(true); }}>
                  <Plus size={15} /> New Flock
                </button>
              )}
            </div>
          ) : (
            <div className="fl-table-wrap">
              <table className="fl-table">
                <thead>
                  <tr>
                    {[
                      { label: 'Flock Name', key: 'batch_name' as keyof Flock },
                      { label: 'Species',    key: 'bird_species' as keyof Flock },
                      { label: 'Type',       key: 'bird_type' as keyof Flock },
                      { label: 'Breed',      key: 'breed' as keyof Flock },
                      { label: 'Start Date', key: 'start_date' as keyof Flock },
                      { label: 'Age',        key: 'age_days' as keyof Flock },
                      { label: 'Initial',    key: 'initial_count' as keyof Flock },
                      { label: 'Current',    key: 'current_count' as keyof Flock },
                      { label: 'Status',     key: 'status' as keyof Flock },
                    ].map(col => (
                      <th key={col.key} className="fl-th" onClick={() => toggleSort(col.key)}>
                        <span className="fl-th-inner">
                          {col.label} <SortIcon col={col.key} />
                        </span>
                      </th>
                    ))}
                    <th className="fl-th fl-th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((flock, i) => {
                    const tc = typeColor[flock.bird_type ?? ''];
                    return (
                      <tr key={flock.id} className="fl-tr" style={{ animationDelay: `${i * 30}ms` }}>
                        <td className="fl-td fl-td-name">
                          <span className="fl-species-dot">{speciesEmoji[flock.bird_species] ?? '🐦'}</span>
                          {flock.batch_name}
                        </td>
                        <td className="fl-td">{flock.bird_species}</td>
                        <td className="fl-td">
                          {flock.bird_type
                            ? <span className="fl-badge" style={tc ? { background: tc.bg, color: tc.text } : {}}>{flock.bird_type}</span>
                            : <span className="fl-dash">—</span>}
                        </td>
                        <td className="fl-td">{flock.breed || <span className="fl-dash">—</span>}</td>
                        <td className="fl-td fl-td-mono">{fmt(flock.start_date)}</td>
                        <td className="fl-td">
                          <span className="fl-age-chip">{flock.age_days}d</span>
                        </td>
                        <td className="fl-td fl-td-mono">{flock.initial_count.toLocaleString()}</td>
                        <td className="fl-td fl-td-current">{flock.current_count.toLocaleString()}</td>
                        <td className="fl-td"><StatusBadge status={flock.status} /></td>
                        <td className="fl-td fl-td-actions">
                          <button className="fl-action-btn fl-action-view" title="View" onClick={() => setViewFlock(flock)}>
                            <Eye size={14} />
                          </button>
                          <button className="fl-action-btn fl-action-edit" title="Edit" onClick={() => { setEditingFlock(flock); setIsModalOpen(true); }}>
                            <Edit2 size={14} />
                          </button>
                          <button className="fl-action-btn fl-action-del" title="Delete" onClick={() => handleDelete(flock.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="fl-pagination">
              <span className="fl-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="fl-page-btns">
                <button
                  className="fl-page-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                    if (idx > 0 && (n as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === '...'
                      ? <span key={`dots-${i}`} className="fl-page-dots">…</span>
                      : <button key={n} className={`fl-page-num ${n === page ? 'fl-page-num-active' : ''}`} onClick={() => setPage(n as number)}>{n}</button>
                  )}
                <button
                  className="fl-page-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22 }}>
              {editingFlock ? 'Edit Flock' : 'New Flock'}
            </DialogTitle>
          </DialogHeader>
          <FlockForm
            editingFlock={editingFlock}
            farmId={farmId}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchFlocks}
          />
        </DialogContent>
      </Dialog>

      {/* ── View Modal ── */}
      <Dialog open={!!viewFlock} onOpenChange={() => setViewFlock(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22 }}>
              Flock Details
            </DialogTitle>
          </DialogHeader>
          {viewFlock && <FlockViewModal flock={viewFlock} onClose={() => setViewFlock(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

  .fl-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    display: flex; flex-direction: column; gap: 24px;
  }

  /* ── Header ── */
  .fl-header {
    display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 16px;
    animation: flIn 0.55s cubic-bezier(.22,1,.36,1) both;
  }
  .fl-eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #15803d; margin-bottom: 6px;
  }
  .fl-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(28px, 4vw, 42px); font-weight: 700; margin: 0;
    color: #0f172a; line-height: 1.1;
  }
  .dark .fl-title { color: #f8fafc; }
  .fl-title-em { color: #15803d; font-style: italic; }
  .fl-subtitle { font-size: 13.5px; color: #94a3b8; margin: 6px 0 0; }
  .fl-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 12px;
    background: #15803d; color: white;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13.5px; font-weight: 600; border: none; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 3px 12px rgba(21,128,61,0.28);
    white-space: nowrap;
  }
  .fl-btn-primary:hover { background: #166534; transform: translateY(-1px); box-shadow: 0 5px 18px rgba(21,128,61,0.38); }

  /* ── Pills ── */
  .fl-pills {
    display: flex; gap: 12px; flex-wrap: wrap;
    animation: flIn 0.55s cubic-bezier(.22,1,.36,1) 0.06s both;
  }
  .fl-pill {
    display: flex; flex-direction: column; align-items: center;
    padding: 12px 22px; border-radius: 16px; min-width: 90px;
    transition: transform 0.2s; cursor: default;
  }
  .fl-pill:hover { transform: translateY(-2px); }
  .fl-pill-val { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; line-height: 1; }
  .fl-pill-lbl { font-size: 11px; font-weight: 600; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }

  /* ── Card ── */
  .fl-card {
    background: white; border: 1px solid #f1f5f9; border-radius: 20px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.05);
    overflow: hidden;
    animation: flIn 0.55s cubic-bezier(.22,1,.36,1) 0.1s both;
  }
  .dark .fl-card { background: #1e293b; border-color: #334155; }

  /* ── Toolbar ── */
  .fl-toolbar {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    padding: 18px 20px 14px;
    border-bottom: 1px solid #f8fafc;
  }
  .dark .fl-toolbar { border-bottom-color: #334155; }
  .fl-search-wrap {
    position: relative; flex: 1; min-width: 200px;
  }
  .fl-search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: #94a3b8; pointer-events: none;
  }
  .fl-search {
    width: 100%; padding: 9px 36px 9px 34px;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13.5px; color: #0f172a; background: #fafafa;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .fl-search:focus { border-color: #15803d; box-shadow: 0 0 0 3px rgba(21,128,61,0.08); background: white; }
  .fl-search-clear {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: #f1f5f9; border: none; cursor: pointer; border-radius: 6px;
    width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
    color: #64748b; transition: background 0.15s;
  }
  .fl-search-clear:hover { background: #e2e8f0; }
  .fl-filter-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 14px; border-radius: 12px;
    border: 1.5px solid #e2e8f0; background: white; color: #475569;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    position: relative;
  }
  .fl-filter-btn:hover, .fl-filter-btn-active {
    border-color: #15803d; color: #15803d; background: #f0fdf4;
  }
  .fl-filter-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 16px; height: 16px; border-radius: 50%;
    background: #15803d; color: white; font-size: 10px; font-weight: 700;
  }
  .fl-clear-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 7px 12px; border-radius: 10px;
    border: 1px solid #fca5a5; background: #fff5f5; color: #dc2626;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 12px; font-weight: 600; cursor: pointer;
    transition: background 0.15s;
  }
  .fl-clear-btn:hover { background: #fee2e2; }
  .fl-count {
    margin-left: auto; font-size: 12px; font-weight: 600;
    color: #94a3b8; white-space: nowrap;
  }

  /* ── Filter bar ── */
  .fl-filters-bar {
    display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap;
    padding: 14px 20px; background: #fafafa;
    border-bottom: 1px solid #f1f5f9;
    animation: flIn 0.25s ease both;
  }
  .dark .fl-filters-bar { background: #1a2332; border-bottom-color: #334155; }
  .fl-filter-group { display: flex; flex-direction: column; gap: 5px; }
  .fl-filter-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; }
  .fl-select-wrap { position: relative; }
  .fl-select {
    appearance: none; padding: 7px 28px 7px 10px;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13px; color: #334155; background: white;
    cursor: pointer; outline: none;
    transition: border-color 0.2s;
  }
  .fl-select:focus { border-color: #15803d; }
  .fl-select-arrow {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    color: #94a3b8; pointer-events: none;
  }

  /* ── Table ── */
  .fl-table-wrap { overflow-x: auto; }
  .fl-table { width: 100%; border-collapse: collapse; }
  .fl-th {
    padding: 12px 16px; text-align: left;
    font-size: 11px; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    border-bottom: 1px solid #f1f5f9;
    cursor: pointer; user-select: none; white-space: nowrap;
    background: #fafbfc;
    transition: color 0.15s;
  }
  .dark .fl-th { background: #172033; border-bottom-color: #334155; }
  .fl-th:hover { color: #15803d; }
  .fl-th-right { text-align: right; }
  .fl-th-inner { display: inline-flex; align-items: center; }
  .fl-tr {
    border-bottom: 1px solid #f8fafc;
    transition: background 0.15s;
    animation: flIn 0.4s cubic-bezier(.22,1,.36,1) both;
  }
  .dark .fl-tr { border-bottom-color: #1e293b; }
  .fl-tr:last-child { border-bottom: none; }
  .fl-tr:hover { background: #f8fffe; }
  .dark .fl-tr:hover { background: #172033; }
  .fl-td {
    padding: 14px 16px; font-size: 13.5px; color: #334155; vertical-align: middle;
  }
  .dark .fl-td { color: #cbd5e1; }
  .fl-td-name {
    font-weight: 600; color: #0f172a; display: flex; align-items: center; gap: 8px; white-space: nowrap;
  }
  .dark .fl-td-name { color: #f1f5f9; }
  .fl-species-dot { font-size: 18px; }
  .fl-td-mono { font-variant-numeric: tabular-nums; font-size: 13px; }
  .fl-td-current { font-weight: 700; color: #15803d; font-variant-numeric: tabular-nums; }
  .fl-td-actions { text-align: right; white-space: nowrap; }
  .fl-badge {
    display: inline-flex; padding: 3px 9px; border-radius: 999px;
    font-size: 11px; font-weight: 700; background: #f1f5f9; color: #64748b;
  }
  .fl-dash { color: #cbd5e1; }
  .fl-age-chip {
    display: inline-flex; padding: 3px 8px; border-radius: 8px;
    background: #e0e7ff; color: #3730a3;
    font-size: 11.5px; font-weight: 700;
  }

  /* ── Action Buttons ── */
  .fl-action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 8px;
    border: none; cursor: pointer; margin-left: 4px;
    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  }
  .fl-action-btn:hover { transform: scale(1.1); }
  .fl-action-view { background: #f0fdf4; color: #15803d; }
  .fl-action-view:hover { background: #dcfce7; box-shadow: 0 2px 8px rgba(21,128,61,0.2); }
  .fl-action-edit { background: #eff6ff; color: #2563eb; }
  .fl-action-edit:hover { background: #dbeafe; box-shadow: 0 2px 8px rgba(37,99,235,0.2); }
  .fl-action-del { background: #fff5f5; color: #dc2626; }
  .fl-action-del:hover { background: #fee2e2; box-shadow: 0 2px 8px rgba(220,38,38,0.2); }

  /* ── Empty / Loading ── */
  .fl-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 64px 20px; text-align: center;
  }
  .fl-empty-icon { font-size: 52px; margin-bottom: 16px; }
  .fl-empty-title { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: #0f172a; margin: 0 0 8px; }
  .dark .fl-empty-title { color: #f1f5f9; }
  .fl-empty-sub { font-size: 13.5px; color: #94a3b8; margin: 0; }
  .fl-loading-wrap { display: flex; flex-direction: column; gap: 12px; width: 100%; padding: 0 20px; }
  .fl-skeleton {
    height: 52px; border-radius: 10px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite, flIn 0.4s ease both;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ── Pagination ── */
  .fl-pagination {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
    padding: 14px 20px; border-top: 1px solid #f1f5f9;
  }
  .dark .fl-pagination { border-top-color: #334155; }
  .fl-page-info { font-size: 12.5px; color: #94a3b8; }
  .fl-page-btns { display: flex; align-items: center; gap: 4px; }
  .fl-page-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 9px;
    border: 1.5px solid #e2e8f0; background: white; color: #475569;
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
  }
  .fl-page-btn:hover:not(:disabled) { border-color: #15803d; color: #15803d; background: #f0fdf4; }
  .fl-page-btn:disabled { opacity: 0.35; cursor: default; }
  .fl-page-num {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 32px; height: 32px; border-radius: 9px; padding: 0 4px;
    border: 1.5px solid #e2e8f0; background: white;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13px; font-weight: 600; color: #475569;
    cursor: pointer; transition: all 0.2s;
  }
  .fl-page-num:hover { border-color: #15803d; color: #15803d; background: #f0fdf4; }
  .fl-page-num-active { background: #15803d !important; color: white !important; border-color: #15803d !important; }
  .fl-page-dots { padding: 0 4px; color: #94a3b8; font-size: 13px; }

  /* ── Animation ── */
  @keyframes flIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const FORM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');

  .flock-form {
    display: flex; flex-direction: column; gap: 16px;
    font-family: 'DM Sans', system-ui, sans-serif;
    padding-top: 4px;
  }
  .ff-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ff-group { display: flex; flex-direction: column; gap: 6px; }
  .ff-label {
    font-size: 12px; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.07em;
    display: flex; align-items: center; gap: 5px;
  }
  .ff-label-dim { opacity: 0.45; }
  .ff-label-icon { flex-shrink: 0; }
  .ff-optional { font-weight: 400; font-size: 11px; color: #b0bec5; text-transform: none; letter-spacing: 0; }

  .ff-input-wrap { position: relative; }
  .ff-input, .ff-select, .ff-textarea {
    width: 100%; padding: 10px 14px;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14px; color: #0f172a; background: #fafafa;
    outline: none; box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .ff-input:focus, .ff-select:focus, .ff-textarea:focus {
    border-color: #15803d;
    box-shadow: 0 0 0 3px rgba(21,128,61,0.09);
    background: white;
  }
  .ff-input-disabled, .ff-select-disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
  .ff-input-num { font-variant-numeric: tabular-nums; font-weight: 600; }
  .ff-textarea { resize: vertical; min-height: 72px; line-height: 1.6; }

  .ff-select-wrap { position: relative; }
  .ff-select { appearance: none; padding-right: 32px; cursor: pointer; }
  .ff-select-arrow {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: #94a3b8; pointer-events: none;
  }

  .ff-actions {
    display: flex; gap: 10px; padding-top: 4px;
  }
  .ff-btn-cancel {
    flex: 1; padding: 11px;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    background: white; color: #64748b;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .ff-btn-cancel:hover { border-color: #cbd5e1; background: #f8fafc; }
  .ff-btn-submit {
    flex: 2; padding: 11px;
    background: #15803d; color: white; border: none;
    border-radius: 12px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14px; font-weight: 700; cursor: pointer;
    box-shadow: 0 3px 12px rgba(21,128,61,0.28);
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .ff-btn-submit:hover:not(:disabled) { background: #166534; transform: translateY(-1px); box-shadow: 0 5px 18px rgba(21,128,61,0.38); }
  .ff-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .ff-spinner {
    width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.35);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── View modal ── */
  .fv-root { display: flex; flex-direction: column; gap: 16px; padding-top: 4px; mt-top:20px }
  .fv-hero {
    display: flex; align-items: center; gap: 14px;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-radius: 16px; padding: 16px 18px;
  }
  .fv-emoji { font-size: 36px; }
  .fv-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 3px;
  }
  .fv-meta { font-size: 12.5px; color: #64748b; }
  .fv-stats {
    display: flex; align-items: center; justify-content: space-around;
    background: #fafafa; border: 1px solid #f1f5f9; border-radius: 14px; padding: 14px;
  }
  .fv-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .fv-stat-val { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: #0f172a; }
  .fv-stat-green { color: #15803d; }
  .fv-stat-red   { color: #dc2626; }
  .fv-stat-lbl { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
  .fv-stat-div { width: 1px; height: 36px; background: #e2e8f0; }
  .fv-grid { display: flex; flex-direction: column; gap: 0; border: 1px solid #f1f5f9; border-radius: 14px; overflow: hidden; }
  .fv-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 16px; font-size: 13.5px;
    border-bottom: 1px solid #f8fafc;
    transition: background 0.12s;
  }
  .fv-row:last-child { border-bottom: none; }
  .fv-row:hover { background: #f8fffe; }
  .fv-row-lbl { font-weight: 600; color: #94a3b8; font-size: 12.5px; }
  .fv-row-val { color: #334155; font-weight: 500; }
  .fv-notes { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; }
  .fv-notes-lbl { font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.07em; display: block; margin-bottom: 5px; }
  .fv-notes-text { font-size: 13.5px; color: #78350f; margin: 0; line-height: 1.6; }
`;

export default Flocks;