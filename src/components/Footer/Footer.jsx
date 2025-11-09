// src/components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              MZ Aromas
            </h3>
            <p className="text-gray-400 mb-4">
              Premium quality natural fragrances, attars, and aroma products for
              your spiritual and aromatic needs.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e9893c] transition-colors"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e9893c] transition-colors"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e9893c] transition-colors"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e9893c] transition-colors"
              >
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#e9893c] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-[#e9893c] transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#e9893c] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/bulk-order"
                  className="hover:text-[#e9893c] transition-colors"
                >
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipping-policy"
                  className="hover:text-[#e9893c] transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="hover:text-[#e9893c] transition-colors"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-[#e9893c] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-[#e9893c] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="mt-1 shrink-0" />
                <span>Artist Village, Maharashtra, India - 400001</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="shrink-0" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="shrink-0" />
                <span>info@mzaromas.com</span>
              </li>
            </ul>

            {/* Certifications */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Certified & Trusted</p>
              <div className="flex space-x-2">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-800">
                  ISO Certified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 MZ Aromas. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <img
                src="/images/payment-methods.png"
                alt="Payment Methods"
                className="h-8 opacity-70"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
