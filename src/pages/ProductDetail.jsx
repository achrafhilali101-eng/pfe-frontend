import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import StockGauge from "../components/StockGauge";
import Toast from "../components/Toast";
import { useStockSocket } from "../hooks/useStockSocket";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    api
      .getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));

    api.similarProducts(id, 6).then(setSimilar).catch(() => setSimilar([]));
  }, [id]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Si un autre client achète ce même produit pendant que cette page est
  // ouverte, la jauge de stock se met à jour ici en temps réel.
  useStockSocket((productId, quantity) => {
    setProduct((current) =>
      current && current.id === productId
        ? { ...current, stock: { ...current.stock, quantity } }
        : current
    );
  });

  function handleAddToCart() {
    addItem(product, quantity);
    setToastMessage("Ajouté au panier !");
    setQuantity(1);
  }

  if (isLoading) return <div className="page loading-state">Chargement du produit...</div>;
  if (!product) return <div className="page empty-state">Produit introuvable.</div>;

  const stockQuantity = product.stock?.quantity ?? 0;
  const outOfStock = stockQuantity <= 0;

  return (
    <div className="page">
      <div className="product-detail">
        <div className="product-detail-thumb">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="product-thumb-img" />
          ) : (
            product.name
          )}
        </div>

        <div>
          {product.category && (
            <span className="product-category">{product.category.name.replace(/_/g, " ")}</span>
          )}
          <h1 className="product-detail-title">{product.name}</h1>
          <div className="product-detail-price">{formatPrice(product.price)}</div>

          <StockGauge quantity={stockQuantity} />

          {product.description && (
            <p style={{ color: "var(--color-ink-soft)", marginTop: 20, lineHeight: 1.6 }}>
              {product.description}
            </p>
          )}

          {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}

          <div className="qty-selector">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={outOfStock}>
              −
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
              disabled={outOfStock}
            >
              +
            </button>
          </div>

          <button
            className="btn-add-cart"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
          </button>
        </div>
      </div>

      {similar.length > 0 && (
        <section>
          <h2 className="section-title">Vous pourriez aussi aimer</h2>
          <p className="section-subtitle">
            Produits similaires selon les habitudes d'achat d'autres clients.
          </p>
          <div className="product-grid">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Toast message={toastMessage} />
    </div>
  );
}
