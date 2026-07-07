import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">Vend</span>io
        </Link>

        <nav className="nav-links">
          <Link to="/catalogue">Catalogue</Link>
          {user && <Link to="/mes-commandes">Mes commandes</Link>}
          {user?.role === "seller" && <Link to="/dashboard">Dashboard</Link>}
          <Link to="/panier">
            Panier{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
          {user ? (
            <>
              <span>{user.full_name || user.email}</span>
              <button onClick={handleLogout} className="btn-primary">
                Se déconnecter
              </button>
            </>
          ) : (
            <Link to="/connexion" className="nav-cta">
              Se connecter
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
