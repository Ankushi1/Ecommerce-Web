import React, { useEffect, useState } from "react";
import API from "../api";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  // =========================
  // AI DELIVERY DAYS FUNCTION
  // =========================
  const getAIDeliveryDays = (order) => {
    let days = 3;

    if (order.category === "gown") days += 3;
    if (order.category === "ring" || order.category === "bracelet") days += 1;
    if (order.category === "necklace") days += 2;

    if (order.price > 2000) days += 1;
    if (order.price > 10000) days += 2;

    const randomDelay = Math.floor(Math.random() * 2);
    days += randomDelay;

    return days;
  };

  // =========================
  // FETCH FROM BACKEND
  // =========================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/api/orders");

        const updatedOrders = res.data.map(order => {
          const orderDate = new Date(order.date);
          const today = new Date();

          const diffDays = Math.floor(
            (today - orderDate) / (1000 * 60 * 60 * 24)
          );

          let status = "Order Placed";
          if (diffDays >= 1) status = "Packed";
          if (diffDays >= 2) status = "Shipped";
          if (diffDays >= 3) status = "Delivered";

          const totalDays = getAIDeliveryDays(order);
          const remainingDays = Math.max(totalDays - diffDays, 0);

          return {
            ...order,
            status,
            remainingDays
          };
        });

        setOrders(updatedOrders);

      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, []);

  // =========================
  // DELETE ORDER
  // =========================
  const deleteOrder = async (id) => {
    try {
      await API.delete(`/api/orders/${id}`);
      setOrders(orders.filter(o => o._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No Orders Yet</p>
      ) : (
        <div className="orders-grid">

          {orders.map(order => (
            <div key={order._id} className="order-card">

              <img
                src={order.image || "https://via.placeholder.com/200"}
                alt={order.title}
              />

              <h4>{order.title}</h4>
              <p>₹{order.price}</p>

              <p><b>ID:</b> {order._id}</p>

              <p>
                <b>Date:</b>{" "}
                {new Date(order.date).toLocaleString()}
              </p>

              <p><b>Payment:</b> {order.payment}</p>

              <p>
                <b>Delivery:</b>{" "}
                {order.remainingDays > 0
                  ? `Arriving in ${order.remainingDays} day(s)`
                  : "Delivered"}
              </p>

              <p className={`status ${order.status}`}>
                {order.status}
              </p>

              <button onClick={() => deleteOrder(order._id)}>
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