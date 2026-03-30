import React, { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  // =========================
  // AI DELIVERY DAYS FUNCTION
  // =========================
  const getAIDeliveryDays = (order) => {
    let days = 3; // base delivery

    // Category logic
    if (order.category === "gown") days += 3;
    if (order.category === "ring" || order.category === "bracelet") days += 1;
    if (order.category === "necklace") days += 2;

    // Price logic
    if (order.price > 2000) days += 1;
    if (order.price > 10000) days += 2;

    // Random delay (only first time)
    const randomDelay = Math.floor(Math.random() * 2);
    days += randomDelay;

    return days;
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];

    const updatedOrders = saved.map(order => {

      // ✅ SAFE DATE (fix invalid date issue)
      const orderDate = order.date ? new Date(order.date) : new Date();
      const today = new Date();

      const diffDays = Math.floor(
        (today - orderDate) / (1000 * 60 * 60 * 24)
      );

      // =========================
      // STATUS TRACKING
      // =========================
      let status = "Order Placed";
      if (diffDays >= 1) status = "Packed";
      if (diffDays >= 2) status = "Shipped";
      if (diffDays >= 3) status = "Delivered";

      // =========================
      // AI DELIVERY DAYS (STABLE)
      // =========================
      const totalDays = order.totalDays || getAIDeliveryDays(order);
      const remainingDays = Math.max(totalDays - diffDays, 0);

      return {
        ...order,
        status,
        totalDays,
        remainingDays,
        date: order.date || new Date().toISOString() // fix old orders
      };
    });

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

  }, []);

  const deleteOrder = (index) => {
    const updated = [...orders];
    updated.splice(index, 1);
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No Orders Yet</p>
      ) : (
        <div className="orders-grid">

          {orders.map((order, index) => (
            <div key={index} className="order-card">

              {/* IMAGE FIX */}
              <img
                src={
                  order.image?.startsWith("http")
                    ? order.image
                    : `http://localhost:5000${order.image}`
                }
                alt={order.title}
              />

              <h4>{order.title}</h4>
              <p>₹{order.price}</p>

              <p><b>ID:</b> {order.id}</p>

              {/* ✅ FIXED DATE DISPLAY */}
              <p>
                <b>Date:</b>{" "}
                {order.date
                  ? new Date(order.date).toLocaleString()
                  : "Just Now"}
              </p>

              <p><b>Payment:</b> {order.payment}</p>

              {/* ✅ AI DELIVERY IN DAYS */}
              <p>
                <b>Delivery:</b>{" "}
                {order.remainingDays > 0
                  ? `Arriving in ${order.remainingDays} day(s)`
                  : "Delivered"} <br />
              
              </p>

              {/* STATUS */}
              <p className={`status ${order.status}`}>
                {order.status}
              </p>

              <button
  onClick={() => deleteOrder(index)}
  style={{
    marginTop: "10px",
    padding: "6px 12px",
    backgroundColor: "#e74c3c", // red
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Delete
</button>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Orders;