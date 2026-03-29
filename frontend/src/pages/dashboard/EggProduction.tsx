import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

const EggProduction = () => {
  const { currentFarm } = useSelector((state: any) => state.farm);

  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [selectedFlock, setSelectedFlock] = useState<Flock | null>(null);
  const [eggLogs, setEggLogs] = useState<EggLog[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    eggs_collected: 0,
    broken_eggs: 0,
    notes: ''
  });

  // Format date as DD/MM/YY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const fetchFlocks = async () => {
    if (!currentFarm?.id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/flocks?farm_id=${currentFarm.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const flocksWithAge = res.data.flocks.map((f: any) => ({
          ...f,
          age_days: Math.floor((Date.now() - new Date(f.start_date).getTime()) / 86400000)
        }));
        setFlocks(flocksWithAge);
      }
    } catch (error) {
      toast.error("Failed to load flocks");
    }
  };

  const fetchEggLogs = async (flockId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/eggs/flock/${flockId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const logsWithRate = res.data.logs.map((log: any) => ({
          ...log,
          production_rate: log.eggs_collected > 0 
            ? Math.round(((log.eggs_collected - log.broken_eggs) / selectedFlock!.current_count) * 100)
            : 0
        }));
        setEggLogs(logsWithRate);
      }
    } catch (error) {
      toast.error("Failed to load egg history");
    }
  };

  useEffect(() => {
    fetchFlocks();
  }, [currentFarm]);

  const openLogModal = (flock: Flock) => {
    setSelectedFlock(flock);
    setFormData({ eggs_collected: 0, broken_eggs: 0, notes: '' });
    setIsLogModalOpen(true);
  };

  const openViewModal = async (flock: Flock) => {
    setSelectedFlock(flock);
    await fetchEggLogs(flock.id);
    setIsViewModalOpen(true);
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlock || !currentFarm) return;

    try {
      const token = localStorage.getItem('token');
      const payload = {
        farm_id: currentFarm.id,
        flock_id: selectedFlock.id,
        eggs_collected: formData.eggs_collected,
        broken_eggs: formData.broken_eggs,
        notes: formData.notes
      };

      await axios.post(`${API_URL}/eggs`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Egg production logged successfully");
      setIsLogModalOpen(false);
      setFormData({ eggs_collected: 0, broken_eggs: 0, notes: '' });
      fetchFlocks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to log eggs");
    }
  };

  const calculateProductionRate = (collected: number, broken: number, currentCount: number) => {
    if (currentCount === 0) return 0;
    const finalEggs = collected - broken;
    return Math.round((finalEggs / currentCount) * 100);
  };

  const averageRate = eggLogs.length > 0
    ? Math.round(eggLogs.reduce((sum, log) => sum + log.production_rate, 0) / eggLogs.length)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-4xl font-bold">Egg Production</h1>
          <p className="text-slate-600 dark:text-slate-400">Daily egg collection and performance tracking</p>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Flocks Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {flocks.length === 0 ? (
            <p className="text-center py-12 text-slate-500">No flocks found. Create a flock first.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4">Flock Name</th>
                    <th className="text-left py-4">Species</th>
                    <th className="text-left py-4">Type</th>
                    <th className="text-left py-4">Breed</th>
                    <th className="text-left py-4">Age (days)</th>
                    <th className="text-left py-4">Current Count</th>
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
                      <td className="py-4">{flock.age_days}</td>
                      <td className="py-4 font-medium">{flock.current_count}</td>
                      <td className="py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openLogModal(flock)}>
                          <Plus size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openViewModal(flock)}>
                          <Eye size={16} />
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

      {/* Log Daily Eggs Modal */}
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Daily Egg Production</DialogTitle>
            <DialogDescription>
              {selectedFlock?.batch_name} • {new Date().toLocaleDateString('en-KE')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogSubmit} className="space-y-6">
            <div>
              <Label>Eggs Collected</Label>
              <Input
                type="number"
                value={formData.eggs_collected}
                onChange={(e) => setFormData({ ...formData, eggs_collected: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <Label>Broken Eggs</Label>
              <Input
                type="number"
                value={formData.broken_eggs}
                onChange={(e) => setFormData({ ...formData, broken_eggs: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label>Trays</Label>
              <Input
                type="text"
                value={Math.floor(formData.eggs_collected / 30)}
                disabled
                className="bg-slate-100 dark:bg-slate-800"
              />
            </div>

            <div>
              <Label>Production Rate %</Label>
              <Input
                type="text"
                value={`${calculateProductionRate(formData.eggs_collected, formData.broken_eggs, selectedFlock?.current_count || 0)}%`}
                disabled
                className="bg-slate-100 dark:bg-slate-800"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any observations..."
              />
            </div>

            <Button type="submit" className="w-full py-6">Save Production Log</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* View History Dialog - Full Table + Average Rate */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Egg Production History</DialogTitle>
            <DialogDescription>{selectedFlock?.batch_name}</DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Eggs Collected</th>
                  <th className="text-left py-3">Broken Eggs</th>
                  <th className="text-left py-3">Trays</th>
                  <th className="text-left py-3">Production Rate %</th>
                  <th className="text-left py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {eggLogs.map(log => (
                  <tr key={log.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="py-3">{formatDate(log.log_date)}</td>
                    <td className="py-3 font-medium">{log.eggs_collected}</td>
                    <td className="py-3">{log.broken_eggs}</td>
                    <td className="py-3">{log.trays}</td>
                    <td className="py-3 font-medium text-emerald-600">{log.production_rate}%</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{log.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Average Rate */}
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-center">
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Average Egg Production Rate</p>
            <p className="text-4xl font-display font-bold text-emerald-600 dark:text-emerald-400">{averageRate}%</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EggProduction;