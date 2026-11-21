const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// Nakhdhou ken el champs el mسموح bihom (ma nkhallouch el client yb3ath ay 7aja)
function pickFields(body) {
  const { name, price, category, image, description } = body;
  return { name, price, category, image, description };
}

function validate(data) {
  if (!data.name || data.name.trim().length < 2) return "Nom: minimum 2 caractères";
  if (typeof data.price !== "number" || Number.isNaN(data.price) || data.price < 0) {
    return "Prix invalide";
  }
  if (!data.category || !data.category.trim()) return "Catégorie requise";
  return null;
}

// GET /api/products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/products/:id (public)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/products (admin)
router.post("/", auth, admin, async (req, res) => {
  try {
    const data = pickFields(req.body);
    const error = validate(data);
    if (error) return res.status(400).json({ message: error });

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/products/:id (admin)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    const data = pickFields(req.body);
    const error = validate(data);
    if (error) return res.status(400).json({ message: error });

    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!product) return res.status(404).json({ message: "Produit introuvable" });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/products/:id (admin)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });
    res.json({ message: "Produit supprimé" });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;