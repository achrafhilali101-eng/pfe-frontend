import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", full_name: "", role: "buyer" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(
        err.message.includes("409")
          ? "Cet email est déjà utilisé."
          : "Impossible de créer le compte, vérifiez les champs."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="section-title">Créer un compte</h1>
        <p className="section-subtitle">Rejoignez la marketplace en quelques secondes.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="full_name">Nom complet</label>
            <input
              id="full_name"
              type="text"
              value={form.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              placeholder="Amine El Fassi"
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="vous@exemple.com"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="8 caractères minimum"
            />
          </div>
          <div className="form-field">
            <label htmlFor="role">Je suis</label>
            <select id="role" value={form.role} onChange={(e) => updateField("role", e.target.value)}>
              <option value="buyer">Acheteur</option>
              <option value="seller">Vendeur</option>
            </select>
          </div>
          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-switch">
          Déjà un compte ? <Link to="/connexion">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
