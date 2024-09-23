// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Połączono z MongoDB'))
  .catch(err => console.error('Błąd połączenia z MongoDB:', err));

// Endpointy autoryzacyjne i tworzenie postaci
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/characters', require('./routes/characterRoutes'));

// Uruchomienie serwera
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
