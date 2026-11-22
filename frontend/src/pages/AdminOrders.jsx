import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllOrders, updateOrderStatus } from "../api/api";
import Loader from "../components/Loader";

const statuses = [
  { value: "en_attente", label: "En attente" },
  { value: "confirmee", label: "Confirmée" },
  { value: "expediee", label: "Expédiée" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
];

export default function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getAllOrders(token)
      .then((data) => {
        if (!cancelled) {
          setOrders(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleStatus(order, status) {
    setError("");
    try {
      const updated = await updateOrderStatus(token, order._id, status);
      // El réponse ma fihach "user", donc nبaddlou ken el statut
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status: updated.status } : o
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loader text="Chargement des commandes..." />;

  return (
    <div>
      <h1>Gestion des commandes</h1>

      {error && <div className="alert">{error}</div>}

      {orders.length === 0 && <p>Aucune commande pour le moment.</p>}

      {orders.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Produits</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                    <br />
                    <small>#{o._id.slice(-6)}</small>
                  </td>
                  <td>
                    {o.user ? o.user.name : "Utilisateur supprimé"}
                    {o.user && (
                      <>
                        <br />
                        <small>{o.user.email}</small>
                      </>
                    )}
                  </td>
                  <td>
                    {o.items.map((i, idx) => (
                      <div key={idx}>
                        {i.emoji} {i.name} × {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td>
                    <strong>{o.total} DT</strong>
                  </td>
                  <td>
                    <select
                      className={`status status-${o.status}`}
                      value={o.status}
                      onChange={(e) => handleStatus(o, e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}