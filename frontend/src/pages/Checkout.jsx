import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/api";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  async function confirmOrder() {
    setError("");
    setLoading(true);
    try {
      const created = await createOrder(token, cart);
      setOrder(created);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // "order" lazem yetchecka 9bal "cart.length", khater clearCart yfarregh el panier
  if (order) {
    return (
      <div>
        <h1>Merci {user.name} 🎉</h1>
        <p>Votre commande a été enregistrée.</p>
        <p>
          Total: <strong>{order.total} DT</strong>
        </p>
        <Link to="/orders" className="btn">Voir mes commandes</Link>{" "}
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
      <p>
        Client: <strong>{user.name}</strong> ({user.email})
      </p>

      <ul className="summary">
        {cart.map((item) => (
          <li key={item.id}>
            <span>
              {item.emoji} {item.name} × {item.quantity}
            </span>
            <strong>{item.price * item.quantity} DT</strong>
          </li>
        ))}
      </ul>

      <h2>Total: {totalPrice} DT</h2>

      {error && <div className="alert">{error}</div>}

      <button className="btn btn-green" onClick={confirmOrder} disabled={loading}>
        {loading ? "Envoi..." : "Confirmer la commande"}
      </button>
    </div>
  );
}