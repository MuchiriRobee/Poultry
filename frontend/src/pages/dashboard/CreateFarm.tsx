import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const createFarmSchema = z.object({
  name: z.string().min(3, "Farm name must be at least 3 characters"),
  location: z.string().min(3, "Please enter a valid location"),
  capacity: z.number().min(50, "Capacity must be at least 50 birds"),
  description: z.string().optional(),
});

type CreateFarmForm = z.infer<typeof createFarmSchema>;

const CreateFarm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateFarmForm>({
    resolver: zodResolver(createFarmSchema),
    defaultValues: {
      capacity: 500,
    },
  });

const onSubmit = async (data: CreateFarmForm) => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const response = await axios.post(`${API_URL}/farms`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      toast.success("Farm created successfully!", {
        description: "Redirecting to your dashboard...",
      });
      
      // Force a small delay so the backend has time to commit
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 800);
    }
  } catch (error: any) {
    console.error("Create farm error:", error.response?.data || error);
    toast.error(error.response?.data?.message || "Failed to create farm. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Create Your First Farm
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Let's set up your poultry farm. You can add more farms later.
        </p>
      </div>

      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Farm Details</CardTitle>
          <CardDescription>
            Provide basic information about your poultry farm
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Farm Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Farm Name</Label>
              <Input
                id="name"
                placeholder="e.g. Green Valley Layers"
                {...register('name')}
                className="text-lg py-6"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  id="location"
                  placeholder="e.g. Nakuru, Kiambu, Eldoret"
                  className="pl-12 py-6"
                  {...register('location')}
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label htmlFor="capacity">Estimated Bird Capacity</Label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  id="capacity"
                  type="number"
                  placeholder="500"
                  className="pl-12 py-6"
                  {...register('capacity', { valueAsNumber: true })}
                />
              </div>
              <p className="text-xs text-slate-500">How many birds can your farm comfortably hold?</p>
              {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
            </div>

            {/* Description (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                placeholder="Brief description of your farm (e.g. Layer farm, Broiler operation, Free-range...)"
                className="w-full min-h-[120px] resize-y p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-emerald-600 focus:ring-0"
                {...register('description')}
              />
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full py-7 text-lg rounded-2xl"
                disabled={isLoading}
              >
                {isLoading ? "Creating Farm..." : "Create Farm & Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-slate-500 mt-10">
        You can add more farms later from Settings
      </p>
    </div>
  );
};

export default CreateFarm;