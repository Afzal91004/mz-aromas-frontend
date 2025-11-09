// src/pages/Checkout/CheckoutPage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiCheckCircle } from "react-icons/fi";
import { createOrder } from "../../store/slices/orderSlice";
import { clearCart } from "../../store/slices/cartSlice";
import API from "../../config/api";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    phoneNo: "",
  });

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
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      // Create Razorpay Order
      const { data } = await API.post("/payment/razorpay/order", {
        amount: total,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        name: "MZ Aromas",
        description: "Order Payment",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // Verify Payment
            const verifyResponse = await API.post("/payment/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              // Create Order
              const finalOrderData = {
                ...orderData,
                paymentInfo: {
                  id: response.razorpay_payment_id,
                  status: "Paid",
                  type: "Razorpay",
                },
              };

              const orderResult = await dispatch(createOrder(finalOrderData));

              if (orderResult.payload) {
                dispatch(clearCart());
                navigate("/order-success", {
                  state: { orderId: orderResult.payload.order._id },
                });
              }
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.phoneNo,
        },
        theme: {
          color: "#8f5c35",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  const handleCODPayment = async (orderData) => {
    try {
      const { data } = await API.post("/payment/cod");

      const finalOrderData = {
        ...orderData,
        paymentInfo: {
          id: data.paymentInfo.id,
          status: "COD",
          type: "COD",
        },
      };

      const orderResult = await dispatch(createOrder(finalOrderData));

      if (orderResult.payload) {
        dispatch(clearCart());
        navigate("/order-success", {
          state: { orderId: orderResult.payload.order._id },
        });
      }
    } catch (error) {
      toast.error("Order placement failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.pinCode ||
      !shippingInfo.phoneNo
    ) {
      toast.error("Please fill all shipping details");
      return;
    }

    if (shippingInfo.phoneNo.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Prepare Order Data
    const orderItems = cartItems.map((item) => {
      const price = item.variant
        ? item.variant.discountPrice || item.variant.price
        : item.product.discountPrice || item.product.price;

      return {
        name: item.product.name,
        price: price,
        quantity: item.quantity,
        image: item.product.images[0]?.url,
        product: item.product._id,
        variant: item.variant
          ? {
              size: item.variant.size,
              price: item.variant.price,
            }
          : undefined,
      };
    });

    const orderData = {
      shippingInfo,
      orderItems,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shipping,
      totalPrice: total,
    };

    // Process Payment
    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment(orderData);
    } else {
      await handleCODPayment(orderData);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping & Payment Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="input-field"
                      placeholder="House No., Street, Area"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="State"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={shippingInfo.pinCode}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="PIN Code"
                      maxLength="6"
                      pattern="[0-9]{6}"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNo"
                      value={shippingInfo.phoneNo}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingInfo.country}
                      className="input-field bg-gray-100"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Razorpay */}
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-[#b7521d] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-[#b7521d]"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center space-x-3">
                        <FiCreditCard size={24} className="text-[#b7521d]" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Credit/Debit Card, UPI, Net Banking
                          </div>
                          <div className="text-sm text-gray-600">
                            Pay securely via Razorpay
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-[#b7521d] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-[#b7521d]"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center space-x-3">
                        <FiCheckCircle size={24} className="text-[#b7521d]" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Cash on Delivery
                          </div>
                          <div className="text-sm text-gray-600">
                            Pay when you receive the order
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h3>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => {
                    const price = item.variant
                      ? item.variant.discountPrice || item.variant.price
                      : item.product.discountPrice || item.product.price;

                    return (
                      <div
                        key={`${item.product._id}-${item.variant?.size}`}
                        className="flex space-x-3"
                      >
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          {item.variant && (
                            <p className="text-xs text-gray-600">
                              {item.variant.size}
                            </p>
                          )}
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t">
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
                    <span>Tax (GST)</span>
                    <span className="font-semibold">₹{tax}</span>
                  </div>
                  <div className="border-t pt-3">
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
                  type="submit"
                  className="w-full btn-primary py-4 text-lg"
                >
                  {paymentMethod === "razorpay" ? "Pay Now" : "Place Order"}
                </button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
