import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <div className="card-emoji">{product.emoji}</div>
      <span className="card-category">{product.category}</span>
      <h3>{product.name}</h3>
      <p className="card-price">{product.price} DT</p>
      <Link to={`/product/${product.id}`} className="btn">
        Voir détails
      </Link>
      <button className="btn btn-green" onClick={() => addToCart(product)}>
        Ajouter au panier
      </button>
    </div>
  );
}