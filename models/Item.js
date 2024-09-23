// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nazwa przedmiotu
  type: { type: String, required: true }, // Typ przedmiotu, np. 'weapon', 'armor', 'ring'
  baseDamage: { type: Number, default: 0 }, // Bazowe obrażenia (jeśli to broń)
  baseDefense: { type: Number, default: 0 }, // Bazowa obrona (jeśli to zbroja)
  strength: { type: Number, default: 0 }, // Bonus do siły
  agility: { type: Number, default: 0 }, // Bonus do zręczności
  intelligence: { type: Number, default: 0 }, // Bonus do inteligencji
  vitality: { type: Number, default: 0 }, // Bonus do vitality
  spread: { type: String, default: 'normal' } // Rozrzut obrażeń (jeśli to broń)
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
