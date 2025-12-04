import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { currentUser, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD PROFILE + ORDERS
  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  // ---------------------------
  // LẤY PROFILE
  // ---------------------------
  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    setProfile(data);
    setLoading(false);
  };

  // ---------------------------
  // LẤY ĐƠN HÀNG + SẢN PHẨM
  // ---------------------------
  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          quantity,
          price,
          product_id,
          products (*)
        )
      `
      )
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    // Add trạng thái showDetail
    const formatted = (data || []).map((o) => ({ ...o, show: false }));

    setOrders(formatted);
  };

  // ---------------------------
  // HỦY ĐƠN
  // ---------------------------
  const cancelOrder = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn?")) return;

    await supabase.from("orders").update({ status: "cancelled" }).eq("id", id);

    loadOrders();
  };

  // ---------------------------
  // MỞ / ĐÓNG CHI TIẾT ĐƠN
  // ---------------------------
  const toggle = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, show: !o.show } : o))
    );
  };

  if (loading) return <p>Đang tải...</p>;

  const avatarText = currentUser.email.charAt(0).toUpperCase();

  return (
    <div className="profile-page">
      {/* --------------------------------- */}
      {/* THÔNG TIN NGƯỜI DÙNG */}
      {/* --------------------------------- */}
      <div className="profile-header">
        <div className="avatar-box">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="avatar" />
          ) : (
            <div className="avatar-text">{avatarText}</div>
          )}
        </div>

        <div className="profile-info">
          {profile?.full_name && <h2>{profile.full_name}</h2>}

          <p className="email">{currentUser.email}</p>

          <p className="join-date">
            Thành viên từ:{" "}
            {new Date(currentUser.created_at).toLocaleDateString("vi-VN")}
          </p>

          <button className="logout-btn" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* --------------------------------- */}
      {/* DANH SÁCH ĐƠN HÀNG */}
      {/* --------------------------------- */}
      <div className="orders-section">
        <h3>Đơn hàng của bạn</h3>

        {orders.length === 0 && (
          <p className="no-orders">Chưa có đơn hàng nào.</p>
        )}

        <div className="orders-list">
          {orders.map((o) => (
            <div key={o.id} className="order-card">
              {/* HEADER ĐƠN */}
              <div className="order-header" onClick={() => toggle(o.id)}>
                <div>
                  <div className="order-id">Mã đơn: {o.id}</div>
                  <div className="order-date">
                    {new Date(o.created_at).toLocaleString("vi-VN")}
                  </div>
                </div>

                <div className="order-total">{o.total.toLocaleString()} ₫</div>
              </div>

              {/* CHI TIẾT ĐƠN */}
              {o.show && (
                <div className="order-detail">
                  {/* SẢN PHẨM */}
                  <h4>Sản phẩm</h4>
                  <div className="order-products">
                    {o.order_items?.map((item) => (
                      <div key={item.id} className="order-product-item">
                        <img
                          src={item.products?.image}
                          className="order-product-img"
                          alt=""
                        />

                        <div className="order-product-info">
                          <p className="product-name">{item.products?.name}</p>
                          <p>Số lượng: {item.quantity}</p>
                          <p>Giá: {item.price.toLocaleString()} ₫</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* THÔNG TIN GIAO HÀNG */}
                  <h4>Thông tin giao hàng</h4>

                  <p>
                    <strong>Người nhận:</strong> {o.fullname}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {o.phone}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {o.address}
                  </p>

                  {o.note && (
                    <p>
                      <strong>Ghi chú:</strong> {o.note}
                    </p>
                  )}

                  {/* NÚT HỦY ĐƠN */}
                  {["pending", "waiting", "processing"].includes(o.status) && (
                    <button
                      className="cancel-btn"
                      onClick={() => cancelOrder(o.id)}
                    >
                      ❌ Hủy đơn hàng
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
