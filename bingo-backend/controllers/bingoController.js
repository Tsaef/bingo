const BingoGridModel = require('../models/BingoGrid');
const { v4: uuidv4, validate: validateUUID } = require('uuid');

class BingoController {
  static async createGrid(req, res) {
    try {
      const { size, cells } = req.body;
      
      // Validate input
      if (!size || !Array.isArray(cells)) {
        return res.status(400).json({
          error: 'Invalid input. Size and cells array are required.'
        });
      }
      
      if (size < 2 || size > 5) {
        return res.status(400).json({
          error: 'Grid size must be between 2 and 5.'
        });
      }
      
      if (cells.length !== size * size) {
        return res.status(400).json({
          error: `Expected ${size * size} cells, received ${cells.length}.`
        });
      }
      
      // Validate cells structure
      for (let i = 0; i < cells.length; i++) {
        if (!cells[i] || typeof cells[i].text !== 'string') {
          return res.status(400).json({
            error: `Invalid cell at position ${i}. Each cell must have a text property.`
          });
        }
      }
      
      const gridId = await BingoGridModel.create(size, cells);
      
      res.status(201).json({
        id: gridId,
        message: 'Bingo grid created successfully'
      });
    } catch (error) {
      console.error('Error creating bingo grid:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  
  static async getGrid(req, res) {
    try {
      const { id } = req.params;
      
      // Validate UUID
      if (!validateUUID(id)) {
        return res.status(400).json({
          error: 'Invalid grid ID format'
        });
      }
      
      const grid = await BingoGridModel.getById(id);
      
      if (!grid) {
        return res.status(404).json({
          error: 'Bingo grid not found'
        });
      }
      
      res.json(grid);
    } catch (error) {
      console.error('Error retrieving bingo grid:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  
  static async checkGrid(req, res) {
    try {
      const { id } = req.params;
      
      // Validate UUID
      if (!validateUUID(id)) {
        return res.status(400).json({
          error: 'Invalid grid ID format'
        });
      }
      
      const exists = await BingoGridModel.exists(id);
      
      res.json({ exists });
    } catch (error) {
      console.error('Error checking bingo grid:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}

module.exports = BingoController;
