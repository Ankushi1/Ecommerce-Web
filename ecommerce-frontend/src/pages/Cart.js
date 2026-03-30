// src/pages/Cart.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart({ cart = [], setCart }) {
  const navigate = useNavigate();

  // Remove item
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };
const [paymentMethod, setPaymentMethod] = React.useState("COD");
  // Total price
  const totalPrice = cart.reduce(
    (total, item) => total + (item.price || 0),
    0
  );

  // ✅ SIMPLE PLACE ORDER (NO ADDRESS)
  const placeOrder = () => {

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const newOrders = cart.map(item => ({
      ...item,
      id: "ORD" + Math.floor(Math.random() * 100000),
      date: new Date().toISOString(),
      payment: "COD",
      status: "Order Placed"
    }));

    const existing = JSON.parse(localStorage.getItem("orders")) || [];

    localStorage.setItem("orders", JSON.stringify([...existing, ...newOrders]));

    alert("Order Placed Successfully ✅");

    setCart([]);
    navigate("/orders");
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
                <img src={item.image} alt={item.title} />

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

          {/* PAYMENT SECTION */}
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