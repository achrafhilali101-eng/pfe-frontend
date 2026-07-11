import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import RecommendationsSection from "../components/RecommendationsSection";
import Toast from "../components/Toast";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    api
      .listCategories()
      .then((cats) => setCategories(cats.slice(0, 6)))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    navigate(`/catalogue${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function goToCategory(categoryId) {
    navigate(`/catalogue?category_id=${categoryId}`);
  }

  return (
    <div className="home-page">
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />

      <div className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Vendio — la marketplace qui vous connaît</span>
          <h1 className="hero-title">
            Achetez futé.
            <br />
            Vendez sans limites.
          </h1>
          <p className="hero-subtitle">
            Des recommandations qui s'affinent à chaque achat, des stocks toujours à jour,
            et des milliers de produits à portée de clic.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Envie de quoi aujourd'hui ?"
              aria-label="Rechercher un produit"
            />
            <button type="submit">Rechercher</button>
          </form>

          <button className="hero-catalog-btn" onClick={() => navigate("/catalogue")}>
            Explorer le catalogue →
          </button>

          {categories.length > 0 && (
            <div className="hero-categories">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  className="category-pill"
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => goToCategory(cat.id)}
                >
                  {cat.name.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="page" style={{ position: "relative", zIndex: 1 }}>
        <RecommendationsSection onAdd={() => setToastMessage("Ajouté au panier !")} />
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}
