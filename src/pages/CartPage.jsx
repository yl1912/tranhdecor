import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // ⭐ KHÔNG mặc định chọn sản phẩm nào
  const [selectedItems, setSelectedItems] = useState([]);

  // ⭐ Chọn / bỏ chọn 1 sản phẩm
  const toggleSelect = (product_id) => {
    setSelectedItems((prev) =>
      prev.includes(product_id)
        ? prev.filter((id) => id !== product_id)
        : [...prev, product_id]
    );
  };

  // ⭐ Chọn tất cả chỉ khi người dùng nhấn
  const selectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]); // bỏ chọn hết
    } else {
      setSelectedItems(cart.map((item) => item.product_id)); // chọn hết
    }
  };

  // ⭐ Tính tổng tiền theo sản phẩm được chọn
  const selectedTotal = cart
    .filter((item) => selectedItems.includes(item.product_id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <h2>Giỏ hàng trống</h2>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Giỏ hàng</h2>

      {/* ⭐ CHECKBOX CHỌN TẤT CẢ */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="checkbox"
          checked={selectedItems.length === cart.length && cart.length > 0}
          onChange={selectAll}
        />{" "}
        <strong>Chọn tất cả</strong>
      </div>

      <table className="cart-table">
        <thead>
          <tr>
            <th></th>
            <th>Sản phẩm</th>
            <th>SL</th>
            <th>Tạm tính</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item) => {
            const subtotal = item.price * item.quantity;

            return (
              <tr key={item.product_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.product_id)}
                    onChange={() => toggleSelect(item.product_id)}
                  />
                </td>

                <td>
                  <div className="cart-product">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                </td>

                <td>
                  <div className="qty-control">
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>{subtotal.toLocaleString()}đ</td>

                <td>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ⭐ THANH TOÁN CHỈ CHO SP ĐÃ CHỌN */}
      <div className="cart-summary">
        <strong>Tổng cộng: {selectedTotal.toLocaleString()}đ</strong>

        <button
          className="checkout-btn"
          disabled={selectedItems.length === 0}
          onClick={() =>
            navigate("/checkout", {
              state: { selectedItems },
            })
          }
        >
          Thanh toán →
        </button>
      </div>
    </div>
  );
}
