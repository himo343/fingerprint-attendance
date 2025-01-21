const BASE_URL = "https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api";

/**
 * جلب طلبات الاستئذان
 * @returns {Promise} بيانات طلبات الاستئذان
 */
export const fetchLeaveRequests = async () => {
  try {
    const response = await fetch(`${BASE_URL}/leavesRequest`);
    if (!response.ok) throw new Error("Failed to fetch leave requests");
    return response.json();
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    throw error;
  }
};

/**
 * تحديث حالة الطلب
 * @param {string} id - معرف الطلب
 * @param {string} adminresponse - حالة الطلب (Approved أو Rejected)
 * @returns {Promise} نتيجة التحديث
 */
export const updateLeaveRequest = async (id, adminresponse) => {
  try {
    const response = await fetch(
      `${BASE_URL}/leavesRequest/leaverequest_admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminresponse: adminresponse,
          requestId: id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update leave request: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error updating leave request:", error);
    throw error;
  }
};