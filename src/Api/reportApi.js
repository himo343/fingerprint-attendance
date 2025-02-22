// api.js
const API_BASE_URL = "https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api";

export const fetchAttendanceReports = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/getallreports`);
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("البيانات ليست مصفوفة");
      return [];
    }
  } catch (error) {
    console.error("Error fetching attendance reports:", error);
    return [];
  }
};

export const fetchNotifications = async () => {
  try {
    const response = await fetch("https://api.example.com/notifications");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  };