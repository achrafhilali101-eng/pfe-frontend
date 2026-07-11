import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "./ProductCard";

/**
 * Section de recommandations réutilisable : personnalisée si connecté
 * (collaborative filtering sur l'historique d'achat), fallback popularité sinon.
 */
export default function RecommendationsSection({ title, subtitle, limit = 8, onAdd }) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const request = user ? api.recommendForUser(user.id, limit) : api.recommendAnonymous(limit);
    request
      .then(setRecommendations)
      .catch(() => setRecommendations([]))
      .finally(() => setIsLoading(false));
  }, [user, limit]);

  const defaultTitle = user ? "Recommandé pour vous" : "Populaire en ce moment";
  const defaultSubtitle = user
    ? "Sélection personnalisée selon vos achats précédents."
    : "Connectez-vous pour des recommandations personnalisées.";

  if (isLoading) {
    return <div className="loading-state">Chargement des recommandations...</div>;
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="section-title">{title || defaultTitle}</h2>
      <p className="section-subtitle">{subtitle || defaultSubtitle}</p>
      <div className="product-grid">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
