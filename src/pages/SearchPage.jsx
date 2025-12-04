import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";

export default function SearchPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const location = useLocation();

  // Lấy keyword từ URL
  const keyword =
    new URLSearchParams(location.search).get("keyword")?.toLowerCase() || "";

  console.log("🔍 Từ khóa đang tìm:", keyword);

  // Tải sản phẩm
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (!error) setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Lọc theo keyword
  const result = products.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const price = item.fromprice?.toString() || "";
    const id = item.id?.toLowerCase() || "";

    return (
      name.includes(keyword) || price.includes(keyword) || id.includes(keyword)
    );
  });

  return (
    <div className="category-page">
      <h2 className="category-title">KẾT QUẢ TÌM KIẾM</h2>

      <p className="search-result-info">
        Kết quả cho: <strong>"{keyword}"</strong> — {result.length} sản phẩm
      </p>

      <div className="product-grid">
        {result.length === 0 && <p>❌ Không tìm thấy sản phẩm nào phù hợp.</p>}

        {result.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-image-wrap">
              <img src={p.image} alt={p.name} />
            </div>
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-bottom">
                <div className="product-price-row">
                  <span className="product-price-label">Chỉ từ:</span>
                  <span className="product-price">
                    {(p.fromprice ?? 0).toLocaleString()}đ
                  </span>
                </div>

                <button
                  className="product-cart-btn"
                  onClick={() => addToCart(p)}
                >
                  🛒+
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
