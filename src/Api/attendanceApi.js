// src/api/attendanceApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/employees';

// دالة لجلب بيانات الحضور
export const fetchAttendanceData = async () => {
  try {
    const response = await axios.get(`https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/employees`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data", error);
    throw error;
  }
};

// دالة لتصدير بيانات الحضور كملف CSV
export const downloadAttendanceReport = async (data) => {
  try {
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
    console.error("Error downloading report", error);
    throw error;
  }
};

// دالة لجلب بيانات الموظفين
export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees data", error);
    throw error;
  }
};