import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Fuse from "fuse.js";
import "./Home.css";
import Chatbot from "../components/Chatbot";

function Home({ cart, setCart }) {

  // ✅ STATES
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [sortBy, setSortBy] = useState("");
  const cartIconRef = useRef(null);

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ AI SMART SEARCH
  const fuse = new Fuse(products, {
    keys: ["title", "category"],
    threshold: 0.4,
  });

  let filteredProducts = search
    ? fuse.search(search).map(result => result.item)
    : products;

  // ✅ SORTING
  if (sortBy === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-asc") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "name-desc") {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortBy === "newest") {
    filteredProducts.sort((a, b) => (b.isNew ? 1 : -1));
  }

  // ✅ ADD TO CART
  const handleAddToCart = (product, e) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    // ✨ Fly animation
    const img = e.currentTarget.closest(".product-card").querySelector("img");
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

    // ✅ Add item
    setCart([...cart, product]);

    // ✅ Message
    setMsg(`"${product.title}" added to cart!`);
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="home-container">

      {/* ✅ Success Message */}
      {msg && <div className="success-msg">{msg}</div>}

      {/* ✅ Banner */}
      <div className="hero-banner">
        <span>Welcome to Fashion Hub! Huge Sale Today – Up to 50% Off!</span>
      </div>

      {/* ✅ Search + Sort */}
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

      {/* ✅ Products */}
      <div className="products-grid">

        {filteredProducts.length === 0 ? (
          <h3 className="no-products">No products found</h3>
        ) : (

          filteredProducts.map(product => (

            <div key={product._id} className="product-card">

              {/* Badges */}
              {product.isSale && <div className="badge">SALE</div>}
              {product.isNew && <div className="badge new">NEW</div>}

              {/* Image */}
              <div className="product-image">
                <img src={product.image} alt={product.title} />

                <Link to={`/product/${product._id}`} className="quick-view">
                  Quick View
                </Link>
              </div>

              {/* Info */}
              <h3>{product.title}</h3>
              <p className="price">₹{product.price}</p>

              {/* ✅ BUTTON FIXED */}
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

      {/* ✅ CHATBOT */}
      <Chatbot 
        products={products} 
        onAddToCart={(product) => setCart([...cart, product])}
      />

      {/* Invisible Cart Ref */}
      <div
        ref={cartIconRef}
        style={{ position: "fixed", top: 20, right: 40 }}
      ></div>

    </div>
  );
}

export default Home;