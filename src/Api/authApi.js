// src/api/authApi.js
const API_URL = "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/admin";

// تسجيل الدخول
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Aname: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.token; // إرجاع التوكن
    } else {
      throw new Error(data.message || "بيانات تسجيل الدخول غير صحيحة!");
    }
  } catch (error) {
    console.error("خطأ أثناء تسجيل الدخول:", error);
    throw error;
  }
};