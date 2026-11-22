import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/api";
import Loader from "../components/Loader";

const categories = ["Électronique", "Mode", "Maison"];
const emptyForm = {
  name: "",
  price: "",
  category: "Électronique",
  emoji: "",
  description: "",
};

export default function Admin() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
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
  }, [version]);

  function reload() {
    setVersion((v) => v + 1);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(p) {
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      emoji: p.emoji || "",
      description: p.description || "",
    });
    setEditingId(p.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Nom: minimum 2 caractères");
      return;
    }
    const price = Number(form.price);
    if (form.price === "" || Number.isNaN(price) || price < 0) {
      setError("Prix invalide");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(token, editingId, form);
      } else {
        await createProduct(token, form);
      }
      setForm(emptyForm);
      setEditingId(null);
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p) {
    if (!window.confirm(`Supprimer "${p.name}" ?`)) return;
    setError("");
    try {
      await deleteProduct(token, p.id);
      if (editingId === p.id) cancelEdit();
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loader text="Chargement..." />;

  return (
    <div>
      <h1>Administration</h1>

      <form className="form admin-form" onSubmit={handleSubmit} noValidate>
        <h2>{editingId ? "Modifier le produit" : "Ajouter un produit"}</h2>

        {error && <div className="alert">{error}</div>}

        <label>Nom</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Prix (DT)</label>
        <input
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
        />

        <label>Catégorie</label>
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Emoji</label>
        <input
          name="emoji"
          value={form.emoji}
          onChange={handleChange}
          placeholder="🎧"
        />

        <label>Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <div className="admin-actions">
          <button type="submit" className="btn btn-green" disabled={saving}>
            {saving ? "..." : editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button type="button" className="btn" onClick={cancelEdit}>
              Annuler
            </button>
          )}
        </div>
      </form>

      <h2 className="admin-title">Produits ({products.length})</h2>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="table-emoji">{p.emoji}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price} DT</td>
                <td>
                  <button className="btn-sm" onClick={() => startEdit(p)}>
                    Modifier
                  </button>{" "}
                  <button
                    className="btn-sm btn-danger"
                    onClick={() => handleDelete(p)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}