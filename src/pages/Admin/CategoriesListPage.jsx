import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiLayers,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
} from "react-icons/fi";
import API from "../../config/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CategoriesListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentCategory, setCurrentCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subcategories: [],
    order: 0,
    isActive: true,
  });

  const [newSubcategory, setNewSubcategory] = useState("");

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/admin/categories");
      setCategories(data.categories || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch categories");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === "create") {
        await API.post("/admin/category/new", formData);
        toast.success("Category created successfully");
      } else {
        await API.put(`/admin/category/${currentCategory._id}`, formData);
        toast.success("Category updated successfully");
      }

      fetchCategories();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await API.delete(`/admin/category/${id}`);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      subcategories: category.subcategories || [],
      order: category.order || 0,
      isActive: category.isActive,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleCreate = () => {
    setCurrentCategory(null);
    setFormData({
      name: "",
      description: "",
      subcategories: [],
      order: 0,
      isActive: true,
    });
    setModalMode("create");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
    setNewSubcategory("");
  };

  const addSubcategory = () => {
    if (newSubcategory.trim()) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, newSubcategory.trim()],
      });
      setNewSubcategory("");
    }
  };

  const removeSubcategory = (index) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#8f3c19]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <FiLayers className="text-[#8f3c19]" size={28} />
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                Categories Management
              </h1>
              <p className="text-gray-600 mt-1">Organize products & taxonomy</p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 ml-10 mt-1">
            <Link to="/admin/dashboard" className="hover:underline">
              Dashboard
            </Link>{" "}
            <span className="mx-2">/</span>{" "}
            <span className="text-gray-700 font-medium">Categories</span>
            <span className="ml-4 text-sm text-gray-500">
              {categories.length} categories
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter / Search (UI only, no extra functionality) */}
          <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Search categories..."
              className="outline-none text-sm w-48 placeholder:text-gray-400"
              aria-label="Search categories"
              readOnly
            />
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center space-x-2 btn-primary"
            title="Add Category"
          >
            <FiPlus size={18} />
            <span className="text-sm">Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-xl shadow-[var(--CardShadow)] hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            style={{ minHeight: 200 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {category.description || "—"}
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-[#6d2f15] bg-[#fff8f4] border border-[#f1e6dc] hover:bg-[#fff2e6] rounded-lg transition-colors"
                  title="Edit"
                  aria-label={`Edit ${category.name}`}
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="p-2 text-red-600 bg-[#fff6f6] border border-[#f8e6e6] hover:bg-[#fff0f0] rounded-lg transition-colors"
                  title="Delete"
                  aria-label={`Delete ${category.name}`}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Display Order</span>
                <span className="font-semibold text-gray-900 bg-primary-50 px-3 py-1 rounded-full">
                  {category.order ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    category.isActive
                      ? "bg-green-50 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  Subcategories ({category.subcategories?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* show up to 3 pills, then show +n more */}
                  {category.subcategories?.slice(0, 3).map((sub, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 tag border border-[#e8dac7] text-xs font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                  {category.subcategories?.length > 3 && (
                    <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full font-medium">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === "create" ? "Create Category" : "Edit Category"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8f3c19] focus:border-[#8f3c19] transition-colors"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8f3c19] focus:border-[#8f3c19] transition-colors resize-none"
                  placeholder="Enter category description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategories
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addSubcategory())
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8f3c19] focus:border-[#8f3c19] transition-colors"
                    placeholder="Add subcategory"
                  />
                  <button
                    type="button"
                    onClick={addSubcategory}
                    className="btn-primary px-6 py-3"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.subcategories.map((sub, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 tag rounded-full flex items-center space-x-2 font-medium border border-[#e8dac7]"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => removeSubcategory(index)}
                        className="hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <FiX size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value || 0),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8f3c19] focus:border-[#8f3c19] transition-colors"
                  min="0"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-[#8f3c19] rounded border-gray-300 focus:ring-[#8f3c19]"
                  />
                  <span className="text-gray-700 font-medium group-hover:text-gray-900">
                    Active Status
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary py-3 px-6">
                  {modalMode === "create"
                    ? "Create Category"
                    : "Update Category"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesListPage;
