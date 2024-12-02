import React, { useState, useEffect } from "react";
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

const Employees = () => {
  const [employeeData, setEmployeeData] = useState({
    fullName: "",
    employeeId: "",
    department: "",
    birthDate: "",
    baseSalary: "",
    email: "",
    location: "",
    workSchedule: "",
  });

  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);

  // Fetch mock data
  useEffect(() => {
    const mockEmployees = [
      {
        fullName: "أحمد محمد",
        employeeId: "001",
        department: "الموارد البشرية",
        birthDate: "1990-01-01",
        baseSalary: "5000",
        email: "ahmed@example.com",
        location: "موقع 1",
        workSchedule: "نموذج 1",
      },
      {
        fullName: "سارة علي",
        employeeId: "002",
        department: "تكنولوجيا المعلومات",
        birthDate: "1995-06-15",
        baseSalary: "6000",
        email: "sara@example.com",
        location: "موقع 2",
        workSchedule: "نموذج 2",
      },
    ];

    const mockLocations = ["موقع 1", "موقع 2", "موقع 3"];
    const mockWorkSchedules = ["نموذج 1", "نموذج 2", "نموذج 3"];

    setEmployees(mockEmployees);
    setLocations(mockLocations);
    setWorkSchedules(mockWorkSchedules);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  // Save employee
  const handleSaveEmployee = (e) => {
    e.preventDefault();
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
      employeeId: "",
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

  // Handle delete employee
  const handleDeleteEmployee = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);
    setEmployees(updatedEmployees);
    setSnackbar({ open: true, message: "تم حذف الموظف بنجاح!" });
  };

  // Close snackbar
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

      {/* Add/Edit Employee Form */}
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
          {editMode ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
        </Typography>

        <form onSubmit={handleSaveEmployee}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="البريد الإلكتروني"
                name="email"
                variant="outlined"
                fullWidth
                required
                value={employeeData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                label="الموقع"
                name="location"
                fullWidth
                value={employeeData.location}
                onChange={handleInputChange}
              >
                {locations.map((location, index) => (
                  <MenuItem key={index} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                label="نموذج الدوام"
                name="workSchedule"
                fullWidth
                value={employeeData.workSchedule}
                onChange={handleInputChange}
              >
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
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  fontWeight: "bold",
                  height: "48px",
                  backgroundColor: "#3A6D8C",
                }}
                startIcon={<AddIcon />}
              >
                {editMode ? "تعديل الموظف" : "إضافة الموظف"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Employee Table */}
      <TableContainer component={Paper} sx={{ width: "100%", maxWidth: "900px" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#3A6D8C" }}>
            <TableRow>
              <TableCell sx={{ color: "#FFFFFF" }}>اسم الموظف</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>رقم الموظف</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>القسم</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>تاريخ الميلاد</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>الراتب الأساسي</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>البريد الإلكتروني</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>الموقع</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>نموذج الدوام</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>العمليات</TableCell>
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
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.location}</TableCell>
                <TableCell>{employee.workSchedule}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEmployeeData(employee);
                      setEditMode(true);
                      setSelectedEmployeeIndex(index);
                    }}
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

      {/* Snackbar */}
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
