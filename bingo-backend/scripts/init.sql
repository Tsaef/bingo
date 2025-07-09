-- Initialize the bingo database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bingo_grids table
CREATE TABLE IF NOT EXISTS bingo_grids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    size INTEGER NOT NULL CHECK (size >= 2 AND size <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bingo_cells table
CREATE TABLE IF NOT EXISTS bingo_cells (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grid_id UUID NOT NULL REFERENCES bingo_grids(id) ON DELETE CASCADE,
    text TEXT NOT NULL DEFAULT '',
    position INTEGER NOT NULL CHECK (position >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bingo_cells_grid_id ON bingo_cells(grid_id);
CREATE INDEX IF NOT EXISTS idx_bingo_cells_position ON bingo_cells(grid_id, position);

-- Create a unique constraint to ensure no duplicate positions per grid
ALTER TABLE bingo_cells ADD CONSTRAINT unique_grid_position UNIQUE (grid_id, position);

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bingo_grids_updated_at BEFORE UPDATE ON bingo_grids FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bingo_cells_updated_at BEFORE UPDATE ON bingo_cells FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
