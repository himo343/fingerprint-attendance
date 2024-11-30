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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";

const Employees = () => {
  const [employeeData, setEmployeeData] = useState({
    fullName: "",
    employeeId: "",
    department: "",
    birthDate: "",
    baseSalary: "",
    email: "",
  });

  const [employees, setEmployees] = useState([]); // بيانات الموظفين
  const [locations, setLocations] = useState([]); // بيانات المواقع
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  // جلب البيانات من قاعدة البيانات (وهمية هنا)
  useEffect(() => {
    // بيانات الموظفين الوهمية
    const mockEmployees = [
      {
        fullName: "أحمد محمد",
        employeeId: "001",
        department: "الموارد البشرية",
        birthDate: "1990-01-01",
        baseSalary: "5000",
        email: "ahmed@example.com",
        location: "موقع 1",
      },
      {
        fullName: "سارة علي",
        employeeId: "002",
        department: "تكنولوجيا المعلومات",
        birthDate: "1995-06-15",
        baseSalary: "6000",
        email: "sara@example.com",
        location: "موقع 2",
      },
    ];

    // بيانات المواقع الوهمية
    const mockLocations = ["موقع 1", "موقع 2", "موقع 3"];

    setEmployees(mockEmployees);
    setLocations(mockLocations);
  }, []);

  // تحديث البيانات المدخلة
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  // إضافة أو تعديل موظف
  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (editMode) {
      // تعديل موظف
      const updatedEmployees = [...employees];
      updatedEmployees[selectedEmployeeIndex] = employeeData;
      setEmployees(updatedEmployees);
      setSnackbar({ open: true, message: "تم تعديل بيانات الموظف بنجاح!" });
    } else {
      // إضافة موظف جديد
      setEmployees([...employees, { ...employeeData, location: "" }]);
      setSnackbar({ open: true, message: "تم إضافة الموظف بنجاح!" });
    }

    // إعادة تعيين البيانات
    setEmployeeData({
      fullName: "",
      employeeId: "",
      department: "",
      birthDate: "",
      baseSalary: "",
      email: "",
    });
    setEditMode(false);
    setSelectedEmployeeIndex(null);
  };

  // حذف موظف
  const handleDeleteEmployee = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);
    setEmployees(updatedEmployees);
    setSnackbar({ open: true, message: "تم حذف الموظف بنجاح!" });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };

  // تعديل موظف
  const handleEditEmployee = (index) => {
    setEmployeeData(employees[index]);
    setEditMode(true);
    setSelectedEmployeeIndex(index);
  };

  // فتح نافذة الحوار لربط الموقع
  const handleOpenDialog = (index) => {
    setSelectedEmployeeIndex(index);
    setOpenDialog(true);
  };

  // غلق نافذة الحوار
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLocation("");
  };

  // حفظ الموقع المرتبط
  const handleSaveLocation = () => {
    if (selectedEmployeeIndex !== null) {
      const updatedEmployees = [...employees];
      updatedEmployees[selectedEmployeeIndex].location = selectedLocation;
      setEmployees(updatedEmployees);
      setSnackbar({ open: true, message: "تم ربط الموقع بالموظف بنجاح!" });
    }
    handleCloseDialog();
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

      {/* نموذج إضافة/تعديل موظف */}
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
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                startIcon={editMode ? <EditIcon /> : <AddIcon />}
                sx={{
                  fontWeight: "bold",
                  height: "48px",
                }}
              >
                {editMode ? "حفظ التعديلات" : "إضافة"}
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
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الموقع</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.location || "غير مرتبط"}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditEmployee(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDeleteEmployee(index)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleOpenDialog(index)}>
                      <LinkIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* نافذة حوار اختيار الموقع */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>ربط الموظف بموقع</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map((location, index) => (
              <MenuItem key={index} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSaveLocation} color="primary">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>

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
