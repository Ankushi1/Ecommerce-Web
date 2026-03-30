import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import "./Chatbot.css";

function Chatbot({ products, onAddToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi Ankushi! 👋 I’m your AI assistant. Ask me anything!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [lastSearch, setLastSearch] = useState("");

  // ✅ Fuse (AI + spelling)
  const fuse = new Fuse(products, {
    keys: ["title", "category"],
    threshold: 0.4,
  });

 

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    let botReply;

    const text = input.toLowerCase();

    // 🔥 ORDER TRACKING (FAKE DEMO)
    if (text.includes("order") || text.includes("track")) {
      botReply = {
        text: "📦 Your order is out for delivery and will reach you by tomorrow!",
        sender: "bot"
      };
    }

    // 🔥 REPEAT LAST SEARCH (MEMORY)
    else if (text.includes("again") && lastSearch) {
      const results = fuse.search(lastSearch);
      const matched = results.map(r => r.item);

      botReply = {
        text: "Showing previous results again:",
        sender: "bot",
        products: matched.slice(0, 3)
      };
    }

    // 🔥 NORMAL AI SEARCH + SPELLING
    else {
      const results = fuse.search(input);
      let matchedProducts = results.map(r => r.item);

      if (text.includes("cheap")) {
        matchedProducts = products.filter(p => p.price < 500);
      }

      if (matchedProducts.length > 0) {
        setLastSearch(input); // memory save

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
      {/* 💬 ICON */}
      {!isOpen && (
        <div className="chat-icon" onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}

      {/* 💬 CHAT UI */}
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
                        <img src={p.image} alt={p.title} />
                        <p>{p.title}</p>
                        <p>₹{p.price}</p>
                        <button onClick={() => onAddToCart(p)}>
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* INPUT*/}
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