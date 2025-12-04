import { supabase } from "../supabaseClient";

// 🔥 Lấy tất cả sản phẩm từ Supabase
export const loadProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Lỗi load sản phẩm:", error);
    return [];
  }

  return data;
};

// 🔥 Thêm sản phẩm
export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 🔥 Cập nhật sản phẩm
export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 🔥 Xóa sản phẩm
export const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};
