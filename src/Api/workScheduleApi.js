// src/api/workScheduleApi.js
const API_URL = "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/shifts";

// جلب جميع جداول العمل
export const fetchSchedules = async () => {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error fetching schedules");
    }
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

// إضافة جدول عمل جديد
export const addSchedule = async (scheduleData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData), // تأكد من أن البيانات مرسلة بشكل صحيح
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json(); // تحقق من رسالة الخطأ من الخادم
      throw new Error(errorData.message || "Error adding schedule");
    }
  } catch (error) {
    console.error("Error adding schedule:", error);
    throw error;
  }
};

// تعديل جدول عمل موجود
export const updateSchedule = async (id, scheduleData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json(); // تحقق من رسالة الخطأ من الخادم
      throw new Error(errorData.message || "Error updating schedule");
    }
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
};

// حذف جدول عمل
export const deleteSchedule = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json(); // تحقق من رسالة الخطأ من الخادم
      throw new Error(errorData.message || "Error deleting schedule");
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};