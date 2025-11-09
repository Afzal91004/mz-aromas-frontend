// src/pages/Cart/CartPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../store/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleQuantityChange = (item, type) => {
    const newQuantity =
      type === "increment" ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity > 0) {
      dispatch(
        updateQuantity({
          productId: item.product._id,
          variantSize: item.variant?.size,
          quantity: newQuantity,
        })
      );
    }
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        productId: item.product._id,
        variantSize: item.variant?.size,
      })
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.variant
        ? item.variant.discountPrice || item.variant.price
        : item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal >= 999 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-block btn-primary px-8 py-3 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const price = item.variant
                ? item.variant.discountPrice || item.variant.price
                : item.product.discountPrice || item.product.price;

              const originalPrice = item.variant
                ? item.variant.price
                : item.product.price;

              return (
                <div
                  key={`${item.product._id}-${item.variant?.size || "default"}`}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            to={`/product/${item.product.slug}`}
                            className="font-semibold text-gray-900 hover:text-[#b7521d] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.product.category?.name}
                          </p>
                          {item.variant && (
                            <p className="text-sm text-gray-600 mt-1">
                              Size:{" "}
                              <span className="font-semibold">
                                {item.variant.size}
                              </span>
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
                        <div>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-[#8f3c19]">
                              ₹{price}
                            </span>
                            {price < originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                          <div className="flex items-center border-2 border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, "decrement")
                              }
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="px-4 py-2 font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item, "increment")
                              }
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                          <span className="font-semibold text-gray-900">
                            ₹{price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart Button */}
            <button
              onClick={() => dispatch(clearCart())}
              className="text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span className="font-semibold">₹{tax}</span>
                </div>

                {subtotal < 999 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Add ₹{999 - subtotal} more to get FREE shipping! 🚚
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-[#8f3c19]">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2"
              >
                <FiShoppingBag />
                <span>Proceed to Checkout</span>
              </button>

              <Link to="/products" className="w-full btn-secondary mt-4">
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Easy Returns & Refunds</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
