import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";

export default function TranhRoiPage() {
  const [products, setProducts] = useState([]);
  const categoriesRoi = ["truu-tuong", "thuc-vat", "dong-vat", "ban-do"];

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("category", categoriesRoi);

    if (!error) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-title">TRANH RỜI</h2>
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
