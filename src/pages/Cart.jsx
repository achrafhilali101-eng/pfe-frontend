import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);
}

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!user) {
      navigate("/connexion");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await api.createOrder(
        items.map((i) => ({ product_id: i.product.id, quantity: i.quantity }))
      );
      clearCart();
      navigate("/mes-commandes");
    } catch (err) {
      setError(err.message || "Impossible de finaliser la commande.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <h1 className="section-title">Votre panier</h1>
        <div className="empty-state">
          Votre panier est vide. <Link to="/">Retourner au catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="section-title">Votre panier</h1>
      <p className="section-subtitle">{items.length} article(s) différent(s)</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="product-card"
            style={{
              padding: "14px 18px",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{product.name}</div>
              <div className="product-price" style={{ fontSize: 14, marginTop: 4 }}>
                {formatPrice(product.price)}
              </div>
            </div>

            <div className="qty-selector" style={{ margin: 0 }}>
              <button onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
              <span>{quantity}</span>
              <button onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
            </div>

            <div className="product-price" style={{ minWidth: 90, textAlign: "right" }}>
              {formatPrice(product.price * quantity)}
            </div>

            <button
              onClick={() => removeItem(product.id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-danger)",
                fontSize: 13,
                textDecoration: "underline",
              }}
            >
              Retirer
            </button>
          </div>
        ))}
      </div>

      {error && <div className="form-error">{error}</div>}

      <div
        className="product-card"
        style={{
          padding: "20px 24px",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "var(--color-ink-soft)" }}>Total</div>
          <div className="product-detail-price" style={{ margin: 0 }}>
            {formatPrice(totalAmount)}
          </div>
        </div>
        <button className="btn-add-cart" onClick={handleCheckout} disabled={isSubmitting}>
          {isSubmitting ? "Validation..." : "Valider la commande"}
        </button>
      </div>
    </div>
  );
}
