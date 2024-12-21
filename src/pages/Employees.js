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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const API_URL = "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/employees";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    fullname: "",
    phone: "",
    email: "",
    department: "",
    dateofbirth: "",
    salary: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Fetch employees from the API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const validateInputs = () => {
    const { fullname, phone, email, salary, dateofbirth } = employeeData;
    if (fullname.trim().split(" ").length < 4) {
      setSnackbar({ open: true, message: "الاسم يجب أن يكون رباعياً!" });
      return false;
    }
    if (!/^[0-9]{9}$/.test(phone)) {
      setSnackbar({ open: true, message: "رقم الهاتف يجب أن يكون 9 أرقام!" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbar({ open: true, message: "البريد الإلكتروني غير صحيح!" });
      return false;
    }
    if (isNaN(salary) || salary <= 0) {
      setSnackbar({ open: true, message: "الراتب الأساسي غير صالح!" });
      return false;
    }
    if (!dateofbirth) {
      setSnackbar({ open: true, message: "تاريخ الميلاد غير صالح!" });
      return false;
    }
    return true;
  };

  const handleSaveEmployee = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      if (editMode) {
        const response = await axios.put(`${API_URL}/${employees[selectedEmployeeIndex]._id}`, employeeData);
        const updatedEmployees = [...employees];
        updatedEmployees[selectedEmployeeIndex] = response.data;
        setEmployees(updatedEmployees);
        setSnackbar({ open: true, message: "تم تعديل بيانات الموظف بنجاح!" });
      } else {
        const response = await axios.post(API_URL, employeeData);
        setEmployees([...employees, response.data]);
        setSnackbar({ open: true, message: "تم إضافة الموظف بنجاح!" });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving employee:", error);
      setSnackbar({ open: true, message: "حدث خطأ أثناء حفظ البيانات!" });
    }
  };

  const resetForm = () => {
    setEmployeeData({
      fullname: "",
      phone: "",
      email: "",
      department: "",
      dateofbirth: "",
      salary: "",
    });
    setEditMode(false);
    setSelectedEmployeeIndex(null);
  };

  const handleEditEmployee = (index) => {
    const employee = employees[index];
    setEmployeeData({
      fullname: employee.fullname,
      phone: employee.phone,
      email: employee.email,
      department: employee.department,
      dateofbirth: employee.dateofbirth.split("T")[0],
      salary: employee.salary,
    });
    setEditMode(true);
    setSelectedEmployeeIndex(index);
  };

  const handleDeleteEmployee = async (index) => {
    try {
      const employeeId = employees[index]._id;
      await axios.delete(`${API_URL}/${employeeId}`);
      const updatedEmployees = employees.filter((_, i) => i !== index);
      setEmployees(updatedEmployees); // تحديث القائمة بعد الحذف
      setSnackbar({ open: true, message: "تم حذف الموظف بنجاح!" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      setSnackbar({ open: true, message: "حدث خطأ أثناء الحذف!" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };

  return (
    <Box sx={{ padding: "30px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", color: "#3A6D8C" }}>إدارة الموظفين</Typography>

      <Paper sx={{ padding: "20px", marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: 2 }}>
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
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ marginTop: "20px", textAlign: "center" }}>
            <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />} sx={{ minWidth: "150px" }}>
              {editMode ? "حفظ التعديلات" : "إضافة الموظف"}
            </Button>
          </Box>
        </form>
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#3A6D8C" }}>
            <TableRow>
              {["الاسم", "رقم الهاتف", "البريد الإلكتروني", "القسم", "تاريخ الميلاد", "الراتب", "الإجراءات"].map((header, index) => (
                <TableCell key={index} sx={{ color: "#ffffff", fontWeight: "bold" }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f0f8ff" } }}>
                {["fullname", "phone", "email", "department", "dateofbirth", "salary"].map((field, i) => (
                  <TableCell key={i}>{field === "dateofbirth" ? new Date(employee[field]).toLocaleDateString() : employee[field]}</TableCell>
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

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default EmployeeManagement;
