const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Ma nرجّ3ouch el password lel frontend, abadan
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: "Nom: minimum 3 caractères" });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Mot de passe: minimum 6 caractères" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }

    const hashed = await bcrypt.hash(password, 10);
    // role mouch men req.body: ay wa7ed ynajjem yكteb "admin" w yweli admin
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Remplis tous les champs" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const ok = user && (await bcrypt.compare(password, user.password));

    // Nafs el message fi 7altin: ma nخبrouch el hacker eli email mawjoud
    if (!ok) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    res.json({ token: createToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/auth/me (route protégée)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(publicUser(user));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;