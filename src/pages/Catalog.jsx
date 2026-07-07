import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

export default function Catalog() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [recommendations, setRecommendations] = useState([]);

  // Debounce : on attend une pause dans la frappe avant de relancer la recherche,
  // pour éviter un appel API à chaque caractère tapé (catalogue de 30k+ produits).
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    api.listCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError("");
    api
      .listProducts({ search, category_id: categoryId, page, page_size: PAGE_SIZE })
      .then((data) => {
        setProducts(data.items);
        setTotal(data.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [search, categoryId, page]);

  useEffect(() => {
    const loadRecommendations = user
      ? api.recommendForUser(user.id, 6)
      : api.recommendAnonymous(6);

    loadRecommendations.then(setRecommendations).catch(() => setRecommendations([]));
  }, [user]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  function handleQuickAdd() {
    setToastMessage("Ajouté au panier !");
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="page">
      {recommendations.length > 0 && (
        <section>
          <h2 className="section-title">
            {user ? "Recommandé pour vous" : "Populaire en ce moment"}
          </h2>
          <p className="section-subtitle">
            {user
              ? "Sélection personnalisée selon vos achats précédents."
              : "Connectez-vous pour des recommandations personnalisées."}
          </p>
          <div className="product-grid">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleQuickAdd} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="section-title">Catalogue</h2>
        <p className="section-subtitle">{total.toLocaleString("fr-FR")} produits disponibles</p>

        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Rechercher un produit..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <select
            className="search-input"
            style={{ maxWidth: 220 }}
            value={categoryId}
            onChange={(e) => {
              setPage(1);
              setCategoryId(e.target.value);
            }}
          >
            <option value="">Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="form-error">{error}</div>}

        {isLoading ? (
          <div className="loading-state">Chargement du catalogue...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">Aucun produit ne correspond à votre recherche.</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleQuickAdd} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ← Précédent
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Suivant →
            </button>
          </div>
        )}
      </section>

      <Toast message={toastMessage} />
    </div>
  );
}
