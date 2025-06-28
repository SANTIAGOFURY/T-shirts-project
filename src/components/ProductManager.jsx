import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import StockManager from "./StockManager";

import "../Css/Dashboard.css";

function ProductManager() {
  // Product fields state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [promotion, setPromotion] = useState(false);
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([]);

  // Main image
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Supporting images
  const [supportingFiles, setSupportingFiles] = useState([]);
  const [supportingPreviews, setSupportingPreviews] = useState([]);
  const [supportingImageUrls, setSupportingImageUrls] = useState([]);
  const [uploadingSupporting, setUploadingSupporting] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(null); // Store index instead of URL
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Error/loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Options
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

  // Main image change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setImageUrl("");
      setError("");
    }
  };
  // Add the new product to the products array
  // Upload main image
  const handleImageUpload = async () => {
    if (!selectedFile) {
      setError("Please select a main image first.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Main image upload failed");
      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  // Supporting images selection
  const handleSupportingFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (supportingFiles.length + files.length > 10) {
      setError("You can upload a maximum of 10 supporting images.");
      return;
    }
    setError("");
    const newSupportingFiles = [...supportingFiles, ...files];
    setSupportingFiles(newSupportingFiles);
    const newPreviews = newSupportingFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setSupportingPreviews(newPreviews);
  };

  // Remove supporting image by index
  const removeSupportingImage = (index) => {
    const newFiles = supportingFiles.filter((_, i) => i !== index);
    const newPreviews = supportingPreviews.filter((_, i) => i !== index);
    const newUrls = supportingImageUrls.filter((_, i) => i !== index);
    setSupportingFiles(newFiles);
    setSupportingPreviews(newPreviews);
    setSupportingImageUrls(newUrls);
    closeModal();
    setError("");
  };

  // Reset all supporting images
  const resetSupportingImages = () => {
    setSupportingFiles([]);
    setSupportingPreviews([]);
    setSupportingImageUrls([]);
    closeModal();
    setError("");
  };

  // Upload supporting images
  const uploadSupportingImages = async () => {
    if (supportingFiles.length === 0) {
      setError("Please select supporting images to upload.");
      return;
    }
    setUploadingSupporting(true);
    setError("");
    try {
      const uploadedUrls = [];
      for (const file of supportingFiles) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("http://localhost:4000/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Supporting image upload failed");
        const data = await res.json();
        uploadedUrls.push(data.imageUrl);
      }
      setSupportingImageUrls(uploadedUrls);
    } catch (err) {
      setError(err.message);
    }
    setUploadingSupporting(false);
  };

  // Size checkbox toggle
  const handleSizeChange = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !price ||
      !description ||
      !sizes.length ||
      !imageUrl ||
      !quantity ||
      !gender ||
      !category
    ) {
      setError("Please fill in all fields and upload the main image.");
      return;
    }
    // ...inside your Preview section, just before the last </div> of .product-preview-card, add the Details button:
    <button
      type="button"
      style={{
        marginTop: "1rem",
        background: "var(--color-light-orange)",
        color: "var(--color-bg-dark)",
        border: "none",
        borderRadius: "8px",
        padding: "0.7rem 1.5rem",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background 0.2s",
        fontSize: "1rem",
      }}
      onClick={() => setModalOpen(true)}
    >
      Details
    </button>;

    // ...then, after your Preview section (but still inside the main return), add this Details Modal:
    {
      modalOpen && (
        <div
          className="details-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            animation: "fadeIn 0.2s",
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="details-modal-card"
            style={{
              background: "var(--color-bg-secondary)",
              color: "var(--color-white)",
              borderRadius: "18px",
              boxShadow: "0 8px 32px 0 rgba(140, 79, 255, 0.18)",
              padding: "2rem 2.5rem 2rem 2.5rem",
              maxWidth: "420px",
              width: "95vw",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: "scaleIn 0.2s",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "var(--color-error)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "2.2rem",
                height: "2.2rem",
                fontSize: "1.5rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.2s",
                zIndex: 2,
              }}
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Main Preview"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "2px solid var(--color-purple-light)",
                    background: "var(--color-bg-dark)",
                  }}
                />
              ) : (
                <div className="preview-no-img">No Image</div>
              )}
            </div>
            <h2
              style={{
                color: "var(--color-purple)",
                fontSize: "1.4rem",
                fontWeight: 800,
                margin: "0.5rem 0 1rem 0",
                textAlign: "center",
              }}
            >
              {title || <span style={{ color: "#888" }}>Product Title</span>}
            </h2>
            <div style={{ width: "100%", marginBottom: "1.2rem" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--color-light-orange)",
                  }}
                >
                  {price ? `${price} MAD` : "0.00 MAD"}
                </span>
                {promotion && (
                  <span
                    style={{
                      background: "var(--color-purple)",
                      color: "#fff",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      fontSize: "0.85rem",
                      marginLeft: "10px",
                      fontWeight: 600,
                    }}
                  >
                    Promotion
                  </span>
                )}
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Quantity:</strong>{" "}
                <span style={{ color: "var(--color-purple-light)" }}>
                  {quantity || <span style={{ color: "#888" }}>N/A</span>}
                </span>
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Promotion Status:</strong>{" "}
                <span
                  style={{ color: promotion ? "var(--color-purple)" : "#888" }}
                >
                  {promotion ? "On Promotion" : "No Promotion"}
                </span>
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Category:</strong>{" "}
                <span style={{ color: "var(--color-purple-light)" }}>
                  {category || <span style={{ color: "#888" }}>N/A</span>}
                </span>
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Gender:</strong>{" "}
                <span style={{ color: "var(--color-purple-light)" }}>
                  {gender || <span style={{ color: "#888" }}>N/A</span>}
                </span>
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Sizes:</strong>{" "}
                <span style={{ color: "var(--color-purple-light)" }}>
                  {sizes.length ? (
                    sizes.join(", ")
                  ) : (
                    <span style={{ color: "#888" }}>N/A</span>
                  )}
                </span>
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Description:</strong>{" "}
                <span style={{ color: "var(--color-purple-light)" }}>
                  {description || <span style={{ color: "#888" }}>N/A</span>}
                </span>
              </div>
            </div>
            <div style={{ width: "100%", marginTop: "1rem" }}>
              <span style={{ fontWeight: 600, color: "var(--color-purple)" }}>
                Supporting Images:
              </span>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginTop: "0.5rem",
                }}
              >
                {supportingPreviews.length ? (
                  supportingPreviews.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Supporting ${idx + 1}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1.5px solid var(--color-purple-light)",
                        background: "var(--color-bg-dark)",
                      }}
                    />
                  ))
                ) : (
                  <span style={{ color: "#888" }}>N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    setLoading(true);
    setError("");
    try {
      await addDoc(collection(db, "products"), {
        title,
        price: parseFloat(price),
        description,
        sizes,
        quantity: parseInt(quantity, 10),
        promotion,
        gender,
        category,
        image: imageUrl,
        supportingImages: supportingImageUrls,
        createdAt: new Date(),
      });

      setTitle("");
      setPrice("");
      setDescription("");
      setSizes([]);
      setQuantity("");
      setPromotion(false);
      setGender("");
      setCategory("");
      setSelectedFile(null);
      setPreview(null);
      setImageUrl("");
      setSupportingFiles([]);
      setSupportingPreviews([]);
      setSupportingImageUrls([]);

      alert("Product saved successfully!");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Modal open handler by index
  const openModal = (index) => {
    setModalImageIndex(index);
    setModalOpen(true);
  };

  // Modal close handler
  const closeModal = () => {
    setModalOpen(false);
    setModalImageIndex(null);
  };

  // Modal Prev/Next navigation handlers
  const showPrevImage = () => {
    setModalImageIndex((prevIndex) => {
      if (prevIndex === 0) return supportingPreviews.length - 1;
      return prevIndex - 1;
    });
  };

  const showNextImage = () => {
    setModalImageIndex((prevIndex) => {
      if (prevIndex === supportingPreviews.length - 1) return 0;
      return prevIndex + 1;
    });
  };

  const canSubmit =
    title.trim() &&
    price.trim() &&
    description.trim() &&
    sizes.length &&
    imageUrl &&
    quantity &&
    gender &&
    category &&
    !loading &&
    !uploading &&
    !uploadingSupporting;

  return (
    <>
      <section className="section-1">
        <div className="product-manager">
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit}>
            {/* Main Image */}
            <div className="label">
              <label>Image:</label>
              <br />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
              {preview && (
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      Width: "400px",
                      maxHeight: "220px",
                      borderRadius: "10px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                      setImageUrl("");
                    }}
                    style={{
                      marginTop: "10px",
                      background: "var(--color-error)",
                      color: "var(--color-white)",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 18px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      height: "3rem",
                      width: "10rem",
                      transition: "background 0.2s",
                    }}
                    disabled={loading}
                  >
                    Reset Image
                  </button>
                </div>
              )}
            </div>

            {!imageUrl && (
              <div>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploading || !selectedFile || loading}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
            )}

            {/* Supporting Images */}
            <div className="label" style={{ marginTop: "20px" }}>
              <label>Supporting Images (max 10):</label>
              <br />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSupportingFilesChange}
                disabled={loading}
              />
              {supportingPreviews.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
                  {supportingPreviews.map((url, index) => (
                    <div
                      key={url}
                      style={{
                        width: "100%",
                        maxWidth: 200,
                        aspectRatio: "1 / 1",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onClick={() => openModal(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          openModal(index);
                      }}
                    >
                      <img
                        src={url}
                        alt="Supporting"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          pointerEvents: "none",
                        }}
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={uploadSupportingImages}
                disabled={
                  uploadingSupporting || supportingFiles.length === 0 || loading
                }
                style={{ marginTop: "10px" }}
              >
                {uploadingSupporting
                  ? "Uploading..."
                  : "Upload Supporting Images"}
              </button>
            </div>

            {/* Product Details */}
            <div>
              <label>Title:</label>
              <br />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label>Price:</label>
              <br />
              <div className="input-currency-group">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={loading}
                  min="0"
                  step="0.01"
                  placeholder="Price"
                />
                <span className="currency-label">MAD</span>
              </div>
            </div>

            <div>
              <label>Description:</label>
              <br />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label>Quantity:</label>
              <br />
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                disabled={loading}
                min="1"
              />
            </div>

            <div>
              <label>Promotion:</label>
              <br />
              <input
                type="checkbox"
                checked={promotion}
                onChange={() => setPromotion((prev) => !prev)}
                disabled={loading}
              />{" "}
              <span style={{ color: "#8c4fff" }}>On Promotion</span>
            </div>

            <div>
              <label>Gender:</label>
              <br />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Gender</option>
                {genderOptions.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Category:</label>
              <br />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Sizes:</label>
              <br />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {sizeOptions.map((sizeOption) => (
                  <label
                    key={sizeOption}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: sizes.includes(sizeOption)
                        ? "#8c4fff"
                        : "#f1f1f1",
                      color: sizes.includes(sizeOption) ? "#fff" : "#333",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      boxShadow: sizes.includes(sizeOption)
                        ? "0 2px 8px #b991ff44"
                        : "none",
                      border: "1.5px solid #b991ff",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={sizes.includes(sizeOption)}
                      onChange={() => handleSizeChange(sizeOption)}
                      disabled={loading}
                      style={{ marginRight: "6px" }}
                    />
                    {sizeOption}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={!canSubmit}>
              {loading ? "Saving Product..." : "Save Product"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          {/* Modal */}
          {modalOpen && modalImageIndex !== null && (
            <div
              className="modal-overlay"
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                animation: "fadeIn 0.3s ease forwards",
                zIndex: 9999,
              }}
              onClick={closeModal}
              aria-modal="true"
              role="dialog"
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  padding: 24,
                  borderRadius: 12,
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  animation: "scaleIn 0.3s ease forwards",
                }}
              >
                <img
                  src={supportingPreviews[modalImageIndex]}
                  alt="Supporting Large"
                  style={{
                    maxWidth: "600px",
                    maxHeight: "80vh",
                    objectFit: "contain",
                    borderRadius: 10,
                    userSelect: "none",
                  }}
                  draggable={false}
                />
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={showPrevImage}
                    style={buttonStyle("#6c7ae0")}
                  >
                    Previous
                  </button>
                  <button
                    onClick={showNextImage}
                    style={buttonStyle("#6c7ae0")}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => removeSupportingImage(modalImageIndex)}
                    style={buttonStyle("#e74c3c")}
                  >
                    Delete
                  </button>
                  <button
                    onClick={resetSupportingImages}
                    style={buttonStyle("#f39c12")}
                  >
                    Reset All
                  </button>
                  <button onClick={closeModal} style={buttonStyle("#bdc3c7")}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Separated Preview Section */}
        <div
          className="Preview"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="product-preview-card">
            {/* Product Image */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {preview ? (
                <img src={preview} alt="Main Preview" />
              ) : (
                <div>No Image</div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ width: "100%" }}>
              <h3
                style={{
                  color: "var(--color-purple)",
                  margin: "0 0 0.5rem 0",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}
              >
                {title || <span style={{ color: "#888" }}>Product Title</span>}
              </h3>
              <div style={{ marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--color-light-orange)",
                  }}
                >
                  {price ? `${price} MAD` : "0.00 MAD"}
                </span>
                {promotion && (
                  <span
                    style={{
                      background: "var(--color-purple)",
                      color: "#fff",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      fontSize: "0.85rem",
                      marginLeft: "10px",
                      fontWeight: 600,
                    }}
                  >
                    Promotion
                  </span>
                )}
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Quantity:</strong>{" "}
                <span style={{ color: "var(--color-purple-light)" }}>
                  {quantity || <span style={{ color: "#888" }}>N/A</span>}
                </span>
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Promotion Status:</strong>{" "}
                <span
                  style={{ color: promotion ? "var(--color-purple)" : "#888" }}
                >
                  {promotion ? "On Promotion" : "No Promotion"}
                </span>
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Category:</strong>{" "}
                <span style={{ color: "var(--color-purple-light)" }}>
                  {category || <span style={{ color: "#888" }}>N/A</span>}
                </span>
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Gender:</strong>{" "}
                <span style={{ color: "var(--color-purple-light)" }}>
                  {gender || <span style={{ color: "#888" }}>N/A</span>}
                </span>
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <strong>Sizes:</strong>{" "}
                <span style={{ color: "var(--color-purple-light)" }}>
                  {sizes.length ? (
                    sizes.join(", ")
                  ) : (
                    <span style={{ color: "#888" }}>N/A</span>
                  )}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="preview-details-btn"
              onClick={() => setDetailsModalOpen(true)}
            >
              Details
            </button>
          </div>
        </div>
        {detailsModalOpen && (
          <div
            className="details-modal-overlay"
            onClick={() => setDetailsModalOpen(false)}
          >
            <div
              className="details-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="details-modal-close"
                onClick={() => setDetailsModalOpen(false)}
              >
                &times;
              </button>
              <h2 className="details-modal-title">
                {title || <span className="preview-na">Product Title</span>}
              </h2>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Main Preview"
                    className="details-modal-main-img"
                  />
                ) : (
                  <div className="preview-no-img">No Image</div>
                )}
              </div>
              <div className="details-modal-info">
                <div className="preview-info-row">
                  <span className="preview-label">Price:</span>
                  <span className="preview-price">
                    {price ? `${price} MAD` : "0.00 MAD"}
                  </span>
                  {promotion && (
                    <span className="preview-promotion">Promotion</span>
                  )}
                </div>
                <div className="preview-info-row">
                  <span className="preview-label">Quantity:</span>
                  <span className="preview-value">
                    {quantity || <span className="preview-na">N/A</span>}
                  </span>
                </div>
                <div className="preview-info-row">
                  <span className="preview-label">Promotion Status:</span>
                  <span
                    className="preview-value"
                    style={{
                      color: promotion ? "var(--color-purple)" : "#888",
                    }}
                  >
                    {promotion ? "On Promotion" : "No Promotion"}
                  </span>
                </div>
                <div className="preview-info-row">
                  <span className="preview-label">Category:</span>
                  <span className="preview-value">
                    {category || <span className="preview-na">N/A</span>}
                  </span>
                </div>
                <div className="preview-info-row">
                  <span className="preview-label">Gender:</span>
                  <span className="preview-value">
                    {gender || <span className="preview-na">N/A</span>}
                  </span>
                </div>
                <div className="preview-info-row">
                  <span className="preview-label">Sizes:</span>
                  <span className="preview-sizes">
                    {sizes.length ? (
                      sizes.join(", ")
                    ) : (
                      <span className="preview-na">N/A</span>
                    )}
                  </span>
                </div>
                <div className="preview-info-row">
                  <span className="preview-label">Description:</span>
                  <span className="preview-value">
                    {description || <span className="preview-na">N/A</span>}
                  </span>
                </div>
              </div>
              <div style={{ width: "100%", marginTop: "1rem" }}>
                <span style={{ fontWeight: 600, color: "var(--color-purple)" }}>
                  Supporting Images:
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginTop: "0.5rem",
                  }}
                >
                  {supportingPreviews.length ? (
                    supportingPreviews.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Supporting ${idx + 1}`}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1.5px solid var(--color-purple-light)",
                          background: "var(--color-bg-dark)",
                        }}
                      />
                    ))
                  ) : (
                    <span style={{ color: "#888" }}>N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <StockManager />
    </>
  );

  // Button style helper
  function buttonStyle(bgColor) {
    return {
      padding: "10px 20px",
      backgroundColor: bgColor,
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
    };
  }
}

export default ProductManager;
