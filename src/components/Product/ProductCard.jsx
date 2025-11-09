// src/components/Product/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlistItems.some(
    (item) => item.product?._id === product._id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (product.variants && product.variants.length > 0) {
      // If product has variants, redirect to product page
      return;
    }

    dispatch(
      addToCart({
        product,
        variant: null,
        quantity: 1,
      })
    );
  };

  const handleWishlist = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  const displayPrice =
    product.variants?.length > 0
      ? product.variants[0].discountPrice || product.variants[0].price
      : product.discountPrice || product.price;

  const originalPrice =
    product.variants?.length > 0 ? product.variants[0].price : product.price;

  const discount =
    product.discountPrice || product.variants?.[0]?.discountPrice
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0;

  return (
    <div className="card overflow-hidden group">
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gray-100">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {discount}% OFF
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 right-3 bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 ${
              product.featured ? "top-14" : ""
            } bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors ${
              isInWishlist ? "text-red-500" : "text-gray-600"
            }`}
          >
            <FiHeart size={20} fill={isInWishlist ? "currentColor" : "none"} />
          </button>

          {/* Quick Actions */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-[#8f3c19] py-2 rounded-lg font-semibold hover:bg-[#fdf4ec] transition-colors flex items-center justify-center space-x-2"
            >
              <FiShoppingCart />
              <span>
                {product.variants?.length > 0 ? "View Options" : "Add to Cart"}
              </span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-[#b7521d] font-semibold uppercase tracking-wide mb-1">
            {product.category?.name}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              <FiStar className="text-yellow-500 fill-yellow-500" size={16} />
              <span className="text-sm font-medium text-gray-700">
                {product.ratings?.toFixed(1) || "0.0"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({product.numOfReviews || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#8f3c19]">
              ₹{displayPrice}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Variants Info */}
          {product.variants && product.variants.length > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              {product.variants.length} size options available
            </p>
          )}

          {/* Stock Status */}
          {product.stock === 0 && !product.variants && (
            <p className="text-red-600 text-sm font-semibold mt-2">
              Out of Stock
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
