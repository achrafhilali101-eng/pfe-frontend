import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalog />} />
          <Route path="/produits/:id" element={<ProductDetail />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/mes-commandes" element={<Orders />} />
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/panier" element={<Cart />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
