import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (form.name.trim().length < 3) errs.name = "Minimum 3 caractères";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Email invalide";
    if (form.password.length < 6) errs.password = "Minimum 6 caractères";
    if (form.password !== form.confirm) errs.confirm = "Les mots de passe ne correspondent pas";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const result = await register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    navigate("/");
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1>Inscription</h1>

      {serverError && <div className="alert">{serverError}</div>}

      <label>Nom complet</label>
      <input name="name" value={form.name} onChange={handleChange} />
      {errors.name && <small className="error">{errors.name}</small>}

      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} />
      {errors.email && <small className="error">{errors.email}</small>}

      <label>Mot de passe</label>
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      {errors.password && <small className="error">{errors.password}</small>}

      <label>Confirmer le mot de passe</label>
      <input name="confirm" type="password" value={form.confirm} onChange={handleChange} />
      {errors.confirm && <small className="error">{errors.confirm}</small>}

      <button type="submit" className="btn btn-green">S'inscrire</button>

      <p className="form-footer">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </form>
  );
}