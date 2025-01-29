import axios from "axios";

const API_URL = "https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/employees";
const WORK_SCHEDULES_URL = "https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/shifts";
const LOCATIONS_URL = "https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/locations";

// جلب جميع الموظفين
export const fetchEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// جلب جداول الدوام
export const fetchWorkSchedules = async () => {
  try {
    const response = await axios.get(WORK_SCHEDULES_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching work schedules:", error);
    throw error;
  }
};

// جلب المواقع
export const fetchLocations = async () => {
  try {
    const response = await axios.get(LOCATIONS_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

// إضافة موظف جديد
export const addEmployee = async (employeeData) => {
  try {
    const payload = {
      fullname: employeeData.fullname,
      phone: employeeData.phone,
      email: employeeData.email,
      department: employeeData.department,
      dateofbirth: employeeData.dateofbirth,
      salary: employeeData.salary,
      Shift_Id: employeeData.Shift_Id, // استخدام Shift_Id
      Location_Id: employeeData.Location_Id, // استخدام Location_Id
    };
    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

// تعديل بيانات موظف
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const payload = {
      fullname: employeeData.fullname,
      phone: employeeData.phone,
      email: employeeData.email,
      department: employeeData.department,
      dateofbirth: employeeData.dateofbirth,
      salary: employeeData.salary,
      Shift_Id: employeeData.Shift_Id, // استخدام Shift_Id
      Location_Id: employeeData.Location_Id, // استخدام Location_Id
    };
    const response = await axios.put(`${API_URL}/${employeeId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// حذف موظف
export const deleteEmployee = async (employeeId) => {
  try {
    await axios.delete(`${API_URL}/${employeeId}`);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};