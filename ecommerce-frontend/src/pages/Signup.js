import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const BASE_URL = "https://ecommerce-web-qkbn.onrender.com";

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/api/signup`, {
        name,
        email,
        password,
      });

      setMsg("Signup successful ✅ Redirecting to login...");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      console.log("Signup Error:", err); // ✅ DEBUG

      setMsg(
        err.response?.data?.message ||
        "Server error. Please try again ❌"
      );
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSignup}>
        <h2 style={styles.title}>Create Account</h2>

        <input
          style={styles.input}
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button style={styles.button}>Sign Up</button>

        <p style={styles.msg}>{msg}</p>
      </form>
    </div>
  );
}

export default Signup;

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },

  card: {
    width: "340px",
    padding: "30px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },

  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#16a34a",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
  },

  msg: {
    textAlign: "center",
    fontSize: "14px",
    marginTop: "5px",
  },
};