import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const BASE_URL = "https://ecommerce-web-qkbn.onrender.com";

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

  // =========================
  // FETCH ORDERS FROM BACKEND
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const updatedOrders = res.data.map((order) => {
          const orderDate = order.date ? new Date(order.date) : new Date();
          const today = new Date();

          const diffDays = Math.floor(
            (today - orderDate) / (1000 * 60 * 60 * 24)
          );

          // STATUS TRACKING
          let status = "Order Placed";
          if (diffDays >= 1) status = "Packed";
          if (diffDays >= 2) status = "Shipped";
          if (diffDays >= 3) status = "Delivered";

          // AI DELIVERY DAYS
          const totalDays = order.totalDays || getAIDeliveryDays(order);
          const remainingDays = Math.max(totalDays - diffDays, 0);

          return {
            ...order,
            status,
            totalDays,
            remainingDays,
            date: order.date || new Date().toISOString(),
          };
        });

        setOrders(updatedOrders);
      })
      .catch((err) => console.log(err));
  }, []);

  // =========================
  // DELETE ORDER
  // =========================
  const deleteOrder = (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .delete(`${BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setOrders(orders.filter((o) => o._id !== orderId));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No Orders Yet</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">

              {/* IMAGE FIX */}
              <img
                src={
                  order.image?.startsWith("http")
                    ? order.image
                    : `${BASE_URL}${order.image}`
                }
                alt={order.title}
              />

              <h4>{order.title}</h4>
              <p>₹{order.price}</p>
              <p><b>ID:</b> {order._id}</p>
              <p><b>Date:</b> {order.date ? new Date(order.date).toLocaleString() : "Just Now"}</p>
              <p><b>Payment:</b> {order.payment}</p>

              {/* AI DELIVERY */}
              <p>
                <b>Delivery:</b>{" "}
                {order.remainingDays > 0
                  ? `Arriving in ${order.remainingDays} day(s)`
                  : "Delivered"}
              </p>

              {/* STATUS */}
              <p className={`status ${order.status.replace(" ", "-")}`}>
                {order.status}
              </p>

              <button
                onClick={() => deleteOrder(order._id)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
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