import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [done, setDone] = useState(false);

  function confirmOrder() {
    clearCart();
    setDone(true);
  }

  // "done" lazem yetchecka 9bal "cart.length", 3ala 5ater clearCart yفarragh el panier
  if (done) {
    return (
      <div>
        <h1>Merci {user.name} 🎉</h1>
        <p>Votre commande a été enregistrée.</p>
        <Link to="/" className="btn">Retour à l'accueil</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div>
        <h1>Commande</h1>
        <p>Votre panier est vide.</p>
        <Link to="/" className="btn">Voir les produits</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Finaliser la commande</h1>
      <p>Client: <strong>{user.name}</strong> ({user.email})</p>

      <ul className="summary">
        {cart.map((item) => (
          <li key={item.id}>
            {item.emoji} {item.name} × {item.quantity}
            <strong>{item.price * item.quantity} DT</strong>
          </li>
        ))}
      </ul>

      <h2>Total: {totalPrice} DT</h2>
      <button className="btn btn-green" onClick={confirmOrder}>
        Confirmer la commande
      </button>
    </div>
  );
}