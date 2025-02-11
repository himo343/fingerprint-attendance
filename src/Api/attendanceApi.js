import axios from "axios";

const API_URL = "https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/attendance/getallreports";

// دالة لجلب بيانات الحضور
export const fetchAttendanceData = async () => {
  try {
    const token = localStorage.getItem("token"); // اجلب التوكن من التخزين المحلي
    if (!token) {
      throw new Error("❌ التوكن غير متوفر، الرجاء تسجيل الدخول!");
    }

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // إرسال التوكن مع الطلب
      },
    });

    console.log("✅ استجابة API:", response.data); // اطبع الاستجابة لتتبع المشكلة

    // تأكد أن البيانات هي مصفوفة قبل الإرجاع
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  } catch (error) {
    console.error("🚨 خطأ في جلب بيانات الحضور:", error);
    throw error;
  }
};


// دالة لتصدير بيانات الحضور كملف CSV
export const downloadAttendanceReport = async (data) => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("لا توجد بيانات متاحة للتنزيل");
    }

    const csvContent =
      "اسم الموظف,التاريخ,الحالة\n" +
      data.map((row) => `${row.employee},${row.date},${row.status}`).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_report.csv";
    link.click();
    return { success: true, message: "تم تنزيل تقرير الحضور بنجاح" };
  } catch (error) {
    console.error("خطأ أثناء تنزيل التقرير", error);
    throw error;
  }
};
