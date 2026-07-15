import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Recommendations from "./pages/Recommendations";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import Cart from "./pages/Cart";
import Confirmation from "./pages/Confirmation";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogue" element={<Catalog />} />
              <Route path="/recommandations" element={<Recommendations />} />
              <Route path="/produits/:id" element={<ProductDetail />} />
              <Route path="/connexion" element={<Login />} />
              <Route path="/inscription" element={<Register />} />
              <Route path="/mes-commandes" element={<Orders />} />
              <Route path="/dashboard" element={<SellerDashboard />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/confirmation" element={<Confirmation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
