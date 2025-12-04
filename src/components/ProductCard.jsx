import React from "react";
import { useCart } from "../context/CartContext";

const formatPrice = (vnd) => {
  if (!vnd) return "0₫"; // ⭐ CHỐT LỖI TẠI ĐÂY
  return vnd.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
        <button
          className="product-add-btn"
          onClick={() => addToCart(product.id)}
        >
          +
        </button>
      </div>

      <div className="product-info">
        <div className="product-name">{product.name}</div>

        <div className="product-price-row">
          <span className="product-price-label">Chỉ từ:</span>

          <span className="product-price">
            {formatPrice(product.fromprice)}{" "}
            {/* ⭐ SỬA fromPrice → fromprice */}
          </span>
        </div>
      </div>
    </div>
  );
}
