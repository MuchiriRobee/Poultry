import { pool } from '../config/db';

export class EggRepository {
async createEggLog(farmId: number, flockId: number, data: any) {
  const logDate = data.log_date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const result = await pool.query(
    `INSERT INTO eggs 
     (farm_id, flock_id, log_date, eggs_collected, broken_eggs, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      farmId,
      flockId,
      logDate,                    // Send actual date string
      data.eggs_collected,
      data.broken_eggs || 0,
      data.notes || null
    ]
  );
  return result.rows[0];
}

  async getEggLogsByFlock(flockId: number, limit: number = 30) {
    const result = await pool.query(
      `SELECT * FROM eggs 
       WHERE flock_id = $1 
       ORDER BY log_date DESC 
       LIMIT $2`,
      [flockId, limit]
    );
    return result.rows;
  }

  async getEggLogsByFarm(farmId: number) {
    const result = await pool.query(
      `SELECT e.*, f.batch_name 
       FROM eggs e
       JOIN flocks f ON e.flock_id = f.id
       WHERE e.farm_id = $1 
       ORDER BY e.log_date DESC`,
      [farmId]
    );
    return result.rows;
  }

  async updateEggLog(id: number, data: any) {
    const result = await pool.query(
      `UPDATE eggs 
       SET eggs_collected = $1, broken_eggs = $2, notes = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [data.eggs_collected, data.broken_eggs || 0, data.notes || null, id]
    );
    return result.rows[0];
  }

  async deleteEggLog(id: number) {
    const result = await pool.query('DELETE FROM eggs WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}