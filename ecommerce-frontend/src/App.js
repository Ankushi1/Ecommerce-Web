// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [cart, setCart] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLogin(true);
  }, []);

  return (
    <BrowserRouter>
      <Navbar cart={cart} isLogin={isLogin} setIsLogin={setIsLogin} />
<Routes>
  <Route path="/" element={<Home cart={cart} setCart={setCart} />} />

  <Route 
    path="/product/:id" 
    element={<ProductDetails cart={cart} setCart={setCart} />} 
  />

  <Route
    path="/cart"
    element={
      <ProtectedRoute>
        <Cart cart={cart} setCart={setCart} />
      </ProtectedRoute>
    }
  />

  <Route path="/orders" element={<Orders />} />

  <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
  <Route path="/signup" element={<Signup />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;