import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/user/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BrandProductsPage from "./pages/BrandProductsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/products/brand/:brand" element={<BrandProductsPage />} />
            <Route path="/products/search" element={<SearchResultsPage />} />

            {/* Routes protégées (utilisateurs connectés) */}
            <Route path="/" element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } />
            <Route path="/cart" element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            } />
            <Route path="/checkout" element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />

            {/* Routes admin */}
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProductsPage />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrdersPage />
              </AdminRoute>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
