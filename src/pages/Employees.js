import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Snackbar,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchEmployees,
  fetchWorkSchedules,
  fetchLocations,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../Api/employeeApi"; // استيراد الدوال من API

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    fullname: "",
    phone: "",
    email: "",
    department: "",
    dateofbirth: "",
    salary: "",
    workScheduleId: "",
    locationId: "",
  });
  const [workSchedules, setWorkSchedules] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const loadData = async () => {
      try {
        const employeesData = await fetchEmployees();
        const schedulesData = await fetchWorkSchedules();
        const locationsData = await fetchLocations();
        setEmployees(employeesData);
        setWorkSchedules(schedulesData);
        setLocations(locationsData);
      } catch (error) {
        setSnackbar({ open: true, message: "فشل في جلب البيانات!" });
      }
    };

    loadData();
  }, []);

  // تعديل موظف
  const handleEditEmployee = (index) => {
    const selectedEmployee = employees[index];
    setEmployeeData({
      fullname: selectedEmployee.fullname,
      phone: selectedEmployee.phone,
      email: selectedEmployee.email,
      department: selectedEmployee.department,
      dateofbirth: new Date(selectedEmployee.dateofbirth).toISOString().split("T")[0],
      salary: selectedEmployee.salary,
      workScheduleId: selectedEmployee.workScheduleId || "",
      locationId: selectedEmployee.locationId || "",
    });
    setEditMode(true);
    setSelectedEmployeeIndex(index);
  };

  // حذف موظف
  const handleDeleteEmployee = async (index) => {
    if (window.confirm("هل تريد بالتأكيد حذف هذا الموظف؟")) {
      try {
        const employeeId = employees[index]._id;
        await deleteEmployee(employeeId);
        const updatedEmployees = employees.filter((_, i) => i !== index);
        setEmployees(updatedEmployees);
        setSnackbar({ open: true, message: "تم حذف الموظف بنجاح!" });
      } catch (error) {
        setSnackbar({ open: true, message: "حدث خطأ أثناء حذف الموظف!" });
      }
    }
  };

  // تغيير القيم في النموذج
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  // حفظ الموظف (إضافة أو تعديل)
  const handleSaveEmployee = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      if (editMode) {
        const updatedEmployee = await updateEmployee(employees[selectedEmployeeIndex]._id, employeeData);
        const updatedEmployees = [...employees];
        updatedEmployees[selectedEmployeeIndex] = updatedEmployee;
        setEmployees(updatedEmployees);
        setSnackbar({ open: true, message: "تم تعديل بيانات الموظف بنجاح!" });
      } else {
        const newEmployee = await addEmployee(employeeData);
        setEmployees([...employees, newEmployee]);
        setSnackbar({ open: true, message: "تم إضافة الموظف بنجاح!" });
      }
      resetForm();
    } catch (error) {
      setSnackbar({ open: true, message: "حدث خطأ أثناء حفظ البيانات!" });
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setEmployeeData({
      fullname: "",
      phone: "",
      email: "",
      department: "",
      dateofbirth: "",
      salary: "",
      workScheduleId: "",
      locationId: "",
    });
    setEditMode(false);
    setSelectedEmployeeIndex(null);
  };

  // التحقق من صحة المدخلات
  const validateInputs = () => {
    // نفس كود التحقق السابق
    return true;
  };

  return (
    <Box sx={{ padding: "30px", backgroundColor: "#f5f5f5", minHeight: "100vh", textAlign: "right" }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", color: "#3A6D8C" }}>إدارة الموظفين</Typography>

      {/* النموذج */}
      <Paper sx={{ padding: "20px", marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: 2, textAlign: "right" }}>
        <Typography variant="h6" sx={{ marginBottom: "20px", color: "#001F3F" }}>
          {editMode ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
        </Typography>
        <form onSubmit={handleSaveEmployee}>
          <Grid container spacing={2}>
            {["fullname", "phone", "email", "department", "dateofbirth", "salary"].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  label={field === "dateofbirth" ? "تاريخ الميلاد" : field === "salary" ? "الراتب الأساسي" : field}
                  name={field}
                  type={field === "dateofbirth" ? "date" : "text"}
                  InputLabelProps={field === "dateofbirth" ? { shrink: true } : null}
                  variant="outlined"
                  fullWidth
                  value={employeeData[field]}
                  onChange={handleInputChange}
                  required={["fullname", "phone", "email", "dateofbirth", "salary"].includes(field)}
                  sx={{ textAlign: "right" }}
                />
              </Grid>
            ))}
            {/* Dropdown for Work Schedule */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="work-schedule-label">جدول الدوام</InputLabel>
                <Select
                  labelId="work-schedule-label"
                  name="workScheduleId"
                  value={employeeData.workScheduleId}
                  onChange={handleInputChange}
                  required
                  sx={{ textAlign: "right" }}
                >
                  {workSchedules.map((schedule) => (
                    <MenuItem key={schedule._id} value={schedule._id}>
                      {schedule.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Dropdown for Location */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="location-label">الموقع</InputLabel>
                <Select
                  labelId="location-label"
                  name="locationId"
                  value={employeeData.locationId}
                  onChange={handleInputChange}
                  required
                  sx={{ textAlign: "right" }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location._id} value={location._id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ marginTop: "20px", textAlign: "center" }}>
            <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />} sx={{ minWidth: "150px" }}>
              {editMode ? "حفظ التعديلات" : "إضافة الموظف"}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* جدول الموظفين */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#3A6D8C" }}>
            <TableRow>
              {["الاسم", "رقم الهاتف", "البريد الإلكتروني", "القسم", "تاريخ الميلاد", "الراتب", "الإجراءات"].map((header, index) => (
                <TableCell key={index} sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "right" }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f0f8ff" } }}>
                {["fullname", "phone", "email", "department", "dateofbirth", "salary"].map((field, i) => (
                  <TableCell key={i} sx={{ textAlign: "right" }}>{field === "dateofbirth" ? new Date(employee[field]).toLocaleDateString() : employee[field]}</TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => handleEditEmployee(index)} color="primary" sx={{ marginRight: "10px" }}>
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

      {/* إشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default EmployeeManagement;