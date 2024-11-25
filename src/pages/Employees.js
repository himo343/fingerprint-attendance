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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Employees = () => {
  const [employeeData, setEmployeeData] = useState({
    fullName: "",
    employeeId: "",
    password: "",
    department: "",
    birthDate: "",
    baseSalary: "",
  });

  const [employees, setEmployees] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setEmployees([...employees, { ...employeeData }]);
    setSnackbar({ open: true, message: "تم إضافة الموظف بنجاح!" });

    setEmployeeData({
      fullName: "",
      employeeId: "",
      password: generateRandomPassword(),
      department: "",
      birthDate: "",
      baseSalary: "",
    });
  };

  const handleDeleteEmployee = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);
    setEmployees(updatedEmployees);
    setSnackbar({ open: true, message: "تم حذف الموظف بنجاح!" });
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
        sx={{
          color: "#3A6D8C",
          fontWeight: "bold",
        }}
      >
        إدارة الموظفين
      </Typography>

      {/* نموذج إضافة موظف */}
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
          إضافة موظف جديد
        </Typography>

        <form onSubmit={handleAddEmployee}>
          <Grid container spacing={2}>
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
                label="رقم الموظف"
                name="employeeId"
                variant="outlined"
                fullWidth
                required
                value={employeeData.employeeId}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="كلمة المرور (تلقائية)"
                name="password"
                variant="outlined"
                fullWidth
                required
                value={employeeData.password || generateRandomPassword()}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="القسم"
                name="department"
                variant="outlined"
                fullWidth
                required
                value={employeeData.department}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="تاريخ الميلاد"
                name="birthDate"
                type="date"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={employeeData.birthDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="الراتب الأساسي"
                name="baseSalary"
                type="number"
                variant="outlined"
                fullWidth
                required
                value={employeeData.baseSalary}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{
                  fontWeight: "bold",
                  height: "48px",
                }}
              >
                إضافة
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* جدول عرض الموظفين */}
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
          قائمة الموظفين
        </Typography>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#3A6D8C" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>اسم الموظف</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>رقم الموظف</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>القسم</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>تاريخ الميلاد</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الراتب</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الإجراء</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.birthDate}</TableCell>
                  <TableCell>{employee.baseSalary}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => alert("تعديل الموظف")}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteEmployee(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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

export default Employees;
