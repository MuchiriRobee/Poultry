import { Request, Response } from 'express';
import { EggService } from '../services/egg.service';

const eggService = new EggService();

export class EggController {

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { farm_id, flock_id, ...eggData } = req.body;

      if (!farm_id || !flock_id) {
        return res.status(400).json({ success: false, message: "farm_id and flock_id are required" });
      }

      const eggLog = await eggService.createEggLog(Number(farm_id), Number(flock_id), eggData);

      res.status(201).json({
        success: true,
        message: "Egg production logged successfully",
        eggLog
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByFlock(req: Request, res: Response) {
    try {
      const flockId = Number(req.params.flockId);
      const logs = await eggService.getEggLogsByFlock(flockId);
      res.json({ success: true, logs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByFarm(req: Request, res: Response) {
    try {
      const farmId = Number(req.query.farm_id);
      if (!farmId) {
        return res.status(400).json({ success: false, message: "farm_id is required" });
      }
      const logs = await eggService.getEggLogsByFarm(farmId);
      res.json({ success: true, logs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const log = await eggService.updateEggLog(Number(req.params.id), req.body);
      res.json({ success: true, log });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await eggService.deleteEggLog(Number(req.params.id));
      res.json({ success: true, message: "Egg log deleted" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}