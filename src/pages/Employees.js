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
} from "../Api/employeeApi";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    fullname: "",
    phone: "",
    email: "",
    department: "",
    dateofbirth: "",
    salary: "",
    Shift_Id: "",
    Location_Id: "",
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
      Shift_Id: selectedEmployee.Shift_Id || null, // السماح بقيمة null
      Location_Id: selectedEmployee.Location_Id || null, // السماح بقيمة null
    });
    setEditMode(true);
    setSelectedEmployeeIndex(index);
  };

  // حذف موظف
  const handleDeleteEmployee = async (index) => {
    if (!employees[index]) {
      console.error("Employee not found at index:", index);
      setSnackbar({ open: true, message: "تعذر العثور على الموظف!" });
      return;
    }
  
    const employeeId = employees[index].employeeId; // استخدام employeeId بدلاً من _id
    console.log("Employee ID to delete:", employeeId);
  
    if (!employeeId) {
      console.error("Employee ID is undefined at index:", index);
      setSnackbar({ open: true, message: "تعذر العثور على معرف الموظف!" });
      return;
    }
  
    if (window.confirm("هل تريد بالتأكيد حذف هذا الموظف؟")) {
      try {
        await deleteEmployee(employeeId);
        const updatedEmployees = employees.filter((_, i) => i !== index);
        setEmployees(updatedEmployees);
        setSnackbar({ open: true, message: "تم حذف الموظف بنجاح!" });
      } catch (error) {
        console.error("Error deleting employee:", error.response?.data);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "حدث خطأ أثناء حذف الموظف!",
        });
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
      const formattedData = {
        fullname: employeeData.fullname,
        phone: parseInt(employeeData.phone, 10),
        email: employeeData.email.toUpperCase(),
        department: employeeData.department.toLowerCase(),
        dateofbirth: employeeData.dateofbirth,
        salary: parseInt(employeeData.salary, 10),
        Shift_Id: employeeData.Shift_Id || null, // السماح بقيمة null
        Location_Id: employeeData.Location_Id || null, // السماح بقيمة null
      };
  
      console.log("Data being sent to API:", formattedData);
  
      if (editMode) {
        const employeeId = employees[selectedEmployeeIndex].employeeId; // استخدام employeeId
        const updatedEmployee = await updateEmployee(employeeId, formattedData);
        const updatedEmployees = [...employees];
        updatedEmployees[selectedEmployeeIndex] = updatedEmployee;
        setEmployees(updatedEmployees);
        setSnackbar({ open: true, message: "تم تعديل بيانات الموظف بنجاح!" });
      } else {
        const newEmployee = await addEmployee(formattedData);
        setEmployees([...employees, newEmployee]);
        setSnackbar({ open: true, message: "تم إضافة الموظف بنجاح!" });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving employee:", error.response?.data);
      setSnackbar({ open: true, message: error.response?.data?.message || "حدث خطأ أثناء حفظ البيانات!" });
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
      Shift_Id: "",
      Location_Id: "",
    });
    setEditMode(false);
    setSelectedEmployeeIndex(null);
  };

  // التحقق من صحة المدخلات
  const validateInputs = () => {
    const { fullname, phone, email, department, dateofbirth, salary } = employeeData;
  
    if (!fullname || !phone || !email || !department || !dateofbirth || !salary) {
      setSnackbar({ open: true, message: "جميع الحقول مطلوبة!" });
      return false;
    }
  
    if (isNaN(phone) || phone.length !== 9 || !/^\d+$/.test(phone)) {
      setSnackbar({ open: true, message: "رقم الهاتف يجب أن يكون 9 أرقام!" });
      return false;
    }
  
    if (isNaN(salary) || salary <= 0) {
      setSnackbar({ open: true, message: "الراتب يجب أن يكون رقمًا صحيحًا أكبر من الصفر!" });
      return false;
    }
  
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
                  type={field === "dateofbirth" ? "date" : field === "phone" || field === "salary" ? "number" : "text"}
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
                  name="Shift_Id"
                  value={employeeData.Shift_Id}
                  onChange={handleInputChange}
                  required
                  sx={{ textAlign: "right" }}
                >
                  {workSchedules.map((shift) => (
                    <MenuItem key={shift._id} value={shift._id}>
                      {shift.shiftname}
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
                  name="Location_Id"
                  value={employeeData.Location_Id}
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