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

  // Fetch leave requests and employee data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // جلب بيانات طلبات الاستئذان
        const leaveResponse = await fetch(
          "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/leavesRequest"
        );
        const leaveData = await leaveResponse.json();

        // جلب بيانات الموظفين
        const employeeResponse = await fetch(
          "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/employees" // افترض أن هذه هي API بيانات الموظفين
        );
        const employeeData = await employeeResponse.json();

        // دمج بيانات الموظفين مع طلبات الاستئذان
        const mergedRequests = leaveData.map((request) => {
          const employee = employeeData.find(
            (emp) => emp._id === request.employeeId // افترض أن employeeId موجود في بيانات الطلبات
          );
          return {
            ...request,
            fullname: employee ? employee.fullname : "غير معروف", // إضافة اسم الموظف
          };
        });

        setLeaveRequests(mergedRequests); // تحديث الحالة بالبيانات المدمجة
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle approval/rejection of leave requests
  const handleAction = async (id, adminresponse) => {
    try {
      const response = await fetch(
        "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/leavesRequest/leaverequest_admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminresponse: adminresponse, // إما "Approved" أو "Rejected"
          }),
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: `تم ${adminresponse === "Approved" ? "الموافقة على" : "رفض"} الطلب بنجاح`,
        });
        setLeaveRequests((prev) =>
          prev.map((request) =>
            request._id === id
              ? { ...request, request: adminresponse === "Approved" ? "approved" : "rejected" }
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
          maxWidth: "900px",
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
                    اسم الموظف
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    نوع الاجازة
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    تاريخ البداية
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    تاريخ النهاية
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
                    <TableCell>{request.fullname || "لايوجد بيانات"}</TableCell>
                    <TableCell>{request.leaveType || "غير متوفر"}</TableCell>
                    <TableCell>{request.startDate || "غير متوفر"}</TableCell>
                    <TableCell>{request.endDate || "غير متوفر"}</TableCell>
                    <TableCell>{request.reason || "غير متوفر"}</TableCell>

                    <TableCell>
                      {request.adminresponse === "Pending" && (
                        <Typography color="orange">قيد الانتظار</Typography>
                      )}

                      {request.adminresponse === "Approved" && (
                        <Typography color="green">مقبول</Typography>
                      )}
                      {request.adminresponse === "rejected" && (
                        <Typography color="red">مرفوض</Typography>
                      )}
                      {request.status === "pending" && (
                        <Typography color="orange">قيد الانتظار</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {request.adminresponse === "Pending" && (
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
