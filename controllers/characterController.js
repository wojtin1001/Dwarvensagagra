const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const defaultStats = require('../models/defaultStats');

// Tworzenie nowej postaci
exports.createCharacter = async (req, res) => {
  try {
    const { userId, characterName, characterClass } = req.body;

    console.log('Dane z frontendu:', req.body); // Sprawdź, jakie dane przychodzą
    // Pobierz domyślne statystyki dla danej klasy
    const defaultClassStats = defaultStats[characterClass];
    if (!defaultClassStats) {
      return res.status(400).json({ msg: 'Nieprawidłowa klasa postaci' });
    }

    // Utworzenie nowej postaci z domyślnymi wartościami
    const newCharacter = new Character({
      userId,
      characterName,
      characterClass, // Użyj characterClass
      strength: defaultClassStats.strength,
      agility: defaultClassStats.agility,
      intelligence: defaultClassStats.intelligence,
      vitality: defaultClassStats.vitality,
      gold: defaultClassStats.gold,
      premiumCurrency: defaultClassStats.premiumCurrency,
      maxHealth: 100 + defaultClassStats.vitality * 2,
      currentHealth: 100 + defaultClassStats.vitality * 2,
    });
    console.log(newCharacter)
    await newCharacter.save();
    res.json(newCharacter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Błąd serwera');
  }
};
