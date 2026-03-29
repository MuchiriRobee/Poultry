import { pool } from '../config/db';

export class FlockRepository {

  async createFlock(farmId: number, data: any) {
    const result = await pool.query(
      `INSERT INTO flocks 
       (farm_id, batch_name, bird_species, bird_type, breed, start_date, initial_count, current_count, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        farmId,
        data.batch_name,
        data.bird_species,
        data.bird_type || null,
        data.breed || null,
        data.start_date,
        data.initial_count,
        data.initial_count,           // current_count starts equal to initial_count
        'active',
        data.notes || null
      ]
    );
    return result.rows[0];
  }

  async findAllByFarmId(farmId: number) {
    const result = await pool.query(
      `SELECT * FROM flocks 
       WHERE farm_id = $1 
       ORDER BY start_date DESC`,
      [farmId]
    );
    return result.rows;
  }

  async findById(flockId: number) {
    const result = await pool.query(
      'SELECT * FROM flocks WHERE id = $1',
      [flockId]
    );
    return result.rows[0];
  }

  async updateFlock(flockId: number, data: any) {
    const result = await pool.query(
      `UPDATE flocks 
       SET batch_name = $1, bird_species = $2, bird_type = $3, breed = $4, 
           start_date = $5, initial_count = $6, current_count = $7, 
           status = $8, notes = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [
        data.batch_name,
        data.bird_species,
        data.bird_type || null,
        data.breed || null,
        data.start_date,
        data.initial_count,
        data.current_count || data.initial_count,
        data.status || 'active',
        data.notes || null,
        flockId
      ]
    );
    return result.rows[0];
  }

  async deleteFlock(flockId: number) {
    const result = await pool.query(
      'DELETE FROM flocks WHERE id = $1 RETURNING id',
      [flockId]
    );
    return result.rows[0];
  }
}