import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh"; // استيراد الأيقونة

// ألوان المشروع
const colors = {
  primary: "#001F3F", // اللون الأساسي
  secondary: "#3A6D8C", // اللون الثانوي
  accent: "#6A9AB0", // اللون المُميز
};

const EmployeeManagement = () => {
  const [employeeData, setEmployeeData] = useState({
    fullName: "",
    phoneNumber: "",
    department: "",
    birthDate: "",
    baseSalary: "",
    email: "",
    location: "",
    workSchedule: "",
  });

  const [employees, setEmployees] = useState([]);
  const [locations] = useState(["الفرع الرئيسي", "فرع 1", "فرع 2"]);
  const [workSchedules] = useState(["الدوام الصباحي", "الدوام المسائي", "دوام متغير"]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const validateInputs = () => {
    const { fullName, phoneNumber, email, baseSalary, birthDate } = employeeData;

    // التحقق من أن الاسم رباعي
    if (fullName.trim().split(" ").length < 4) {
      setSnackbar({ open: true, message: "يجب أن يكون اسم الموظف رباعياً!" });
      return false;
    }

    // التحقق من رقم الهاتف (10 أرقام)
    const phoneRegex = /^[0-8]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setSnackbar({ open: true, message: "رقم الهاتف يجب أن يكون مكونًا من 9 أرقام!" });
      return false;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbar({ open: true, message: "البريد الإلكتروني غير صحيح!" });
      return false;
    }

    // التحقق من صحة الراتب
    if (isNaN(baseSalary) || baseSalary <= 0) {
      setSnackbar({ open: true, message: "الراتب الأساسي يجب أن يكون رقماً موجباً!" });
      return false;
    }

    // التحقق من تاريخ الميلاد
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthDate).getFullYear();
    if (!birthDate || birthYear > currentYear) {
      setSnackbar({ open: true, message: "تاريخ الميلاد غير صحيح!" });
      return false;
    }

    return true;
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    if (editMode) {
      const updatedEmployees = [...employees];
      updatedEmployees[selectedEmployeeIndex] = employeeData;
      setEmployees(updatedEmployees);
      setSnackbar({ open: true, message: "تم تعديل بيانات الموظف بنجاح!" });
    } else {
      setEmployees([...employees, employeeData]);
      setSnackbar({ open: true, message: "تم إضافة الموظف بنجاح!" });
    }

    setEmployeeData({
      fullName: "",
      phoneNumber: "",
      department: "",
      birthDate: "",
      baseSalary: "",
      email: "",
      location: "",
      workSchedule: "",
    });
    setEditMode(false);
    setSelectedEmployeeIndex(null);
  };

  const handleEditEmployee = (index) => {
    setEmployeeData(employees[index]);
    setEditMode(true);
    setSelectedEmployeeIndex(index);
  };

  const handleDeleteEmployee = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);
    setEmployees(updatedEmployees);
    setSnackbar({ open: true, message: "تم حذف الموظف بنجاح!" });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };

  const handleRefreshPage = () => {
    window.location.reload(); // إعادة تحميل الصفحة
  };

  return (
    <Box sx={{ padding: "30px", backgroundColor: "#F4F6F8", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" gutterBottom color={colors.primary}>
          إدارة الموظفين
        </Typography>
        <IconButton onClick={handleRefreshPage} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Paper elevation={3} sx={{ padding: "30px", marginBottom: "30px", backgroundColor: "#fff" }}>
        <Typography variant="h6" gutterBottom color={colors.secondary}>
          {editMode ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
        </Typography>
        <form onSubmit={handleSaveEmployee}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="اسم الموظف الرباعي"
                name="fullName"
                variant="outlined"
                fullWidth
                required
                value={employeeData.fullName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="رقم الهاتف"
                name="phoneNumber"
                variant="outlined"
                fullWidth
                required
                value={employeeData.phoneNumber}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="القسم"
                name="department"
                variant="outlined"
                fullWidth
                value={employeeData.department}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="تاريخ الميلاد"
                name="birthDate"
                variant="outlined"
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                value={employeeData.birthDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="الراتب الأساسي"
                name="baseSalary"
                variant="outlined"
                fullWidth
                type="number"
                value={employeeData.baseSalary}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="البريد الإلكتروني"
                name="email"
                variant="outlined"
                fullWidth
                value={employeeData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                name="location"
                value={employeeData.location}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  اختر الفرع
                </MenuItem>
                {locations.map((location, index) => (
                  <MenuItem key={index} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                name="workSchedule"
                value={employeeData.workSchedule}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  اختر الجدول الزمني
                </MenuItem>
                {workSchedules.map((schedule, index) => (
                  <MenuItem key={index} value={schedule}>
                    {schedule}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={editMode ? <EditIcon /> : <AddIcon />}
              >
                {editMode ? "حفظ التعديلات" : "إضافة الموظف"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>القسم</TableCell>
              <TableCell>تاريخ الميلاد</TableCell>
              <TableCell>الراتب الأساسي</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>الفرع</TableCell>
              <TableCell>الجدول الزمني</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={index}>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.birthDate}</TableCell>
                <TableCell>{employee.baseSalary}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.location}</TableCell>
                <TableCell>{employee.workSchedule}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditEmployee(index)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteEmployee(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default EmployeeManagement;
