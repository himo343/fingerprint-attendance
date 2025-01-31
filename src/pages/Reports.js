import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RefreshIcon from "@mui/icons-material/Refresh";

function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("attendance"); // نوع التقرير
  const [filterDepartment, setFilterDepartment] = useState(""); // الفلترة حسب القسم
  const [filterLocation, setFilterLocation] = useState(""); // الفلترة حسب الموقع
  const [tabValue, setTabValue] = useState(0); // قيمة التبويب
  const [reports, setReports] = useState([]); // البيانات الحقيقية
  const [loading, setLoading] = useState(false); // حالة التحميل

  // أنواع التقارير
  const reportTypes = ["attendance", "employees", "locations", "leaveRequests", "notifications"];

  // جلب البيانات من API
  const fetchData = async (type) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/reports/${type}`); // استبدل بالرابط الحقيقي
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // تحديث البيانات عند تغيير التبويب
  useEffect(() => {
    fetchData(reportTypes[tabValue]);
  }, [tabValue]);

  // فلترة البيانات حسب البحث ونوع التقرير
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.date?.includes(searchQuery) ||
      report.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = filterDepartment ? report.department === filterDepartment : true;
    const matchesLocation = filterLocation ? report.location === filterLocation : true;

    return matchesSearch && matchesDepartment && matchesLocation;
  });

  // تحميل التقرير كملف PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(`تقارير ${filterType}`, 14, 20);

    doc.autoTable({
      head: [Object.keys(filteredReports[0] || {}).map((key) => key)],
      body: filteredReports.map((report) => Object.values(report)),
      theme: "grid",
    });

    doc.save(`${filterType}-reports.pdf`);
  };

  // تحديث البيانات
  const handleRefresh = () => {
    fetchData(reportTypes[tabValue]);
  };

  // تغيير نوع التقرير عند تغيير التبويب
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFilterType(reportTypes[newValue]);
  };

  return (
    <Box
      p={3}
      sx={{
        background: "#F7F9FC",
        minHeight: "100vh",
        borderRadius: "16px",
        textAlign: "right",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#001F3F", fontWeight: "bold" }}>
        التقارير
      </Typography>

      {/* تبويبات لأنواع التقارير */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: "20px" }}>
        <Tab label="الحضور" />
        <Tab label="الموظفين" />
        <Tab label="المواقع" />
        <Tab label="طلبات الاستئذان" />
        <Tab label="الإشعارات" />
      </Tabs>

      {/* شريط البحث والفلترة */}
      <Grid container spacing={2} mb={3} direction="row-reverse">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="البحث حسب الاسم، التاريخ أو الموقع"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ textAlign: "right" }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>القسم</InputLabel>
            <Select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              sx={{ textAlign: "right" }}
            >
              <MenuItem value="">الكل</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>الموقع</InputLabel>
            <Select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              sx={{ textAlign: "right" }}
            >
              <MenuItem value="">الكل</MenuItem>
              <MenuItem value="الفرع الرئيسي">الفرع الرئيسي</MenuItem>
              <MenuItem value="الفرع الثاني">الفرع الثاني</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* زر تحديث البيانات */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <IconButton onClick={handleRefresh} sx={{ background: "#3A6D8C", color: "white" }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* زر تحميل ملف PDF */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Button
          variant="contained"
          sx={{ background: "#3A6D8C", color: "white" }}
          onClick={handleDownloadPDF}
        >
          تحميل كملف PDF
        </Button>
      </Box>

      {/* الجدول */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead sx={{ background: "#3A6D8C" }}>
              <TableRow>
                {filteredReports.length > 0 &&
                  Object.keys(filteredReports[0]).map((key) => (
                    <TableCell key={key} sx={{ color: "white", fontWeight: "bold", textAlign: "right" }}>
                      {key}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  {Object.values(report).map((value, index) => (
                    <TableCell key={index} sx={{ textAlign: "right" }}>
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Reports;