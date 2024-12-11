import React, { useState } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh"; // إضافة أيقونة التحديث

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, employee: "أحمد علي", date: "2024-11-15", status: "حاضر" },
    { id: 2, employee: "محمد يوسف", date: "2024-11-15", status: "غائب" },
    { id: 3, employee: "سعاد خالد", date: "2024-11-15", status: "حاضر" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const filteredData = attendanceData.filter((item) => {
    const matchesSearch =
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.includes(searchQuery);
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = () => {
    const csvContent =
      "اسم الموظف,التاريخ,الحالة\n" +
      filteredData
        .map((row) => `${row.employee},${row.date},${row.status}`)
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_report.csv";
    link.click();

    setSnackbar({ open: true, message: "تم تنزيل تقرير الحضور بنجاح" });
  };

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: "" });

  const handleRefresh = () => {
    // هنا يمكنك إضافة عملية التحديث (مثل إعادة تحميل البيانات أو الصفحة)
    window.location.reload(); // تحديث الصفحة
  };

  return (
    <Box p={3} sx={{ background: "#F7F9FC", minHeight: "100vh", borderRadius: "16px" }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: "20px" }}>
        <Grid item>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#001F3F", fontWeight: "bold" }}
          >
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
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          borderRadius: "16px",
          marginBottom: "20px",
          background: "#ffffff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="البحث حسب الموظف أو التاريخ"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="أدخل اسم الموظف أو التاريخ"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="filter-status-label">تصفية بالحالة</InputLabel>
              <Select
                labelId="filter-status-label"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">الكل</MenuItem>
                <MenuItem value="حاضر">حاضر</MenuItem>
                <MenuItem value="غائب">غائب</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<FilterListIcon />}
              onClick={() => setSnackbar({ open: true, message: "تم تطبيق التصفية" })}
              sx={{ height: "56px", fontWeight: "bold" }}
            >
              تصفية
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* جدول عرض الحضور */}
      <Paper elevation={3} sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: "#001F3F" }}>
              <TableRow>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>اسم الموظف</TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>التاريخ</TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{attendance.employee}</TableCell>
                  <TableCell>{attendance.date}</TableCell>
                  <TableCell>{attendance.status}</TableCell>
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
      />
    </Box>
  );
}

export default Attendance;
