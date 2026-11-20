import { useState } from "react";
import { getProducts } from "../api/api";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const categories = ["Toutes", "Électronique", "Mode", "Maison"];

export default function Home() {
  const { data: products, loading, error } = useFetch(getProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");

  if (loading) return <Loader text="Chargement des produits..." />;
  if (error) return <div className="alert">{error}</div>;

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Toutes" || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <h1>Nos produits</h1>

      <input
        className="search"
        type="text"
        placeholder="Rechercher un produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "chip active" : "chip"}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="count">{filteredProducts.length} produit(s)</p>

      <div className="grid">
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filteredProducts.length === 0 && <p>Aucun produit trouvé.</p>}
    </div>
  );
}