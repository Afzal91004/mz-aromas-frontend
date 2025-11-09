// src/pages/Profile/ProfilePage.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center mb-6">
                <img
                  src={user?.avatar?.url || "/images/default-avatar.png"}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#f5efe8]"
                />
                <h2 className="font-semibold text-gray-900 text-xl">
                  {user?.name}
                </h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-50 text-accent-dark font-medium"
                >
                  <FiUser />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <FiShoppingBag />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <FiHeart />
                  <span>Wishlist</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <FiSettings />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
                Profile Information
              </h1>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user?.name}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user?.role}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 capitalize"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={new Date(user?.createdAt).toLocaleDateString()}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Link to="/update-profile" className="btn-primary">
                    Edit Profile
                  </Link>
                  <Link to="/update-password" className="btn-secondary">
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
