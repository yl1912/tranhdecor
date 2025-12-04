import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [fromPrice, setFromPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (!error) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // 🔥 THÊM + SỬA
  const handleSave = async () => {
    if (!name || !fromPrice || !image || !category)
      return alert("Vui lòng nhập đầy đủ thông tin!");

    // SỬA
    if (editingId) {
      const { data, error } = await supabase
        .from("products")
        .update({
          name,
          fromprice: Number(fromPrice),
          image,
          category,
        })
        .eq("id", editingId);

      if (error) return alert("❌ Lỗi khi cập nhật!");

      showMessage("✅ Cập nhật thành công!");
      resetForm();
      fetchProducts();
      return;
    }

    // THÊM MỚI
    const { data, error } = await supabase.from("products").insert([
      {
        name,
        fromprice: Number(fromPrice),
        image,
        category,
      },
    ]);

    if (error) return alert("❌ Lỗi khi thêm sản phẩm!");

    showMessage("🎉 Thêm sản phẩm thành công!");
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) showMessage("🗑️ Xóa thành công!");

    fetchProducts();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setFromPrice(p.fromprice);
    setImage(p.image);
    setCategory(p.category || ""); // ⭐ LOAD CATEGORY CHÍNH XÁC
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setFromPrice("");
    setImage("");
    setCategory("");
  };

  return (
    <div className="admin-page">
      <h2>Quản lý sản phẩm</h2>

      {message && <div className="success-msg">{message}</div>}

      <div className="admin-form">
        <h3>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>

        <label>Danh mục</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- Chọn danh mục --</option>
          <option value="tranh-bo">Tranh Bộ </option>
          <option value="truu-tuong">Trừu tượng</option>
          <option value="thuc-vat">Thực vật</option>
          <option value="dong-vat">Động vật</option>
          <option value="ban-do">Bản đồ & thành phố</option>
          
        </select>

        <label>Tên sản phẩm</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Giá</label>
        <input
          type="number"
          value={fromPrice}
          onChange={(e) => setFromPrice(e.target.value)}
        />

        <label>Upload ảnh</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {image && (
          <img src={image} alt="" style={{ width: "120px", marginTop: 10 }} />
        )}

        <button className="primary-btn" onClick={handleSave}>
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>

        {editingId && (
          <button className="link-btn" onClick={resetForm}>
            Hủy sửa
          </button>
        )}
      </div>

      <h3>Danh sách sản phẩm</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img src={p.image} className="admin-thumb" />
              </td>
              <td>{p.name}</td>
              <td>{p.fromprice?.toLocaleString()}₫</td>
              <td>{p.category}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(p)}>
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(p.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
