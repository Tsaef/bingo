require('dotenv').config();
const pool = require('../config/database');

const createTables = async () => {
  try {
    // Create bingo_grids table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bingo_grids (
        id UUID PRIMARY KEY,
        size INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create bingo_cells table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bingo_cells (
        id UUID PRIMARY KEY,
        grid_id UUID NOT NULL REFERENCES bingo_grids(id) ON DELETE CASCADE,
        text TEXT NOT NULL DEFAULT '',
        position INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_bingo_cells_grid_id ON bingo_cells(grid_id);
    `);

    // Create index for position ordering
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_bingo_cells_position ON bingo_cells(grid_id, position);
    `);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const runMigration = async () => {
  try {
    await createTables();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runMigration();
}

module.exports = { createTables };
