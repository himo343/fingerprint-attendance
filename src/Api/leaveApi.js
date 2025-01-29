// تعريف دالة لجلب بيانات طلبات الاستئذان
export const fetchLeaveRequests = async () => {
  try {
    const response = await fetch("https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/leavesRequest");
    if (!response.ok) {
      throw new Error("Error fetching leave requests");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    throw error;
  }
};

// دالة لتحديث حالة طلب الاستئذان (قبول أو رفض)
export const updateLeaveRequest = async (id, adminResponse) => {
  try {
    const response = await fetch(`https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/leavesRequest/leaverequest_emp`, {
      method: "POST", // نستخدم POST بدلاً من PATCH
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adminResponse: adminResponse, // إرسال حالة القبول أو الرفض
      }),
    });

    // التحقق من حالة الاستجابة
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error updating leave request: ${errorData.message || "Unknown error"}`);
    }

    return await response.json(); // إعادة البيانات المحدثة من الـ API
  } catch (error) {
    console.error("Error updating leave request:", error);
    throw error;
  }
};
