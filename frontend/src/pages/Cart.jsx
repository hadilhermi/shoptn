import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div>
        <h1>Mon panier</h1>
        <p>Votre panier est vide.</p>
        <Link to="/" className="btn">Continuer mes achats</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Mon panier</h1>

      {cart.map((item) => (
        <div key={item.id} className="cart-row">
          <span className="cart-emoji">{item.emoji}</span>

          <div className="cart-info">
            <strong>{item.name}</strong>
            <span>{item.price} DT</span>
          </div>

          <div className="qty">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>

          <strong>{item.price * item.quantity} DT</strong>

          <button className="remove" onClick={() => removeFromCart(item.id)}>✗</button>
        </div>
      ))}

      <div className="cart-total">
        <h2>Total: {totalPrice} DT</h2>
        <div>
          <button className="btn" onClick={clearCart}>Vider le panier</button>{" "}
          <Link to="/checkout" className="btn btn-green">Passer la commande</Link>
        </div>
      </div>
    </div>
  );
}