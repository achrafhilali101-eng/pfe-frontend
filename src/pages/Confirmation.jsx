import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";

export default function Confirmation() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("order_id");

    if (!sessionId || !orderId) {
      setStatus("error");
      setError("Lien de confirmation invalide.");
      return;
    }

    api
      .confirmPayment(orderId, sessionId)
      .then(() => {
        clearCart();
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message || "Impossible de confirmer le paiement.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <div className="auth-page" style={{ margin: "64px auto" }}>
        <div className="auth-card" style={{ textAlign: "center" }}>
          {status === "loading" && (
            <>
              <h1 className="section-title">Confirmation du paiement...</h1>
              <p className="section-subtitle">Merci de patienter un instant.</p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="section-title">Paiement confirmé ✅</h1>
              <p className="section-subtitle">
                Votre commande a bien été enregistrée et sera traitée par le vendeur.
              </p>
              <Link to="/mes-commandes" className="btn-primary" style={{ display: "inline-block", marginTop: 16 }}>
                Voir mes commandes
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="section-title">Un problème est survenu</h1>
              <div className="form-error">{error}</div>
              <Link to="/panier" style={{ display: "inline-block", marginTop: 16 }}>
                Retourner au panier
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
