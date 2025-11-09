import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiHome,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiGrid,
  FiBarChart2,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { logoutUser } from "../../store/slices/authSlice";

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { path: "/admin/dashboard", icon: FiBarChart2, label: "Dashboard" },
    { path: "/admin/products", icon: FiShoppingBag, label: "Products" },
    { path: "/admin/categories", icon: FiGrid, label: "Categories" },
    { path: "/admin/orders", icon: FiPackage, label: "Orders" },
    { path: "/admin/users", icon: FiUsers, label: "Users" },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-primary-50 text-gray-900">
      {/* Global small CSS for scrollbar & font import */}
      <style>
        {`
          :root{
            --Primary:#a47148;
            --Primary-dark:#77492c;
            --Beige:#fbf6f1;
            --Sidebar:#f6efe8;
            --CardShadow: 0 6px 18px rgba(25,25,25,0.06);
          }

          /* Thin rounded scrollbar for webkit browsers */
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.12); border-radius: 999px; }
          ::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.18); }
        `}
      </style>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link to="/" className="text-2xl font-display font-bold text-primary">
          MZ Aromas
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-600 hover:text-gray-900 p-2"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[var(--Sidebar)] border-r border-gray-200 transform transition-transform duration-300 z-40 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo */}
          <div className="hidden lg:block p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-3 text-primary">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f7efe6] to-[#f0e7dd] flex items-center justify-center border border-[#e8dac7] shadow-sm">
                {/* Minimal perfume icon (using text) */}
                <span className="text-sm font-semibold text-primary">MZ</span>
              </div>
              <div>
                <div className="text-2xl font-display font-bold">MZ Aromas</div>
                <p className="text-xs text-gray-600 mt-1">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar?.url || "/images/default-avatar.png"}
                alt={user?.name}
                className="w-12 h-12 rounded-full border-2 border-[#f5efe8] shadow-sm object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                    isActive
                      ? "bg-primary-50 text-primary font-semibold shadow"
                      : "text-gray-700 hover:bg-white hover:shadow-sm"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-primary">
                    <Icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-[var(--Sidebar)]">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-colors mb-2"
            >
              <FiHome size={18} />
              <span>Back to Store</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
