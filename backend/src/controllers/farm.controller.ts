import { Request, Response } from 'express';
import { FarmService } from '../services/farm.service';

const farmService = new FarmService();

export class FarmController {

async create(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const farm = await farmService.createFarm(userId, req.body);
    
    res.status(201).json({ 
      success: true, 
      message: "Farm created successfully",
      farm 
    });
  } catch (error: any) {
    console.error("Farm creation error:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message || "Failed to create farm" 
    });
  }
}

  async getUserFarms(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const farms = await farmService.getUserFarms(userId);
      
      res.json({ 
        success: true, 
        farms 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getDashboardStats(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const data = await farmService.getDashboardStats(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}