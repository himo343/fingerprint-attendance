import axios from 'axios';

const BASE_URL = 'https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api';

// دالة لجلب الموظفين
export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/employees`);
    console.log("Employees data:", response.data); // تحقق من البيانات هنا
    return response.data.map(employee => ({
      fullname: employee.fullname,
      employeeId: employee.employeeId, // إضافة employeeId
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

export const sendNotification = async (notificationData) => {
  try {
    console.log("Sending notification data:", notificationData); // تحقق من البيانات هنا
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // مثال على استخدام token
    };
    const response = await axios.post(`${BASE_URL}/notification/sendNotificationAdmin`, notificationData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error(error.response?.data?.message || "حدث خطأ أثناء إرسال الإشعار!");
  }
};