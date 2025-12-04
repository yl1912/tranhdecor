import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";

export default function TranhBoPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", "tranh-bo");

    if (!error) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-title">TRANH BỘ</h2>
      <div className="product-grid">
        {products.length === 0 ? (
          <p>Không có sản phẩm!</p>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
}
