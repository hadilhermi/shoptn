import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Ken jina men ProtectedRoute, nرجعou lel page el asliya, sinon l accueil
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Remplis tous les champs");
      return;
    }

    const result = login({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1>Connexion</h1>

      {error && <div className="alert">{error}</div>}

      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} />

      <label>Mot de passe</label>
      <input name="password" type="password" value={form.password} onChange={handleChange} />

      <button type="submit" className="btn btn-green">Se connecter</button>

      <p className="form-footer">
        Pas de compte ? <Link to="/register">S'inscrire</Link>
      </p>
    </form>
  );
}