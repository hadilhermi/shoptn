require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  { name: "Écouteurs Bluetooth", price: 59, category: "Électronique", image: "🎧", description: "Écouteurs sans fil avec réduction de bruit." },
  { name: "Montre connectée", price: 129, category: "Électronique", image: "⌚", description: "Suivi d'activité et notifications." },
  { name: "Sac à dos", price: 45, category: "Mode", image: "🎒", description: "Sac à dos résistant et spacieux." },
  { name: "Sneakers", price: 89, category: "Mode", image: "👟", description: "Sneakers confortables pour tous les jours." },
  { name: "Lampe de bureau", price: 35, category: "Maison", image: "💡", description: "Lampe LED réglable." },
  { name: "Tasse isotherme", price: 25, category: "Maison", image: "☕", description: "Garde vos boissons chaudes 6 heures." },
  { name: "Clavier mécanique", price: 99, category: "Électronique", image: "⌨️", description: "Clavier mécanique rétroéclairé." },
  { name: "Lunettes de soleil", price: 49, category: "Mode", image: "🕶️", description: "Protection UV400." },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("8 produits ajoutés ✅");
  } catch (err) {
    console.error("Erreur:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();