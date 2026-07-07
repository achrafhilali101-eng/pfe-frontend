// Élément signature du design : une jauge visuelle de stock, présente sur chaque
// carte produit. Relie directement l'interface à la thématique "gestion des stocks
// en temps réel" du projet, plutôt qu'une simple étiquette de prix.

const THRESHOLDS = {
  low: { max: 5, color: "#c1443e", label: "Stock faible" },
  medium: { max: 20, color: "#5a9494", label: "Stock modéré" },
  high: { max: Infinity, color: "#088395", label: "En stock" },
};

function getTier(quantity) {
  if (quantity <= THRESHOLDS.low.max) return THRESHOLDS.low;
  if (quantity <= THRESHOLDS.medium.max) return THRESHOLDS.medium;
  return THRESHOLDS.high;
}

export default function StockGauge({ quantity }) {
  if (quantity === undefined || quantity === null) return null;

  const tier = getTier(quantity);
  const fillPercent = Math.min(100, (quantity / 30) * 100);

  return (
    <div>
      <div className="stock-gauge-track">
        <div
          className="stock-gauge-fill"
          style={{ width: `${fillPercent}%`, background: tier.color }}
        />
      </div>
      <div className="stock-label">
        <span>{tier.label}</span>
        <span>{quantity} u.</span>
      </div>
    </div>
  );
}
