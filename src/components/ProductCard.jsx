import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export default function ProductCard({ product, onAdd }) {
  const { addItem } = useCart();

  function handleQuickAdd(e) {
    e.preventDefault();
    addItem(product, 1);
    onAdd?.();
  }

  return (
    <div className="product-card">
      <Link to={`/produits/${product.id}`} style={{ display: "contents" }}>
        <div className="product-thumb">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="product-thumb-img" />
          ) : (
            product.name
          )}
        </div>
      </Link>
      <div className="product-body">
        <Link to={`/produits/${product.id}`} style={{ display: "contents" }}>
          {product.category && (
            <span className="product-category">{product.category.name.replace(/_/g, " ")}</span>
          )}
          <span className="product-name">{product.name}</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span className="product-price">{formatPrice(product.price)}</span>
          <button onClick={handleQuickAdd} title="Ajouter au panier" className="quick-add-btn">
            +
          </button>
        </div>
      </div>
    </div>
  );
}
