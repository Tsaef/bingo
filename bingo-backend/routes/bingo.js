const express = require('express');
const BingoController = require('../controllers/bingoController');

const router = express.Router();

// Create a new bingo grid
router.post('/grids', BingoController.createGrid);

// Get a bingo grid by ID
router.get('/grids/:id', BingoController.getGrid);

// Check if a bingo grid exists
router.get('/grids/:id/exists', BingoController.checkGrid);

module.exports = router;
