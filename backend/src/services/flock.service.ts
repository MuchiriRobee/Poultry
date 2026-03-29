import { FlockRepository } from '../repositories/flock.repository';

const flockRepository = new FlockRepository();

export class FlockService {

  async createFlock(userId: number, farmId: number, data: any) {
    if (!data.batch_name || !data.bird_species || !data.start_date || !data.initial_count) {
      throw new Error("Missing required fields: batch_name, bird_species, start_date, initial_count");
    }

    // Optional validation for Hen species
    if (data.bird_species === 'Hen' && (!data.bird_type || !data.breed)) {
      throw new Error("Bird type and breed are required when species is Hen");
    }

    return await flockRepository.createFlock(farmId, data);
  }

  async getFlocksByFarm(farmId: number) {
    return await flockRepository.findAllByFarmId(farmId);
  }

  async getFlockById(flockId: number) {
    const flock = await flockRepository.findById(flockId);
    if (!flock) throw new Error("Flock not found");
    return flock;
  }

  async updateFlock(flockId: number, data: any) {
    return await flockRepository.updateFlock(flockId, data);
  }

  async deleteFlock(flockId: number) {
    const deleted = await flockRepository.deleteFlock(flockId);
    if (!deleted) throw new Error("Flock not found");
    return deleted;
  }
}