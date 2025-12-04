import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage";
import SearchPage from "./pages/SearchPage";
import CheckoutPage from "./pages/CheckoutPage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Profile from "./pages/Profile";

import TranhRoiPage from "./pages/TranhRoiPage";
import TranhBoPage from "./pages/TranhBoPage";
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";

function AppContent() {
  const { successMessage } = useCart(); // ⭐ Lấy thông báo từ CartContext

  return (
    <>
      {/* ⭐ Popup thông báo thêm giỏ hàng */}
      {successMessage && <div className="success-toast">{successMessage}</div>}

      <Header />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<CategoryPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/tranh-roi" element={<TranhRoiPage />} />
        <Route path="/tranh-bo" element={<TranhBoPage />} />

        {/* SEARCH */}
        <Route path="/search" element={<SearchPage />} />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* CART */}
        <Route path="/cart" element={<CartPage />} />

        {/* CHECKOUT */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
