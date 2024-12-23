import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState(false);

  // Fetch leave requests from API
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/leavesRequest"
        );
        const data = await response.json();
        console.log(data); // لعرض البيانات المستلمة في الكونسول
        setLeaveRequests(data); // تأكد أن البيانات تحتوي على الحقول المطلوبة
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle approval/rejection of leave requests
  const handleAction = async (id, adminResponse) => {
    try {
      const response = await fetch(
        "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/leavesRequest/leaverequest_admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminresponse: adminResponse, // either "Approved" or "Rejected"
          }),
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: `تم ${adminResponse === "Approved" ? "الموافقة على" : "رفض"} الطلب بنجاح`,
        });
        setLeaveRequests((prev) =>
          prev.map((request) =>
            request._id === id
              ? { ...request, status: adminResponse === "Approved" ? "approved" : "rejected" }
              : request
          )
        );
      } else {
        setSnackbar({ open: true, message: "حدث خطأ أثناء تحديث الطلب" });
      }
    } catch (error) {
      console.error("Error updating leave request:", error);
      setSnackbar({ open: true, message: "فشل الاتصال بالخادم" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };

  return (
    <Box
      sx={{
        padding: "20px",
        background: "#F5F5F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#3A6D8C", fontWeight: "bold" }}
      >
        إدارة طلبات الاستئذان
      </Typography>

      <Paper
        elevation={1}
        sx={{
          width: "100%",
          maxWidth: "800px",
          padding: "20px",
          borderRadius: "12px",
          background: "#FFFFFF",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#3A6D8C", fontWeight: "bold", textAlign: "center" }}
        >
          قائمة طلبات الاستئذان
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#3A6D8C" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    اسم الموظف
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    التاريخ
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    نوع الاجازه
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    الحالة
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    الإجراءات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.employeeName || "غير متوفر"}</TableCell>
                    <TableCell>{request.date || "غير متوفر"}</TableCell>
                    <TableCell>{request.reason || "غير متوفر"}</TableCell>
                    <TableCell>
                      {request.status === "approved" && (
                        <Typography color="green">مقبول</Typography>
                      )}
                      {request.status === "rejected" && (
                        <Typography color="red">مرفوض</Typography>
                      )}
                      {request.status === "pending" && (
                        <Typography color="orange">قيد الانتظار</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleAction(request._id, "Approved")}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleAction(request._id, "Rejected")}
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default LeaveRequests;
