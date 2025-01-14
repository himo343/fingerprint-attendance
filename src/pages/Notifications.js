import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { fetchEmployees, sendNotification } from "../Api/notificationApi"; // استيراد الدوال من ملف api.js

const Notifications = () => {
  const [title, setTitle] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [notificationText, setNotificationText] = useState("");
  const [employees, setEmployees] = useState([]); // قائمة الموظفين

  // جلب الموظفين عند تحميل الصفحة
  useEffect(() => {
    const getEmployees = async () => {
      const employeesList = await fetchEmployees();
      setEmployees(employeesList);
    };
    getEmployees();
  }, []);

  // دالة لتحديد جميع الموظفين
  const handleSelectAll = () => {
    if (selectedEmployee.length === employees.length) {
      // إذا تم تحديد الكل بالفعل، قم بإلغاء التحديد
      setSelectedEmployee([]);
    } else {
      // إذا لم يتم تحديد الكل، قم بتحديد جميع الموظفين
      setSelectedEmployee(employees);
    }
  };

  const handleSendNotification = async () => {
    const notificationData = {
      title: title,
      message: notificationText,
      type: selectedEmployee.length > 0 ? "individual" : "all", // استخدام "individual" بدلاً من "specific"
      recipients: selectedEmployee.length > 0 ? selectedEmployee.map(employee => employee.employeeId) : null,
    };
  
    console.log("Notification Data:", notificationData); // تحقق من البيانات المرسلة
  
    try {
      await sendNotification(notificationData);
      console.log("Notification sent successfully!");
      setTitle("");
      setSelectedEmployee([]);
      setNotificationText("");
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
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
        إدارة الإشعارات
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          background: "#FFFFFF",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* محددات عنوان الرسالة */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="title-label">عنوان الرسالة</InputLabel>
          <Select
            labelId="title-label"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          >
            <MenuItem value="تحديث في النظام">تحديث في النظام</MenuItem>
            <MenuItem value="إشعار بموعد مهم">إشعار بموعد مهم</MenuItem>
            <MenuItem value="تحذير">تحذير</MenuItem>
          </Select>
        </FormControl>

        {/* تحديد الموظف */}
        <FormControl fullWidth margin="normal">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <InputLabel id="employee-label">إرسال إلى</InputLabel>
            <Button
              onClick={handleSelectAll}
              variant="outlined"
              size="small"
              sx={{ textTransform: "none" }}
            >
              {selectedEmployee.length === employees.length
                ? "إلغاء تحديد الكل"
                : "تحديد الكل"}
            </Button>
          </Box>
          <Select
            labelId="employee-label"
            multiple
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            renderValue={(selected) =>
              selected.length ? selected.map(emp => emp.fullname).join(", ") : "إرسال إلى الكل"
            }
          >
            {employees.map((employee, index) => (
              <MenuItem key={index} value={employee}>
                <Checkbox
                  checked={selectedEmployee.indexOf(employee) > -1}
                />
                <ListItemText primary={employee.fullname} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* نص الإشعار */}
        <TextField
          label="نص الإشعار"
          value={notificationText}
          onChange={(e) => setNotificationText(e.target.value)}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        {/* زر الإرسال */}
        <Button
          onClick={handleSendNotification}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            fontWeight: "bold",
            height: "48px",
          }}
        >
          إرسال الإشعار
        </Button>
      </Box>
    </Box>
  );
};

export default Notifications;