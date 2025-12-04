import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${keyword}`);
  };

  return (
    <>
      <div className="top-banner">
        GIAO HÀNG TỪ 2-5 NGÀY LÀM VIỆC.
        <span className="top-banner-hotline">
          📞 HOTLINE (10:00AM - 20:00H): (+84) 768962276
        </span>
      </div>

      <header className="header">
        <div className="header-left" />

        <div className="header-center">
          <Link to="/" className="logo">
            TranhDecor
          </Link>

          <nav className="main-nav">
            <ul className="main-nav-list">
              {/* TẤT CẢ */}
              <li className="nav-item">
                <Link to="/">TẤT CẢ</Link>
              </li>

              {/* TRANH RỜI */}
              <li className="nav-item dropdown">
                <span className="nav-link">TRANH RỜI</span>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/category/truu-tuong">TRỪU TƯỢNG</Link>
                  </li>

                  <li>
                    <Link to="/category/thuc-vat">THỰC VẬT</Link>
                  </li>

                  <li>
                    <Link to="/category/dong-vat">ĐỘNG VẬT</Link>
                  </li>

                  <li>
                    <Link to="/category/ban-do">BẢN ĐỒ & THÀNH PHỐ</Link>
                  </li>
                </ul>
              </li>

              {/* BỘ SƯU TẬP */}
              <li className="nav-item dropdown">
                <span className="nav-link">BỘ SƯU TẬP</span>
              </li>

              {/* TRANH BỘ */}
              <li className="nav-item">
                <Link to="/tranh-bo">TRANH BỘ</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-right">
          {/* SEARCH */}
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="🔍 Bạn tìm gì..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>

          {/* CART */}
          <Link to="/cart" className="cart-btn">
            🛍
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>

          {/* USER */}
          <div className="user-box-wrapper">
            {isAuthenticated ? (
              <>
                {/* Khi đã đăng nhập → nhấn vào avatar sẽ vào profile */}
                <Link to="/profile" className="icon-btn">
                  👤
                </Link>

                {/* Email + nút đăng xuất */}
                <div className="user-info">
                  <div className="user-email">{currentUser.email}</div>
                  <button className="link-btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>

                {/* Nếu admin → nút quản lý sản phẩm */}
                {isAdmin && (
                  <Link to="/admin" className="admin-btn">
                    ⚙️ Quản lý sản phẩm
                  </Link>
                )}
              </>
            ) : (
              // Khi chưa đăng nhập → nhấn vào avatar → login
              <Link to="/login" className="icon-btn">
                👤
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
