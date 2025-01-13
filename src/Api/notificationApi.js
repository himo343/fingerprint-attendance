// api.js
import axios from 'axios';

const BASE_URL = 'https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api';

// دالة لجلب الموظفين
export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/employees`);
    return response.data.map(employee => employee.fullname); // نأخذ فقط الـ fullname
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

// دالة لإرسال الإشعار
export const sendNotification = async (notificationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/notification/sendNotificationAdmin`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};