import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Fuse from "fuse.js";
import "./Home.css";
import Chatbot from "../components/Chatbot";

function Home({ cart, setCart }) {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [sortBy, setSortBy] = useState("");
  const cartIconRef = useRef(null);

  // ✅ BASE URL (Render backend)
  const BASE_URL = "https://ecommerce-web-qkbn.onrender.com";

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    axios.get(`${BASE_URL}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.log("Error fetching products:", err));
  }, []);

  // ✅ AI SEARCH
  const fuse = new Fuse(products, {
    keys: ["title", "category"],
    threshold: 0.4,
  });

  let filteredProducts = search
    ? fuse.search(search).map(result => result.item)
    : [...products]; // ✅ FIX: avoid mutation bug

  // ✅ SORTING
  if (sortBy === "price-asc") filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === "name-asc") filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === "name-desc") filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  else if (sortBy === "newest") filteredProducts.sort((a, b) => (b.isNew ? 1 : -1));

  // ✅ ADD TO CART
  const handleAddToCart = (product, e) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    // ✨ SAFE animation (prevent crash)
    const img = e?.currentTarget?.closest(".product-card")?.querySelector("img");

    if (img) {
      const flyImg = img.cloneNode(true);
      flyImg.classList.add("fly-img");

      const rect = img.getBoundingClientRect();
      flyImg.style.top = rect.top + "px";
      flyImg.style.left = rect.left + "px";

      document.body.appendChild(flyImg);

      const cartRect = cartIconRef.current.getBoundingClientRect();
      flyImg.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.1)`;
      flyImg.style.opacity = 0;

      setTimeout(() => document.body.removeChild(flyImg), 800);
    }

    // ✅ Add item
    setCart([...cart, product]);

    // ✅ Message
    setMsg(`"${product.title}" added to cart!`);
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="home-container">

      {msg && <div className="success-msg">{msg}</div>}

      <div className="hero-banner">
        <span>Welcome to Fashion Hub! Huge Sale Today – Up to 50% Off!</span>
      </div>

      <div className="search-sort">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <h3 className="no-products">Loading products...</h3>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className="product-card">

              {product.isSale && <div className="badge">SALE</div>}
              {product.isNew && <div className="badge new">NEW</div>}

              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200";
                  }}
                />
                <Link to={`/product/${product._id}`} className="quick-view">
                  Quick View
                </Link>
              </div>

              <h3>{product.title}</h3>
              <p className="price">₹{product.price}</p>

              <div className="card-buttons">
                <button
                  className="add-btn"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Cart
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* ✅ FIX: chatbot add to cart safe */}
      <Chatbot
        products={products}
        onAddToCart={(product) => {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("Please login first");
            window.location.href = "/login";
            return;
          }
          setCart([...cart, product]);
        }}
      />

      <div ref={cartIconRef} style={{ position: "fixed", top: 20, right: 40 }}></div>

    </div>
  );
}

export default Home;