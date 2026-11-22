const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Nkhabbiw copie mel produit wa9t el commande (ken el prix yetbaddel ba3d)
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        emoji: String,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["en_attente", "confirmee", "expediee", "livree", "annulee"],
      default: "en_attente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);