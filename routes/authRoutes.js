// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Rejestracja użytkownika
router.post('/register', async (req, res) => {
  const { login, email, password } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { login }] });
    if (user) {
      return res.status(400).json({ msg: 'Login lub e-mail już istnieje' });
    }

    user = new User({ login, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Błąd serwera');
  }
});

// Logowanie użytkownika
router.post('/login', async (req, res) => {
  const { loginOrEmail, password } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
    if (!user) {
      return res.status(400).json({ msg: 'Nieprawidłowy login lub hasło' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Nieprawidłowy login lub hasło' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Błąd serwera');
  }
});

module.exports = router;
