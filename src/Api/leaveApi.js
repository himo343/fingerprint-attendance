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

export const updateLeaveRequest = async (_id, adminResponse) => {
  try {
    const response = await fetch(
      `https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/leavesRequest/leaverequest_admin/${_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminResponse }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating leave request:", errorData);
      throw new Error(errorData.message || "Unknown error");
    }

    const data = await response.json();
    // تأكد من أن الرسالة التي تم إرجاعها من الـ API هي كما هو متوقع
    if (data.message && data.message.includes("تم رفض الطلب")) {
      throw new Error("تم رفض الطلب");
    }

    return data;
  } catch (error) {
    console.error("Error updating leave request:", error);
    throw error;
  }
};

