import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function navLinkClass({ isActive }) {
  return isActive ? "active" : undefined;
}

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
        <div className="navbar-left">
          <Link to="/" className="brand">
            <span className="brand-mark">Vend</span>io
          </Link>

          <nav className="nav-links">
            <NavLink to="/catalogue" className={navLinkClass}>
              Catalogue
            </NavLink>
            <NavLink to="/recommandations" className={navLinkClass}>
              Pour vous
            </NavLink>
            {user && (
              <NavLink to="/mes-commandes" className={navLinkClass}>
                Mes commandes
              </NavLink>
            )}
            {user?.role === "seller" && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
          </nav>
        </div>

        <div className="navbar-right">
          <Link to="/panier" className="cart-link" aria-label="Panier">
            <CartIcon />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <>
              <span className="navbar-username">{user.full_name || user.email}</span>
              <button onClick={handleLogout} className="nav-cta">
                Se déconnecter
              </button>
            </>
          ) : (
            <Link to="/connexion" className="nav-cta">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
