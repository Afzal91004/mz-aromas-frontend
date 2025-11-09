// src/components/Header/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { logoutUser } from "../../store/slices/authSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white"
      }`}
    >
      {/* Top Bar */}
      <div className="bg-[#8f3c19]  text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>📞 +91 1234567890</span>
              <span className="hidden md:inline">✉️ info@mzaromas.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">
                Free Shipping on Orders Above ₹999
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl font-display font-bold text-[#8f3c19]">
              MZ <span className="text-accent-600">Aromas</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search for Attar, Agarbatti, Soaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-r-0 border-[#dbc5a6] rounded-l-lg focus:outline-none focus:border-[#8f5c35]"
              />
              <button
                type="submit"
                className="bg-[#8f5c35] hover:bg-[#77492c] text-white px-6 py-3 rounded-r-lg transition-colors"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hover:text-[#8f5c35] transition-colors"
            >
              <FiHeart size={24} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative hover:text-[#8f5c35] transition-colors"
            >
              <FiShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8f5c35] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="hover:text-[#8f5c35] transition-colors">
                <FiUser size={24} />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-r-0 border-[#dbc5a6] rounded-l-lg focus:outline-none focus:border-[#8f5c35]"
            />
            <button
              type="submit"
              className="bg-[#b7521d] text-white px-4 rounded-r-lg"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </form>
      </nav>

      {/* Category Navigation */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center space-x-8 py-3">
            <Link
              to="/products?category=attar"
              className="hover:text-[#b7521d] transition-colors font-medium"
            >
              Attar
            </Link>
            <Link
              to="/products?category=agarbatti"
              className="hover:text-[#b7521d] transition-colors font-medium"
            >
              Agarbatti
            </Link>
            <Link
              to="/products?category=soap"
              className="hover:text-[#b7521d] transition-colors font-medium"
            >
              Soaps
            </Link>
            <Link
              to="/products?category=essential-oils"
              className="hover:text-[#b7521d] transition-colors font-medium"
            >
              Essential Oils
            </Link>
            <Link
              to="/products?category=dhoop"
              className="hover:text-[#b7521d] transition-colors font-medium"
            >
              Dhoop
            </Link>
            <Link
              to="/products?category=gift-sets"
              className="hover:text-[#b7521d] transition-colors font-medium"
            >
              Gift Sets
            </Link>
            <Link
              to="/products"
              className="hover:text-[#8f5c35] transition-colors font-medium text-accent-600"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/products?category=attar"
              className="block py-2 hover:text-[#b7521d]"
            >
              Attar
            </Link>
            <Link
              to="/products?category=agarbatti"
              className="block py-2 hover:text-[#b7521d]"
            >
              Agarbatti
            </Link>
            <Link
              to="/products?category=soap"
              className="block py-2 hover:text-[#b7521d]"
            >
              Soaps
            </Link>
            <Link
              to="/products?category=essential-oils"
              className="block py-2 hover:text-[#b7521d]"
            >
              Essential Oils
            </Link>
            <Link to="/products" className="block py-2 hover:text-[#b7521d]">
              View All Products
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
