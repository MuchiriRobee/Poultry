import { pool } from '../config/db';
import { RegisterInput } from '../types/auth.types';

export class UserRepository {
  async findByEmail(email: string) {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, password_hash FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async createUser({ firstName, lastName, email, passwordHash }: RegisterInput & { passwordHash: string }) {
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email`,
      [firstName, lastName, email, passwordHash]
    );
    return result.rows[0];
  }

  async getUserById(id: number) {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
}