// src/pages/Wishlist/WishlistPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import { addToCart } from "../../store/slices/cartSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading } = useSelector(
    (state) => state.wishlist
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (item) => {
    const product = item.product;
    dispatch(
      addToCart({
        product,
        variant: product.variants?.[0] || null,
        quantity: 1,
      })
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">❤️</div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Login to View Wishlist
          </h2>
          <p className="text-gray-600 mb-8">
            Please login to see your saved products
          </p>
          <Link to="/login" className="inline-block btn-primary px-8 py-3">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent"></div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">💔</div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Save your favorite products for later
          </p>
          <Link to="/products" className="inline-block btn-primary px-8 py-3">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">{wishlistItems.length} items saved</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const product = item.product;
            const displayPrice =
              product.variants?.length > 0
                ? product.variants[0].discountPrice || product.variants[0].price
                : product.discountPrice || product.price;

            const originalPrice =
              product.variants?.length > 0
                ? product.variants[0].price
                : product.price;

            const discount =
              displayPrice < originalPrice
                ? Math.round(
                    ((originalPrice - displayPrice) / originalPrice) * 100
                  )
                : 0;

            return (
              <div key={product._id} className="card overflow-hidden group">
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />

                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {discount}% OFF
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(product._id);
                      }}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">
                      {product.category?.name}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline space-x-2 mb-3">
                      <span className="text-2xl font-bold text-accent-dark">
                        ₹{displayPrice}
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(item);
                      }}
                      className="w-full btn-primary py-2 flex items-center justify-center space-x-2"
                    >
                      <FiShoppingCart />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
