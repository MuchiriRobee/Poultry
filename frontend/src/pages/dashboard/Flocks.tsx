import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const Flocks = () => {
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlock, setEditingFlock] = useState<Flock | null>(null);
  const [viewFlock, setViewFlock] = useState<Flock | null>(null);
  const { currentFarm } = useSelector((state: any) => state.farm);
  
  //const navigate = useNavigate();

  // TODO: Get current farm from layout/Redux later
  const farmId = currentFarm?.id;

  const fetchFlocks = async () => {
if (!farmId) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/flocks?farm_id=${farmId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const flocksWithAge = res.data.flocks.map((flock: any) => ({
          ...flock,
          age_days: Math.floor((Date.now() - new Date(flock.start_date).getTime()) / (86400000))
        }));
        setFlocks(flocksWithAge);
      }
    } catch (error) {
      toast.error("Failed to load flocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlocks();
  }, []);

  const openNewModal = () => {
    setEditingFlock(null);
    setIsModalOpen(true);
  };

  const openEditModal = (flock: Flock) => {
    setEditingFlock(flock);
    setIsModalOpen(true);
  };

  const openView = (flock: Flock) => {
    setViewFlock(flock);
  };

  const handleDelete = async (flockId: number) => {
    if (!confirm("Delete this flock? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/flocks/${flockId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Flock deleted");
      fetchFlocks();
    } catch (error) {
      toast.error("Failed to delete flock");
    }
  };

const FlockForm = () => {
  const [formData, setFormData] = useState({
    batch_name: editingFlock?.batch_name || '',
    bird_species: editingFlock?.bird_species || 'Hen',
    bird_type: editingFlock?.bird_type || '',
    breed: editingFlock?.breed || '',
    start_date: editingFlock?.start_date || '',
    initial_count: editingFlock?.initial_count || 500,
    notes: editingFlock?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData, farm_id: farmId };

      if (editingFlock) {
        await axios.put(`${API_URL}/flocks/${editingFlock.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Flock updated successfully");
      } else {
        await axios.post(`${API_URL}/flocks`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Flock created successfully");
      }

      setIsModalOpen(false);
      fetchFlocks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Flock Name / Batch</Label>
          <Input
            value={formData.batch_name}
            onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
            placeholder="Batch 01/04"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Bird Species</Label>
            <Select value={formData.bird_species} onValueChange={(v) => setFormData({ ...formData, bird_species: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hen">Hen</SelectItem>
                <SelectItem value="Duck">Duck</SelectItem>
                <SelectItem value="Turkey">Turkey</SelectItem>
                <SelectItem value="Goose">Goose</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Bird Type</Label>
            <Select 
              value={formData.bird_type} 
              onValueChange={(v) => setFormData({ ...formData, bird_type: v })}
              disabled={formData.bird_species !== 'Hen'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Broiler">Broiler</SelectItem>
                <SelectItem value="Layer">Layer</SelectItem>
                <SelectItem value="Kienyeji">Kienyeji</SelectItem>
                <SelectItem value="Dual">Dual Purpose</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Breed</Label>
          <Input
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            placeholder="Kuroiler, Kenchic, Sasso..."
            disabled={formData.bird_species !== 'Hen'}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Day 1 (Start Date)</Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Initial Count</Label>
            <Input
              type="number"
              value={formData.initial_count}
              onChange={(e) => setFormData({ ...formData, initial_count: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        <div>
          <Label>Notes (Optional)</Label>
          <textarea
            className="w-full h-24 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional information..."
          />
        </div>

        <Button type="submit" className="w-full py-6 text-lg">
          {editingFlock ? "Update Flock" : "Create New Flock"}
        </Button>
      </form>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-4xl font-bold">Flocks & Batches</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage all your bird batches</p>
        </div>
        <Button onClick={openNewModal} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2" /> New Flock
        </Button>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Flocks ({flocks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {flocks.length === 0 ? (
            <p className="text-center py-12 text-slate-500">No flocks yet. Create your first one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4">Flock Name</th>
                    <th className="text-left py-4">Species</th>
                    <th className="text-left py-4">Type</th>
                    <th className="text-left py-4">Breed</th>
                    <th className="text-left py-4">Start Date</th>
                    <th className="text-left py-4">Age (days)</th>
                    <th className="text-left py-4">Initial</th>
                    <th className="text-left py-4">Current</th>
                    <th className="text-right py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flocks.map(flock => (
                    <tr key={flock.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                      <td className="py-4 font-medium">{flock.batch_name}</td>
                      <td className="py-4">{flock.bird_species}</td>
                      <td className="py-4">{flock.bird_type || '-'}</td>
                      <td className="py-4">{flock.breed || '-'}</td>
                      <td className="py-4">{new Date(flock.start_date).toLocaleDateString('en-KE')}</td>
                      <td className="py-4 font-medium">{flock.age_days}</td>
                      <td className="py-4">{flock.initial_count}</td>
                      <td className="py-4 font-medium">{flock.current_count}</td>
                      <td className="py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openView(flock)}><Eye size={16} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(flock)}><Edit2 size={16} /></Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(flock.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFlock ? "Edit Flock" : "New Flock"}</DialogTitle>
          </DialogHeader>
          <FlockForm />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={!!viewFlock} onOpenChange={() => setViewFlock(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flock Details</DialogTitle>
          </DialogHeader>
          {viewFlock && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Batch Name:</strong> {viewFlock.batch_name}</div>
                <div><strong>Species:</strong> {viewFlock.bird_species}</div>
                <div><strong>Type:</strong> {viewFlock.bird_type || '—'}</div>
                <div><strong>Breed:</strong> {viewFlock.breed || '—'}</div>
                <div><strong>Start Date:</strong> {new Date(viewFlock.start_date).toLocaleDateString('en-KE')}</div>
                <div><strong>Age:</strong> {viewFlock.age_days} days</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Flocks;