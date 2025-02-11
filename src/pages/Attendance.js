import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  
  Snackbar,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchAttendanceData, downloadAttendanceReport } from "../Api/attendanceApi";

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // جلب بيانات الحضور عند تحميل الصفحة
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAttendanceData();
        setAttendanceData(data);
      } catch (error) {
        setSnackbar({ open: true, message: "فشل في جلب بيانات الحضور" });
      }
    };

    loadData();
  }, []);

  // تصفية البيانات
  const filteredData = attendanceData.filter((item) => {
    const matchesSearch =
      item.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entry_time?.includes(searchQuery) ||
      item.exit_time?.includes(searchQuery);
    
    const matchesDepartment = filterDepartment ? item.department === filterDepartment : true;

    return matchesSearch && matchesDepartment;
  });

  // تنزيل التقرير
  const handleDownload = async () => {
    try {
      await downloadAttendanceReport(filteredData);
      setSnackbar({ open: true, message: "تم تنزيل تقرير الحضور بنجاح" });
    } catch (error) {
      setSnackbar({ open: true, message: "فشل في تنزيل التقرير" });
    }
  };

  // تحديث الصفحة
  const handleRefresh = () => {
    window.location.reload();
  };

  // إغلاق الإشعار
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box p={3} sx={{ background: "#F7F9FC", minHeight: "100vh", borderRadius: "16px", textAlign: "right" }}>
      <Grid container justifyContent="space-between" alignItems="center" direction="row-reverse" sx={{ marginBottom: "20px" }}>
        <Grid item>
          <Typography variant="h4" gutterBottom sx={{ color: "#001F3F", fontWeight: "bold" }}>
            إدارة الحضور
          </Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* البحث والتصفية */}
      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "16px", marginBottom: "20px", background: "#ffffff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="البحث حسب الموظف أو وقت الدخول"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="أدخل اسم الموظف أو وقت الدخول"
              sx={{ textAlign: "right" }}
            />
          </Grid>
         
        </Grid>
      </Paper>

      {/* جدول عرض الحضور */}
      <Paper elevation={3} sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: "#3A6D8C" }}>
              <TableRow>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "right" }}>اسم الموظف</TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "right" }}>وقت الدخول</TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "right" }}>وقت الانصراف</TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "right" }}>حالة الحضور</TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "right" }}>عدد ساعات العمل</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell sx={{ textAlign: "right" }}>{employee.fullname}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    {employee.entry_time ? new Date(employee.entry_time).toLocaleTimeString() : "--"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    {employee.exit_time ? new Date(employee.exit_time).toLocaleTimeString() : "--"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "right", color: employee.status === "حاضر" ? "green" : "red" }}>
                    {employee.status}
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    {employee.work_hours ? `${employee.work_hours} ساعات` : "--"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* زر تنزيل التقرير */}
      <Box mt={3} textAlign="right">
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{
            borderRadius: "8px",
            fontWeight: "bold",
            background: "#3A6D8C",
            "&:hover": { background: "#6A9AB0" },
          }}
        >
          تنزيل التقرير
        </Button>
      </Box>

      {/* إشعار */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        sx={{ textAlign: "right" }}
      />
    </Box>
  );
}

export default Attendance;
