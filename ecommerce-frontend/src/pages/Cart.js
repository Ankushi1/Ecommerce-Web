import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import API from "../api";

function Cart({ cart = [], setCart }) {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = React.useState("COD");

  // ✅ Remove item
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // ✅ Total price
  const totalPrice = cart.reduce(
    (total, item) => total + (item.price || 0),
    0
  );

  // ✅ PLACE ORDER (NOW BACKEND)
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      const ordersData = cart.map(item => ({
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category,
        payment: paymentMethod
      }));

      // 🔥 SEND TO BACKEND
      await API.post("/api/orders", ordersData);

      alert("Order Placed Successfully ✅");

      setCart([]);
      navigate("/orders");

    } catch (err) {
      console.log("Order Error:", err);
      alert("Order failed ❌");
    }
  };

  return (
    <div className="cart-page">
      <h2>My Cart</h2>

      {/* EMPTY CART */}
      {cart.length === 0 ? (
        <div className="empty-cart">
          <h3>Your Cart is empty</h3>
          <Link to="/" className="shop-link">
            Go Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* CART ITEMS */}
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-card">

                {/* ✅ SAFE IMAGE */}
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />

                <div className="cart-info">
                  <h4>{item.title}</h4>
                  <p>₹{(item.price || 0).toFixed(2)}</p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* PAYMENT */}
          <div className="payment-section">
            <h3>Select Payment Method</h3>

            <label className="payment-option">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label className="payment-option">
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Pay Online (UPI / Card)
            </label>
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <h3>Total: ₹{totalPrice.toFixed(2)}</h3>

            <button className="place-btn" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;