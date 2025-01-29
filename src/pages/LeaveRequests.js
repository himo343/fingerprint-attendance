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
import { fetchLeaveRequests, updateLeaveRequest } from "../Api/leaveApi";

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState(false);

  // جلب بيانات طلبات الاستئذان
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const leaveData = await fetchLeaveRequests();
        setLeaveRequests(leaveData);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // التعامل مع القبول أو الرفض
  const handleAction = async (id, adminResponse) => {
    try {
      // إرسال القيمة المحدثة إلى الـ API
      const data = await updateLeaveRequest(id, adminResponse);
      console.log("API Response:", data);
  
      setSnackbar({
        open: true,
        message: `تم ${adminResponse === "Approved" ? "الموافقة على" : "رفض"} الطلب بنجاح`,
      });
  
      // تحديث الحالة محلياً بدون إعادة تحميل الصفحة
      setLeaveRequests((prev) =>
        prev.map((request) =>
          request._id === id
            ? { ...request, adminResponse: adminResponse }
            : request
        )
      );
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
          maxWidth: "1000px",
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
              height: "300px",
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
                    معرف الطلب
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    نوع الاستئذان
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    تاريخ البداية
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    تاريخ النهاية
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    السبب
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    الحالة الحالية
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    الإجراءات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request._id}</TableCell>
                    <TableCell>{request.leaveType || "غير متوفر"}</TableCell>
                    <TableCell>{request.startDate || "غير متوفر"}</TableCell>
                    <TableCell>{request.endDate || "غير متوفر"}</TableCell>
                    <TableCell>{request.reason || "غير متوفر"}</TableCell>
                    <TableCell>
                      {request.adminResponse === "Approved" && (
                        <Typography color="green">مقبول</Typography>
                      )}
                      {request.adminResponse === "Rejected" && (
                        <Typography color="red">مرفوض</Typography>
                      )}
                      {request.adminResponse === "Pending" && (
                        <Typography color="orange">قيد الانتظار</Typography>
                      )}
                                      </TableCell>
                                      <TableCell>
                    {request.adminResponse === "Pending" && (
                      <>
                        <IconButton
                          color="success"
                          onClick={() =>
                            handleAction(request._id, "Approved") // إرسال "Approved" عند الضغط على الصح
                          }
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleAction(request._id, "Rejected") // إرسال "Rejected" عند الضغط على الاكس
                          }
                        >
                          <CancelIcon/>
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
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default LeaveRequests;