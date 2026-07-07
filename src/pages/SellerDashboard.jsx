import { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import StockGauge from "../components/StockGauge";
import RevenueChart from "../components/RevenueChart";
import Toast from "../components/Toast";

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);
}

function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={accent ? { color: accent } : undefined}>
        {value}
      </span>
    </div>
  );
}

function ProductRow({ product, categories, onChanged }) {
  const [isEditing, setIsEditing] = useState(false);
  const [restockAmount, setRestockAmount] = useState(10);
  const [editForm, setEditForm] = useState({
    name: product.name,
    price: product.price,
    category_id: product.category?.id || "",
    image_url: product.image_url || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleRestock() {
    setIsSubmitting(true);
    setError("");
    try {
      await api.adjustStock(product.id, Number(restockAmount), "Réapprovisionnement manuel (dashboard)");
      onChanged();
    } catch (err) {
      setError("Échec du réapprovisionnement.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveEdit() {
    setIsSubmitting(true);
    setError("");
    try {
      await api.updateProduct(product.id, {
        name: editForm.name,
        price: Number(editForm.price),
        category_id: editForm.category_id || undefined,
        image_url: editForm.image_url || undefined,
      });
      setIsEditing(false);
      onChanged();
    } catch (err) {
      setError("Échec de la modification.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer "${product.name}" du catalogue ?`)) return;
    setIsSubmitting(true);
    try {
      await api.deleteProduct(product.id);
      onChanged();
    } catch (err) {
      setError("Échec de la suppression.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReactivate() {
    setIsSubmitting(true);
    try {
      await api.updateProduct(product.id, { is_active: true });
      onChanged();
    } catch (err) {
      setError("Échec de la réactivation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isEditing) {
    return (
      <tr>
        <td>
          <input
            value={editForm.name}
            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            style={{ width: "100%" }}
          />
        </td>
        <td>
          <select
            value={editForm.category_id}
            onChange={(e) => setEditForm((f) => ({ ...f, category_id: e.target.value }))}
          >
            <option value="">Non catégorisé</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="restock-input"
            value={editForm.price}
            onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
          />
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-small" onClick={handleSaveEdit} disabled={isSubmitting}>
              {isSubmitting ? "..." : "Enregistrer"}
            </button>
            <button
              className="btn-small"
              style={{ background: "transparent", color: "var(--color-ink-soft)" }}
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              Annuler
            </button>
          </div>
          {error && <div style={{ color: "var(--color-danger)", fontSize: 12, marginTop: 4 }}>{error}</div>}
        </td>
      </tr>
    );
  }

  return (
    <tr style={!product.is_active ? { opacity: 0.5 } : undefined}>
      <td>
        {product.name}
        {!product.is_active && (
          <span style={{ marginLeft: 8, fontSize: 11, color: "var(--color-danger)", fontWeight: 600 }}>
            SUPPRIMÉ
          </span>
        )}
      </td>
      <td>{product.category?.name.replace(/_/g, " ") || "—"}</td>
      <td className="mono">{formatPrice(product.price)}</td>
      <td style={{ minWidth: 140 }}>
        <StockGauge quantity={product.stock?.quantity ?? 0} />
      </td>
      <td>
        {product.is_active ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="number"
              min={1}
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
              className="restock-input"
            />
            <button className="btn-small" onClick={handleRestock} disabled={isSubmitting}>
              Réapprovisionner
            </button>
            <button className="btn-small" onClick={() => setIsEditing(true)} disabled={isSubmitting}>
              Modifier
            </button>
            <button
              className="btn-small"
              style={{ background: "var(--color-danger)" }}
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Supprimer
            </button>
          </div>
        ) : (
          <button className="btn-small" onClick={handleReactivate} disabled={isSubmitting}>
            Réactiver
          </button>
        )}
        {error && <div style={{ color: "var(--color-danger)", fontSize: 12, marginTop: 4 }}>{error}</div>}
      </td>
    </tr>
  );
}

function NewProductForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    initial_stock: 0,
    category_id: "",
    image_url: "",
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.createProduct({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        initial_stock: Number(form.initial_stock),
        category_id: form.category_id || undefined,
        image_url: form.image_url || undefined,
      });
      setForm({ name: "", description: "", price: "", initial_stock: 0, category_id: "", image_url: "" });
      onCreated();
    } catch (err) {
      setError("Impossible de créer le produit, vérifiez les champs.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="new-product-form">
      <div className="form-field">
        <label htmlFor="name">Nom du produit</label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Ex: Théière artisanale en cuivre"
        />
      </div>
      <div className="form-field">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Optionnel"
        />
      </div>
      <div className="form-field">
        <label htmlFor="category_id">Catégorie</label>
        <select
          id="category_id"
          value={form.category_id}
          onChange={(e) => updateField("category_id", e.target.value)}
        >
          <option value="">Non catégorisé</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="image_url">URL de l'image (optionnel)</label>
        <input
          id="image_url"
          type="url"
          value={form.image_url}
          onChange={(e) => updateField("image_url", e.target.value)}
          placeholder="https://exemple.com/photo-du-produit.jpg"
        />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div className="form-field" style={{ flex: 1 }}>
          <label htmlFor="price">Prix (€)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
          />
        </div>
        <div className="form-field" style={{ flex: 1 }}>
          <label htmlFor="initial_stock">Stock initial</label>
          <input
            id="initial_stock"
            type="number"
            min="0"
            value={form.initial_stock}
            onChange={(e) => updateField("initial_stock", e.target.value)}
          />
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <button className="btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Création..." : "Ajouter le produit"}
      </button>
    </form>
  );
}

export default function SellerDashboard() {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([api.getDashboardSummary(), api.listMyProducts()])
      .then(([summaryData, productsData]) => {
        setSummary(summaryData);
        setProducts(productsData);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    api.listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  function handleRestocked() {
    setToastMessage("Stock mis à jour.");
    loadData();
  }

  function handleProductCreated() {
    setToastMessage("Produit ajouté au catalogue.");
    setShowForm(false);
    loadData();
  }

  if (isLoading) return <div className="page loading-state">Chargement du dashboard...</div>;

  if (error) {
    return (
      <div className="page">
        <div className="form-error">
          {error.status === 400 || error.status === 403
            ? "Cette page est réservée aux comptes vendeurs (ex: seller1@demo.com)."
            : "Impossible de charger le dashboard."}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="section-title">Dashboard vendeur</h1>
          <p className="section-subtitle">Vue d'ensemble de votre activité</p>
        </div>
        <button className="btn-primary" style={{ width: "auto" }} onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Annuler" : "+ Ajouter un produit"}
        </button>
      </div>

      {showForm && (
        <div className="auth-card" style={{ marginBottom: 32 }}>
          <NewProductForm onCreated={handleProductCreated} />
        </div>
      )}

      <div className="stats-grid">
        <StatCard label="Chiffre d'affaires" value={formatPrice(summary.total_revenue)} />
        <StatCard label="Commandes" value={summary.total_orders} />
        <StatCard label="Produits au catalogue" value={summary.total_products} />
        <StatCard
          label="Stock faible"
          value={summary.low_stock_count}
          accent={summary.low_stock_count > 0 ? "var(--color-danger)" : undefined}
        />
      </div>

      <section>
        <h2 className="section-title">Chiffre d'affaires (30 derniers jours)</h2>
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius)", padding: 20, marginBottom: 40 }}>
          <RevenueChart data={summary.revenue_last_30_days} />
        </div>
      </section>

      <section>
        <h2 className="section-title">Mes produits & stocks</h2>
        <p className="section-subtitle">{products.length} produit(s) au catalogue</p>

        {products.length === 0 ? (
          <div className="empty-state">Vous n'avez pas encore de produit. Ajoutez-en un ci-dessus.</div>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Réapprovisionner</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow key={p.id} product={p} categories={categories} onChanged={handleRestocked} />
              ))}
            </tbody>
          </table>
        )}
      </section>

      <Toast message={toastMessage} />
    </div>
  );
}
