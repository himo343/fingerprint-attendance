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
import { fetchLeaveRequests, updateLeaveRequest } from "../Api/leaveApi"; // تم التحديث هنا

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchLeaveRequests(); // تم التحديث هنا
        setLeaveRequests(data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setSnackbar({ open: true, message: "فشل في جلب البيانات" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // دالة لتصحيح القيم غير المتوقعة
  const normalizeAdminResponse = (response) => {
    if (response === "ٌRejecte" || response === "Rejecte") {
      return "Rejected";
    }
    if (response === "Approved") {
      return "Approved";
    }
    return "Pending"; // إذا كانت القيمة غير معروفة
  };

  const handleAction = async (id, adminResponse) => {
    try {
      // تأكد من أن القيمة المرسلة صحيحة
      const normalizedResponse = adminResponse === "Approved" ? "Approved" : "Rejected";
      await updateLeaveRequest(id, normalizedResponse);

      setSnackbar({
        open: true,
        message: `تم ${normalizedResponse === "Approved" ? "الموافقة على" : "رفض"} الطلب بنجاح`,
      });

      // تحديث حالة الطلب في الواجهة الأمامية
      setLeaveRequests((prev) =>
        prev.map((request) =>
          request._id === id ? { ...request, adminResponse: normalizedResponse } : request
        )
      );
    } catch (error) {
      console.error("Error updating leave request:", error);
      setSnackbar({ open: true, message: "فشل في تحديث الطلب" });
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
      <Typography variant="h4" gutterBottom sx={{ color: "#3A6D8C", fontWeight: "bold" }}>
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
        <Typography variant="h5" gutterBottom sx={{ color: "#3A6D8C", fontWeight: "bold", textAlign: "center" }}>
          قائمة طلبات الاستئذان
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#3A6D8C" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>اسم الموظف</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>نوع الاستئذان</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>تاريخ البداية</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>تاريخ النهاية</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>السبب</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>الحالة الحالية</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request.employeeId?.fullname || "غير متوفر"}</TableCell>
                      <TableCell>{request.leaveType || "غير متوفر"}</TableCell>
                      <TableCell>{request.startDate || "غير متوفر"}</TableCell>
                      <TableCell>{request.endDate || "غير متوفر"}</TableCell>
                      <TableCell>{request.reason || "غير متوفر"}</TableCell>
                      <TableCell>
                        {normalizeAdminResponse(request.adminResponse) === "Approved" ? "مقبول" :
                          normalizeAdminResponse(request.adminResponse) === "Rejected" ? "مرفوض" :
                            "قيد الانتظار"}
                      </TableCell>
                      <TableCell>
                        {normalizeAdminResponse(request.adminResponse) === "Pending" && (
                          <>
                            <IconButton color="success" onClick={() => handleAction(request._id, "Approved")}>
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleAction(request._id, "Rejected")}>
                              <CancelIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                      لا توجد طلبات استئذان
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} message={snackbar.message} />
    </Box>
  );
};

export default LeaveRequests;