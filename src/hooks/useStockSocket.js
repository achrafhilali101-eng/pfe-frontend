import { useEffect, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const WS_URL = API_BASE_URL.replace(/^http/, "ws") + "/ws/stock";

/**
 * S'abonne aux mises à jour de stock en temps réel.
 * `onStockUpdate(productId, quantity)` est appelé à chaque changement, pour
 * n'importe quel produit -- au composant appelant de filtrer ce qui l'intéresse.
 *
 * Se reconnecte automatiquement après 3s en cas de coupure (redémarrage du
 * serveur, perte réseau), pour que l'UI redevienne réactive sans action de
 * l'utilisateur.
 */
export function useStockSocket(onStockUpdate) {
  const callbackRef = useRef(onStockUpdate);
  callbackRef.current = onStockUpdate;

  useEffect(() => {
    let socket;
    let reconnectTimer;
    let isUnmounted = false;

    function connect() {
      socket = new WebSocket(WS_URL);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "stock_update") {
            callbackRef.current(data.product_id, data.quantity);
          }
        } catch {
          // message non-JSON, ignoré silencieusement
        }
      };

      socket.onclose = () => {
        if (!isUnmounted) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };
    }

    connect();

    return () => {
      isUnmounted = true;
      clearTimeout(reconnectTimer);
      if (socket) {
        socket.onclose = null; // évite de déclencher une reconnexion après démontage volontaire
        socket.close();
      }
    };
  }, []);
}
