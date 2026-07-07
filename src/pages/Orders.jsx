import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_LABELS = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="product-card" style={{ padding: 0, overflow: "hidden" }}>
      <button
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {order.items.length} article(s) — {formatDate(order.created_at)}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-ink-soft)", marginTop: 4 }}>
            {STATUS_LABELS[order.status] || order.status}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="product-price">{formatPrice(order.total_amount)}</span>
          <span
            style={{
              display: "inline-block",
              transition: "transform var(--transition-base)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              color: "var(--color-primary)",
            }}
          >
            ▾
          </span>
        </div>
      </button>

      {expanded && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "12px 20px 16px",
            background: "var(--color-bg)",
          }}
        >
          {order.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i < order.items.length - 1 ? "1px solid var(--color-border)" : "none",
                fontSize: 13,
              }}
            >
              <span>
                {item.product_name || "Produit"} <span style={{ color: "var(--color-ink-soft)" }}>× {item.quantity}</span>
              </span>
              <span className="mono">{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .listMyOrders()
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="page loading-state">Chargement de vos commandes...</div>;

  return (
    <div className="page">
      <h1 className="section-title">Mes commandes</h1>
      <p className="section-subtitle">{orders.length} commande(s) passée(s)</p>

      {orders.length === 0 ? (
        <div className="empty-state">
          Vous n'avez pas encore passé de commande. <Link to="/catalogue">Découvrir le catalogue</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
