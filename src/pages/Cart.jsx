import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!user) {
      navigate("/inscription");
      return;
    }

    if (shippingAddress.trim().length < 5 || shippingPhone.trim().length < 6) {
      setError("Merci de renseigner une adresse et un numéro de téléphone valides.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const { checkout_url } = await api.createCheckoutSession(
        items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        shippingAddress.trim(),
        shippingPhone.trim()
      );
      // Le panier sera vidé après confirmation réelle du paiement (page /confirmation),
      // pas ici -- pour ne pas le perdre si l'acheteur annule sur Stripe.
      window.location.href = checkout_url;
    } catch (err) {
      setError(err.message || "Impossible de démarrer le paiement.");
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

      <section style={{ marginBottom: 24 }}>
        <h2 className="section-title" style={{ fontSize: 20 }}>Livraison</h2>
        <p className="section-subtitle">Ces informations serviront au vendeur pour expédier votre commande.</p>

        <div className="auth-card" style={{ padding: 24 }}>
          <div className="form-field">
            <label htmlFor="shipping_address">Adresse de livraison</label>
            <input
              id="shipping_address"
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Ex: 12 Rue des Fleurs, Rabat"
            />
          </div>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label htmlFor="shipping_phone">Numéro de téléphone</label>
            <input
              id="shipping_phone"
              type="tel"
              value={shippingPhone}
              onChange={(e) => setShippingPhone(e.target.value)}
              placeholder="Ex: +212 6 00 00 00 00"
            />
          </div>
        </div>
      </section>

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
