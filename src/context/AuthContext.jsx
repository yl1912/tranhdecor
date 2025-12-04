import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("current_user")) || null
  );

  // Lưu user vào localStorage
  const saveCurrentUser = (user) => {
    localStorage.setItem("current_user", JSON.stringify(user));
    setCurrentUser(user);
  };

  // ----------------------------------
  // 🔥 REGISTER - tạo user trong bảng Supabase
  // ----------------------------------
  const registerWithDatabase = async (email, password) => {
    // kiểm tra email trùng
    const { data: exists } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (exists) {
      throw new Error("Email đã tồn tại!");
    }

    const role = email === "admin@gmail.com" ? "admin" : "user";

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password,
          role,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error("Đăng ký thất bại!");
    }

    saveCurrentUser(data);
    return data;
  };

  // ----------------------------------
  // 🔥 LOGIN với SUPABASE DATABASE
  // ----------------------------------
  const loginWithDatabase = async (email, password) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) return null;

    saveCurrentUser(data);
    return data;
  };

  // ----------------------------------
  // 🔥 LOGOUT
  // ----------------------------------
  const logout = () => {
    localStorage.removeItem("current_user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === "admin",
        loginWithDatabase,
        registerWithDatabase,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
