import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);

  // ⭐ THÊM STATE THÔNG BÁO
  const [successMessage, setSuccessMessage] = useState("");

  // 🔥 Lấy CART từ Supabase
  const fetchCart = async () => {
    if (!currentUser) {
      setCart([]);
      return;
    }

    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", currentUser.id);

    if (!error) setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, [currentUser]);

  // 🔥 Thêm SP vào giỏ + THÔNG BÁO
  const addToCart = async (product) => {
    if (!currentUser) {
      alert("Bạn phải đăng nhập để mua!");
      return;
    }

    const exists = cart.find((c) => c.product_id === product.id);

    if (exists) {
      updateQuantity(product.id, exists.quantity + 1);

      // ⭐ hiện thông báo
      showMessage("✔️ Đã tăng số lượng sản phẩm!");

      return;
    }

    await supabase.from("cart").insert([
      {
        user_id: currentUser.id,
        product_id: product.id,
        name: product.name,
        price: product.fromprice || product.price,
        image: product.image,
        quantity: 1,
      },
    ]);

    fetchCart();

    // ⭐ hiện thông báo
    showMessage("✔️ Đã thêm vào giỏ hàng!");
  };

  // ⭐ Hàm hiển thị thông báo và tự ẩn sau 2 giây
  const showMessage = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  // 🔥 Cập nhật số lượng
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    await supabase
      .from("cart")
      .update({ quantity })
      .eq("user_id", currentUser.id)
      .eq("product_id", productId);

    fetchCart();
  };

  // 🔥 Xóa SP
  const removeFromCart = async (productId) => {
    await supabase
      .from("cart")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("product_id", productId);

    fetchCart();
  };

  // 🔥 Clear Cart (fix lỗi CheckoutPage)
  const clearCart = () => {
    setCart([]); // clear UI
  };

  // Tổng số lượng
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Tổng tiền
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        totalItems,
        totalPrice,
        fetchCart,
        clearCart,

        // ⭐ TRẢ STATE THÔNG BÁO RA NGOÀI
        successMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
