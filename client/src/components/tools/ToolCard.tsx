import React from "react";
import { Tool } from "../../types/tool";
import { useCart } from "../../contexts/CartContext";
import { ShoppingBag, Plus, Minus } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();

  const existingInCart = cartItems.find((item) => item.tool.id === tool.id);

  const handleAdd = () => {
    addToCart(tool, 1);
  };

  const handleIncrement = () => {
    if (existingInCart) {
      updateQuantity(tool.id, existingInCart.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (existingInCart) {
      updateQuantity(tool.id, existingInCart.quantity - 1);
    }
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
          {existingInCart ? (
            <div className="qty-picker qty-picker-active">
              <button
                type="button"
                className="qty-btn"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="qty-display">{existingInCart.quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button type="button" className="add-cart-btn" onClick={handleAdd}>
              <ShoppingBag size={16} /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
