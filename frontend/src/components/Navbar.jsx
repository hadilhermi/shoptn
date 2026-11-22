import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">ShopTN</NavLink>

      <div className="nav-links">
        <NavLink to="/">Accueil</NavLink>

        <NavLink to="/cart">
          Panier {totalItems > 0 && <span className="badge">{totalItems}</span>}
        </NavLink>

        {user ? (
          <>
            <NavLink to="/orders">Commandes</NavLink>
            {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
            {user.role === "admin" && <NavLink to="/admin/orders">Gestion</NavLink>}
            <span className="nav-user">👤 {user.name}</span>
            <button className="nav-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Connexion</NavLink>
            <NavLink to="/register">Inscription</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}