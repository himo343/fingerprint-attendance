import React, { useState } from "react";
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
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Reports() {
  const initialReports = [
    {
      id: 1,
      name: "أحمد علي",
      date: "2024-11-15",
      status: "حاضر",
      checkInTime: "08:00",
      checkOutTime: "16:00",
      workHours: 8,
      salary: "5000 ريال",
      location: "مكتب صنعاء",
    },
    {
      id: 2,
      name: "محمد يوسف",
      date: "2024-11-15",
      status: "متأخر",
      checkInTime: "09:00",
      checkOutTime: "17:00",
      workHours: 7,
      salary: "4800 ريال",
      location: "مكتب عدن",
    },
    {
      id: 3,
      name: "سعاد خالد",
      date: "2024-11-15",
      status: "حاضر",
      checkInTime: "08:30",
      checkOutTime: "15:30",
      workHours: 7,
      salary: "4900 ريال",
      location: "مكتب تعز",
    },
  ];

  const [reports, setReports] = useState(initialReports);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.date.includes(searchQuery) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("تقارير الحضور", 14, 20);
    doc.autoTable({
      head: [
        [
          "اسم الموظف",
          "التاريخ",
          "الحالة",
          "وقت الحضور",
          "وقت الانصراف",
          "عدد الساعات",
          "الراتب",
          "الموقع",
        ],
      ],
      body: filteredReports.map((report) => [
        report.name,
        report.date,
        report.status,
        report.checkInTime,
        report.checkOutTime,
        report.workHours,
        report.salary,
        report.location,
      ]),
    });
    doc.save("attendance-reports.pdf");
  };

  return (
    <Box
      p={3}
      sx={{
        background: "#F7F9FC",
        minHeight: "100vh",
        borderRadius: "16px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#001F3F",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        التقارير
      </Typography>

      {/* شريط البحث */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="البحث حسب الاسم، التاريخ أو الموقع"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: "#3A6D8C",
              color: "white",
              "&:hover": { background: "#2A5C7A" },
            }}
            onClick={handleDownloadPDF}
          >
            تحميل كملف PDF
          </Button>
        </Grid>
      </Grid>

      {/* الجدول */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Table>
          <TableHead sx={{ background: "#3A6D8C" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                اسم الموظف
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                التاريخ
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                الحالة
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                وقت الحضور
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                وقت الانصراف
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                عدد الساعات
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                الراتب
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                الموقع
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>{report.checkInTime}</TableCell>
                <TableCell>{report.checkOutTime}</TableCell>
                <TableCell>{report.workHours}</TableCell>
                <TableCell>{report.salary}</TableCell>
                <TableCell>{report.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Reports;
