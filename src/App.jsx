// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, setInitialized } from "./store/slices/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/Route/ProtectedRoute";

// Public Pages
import HomePage from "./pages/Home/HomePage";
import ProductsPage from "./pages/Products/ProductsPage";
import ProductDetailPage from "./pages/Product/ProductDetailPage";
import CartPage from "./pages/Cart/CartPage";
import WishlistPage from "./pages/Wishlist/WishlistPage";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

// User Pages
import ProfilePage from "./pages/Profile/ProfilePage";
import UpdateProfilePage from "./pages/Profile/UpdateProfilePage";
import UpdatePasswordPage from "./pages/Profile/UpdatePasswordPage";
import OrdersPage from "./pages/Orders/OrdersPage";
import OrderDetailPage from "./pages/Orders/OrderDetailPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import OrderSuccessPage from "./pages/Orders/OrderSuccessPage";

// Admin Pages
import AdminLayout from "./components/Admin/AdminLayout";
import DashboardPage from "./pages/Admin/DashboardPage";
import ProductsListPage from "./pages/Admin/ProductsListPage";
import CreateProductPage from "./pages/Admin/CreateProductPage";
import EditProductPage from "./pages/Admin/EditProductPage";
import OrdersListPage from "./pages/Admin/OrdersListPage";
import OrderDetailAdminPage from "./pages/Admin/OrderDetailPage";
import UsersListPage from "./pages/Admin/UsersListPage";
import CategoriesListPage from "./pages/Admin/CategoriesListPage";

// Redux
import { fetchWishlist } from "./store/slices/wishlistSlice";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if user data exists in localStorage
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        try {
          // Verify session with server
          await dispatch(getUserProfile()).unwrap();
          console.log("✅ Session verified successfully");
        } catch (error) {
          console.error("❌ Session verification failed:", error);
          // Clear invalid session data
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }

      // Mark as initialized even if not authenticated
      dispatch(setInitialized());
    };

    // Only run once on mount
    if (!initialized) {
      initializeAuth();
    }
  }, [dispatch, initialized]);

  // Show loading screen while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#b7521d]"></div>
          <p className="mt-4 text-xl text-gray-600 font-display">
            Loading MZ Aromas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<CreateProductPage />} />
          <Route path="products/edit/:id" element={<EditProductPage />} />
          <Route path="orders" element={<OrdersListPage />} />
          <Route path="orders/:id" element={<OrderDetailAdminPage />} />
          <Route path="users" element={<UsersListPage />} />
          <Route path="categories" element={<CategoriesListPage />} />
        </Route>

        {/* Main App Routes */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              {/* container ensures consistent outer padding for all pages */}
              <main className="flex-grow container mx-auto px-4">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route
                    path="/product/:slug"
                    element={<ProductDetailPage />}
                  />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="/password/reset/:token"
                    element={<ResetPasswordPage />}
                  />

                  {/* Protected User Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/update-profile"
                    element={
                      <ProtectedRoute>
                        <UpdateProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/update-password"
                    element={
                      <ProtectedRoute>
                        <UpdatePasswordPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-success"
                    element={
                      <ProtectedRoute>
                        <OrderSuccessPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <div className="container mx-auto px-4 py-16 text-center">
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">
                          404
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                          Page not found
                        </p>
                        <a href="/" className="btn-primary inline-block">
                          Go Home
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
};

export default App;
