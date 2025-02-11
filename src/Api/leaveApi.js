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

export const updateLeaveRequest = async (id, adminResponse) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token is missing. Please log in again.");
    }

    const response = await fetch(
      `https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/leavesRequest/leaverequest_emp/admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id, adminResponse }), // تأكد من إرسال الـ id والـ adminResponse
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error updating leave request: ${errorData.message || "Unknown error"}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating leave request:", error);
    throw error;
  }
};