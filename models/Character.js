// models/Character.js
const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  characterClass: { type: String, required: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  strength: { type: Number, default: 0 }, // Siła
  agility: { type: Number, default: 0 }, // Zręczność
  intelligence: { type: Number, default: 0 }, // Inteligencja
  vitality: { type: Number, default: 0 }, // Wytrzymałość
  condition: { type: Number, default: 100 },
  uniqueAbility: { type: String },
  maxHealth: { type: Number, default: 100 },
  currentHealth: { type: Number, default: 100 },
  gold: { type: Number, default: 0 },
  premiumCurrency: { type: Number, default: 0 },

  baseDamage: { type: Number, default: 10 }, // Bazowy damage
  baseDefense: { type: Number, default: 5 }, // Bazowa obrona

  damage: { type: Number, default: 10 }, // Wynikowy damage
  defense: { type: Number, default: 5 }, // Wynikowa obrona

  equipment: {
    weapon: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null }, // Domyślna wartość null
    shield: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
    armor: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
    helmet: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
    boots: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
    leggings: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
    necklace: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
    ring: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  },

  resources: {
    iron: { type: Number, default: 0 },
    wood: { type: Number, default: 0 },
    stone: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
  },
  backpack: {
    slots: { type: Number, default: 10 },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
  }
});

// Obliczanie bonusów ze statystyk ekwipunku
characterSchema.methods.calculateEquipmentStats = function() {
  let bonusStrength = 0;
  let bonusAgility = 0;
  let bonusIntelligence = 0;
  let bonusVitality = 0;

  const items = ['weapon', 'shield', 'armor', 'helmet', 'boots', 'leggings', 'necklace', 'ring'];
  for (const slot of items) {
    if (this.equipment[slot]) {
      const item = this.equipment[slot];
      bonusStrength += item.strength || 0; // Domyślna wartość, jeśli item.strength nie istnieje
      bonusAgility += item.agility || 0;
      bonusIntelligence += item.intelligence || 0;
      bonusVitality += item.vitality || 0;
    }
  }

  return {
    bonusStrength,
    bonusAgility,
    bonusIntelligence,
    bonusVitality
  };
};

// Dynamiczne obliczanie statystyk postaci z uwzględnieniem bonusów z ekwipunku
characterSchema.methods.calculateTotalStats = function() {
  const { bonusStrength, bonusAgility, bonusIntelligence, bonusVitality } = this.calculateEquipmentStats();

  this.strength += bonusStrength;
  this.agility += bonusAgility;
  this.intelligence += bonusIntelligence;
  this.vitality += bonusVitality;

  this.calculateFinalDamage(); // Obliczanie damage z bonusami
  this.calculateDefense(); // Obliczanie defense z bonusami
};

// Funkcja do obliczania damage z dominującej statystyki i broni
characterSchema.methods.calculateFinalDamage = function() {
  const statDamage = this.calculateDominantStatDamage();

  let weaponDamage = 0;
  let weaponSpread = 'normal';

  if (this.equipment.weapon) {
    const weapon = this.equipment.weapon;
    weaponDamage = weapon.baseDamage;
    weaponSpread = weapon.spread;
  }

  const totalDamage = statDamage + weaponDamage;
  this.damage = calculateDamageWithBilateralSpread(totalDamage, weaponSpread);
};

// Funkcja do obliczenia damage z dwustronnym rozrzutem na podstawie broni
function calculateDamageWithBilateralSpread(baseDamage, spread) {
  let minMultiplier, maxMultiplier;

  switch (spread) {
    case 'very small':
      minMultiplier = 0.95;
      maxMultiplier = 1.05;
      break;
    case 'small':
      minMultiplier = 0.9;
      maxMultiplier = 1.1;
      break;
    case 'normal':
      minMultiplier = 0.8;
      maxMultiplier = 1.2;
      break;
    case 'large':
      minMultiplier = 0.7;
      maxMultiplier = 1.3;
      break;
    case 'very large':
      minMultiplier = 0.6;
      maxMultiplier = 1.4;
      break;
    default:
      minMultiplier = 0.8;
      maxMultiplier = 1.2;
      break;
  }

  // Losowe obrażenia z przedziału określonego przez spread
  return Math.floor(Math.random() * (baseDamage * maxMultiplier - baseDamage * minMultiplier + 1)) + Math.floor(baseDamage * minMultiplier);
}

const Character = mongoose.model('Character', characterSchema);
module.exports = Character;
