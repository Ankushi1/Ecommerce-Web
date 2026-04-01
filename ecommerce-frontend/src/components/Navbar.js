import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cart, isLogin, setIsLogin }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);

    // ✅ redirect after logout
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Fashion Hub</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/cart" className="cart-link">
          Cart
          {cart.length > 0 && (
            <span className="cart-count">{cart.length}</span>
          )}
        </Link>

        <Link to="/orders">My Orders</Link>

        {!isLogin ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;