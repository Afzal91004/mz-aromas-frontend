// src/pages/Admin/OrderDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard } from "react-icons/fi";
import API from "../../config/api";
import { toast } from "react-toastify";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await API.get(`/order/${id}`);
      setOrder(data.order);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch order details");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await API.put(`/admin/order/${id}`, { status });
      toast.success("Order status updated");
      fetchOrderDetails();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await API.delete(`/admin/order/${id}`);
        toast.success("Order deleted successfully");
        navigate("/admin/orders");
      } catch (error) {
        toast.error("Failed to delete order");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#8f3c19]"></div>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-16">Order not found</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/orders")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FiArrowLeft />
          <span className="font-medium">Back to Orders</span>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Order #{order._id.slice(-8)}
            </h1>
            <p className="text-gray-600">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold border ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiPackage className="mr-2 text-[#8f3c19]" size={24} />
              Order Items
            </h2>

            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-gray-600 mt-1">
                        Size:{" "}
                        <span className="font-medium">{item.variant.size}</span>
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        Qty:{" "}
                        <span className="font-medium">{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{item.price} × {item.quantity} = ₹
                        {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiMapPin className="mr-2 text-[#8f3c19]" size={24} />
              Shipping Address
            </h2>

            <div className="text-gray-700 space-y-2">
              <p className="font-semibold text-gray-900 text-lg mb-3">
                {order.user?.name}
              </p>
              <p>{order.shippingInfo.address}</p>
              <p>
                {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                {order.shippingInfo.pinCode}
              </p>
              <p>{order.shippingInfo.country}</p>
              <p className="mt-3 pt-3 border-t border-gray-200">
                <span className="font-medium">Phone:</span>{" "}
                {order.shippingInfo.phoneNo}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiCreditCard className="mr-2 text-[#8f3c19]" size={24} />
              Payment Information
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Payment Method:
                </span>
                <span className="font-semibold text-gray-900">
                  {order.paymentInfo.type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Payment Status:
                </span>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    order.paymentInfo.status === "Paid"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-orange-100 text-orange-800 border-orange-200"
                  }`}
                >
                  {order.paymentInfo.status}
                </span>
              </div>
              {order.paymentInfo.id && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">
                    Transaction ID:
                  </span>
                  <span className="font-mono text-sm text-gray-900 break-all text-right ml-4">
                    {order.paymentInfo.id}
                  </span>
                </div>
              )}
              {order.paidAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Paid At:</span>
                  <span className="text-gray-900">
                    {new Date(order.paidAt).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Shipping</span>
                <span className="font-semibold">₹{order.shippingPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Tax</span>
                <span className="font-semibold">₹{order.taxPrice}</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#8f3c19]">
                    ₹{order.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Update Status
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => handleStatusUpdate("Processing")}
                disabled={order.orderStatus === "Processing"}
                className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Mark as Processing
              </button>
              <button
                onClick={() => handleStatusUpdate("Shipped")}
                disabled={order.orderStatus === "Shipped"}
                className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => handleStatusUpdate("Delivered")}
                disabled={order.orderStatus === "Delivered"}
                className="w-full bg-gradient-to-r from-[#8f3c19] to-[#6d2f15] hover:from-[#77492c] hover:to-[#5f3a23] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md"
              >
                Mark as Delivered
              </button>
              <button
                onClick={handleDeleteOrder}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
