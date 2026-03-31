import { useState } from "react";
import Fuse from "fuse.js";
import "./Chatbot.css";

function Chatbot({ products, onAddToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi Ankushi! 👋 I’m your AI assistant. Ask me anything!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [lastSearch, setLastSearch] = useState("");

  // ✅ AI Search (with spelling support)
  const fuse = new Fuse(products, {
    keys: ["title", "category"],
    threshold: 0.4,
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    let botReply;
    const text = input.toLowerCase();

    // 📦 ORDER TRACKING (demo)
    if (text.includes("order") || text.includes("track")) {
      botReply = {
        text: "📦 Your order is out for delivery and will reach you by tomorrow!",
        sender: "bot"
      };
    }

    // 🔁 Repeat last search
    else if (text.includes("again") && lastSearch) {
      const results = fuse.search(lastSearch);
      const matched = results.map(r => r.item);

      botReply = {
        text: "Showing previous results again:",
        sender: "bot",
        products: matched.slice(0, 3)
      };
    }

    // 🔍 Normal search
    else {
      const results = fuse.search(input);
      let matchedProducts = results.map(r => r.item);

      // 💰 cheap filter
      if (text.includes("cheap")) {
        matchedProducts = products.filter(p => p.price < 500);
      }

      if (matchedProducts.length > 0) {
        setLastSearch(input);

        botReply = {
          text: `I found ${matchedProducts.length} products for you 😊`,
          sender: "bot",
          products: matchedProducts.slice(0, 3)
        };
      } else {
        botReply = {
          text: "Hmm... I couldn't find that. Try something else!",
          sender: "bot"
        };
      }
    }

    setMessages(prev => [...prev, userMessage, botReply]);
    setInput("");
  };

  return (
    <>
      {/* 💬 Chat Icon */}
      {!isOpen && (
        <div className="chat-icon" onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}

      {/* 💬 Chat UI */}
      {isOpen && (
        <div className="chatbot">

          <div className="chat-header">
            <span>AI Assistant</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`msg ${msg.sender}`}>
                <p>{msg.text}</p>

                {msg.products && (
                  <div className="chat-products">
                    {msg.products.map(p => (
                      <div key={p._id} className="chat-card">
                        <img
                          src={p.image}
                          alt={p.title}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                        <p>{p.title}</p>
                        <p>₹{p.price}</p>

                        <button
                          onClick={() => {
                            const token = localStorage.getItem("token");
                            if (!token) {
                              alert("Please login first");
                              window.location.href = "/login";
                              return;
                            }
                            onAddToCart(p);
                          }}
                        >
                          Add
                        </button>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="chat-input">
            <input
              type="text"
              placeholder="Try: shoes / cheap / track order..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>

        </div>
      )}
    </>
  );
}

export default Chatbot;