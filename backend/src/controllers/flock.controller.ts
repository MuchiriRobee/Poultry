import { Request, Response } from 'express';
import { FlockService } from '../services/flock.service';

const flockService = new FlockService();

export class FlockController {

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { farm_id, ...flockData } = req.body;

      if (!farm_id) {
        return res.status(400).json({ success: false, message: "farm_id is required" });
      }

      const flock = await flockService.createFlock(userId, Number(farm_id), flockData);

      res.status(201).json({
        success: true,
        message: "Flock created successfully",
        flock
      });
    } catch (error: any) {
      console.error("Create flock error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create flock"
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const farmId = Number(req.query.farm_id);

      if (!farmId) {
        return res.status(400).json({ success: false, message: "farm_id query parameter is required" });
      }

      const flocks = await flockService.getFlocksByFarm(farmId);
      res.json({ success: true, flocks });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const flock = await flockService.getFlockById(Number(req.params.id));
      res.json({ success: true, flock });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const flock = await flockService.updateFlock(Number(req.params.id), req.body);
      res.json({ success: true, flock });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await flockService.deleteFlock(Number(req.params.id));
      res.json({ success: true, message: "Flock deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}