import { useState, useEffect } from "react";
import RecommendationsSection from "../components/RecommendationsSection";
import Toast from "../components/Toast";

export default function Recommendations() {
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="page">
      <RecommendationsSection
        limit={16}
        onAdd={() => setToastMessage("Ajouté au panier !")}
      />
      <Toast message={toastMessage} />
    </div>
  );
}
