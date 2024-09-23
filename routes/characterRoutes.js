// routes/characterRoutes.js
const express = require('express');
const Character = require('../models/Character'); // Importujemy model postaci
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware do autoryzacji
const router = express.Router();
const characterController = require('../controllers/characterController');

// Tworzenie nowej postaci
router.post('/create-character', characterController.createCharacter);

// Pobierz wszystkie postaci użytkownika
router.get('/user-characters', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId; // ID użytkownika z middleware autoryzacji
      const characters = await Character.find({ userId });
      res.json(characters);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Błąd serwera');
    }
  });

module.exports = router;