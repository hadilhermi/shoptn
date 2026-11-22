const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

const STATUSES = ["en_attente", "confirmee", "expediee", "livree", "annulee"];

// POST /api/orders (client connecté)
router.post("/", auth, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({ message: "Panier invalide" });
    }

    // Nvalidiw kol item, w njma3ou nafs el produit ken mawjoud marratin
    const wanted = new Map();
    for (const it of items) {
      const id = String(it.productId);
      const qty = Number(it.quantity);
      if (
        !mongoose.Types.ObjectId.isValid(id) ||
        !Number.isInteger(qty) ||
        qty < 1 ||
        qty > 99
      ) {
        return res.status(400).json({ message: "Panier invalide" });
      }
      wanted.set(id, Math.min((wanted.get(id) || 0) + qty, 99));
    }

    // El prix yji mel base, mouch mel client
    const products = await Product.find({ _id: { $in: [...wanted.keys()] } });
    if (products.length !== wanted.size) {
      return res.status(400).json({
        message: "Un produit de votre panier n'existe plus. Videz le panier et réessayez.",
      });
    }

    const orderItems = products.map((p) => ({
      product: p._id,
      name: p.name,
      price: p.price,
      emoji: p.image,
      quantity: wanted.get(String(p._id)),
    }));

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total,
    });

    res.status(201).json(order);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/orders/mine (el commandes mte3 el user el 7ali bark)
router.get("/mine", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/orders (admin: kol el commandes)
router.get("/", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PATCH /api/orders/:id/status (admin)
router.patch("/:id/status", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Commande introuvable" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Commande introuvable" });
    res.json(order);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;