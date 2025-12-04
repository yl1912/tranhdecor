import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";

export default function CategoryPage() {
  const { category } = useParams(); // lấy /category/:category
  const [sort, setSort] = useState("newest");
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  // ⭐ Lấy sản phẩm theo category
  const fetchProducts = async () => {
    let query = supabase.from("products").select("*");

    if (category && category !== "all") {
      query = query.eq("category", category); // lọc đúng key
    }

    const { data, error } = await query;
    if (!error) setProducts(data);
  };

  // ⭐ Sắp xếp
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.fromprice - b.fromprice;
    if (sort === "price-desc") return b.fromprice - a.fromprice;
    return 0;
  });

  // ⭐ Map tiêu đề
  const categoryNames = {
    all: "Tất cả sản phẩm",
    "truu-tuong": "Tranh Trừu tượng",
    "thuc-vat": "Tranh Thực vật",
    "dong-vat": "Tranh Động vật",
    "ban-do": "Tranh Bản đồ & Thành phố",
    "tranh-bo": "Tranh Bộ",
  };

  return (
    <div className="category-page">
      <h2 className="category-title">
        {categoryNames[category] || "Tất cả sản phẩm"}
      </h2>

      <div className="sort-bar">
        <span>Sắp xếp theo:</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
      </div>

      {products.length === 0 && <p>Không có sản phẩm nào.</p>}

      <div className="product-grid">
        {sortedProducts.map((p) => (
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
