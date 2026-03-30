// src/pages/ProductDetails.js
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function ProductDetails({ cart, setCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("");

  // 🔹 Use Render backend URL
  const BASE_URL = "https://ecommerce-web-qkbn.onrender.com";

  // ✅ GET SINGLE PRODUCT
  useEffect(() => {
    axios.get(`${BASE_URL}/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // ✅ GET ALL PRODUCTS
  useEffect(() => {
    axios.get(`${BASE_URL}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ ADD TO CART
  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }
    setCart([...cart, product]);
    setMsg("✅ Added to cart!");
    setTimeout(() => setMsg(""), 2000);
  };

  // ✅ RECOMMENDED PRODUCTS
  const recommendedProducts = products.filter(p =>
    product && p.category === product.category && p._id !== product._id
  ).slice(0, 4);

  if (!product)
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>{product.title}</h2>
      <img 
        src={product.image} 
        alt={product.title} 
        style={{ width: "100%", maxWidth: "350px", margin: "20px auto", display: "block" }} 
      />
      <p>{product.description}</p>
      <p><b>Price:</b> ₹{product.price}</p>

      <button 
        onClick={handleAddToCart} 
        style={{
          padding: "10px 20px",
          backgroundColor: "#27ae60",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "15px"
        }}
      >
        Add to Cart
      </button>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {/* RECOMMENDATIONS */}
      {recommendedProducts.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h3>You May Also Like</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px" }}>
            {recommendedProducts.map(item => (
              <div key={item._id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "10px", textAlign: "center" }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: "100%", height: "120px", objectFit: "cover" }} 
                />
                <h4>{item.title}</h4>
                <p>₹{item.price}</p>
                <Link to={`/product/${item._id}`}>View</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;