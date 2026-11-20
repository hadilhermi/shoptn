import { useParams, Link } from "react-router-dom";
import { getProductById } from "../api/api";
import useFetch from "../hooks/useFetch";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { data: product, loading, error } = useFetch(getProductById, id);

  if (loading) return <Loader text="Chargement du produit..." />;

  if (error) {
    return (
      <div>
        <div className="alert">{error}</div>
        <Link to="/" className="btn">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="details">
      <div className="details-emoji">{product.emoji}</div>
      <div>
        <span className="card-category">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="card-price">{product.price} DT</p>
        <p>{product.description}</p>
        <button className="btn btn-green" onClick={() => addToCart(product)}>
          Ajouter au panier
        </button>{" "}
        <Link to="/" className="btn">← Retour</Link>
      </div>
    </div>
  );
}