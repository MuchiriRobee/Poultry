import { FarmRepository } from '../repositories/farm.repository';

const farmRepository = new FarmRepository();

export class FarmService {
  
async createFarm(userId: number, data: any) {
  // Add validation
  if (!data.name || !data.location || !data.capacity) {
    throw new Error("Name, location and capacity are required");
  }

  return await farmRepository.createFarm(userId, {
    name: data.name,
    location: data.location,
    capacity: Number(data.capacity)
  });
}

  async getUserFarms(userId: number) {
    return await farmRepository.findByUserId(userId);
  }

async getDashboardStats(userId: number) {
  try {
    const farms = await farmRepository.findByUserId(userId);
    
    if (farms.length === 0) {
      return { hasFarm: false, farms: [] };
    }

    const primaryFarm = farms[0];

    // Safer stats query with fallback
    const stats = await farmRepository.getFarmStats(primaryFarm.id);

    return {
      hasFarm: true,
      farms,
      currentFarm: primaryFarm,
      stats: {
        total_birds: stats?.total_birds || 0,
        eggs_today: stats?.eggs_today || 0,
      }
    };
  } catch (error) {
    console.error("getDashboardStats error:", error);
    throw error;
  }
}
}