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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchAttendanceData, downloadAttendanceReport } from "../Api/attendanceApi";

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
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
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.includes(searchQuery);
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
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

  // إغلاق الـ Snackbar
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
              label="البحث حسب الموظف أو التاريخ"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="أدخل اسم الموظف أو التاريخ"
              sx={{ textAlign: "right" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="filter-status-label">تصفية بالحالة</InputLabel>
              <Select
                labelId="filter-status-label"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ textAlign: "right" }}
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
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "right" }}>اسم الموظف</TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "right" }}>التاريخ</TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "right" }}>الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell sx={{ textAlign: "right" }}>{attendance.employee}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>{attendance.date}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>{attendance.status}</TableCell>
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