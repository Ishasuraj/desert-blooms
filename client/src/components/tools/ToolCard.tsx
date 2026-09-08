import React, { useState } from "react";
import { Tool } from "../../types/tool";
import { useCart } from "../../contexts/CartContext";
import { ShoppingBag, Plus, Minus, Check } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [selectedQty, setSelectedQty] = useState(1);
  const [added, setAdded] = useState(false);

  const existingInCart = cartItems.find((item) => item.tool.id === tool.id);

  const handleAdd = () => {
    addToCart(tool, selectedQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleIncrement = () => {
    setSelectedQty((prev) => Math.min(prev + 1, 99));
  };

  const handleDecrement = () => {
    setSelectedQty((prev) => Math.max(prev - 1, 1));
  };

  return (
    <article className="tool-card">
      <div className="tool-image-container">
        <span className="tool-bin-badge">BIN: {tool.binNo}</span>
        <span className="tool-category-badge">{tool.category}</span>
        <img
          src={tool.image}
          alt={tool.name}
          className="tool-image"
          loading="lazy"
        />
      </div>

      <div className="tool-card-body">
        <h3 className="tool-title">{tool.name}</h3>
        <p className="tool-description">{tool.description}</p>

        <div className="tool-price-row">
          <div className="tool-price-wrapper">
            <span className="price-val">{tool.price.toFixed(3)}</span>
            <span className="price-currency">KWD</span>
          </div>
        </div>

        <div className="tool-actions-row">
          <div className="qty-picker">
            <button
              type="button"
              className="qty-btn"
              onClick={handleDecrement}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="qty-display">{selectedQty}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={handleIncrement}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            className={`add-cart-btn ${added ? "is-added" : ""}`}
            onClick={handleAdd}
          >
            {added ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Add to Cart
              </>
            )}
          </button>
        </div>

        {existingInCart ? (
          <div className="in-cart-indicator">
            <span>In cart: <strong>{existingInCart.quantity}</strong></span>
            <button
              onClick={() => updateQuantity(tool.id, existingInCart.quantity + 1)}
              className="quick-add-link"
            >
              + Add another
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
};
