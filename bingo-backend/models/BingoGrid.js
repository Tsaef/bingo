const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class BingoGridModel {
  static async create(size, cells) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const gridId = uuidv4();

      // Insert grid
      await client.query(
        'INSERT INTO bingo_grids (id, size) VALUES ($1, $2)',
        [gridId, size]
      );

      // Insert cells
      for (let i = 0; i < cells.length; i++) {
        const cellId = uuidv4();
        await client.query(
          'INSERT INTO bingo_cells (id, grid_id, text, position) VALUES ($1, $2, $3, $4)',
          [cellId, gridId, cells[i].text, i]
        );
      }

      await client.query('COMMIT');
      return gridId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getById(id) {
    const client = await pool.connect();
    try {
      // Get grid info
      const gridResult = await client.query(
        'SELECT id, size, created_at FROM bingo_grids WHERE id = $1',
        [id]
      );

      if (gridResult.rows.length === 0) {
        return null;
      }

      const grid = gridResult.rows[0];

      // Get cells
      const cellsResult = await client.query(
        'SELECT id, text, position FROM bingo_cells WHERE grid_id = $1 ORDER BY position',
        [id]
      );

      const cells = cellsResult.rows.map(row => ({
        id: row.id,
        text: row.text
      }));

      return {
        id: grid.id,
        size: grid.size,
        cells: cells,
        createdAt: grid.created_at
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  static async exists(id) {
    const result = await pool.query(
      'SELECT 1 FROM bingo_grids WHERE id = $1',
      [id]
    );
    return result.rows.length > 0;
  }
}

module.exports = BingoGridModel;
