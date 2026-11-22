import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../api/api";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";

const statusLabels = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export default function Orders() {
  const { token } = useAuth();
  const { data: orders, loading, error } = useFetch(getMyOrders, token);

  if (loading) return <Loader text="Chargement des commandes..." />;
  if (error) return <div className="alert">{error}</div>;

  return (
    <div>
      <h1>Mes commandes</h1>

      {orders.length === 0 && (
        <div>
          <p>Vous n'avez pas encore de commande.</p>
          <Link to="/" className="btn">Voir les produits</Link>
        </div>
      )}

      {orders.map((o) => (
        <div key={o._id} className="order-card">
          <div className="order-head">
            <span>
              {new Date(o.createdAt).toLocaleDateString("fr-FR")} · #
              {o._id.slice(-6)}
            </span>
            <span className={`status status-${o.status}`}>
              {statusLabels[o.status] || o.status}
            </span>
          </div>

          <ul className="summary">
            {o.items.map((i, idx) => (
              <li key={idx}>
                <span>
                  {i.emoji} {i.name} × {i.quantity}
                </span>
                <strong>{i.price * i.quantity} DT</strong>
              </li>
            ))}
          </ul>

          <p className="order-total">Total: {o.total} DT</p>
        </div>
      ))}
    </div>
  );
}