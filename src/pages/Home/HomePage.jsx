// src/pages/Home/HomePage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ProductCard from "../../components/Product/ProductCard";
import { fetchFeaturedProducts } from "../../store/slices/productSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { FiTruck, FiAward, FiShield, FiHeadphones } from "react-icons/fi";

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="h-[500px] md:h-[600px]"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="relative h-full bg-gradient-to-r from-[#f5efe8] to-[#faf7f4]">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-xl">
                  <h1 className="text-5xl md:text-6xl font-display font-bold text-[#4d2f1f] mb-4">
                    Pure Natural Attars
                  </h1>
                  <p className="text-xl text-gray-700 mb-8">
                    Experience the authentic essence of traditional Indian
                    fragrances
                  </p>
                  <Link
                    to="/products?category=attar"
                    className="inline-block bg-[#8f5c35] hover:bg-[#77492c] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Shop Attars
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="relative h-full bg-gradient-to-r from-accent-100 to-accent-50">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-xl">
                  <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-4">
                    Premium Agarbatti
                  </h1>
                  <p className="text-xl text-gray-700 mb-8">
                    Divine fragrances for your spiritual moments
                  </p>
                  <Link
                    to="/products?category=agarbatti"
                    className="inline-block bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Explore Collection
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="relative h-full bg-gradient-to-r from-orange-100 to-orange-50">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-xl">
                  <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-4">
                    Luxurious Gift Sets
                  </h1>
                  <p className="text-xl text-gray-700 mb-8">
                    Perfect gifts for every occasion
                  </p>
                  <Link
                    to="/products?category=gift-sets"
                    className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    View Gift Sets
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-[#f5efe8] p-4 rounded-full">
                <FiTruck className="text-[#8f5c35]" size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-accent-100 p-4 rounded-full">
                <FiAward className="text-accent-600" size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Premium Quality</h3>
                <p className="text-sm text-gray-600">100% authentic products</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <FiShield className="text-blue-600" size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-600">Safe & encrypted</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <FiHeadphones className="text-purple-600" size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                <p className="text-sm text-gray-600">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our wide range of aromatic products
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category.slug}`}
                className="card p-6 text-center hover:shadow-xl transition-all group"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-[#f5efe8] rounded-full flex items-center justify-center group-hover:bg-[#e8dac7] transition-colors">
                  <span className="text-3xl">
                    {category.name === "Attar" && "🌸"}
                    {category.name === "Agarbatti" && "🪔"}
                    {category.name === "Soap" && "🧼"}
                    {category.name === "Essential Oils" && "💧"}
                    {category.name === "Dhoop" && "🔥"}
                    {category.name === "Scented Candles" && "🕯️"}
                    {category.name === "Room Fresheners" && "🌿"}
                    {category.name === "Gift Sets" && "🎁"}
                    {![
                      "Attar",
                      "Agarbatti",
                      "Soap",
                      "Essential Oils",
                      "Dhoop",
                      "Scented Candles",
                      "Room Fresheners",
                      "Gift Sets",
                    ].includes(category.name) && "✨"}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[#8f5c35] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {category.subcategories?.length || 0} varieties
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked bestsellers just for you
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-block text-[#8f5c35] hover:text-[#77492c] font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-block text-[#8f5c35] hover:text-[#77492c] font-semibold"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#faf7f4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose MZ Aromas?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl text-center">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold mb-3">100% Natural</h3>
              <p className="text-gray-600">
                All our products are made from pure, natural ingredients without
                any harmful chemicals
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                We source the finest raw materials to ensure the highest quality
                in every product
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl text-center">
              <div className="text-5xl mb-4">🇮🇳</div>
              <h3 className="text-xl font-semibold mb-3">Made in India</h3>
              <p className="text-gray-600">
                Proudly crafted in India, following traditional methods passed
                down through generations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#77492c] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-[#f5efe8] mb-8">
              Get exclusive offers, new product updates, and aromatic tips
              delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
