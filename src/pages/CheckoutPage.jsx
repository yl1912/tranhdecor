import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ⭐ Lấy sản phẩm đã chọn từ trang giỏ hàng
  const selectedItems = location.state?.selectedItems || [];

  // ⭐ Lọc SP được chọn
  const selectedProducts = cart.filter((item) =>
    selectedItems.includes(item.product_id)
  );

  // ⭐ Tổng tiền
  const totalPrice = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ⭐ Form
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ⭐ Xử lý thanh toán
  const handleCheckout = async () => {
    if (!currentUser) return navigate("/login");

    if (!name || !phone || !address)
      return alert("Vui lòng điền đầy đủ thông tin!");

    if (selectedProducts.length === 0)
      return alert("Không có sản phẩm nào để đặt hàng!");

    // 📌 Tạo đơn hàng
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: currentUser.id,
          total: totalPrice,
          customer_name: name,
          phone,
          address,
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error(orderError);
      alert("❌ Lỗi tạo đơn hàng!");
      return;
    }

    // 📌 Tạo order_items
    const items = selectedProducts.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(items);

    if (itemsError) {
      console.error(itemsError);
      alert("❌ Lỗi lưu sản phẩm vào đơn hàng!");
      return;
    }

    alert("🎉 Đặt hàng thành công!");
    clearCart();
    navigate("/");
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-steps">
        <div className={`step ${step === 1 ? "active" : ""}`}>
          1. Xác nhận đơn
        </div>
        <div className={`step ${step === 2 ? "active" : ""}`}>
          2. Thông tin giao hàng
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="checkout-box">
          <h2>Danh sách sản phẩm</h2>

          {selectedProducts.map((item) => (
            <div className="checkout-item" key={item.product_id}>
              <img src={item.image} alt="" />
              <div>
                <p className="item-name">{item.name}</p>
                <p className="item-qty">SL: {item.quantity}</p>
              </div>
              <p className="item-price">
                {(item.price * item.quantity).toLocaleString()}đ
              </p>
            </div>
          ))}

          <div className="checkout-total">
            <p>
              Tổng tiền:{" "}
              <strong style={{ color: "red" }}>
                {totalPrice.toLocaleString()}đ
              </strong>
            </p>
          </div>

          <button className="checkout-btn" onClick={() => setStep(2)}>
            Tiếp tục →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="checkout-box">
          <h2>Thông tin giao hàng</h2>

          <div className="checkout-form">
            <label>
              Họ tên
              <input
                className="checkout-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              Số điện thoại
              <input
                className="checkout-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <label>
              Địa chỉ giao hàng
              <textarea
                className="checkout-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </label>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Đặt hàng ngay
          </button>

          <button className="checkout-btn back" onClick={() => setStep(1)}>
            ← Quay lại
          </button>
        </div>
        
      )}
    </div>
  );
}
