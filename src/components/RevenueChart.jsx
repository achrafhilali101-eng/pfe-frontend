// Graphique en ligne construit en SVG natif (pas de librairie de charting,
// pour limiter le nombre de dépendances du projet).

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-state">Aucune vente sur les 30 derniers jours.</div>;
  }

  const width = 720;
  const height = 220;
  const padding = 36;
  const maxRevenue = Math.max(1, ...data.map((d) => d.revenue));

  function scaleX(i) {
    return padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
  }

  function scaleY(value) {
    return height - padding - (value / maxRevenue) * (height - padding * 2);
  }

  const points = data.map((d, i) => `${scaleX(i)},${scaleY(d.revenue)}`).join(" ");

  function formatDay(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#cfe4e9"
        strokeWidth="1"
      />

      <polyline points={points} fill="none" stroke="#088395" strokeWidth="2.5" />

      {data.map((d, i) => (
        <circle key={d.date} cx={scaleX(i)} cy={scaleY(d.revenue)} r="3" fill="#088395">
          <title>{`${formatDay(d.date)} : ${formatPrice(d.revenue)}`}</title>
        </circle>
      ))}

      {data.map(
        (d, i) =>
          (i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0) && (
            <text
              key={`label-${d.date}`}
              x={scaleX(i)}
              y={height - padding + 16}
              fontSize="10"
              fontFamily="IBM Plex Mono, monospace"
              fill="#4c7c87"
              textAnchor="middle"
            >
              {formatDay(d.date)}
            </text>
          )
      )}
    </svg>
  );
}
