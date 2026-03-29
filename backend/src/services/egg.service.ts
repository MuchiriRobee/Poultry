import { EggRepository } from '../repositories/egg.repository';

const eggRepository = new EggRepository();

export class EggService {
  async createEggLog(farmId: number, flockId: number, data: any) {
    if (!data.eggs_collected && data.eggs_collected !== 0) {
      throw new Error("eggs_collected is required");
    }
    return await eggRepository.createEggLog(farmId, flockId, data);
  }

  async getEggLogsByFlock(flockId: number) {
    return await eggRepository.getEggLogsByFlock(flockId);
  }

  async getEggLogsByFarm(farmId: number) {
    return await eggRepository.getEggLogsByFarm(farmId);
  }

  async updateEggLog(id: number, data: any) {
    return await eggRepository.updateEggLog(id, data);
  }

  async deleteEggLog(id: number) {
    const deleted = await eggRepository.deleteEggLog(id);
    if (!deleted) throw new Error("Egg log not found");
    return deleted;
  }
}