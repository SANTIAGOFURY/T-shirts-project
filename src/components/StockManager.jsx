import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../Css/stockmanager.css";

export default function StockManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filterTitle, setFilterTitle] = useState("");
  const [filterPrice, setFilterPrice] = useState(""); // "asc", "desc", or ""
  const [filterCategory, setFilterCategory] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterQuantity, setFilterQuantity] = useState(""); // "asc", "desc", or ""

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  // Remove product from Firestore
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  // Open edit modal
  const handleEdit = (prod) => {
    setEditProduct(prod);
    setEditFields({
      title: prod.title || "",
      price: prod.price || "",
      description: prod.description || "",
      quantity: prod.quantity || "",
      promotion: prod.promotion || false,
      gender: prod.gender || "",
      category: prod.category || "",
      sizes: prod.sizes || [],
      image: prod.image || "",
    });
    setEditModalOpen(true);
  };

  // Handle edit field changes
  const handleEditFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle sizes (checkbox group)
  const handleEditSizeChange = (size) => {
    setEditFields((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // Save changes
  const handleSaveEdit = async () => {
    if (!editProduct) return;
    const docRef = doc(db, "products", editProduct.id);
    await updateDoc(docRef, {
      ...editFields,
      price: parseFloat(editFields.price),
      quantity: parseInt(editFields.quantity, 10),
    });
    setEditModalOpen(false);
    setEditProduct(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditProduct(null);
  };

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const categoryOptions = [
    "T-Shirt",
    "Hoodie",
    "Sweatshirt",
    "Pants",
    "Shorts",
    "Jacket",
    "Dress",
    "Skirt",
    "Other",
  ];
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "child", label: "Child" },
  ];

  // Filtering and sorting logic
  let filteredProducts = products
    .filter((prod) =>
      prod.title?.toLowerCase().includes(filterTitle.toLowerCase())
    )
    .filter((prod) =>
      filterCategory ? prod.category === filterCategory : true
    )
    .filter((prod) => (filterGender ? prod.gender === filterGender : true));

  if (filterPrice === "asc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (a.price || 0) - (b.price || 0)
    );
  } else if (filterPrice === "desc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (b.price || 0) - (a.price || 0)
    );
  }

  if (filterQuantity === "asc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (a.quantity || 0) - (b.quantity || 0)
    );
  } else if (filterQuantity === "desc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (b.quantity || 0) - (a.quantity || 0)
    );
  }

  return (
    <div className="stock-manager">
      <h2>Stock</h2>
      {/* Filters */}
      <div className="stock-filters">
        <input
          type="text"
          placeholder="Filter by title"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
        />
        <select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
        >
          <option value="">Sort by price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
        <select
          value={filterQuantity}
          onChange={(e) => setFilterQuantity(e.target.value)}
        >
          <option value="">Sort by quantity</option>
          <option value="asc">Quantity: Low to High</option>
          <option value="desc">Quantity: High to Low</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
        >
          <option value="">All Genders</option>
          {genderOptions.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="StockPreview">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="product-preview-card">
              {/* Product Image */}
              <div className="preview-img-container">
                {prod.image ? (
                  <img src={prod.image} alt="Main Preview" />
                ) : (
                  <div className="preview-no-img">No Image</div>
                )}
              </div>
              {/* Product Info */}
              <div>
                <h3>
                  {prod.title || (
                    <span className="product-title-placeholder">
                      Product Title
                    </span>
                  )}
                </h3>
                <div className="product-price-row">
                  <span className="preview-price">
                    {prod.price ? `${prod.price} MAD` : "0.00 MAD"}
                  </span>
                  {prod.promotion && (
                    <span className="preview-promotion">Promotion</span>
                  )}
                </div>
                <div>
                  <strong>Quantity:</strong>{" "}
                  <span>{prod.quantity || <span>N/A</span>}</span>
                </div>
                <div>
                  <strong>Promotion Status:</strong>{" "}
                  <span>
                    {prod.promotion ? "On Promotion" : "No Promotion"}
                  </span>
                </div>
                <div>
                  <strong>Category:</strong>{" "}
                  <span>
                    {prod.category || (
                      <span className="product-title-placeholder">N/A</span>
                    )}
                  </span>
                </div>
                <div>
                  <strong>Gender:</strong>{" "}
                  <span>
                    {prod.gender || (
                      <span className="product-title-placeholder">N/A</span>
                    )}
                  </span>
                </div>
                <div>
                  <strong>Sizes:</strong>{" "}
                  <span>
                    {prod.sizes && prod.sizes.length ? (
                      prod.sizes.join(", ")
                    ) : (
                      <span className="product-title-placeholder">N/A</span>
                    )}
                  </span>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="product-action-btns">
                <button
                  className="preview-details-btn"
                  onClick={() => handleEdit(prod)}
                >
                  Edit
                </button>
                <button
                  style={{ marginLeft: "1rem" }}
                  className="preview-details-btn remove-btn"
                  onClick={() => handleRemove(prod.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-card">
            <button className="edit-modal-close" onClick={handleCancelEdit}>
              &times;
            </button>
            <h2>Edit Product</h2>
            <form
              className="edit-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={editFields.title}
                  onChange={handleEditFieldChange}
                  required
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={editFields.price}
                  onChange={handleEditFieldChange}
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={editFields.description}
                  onChange={handleEditFieldChange}
                  rows="3"
                  required
                />
              </label>
              <label>
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={editFields.quantity}
                  onChange={handleEditFieldChange}
                  min="1"
                  required
                />
              </label>
              <label>
                Promotion:
                <input
                  type="checkbox"
                  name="promotion"
                  checked={editFields.promotion}
                  onChange={handleEditFieldChange}
                />
              </label>
              <label>
                Gender:
                <select
                  name="gender"
                  value={editFields.gender}
                  onChange={handleEditFieldChange}
                  required
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category:
                <select
                  name="category"
                  value={editFields.category}
                  onChange={handleEditFieldChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Sizes:
                <div className="edit-modal-sizes">
                  {sizeOptions.map((size) => (
                    <label key={size} className="edit-modal-size-label">
                      <input
                        type="checkbox"
                        checked={editFields.sizes.includes(size)}
                        onChange={() => handleEditSizeChange(size)}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </label>
              <button type="submit" className="edit-modal-save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="edit-modal-cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
