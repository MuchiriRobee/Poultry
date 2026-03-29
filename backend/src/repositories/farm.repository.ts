import { pool } from '../config/db';

export class FarmRepository {
  async createFarm(userId: number, data: { name: string; location: string; capacity: number }) {
    const result = await pool.query(
      `INSERT INTO farms (name, location, capacity, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, location, capacity`,
      [data.name, data.location, data.capacity, userId]
    );
    return result.rows[0];
  }

async findByUserId(userId: number) {
  const result = await pool.query(
    `SELECT id, name, location, capacity, created_at 
     FROM farms 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

async getFarmStats(farmId: number) {
  try {
    const result = await pool.query(`
      SELECT 
        COALESCE((SELECT SUM(current_birds) FROM flocks WHERE farm_id = $1), 0) as total_birds,
        COALESCE((SELECT SUM(eggs_collected) 
                  FROM production_logs 
                  WHERE farm_id = $1 
                    AND log_date = CURRENT_DATE), 0) as eggs_today
    `, [farmId]);

    return result.rows[0] || { total_birds: 0, eggs_today: 0 };
  } catch (error) {
    console.error("getFarmStats query error:", error);
    return { total_birds: 0, eggs_today: 0 };
  }
}
}