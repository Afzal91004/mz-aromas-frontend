// src/pages/Product/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiHeart,
  FiShoppingCart,
  FiShare2,
  FiStar,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  fetchProductBySlug,
  fetchRelatedProducts,
} from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import ProductCard from "../../components/Product/ProductCard";
import { toast } from "react-toastify";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const {
    currentProduct: product,
    relatedProducts,
    loading,
  } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
      dispatch(fetchRelatedProducts(product._id));
    }
  }, [product, dispatch]);

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#8f5c35]"></div>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlistItems.some(
    (item) => item.product?._id === product._id
  );

  const displayPrice = selectedVariant
    ? selectedVariant.discountPrice || selectedVariant.price
    : product.discountPrice || product.price;

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;

  const discount =
    displayPrice < originalPrice
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.stock === 0) {
      toast.error("Selected variant is out of stock");
      return;
    }

    dispatch(
      addToCart({
        product,
        variant: selectedVariant,
        quantity,
      })
    );
  };

  const handleWishlist = () => {
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

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#b7521d]">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#b7521d]">
              Products
            </Link>
            <span>/</span>
            <Link
              to={`/products?category=${product.category?.slug}`}
              className="hover:text-[#b7521d]"
            >
              {product.category?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-xl p-4 mb-4">
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mb-4 rounded-lg overflow-hidden"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-[500px] object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Thumbnails */}
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-transparent hover:border-[#8f5c35]"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleWishlist}
                className={`flex-1 py-3 rounded-lg font-semibold border-2 transition-colors ${
                  isInWishlist
                    ? "bg-red-50 border-red-500 text-red-600"
                    : "bg-white border-gray-300 text-gray-700 hover:border-[#b7521d]"
                }`}
              >
                <FiHeart
                  className="inline mr-2"
                  fill={isInWishlist ? "currentColor" : "none"}
                />
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-[#b7521d] transition-colors"
              >
                <FiShare2 className="inline" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl p-8">
              {/* Category */}
              <Link
                to={`/products?category=${product.category?.slug}`}
                className="inline-block text-sm text-[#b7521d] hover:text-[#8f3c19] font-semibold uppercase tracking-wide mb-2"
              >
                {product.category?.name}
              </Link>

              {/* Product Name */}
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={20}
                      className={
                        i < Math.floor(product.ratings || 0)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.ratings?.toFixed(1)} ({product.numOfReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-4xl font-bold text-[#8f3c19]">
                    ₹{displayPrice}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{originalPrice}
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-700 mb-6">{product.shortDescription}</p>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Select Size:
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={variant.stock === 0}
                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                          selectedVariant?._id === variant._id
                            ? "border-[#8f5c35] bg-[#faf7f4] text-[#77492c]"
                            : variant.stock === 0
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-gray-300 hover:border-[#b7521d]"
                        }`}
                      >
                        <div className="text-sm">{variant.size}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          ₹{variant.discountPrice || variant.price}
                        </div>
                        {variant.stock === 0 && (
                          <div className="text-xs text-red-600 mt-1">
                            Out of Stock
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fragrance Type */}
              {product.fragrance && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Fragrance Type:
                  </h3>
                  <span className="inline-block bg-[#f5efe8] text-[#77492c] px-4 py-2 rounded-full font-medium">
                    {product.fragrance}
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quantity:</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  {selectedVariant && (
                    <span className="text-sm text-gray-600">
                      {selectedVariant.stock} units available
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant?.stock === 0}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2"
              >
                <FiShoppingCart size={24} />
                <span>Add to Cart</span>
              </button>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FiTruck className="text-[#b7521d]" size={24} />
                  <div className="text-sm">
                    <div className="font-semibold">Free Delivery</div>
                    <div className="text-gray-600">On orders above ₹999</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FiShield className="text-[#b7521d]" size={24} />
                  <div className="text-sm">
                    <div className="font-semibold">Secure Payment</div>
                    <div className="text-gray-600">100% Protected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-xl p-8">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 font-semibold transition-colors ${
                  activeTab === "description"
                    ? "border-b-2 border-[#8f5c35] text-[#8f5c35]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("ingredients")}
                className={`pb-4 font-semibold transition-colors ${
                  activeTab === "ingredients"
                    ? "border-b-2 border-[#8f5c35] text-[#8f5c35]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab("howToUse")}
                className={`pb-4 font-semibold transition-colors ${
                  activeTab === "howToUse"
                    ? "border-b-2 border-[#8f5c35] text-[#8f5c35]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                How to Use
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 font-semibold transition-colors ${
                  activeTab === "reviews"
                    ? "border-b-2 border-[#b7521d] text-[#b7521d]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Reviews ({product.numOfReviews})
              </button>
            </div>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div>
                {product.ingredients && product.ingredients.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    Ingredient information not available.
                  </p>
                )}
              </div>
            )}

            {activeTab === "howToUse" && (
              <div>
                {product.howToUse ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.howToUse}
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Usage instructions not available.
                  </p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 pb-6 last:border-0"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {review.name}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  size={16}
                                  className={
                                    i < review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
