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
  Snackbar,
  Alert,
} from "@mui/material";
import { fetchEmployees, sendNotification } from "../Api/notificationApi"; // استيراد الدوال من ملف api.js

const Notifications = () => {
  const [title, setTitle] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [notificationText, setNotificationText] = useState("");
  const [employees, setEmployees] = useState([]); // قائمة الموظفين
  const [snackbarOpen, setSnackbarOpen] = useState(false); // حالة Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // رسالة Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // نوع الرسالة (success, error)

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
      setSelectedEmployee(employees.map(emp => emp.employeeId));
    }
  };

  // دالة لإظهار رسالة Snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // دالة لإغلاق Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // دالة لإرسال الإشعار
  const handleSendNotification = async (type = "individual") => {
    // التحقق من الحقول المطلوبة
    if (!title || !notificationText) {
      showSnackbar("الرجاء ملء عنوان الرسالة ونص الإشعار", "error");
      return;
    }
  
    // التحقق من وجود مستلمين إذا كان النوع individual
    if (type === "individual" && selectedEmployee.length === 0) {
      showSnackbar("الرجاء تحديد موظفين لإرسال الإشعار إليهم", "error");
      return;
    }
  
    const notificationData = {
      title: title,
      message: notificationText,
      type: type, // تحديد نوع الإشعار (individual أو all)
      recipients:
        type === "individual"
          ? selectedEmployee // إرسال employeeId كـ ObjectId
          : [], // إذا كان النوع "all"، نرسل مصفوفة فارغة
      createdBy: "adminId", // يجب استبدالها بـ ID المستخدم الحالي (المشرف)
    };
  
    console.log("Notification Data:", notificationData); // تحقق من البيانات المرسلة
  
    try {
      await sendNotification(notificationData);
      showSnackbar("تم إرسال الإشعار بنجاح!");
      setTitle("");
      setSelectedEmployee([]);
      setNotificationText("");
    } catch (error) {
      console.error("Failed to send notification:", error);
      showSnackbar("فشل إرسال الإشعار، الرجاء المحاولة مرة أخرى", "error");
    }
  };

  // دالة لإرسال الإشعار إلى الكل
  const handleSendToAll = async () => {
    // التحقق من الحقول المطلوبة
    if (!title || !notificationText) {
      showSnackbar("الرجاء ملء عنوان الرسالة ونص الإشعار", "error");
      return;
    }

    const notificationData = {
      title: title,
      message: notificationText,
      type: "all", // إرسال إلى الكل
      recipients: [], // مصفوفة فارغة للإرسال إلى الكل
      createdBy: "adminId", // يجب استبدالها بـ ID المستخدم الحالي (المشرف)
    };

    console.log("Notification Data (Send to All):", notificationData); // تحقق من البيانات المرسلة

    try {
      await sendNotification(notificationData);
      showSnackbar("تم إرسال الإشعار إلى الكل بنجاح!");
      setTitle("");
      setSelectedEmployee([]);
      setNotificationText("");
    } catch (error) {
      console.error("Failed to send notification to all:", error);
      showSnackbar("فشل إرسال الإشعار إلى الكل، الرجاء المحاولة مرة أخرى", "error");
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
              selected.length
                ? employees
                    .filter((emp) => selected.includes(emp.employeeId))
                    .map((emp) => emp.fullname)
                    .join(", ")
                : "إرسال إلى الكل"
            }
          >
            {employees.map((employee, index) => (
              <MenuItem key={index} value={employee.employeeId}>
                <Checkbox checked={selectedEmployee.indexOf(employee.employeeId) > -1} />
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

        {/* زر الإرسال إلى الكل */}
        <Button
          onClick={handleSendToAll}
          variant="contained"
          color="secondary"
          fullWidth
          sx={{
            fontWeight: "bold",
            height: "48px",
            marginBottom: "10px",
          }}
        >
          إرسال إلى الكل
        </Button>

        {/* زر الإرسال إلى المحددين */}
        <Button
          onClick={() => handleSendNotification("individual")}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            fontWeight: "bold",
            height: "48px",
          }}
        >
          إرسال إلى المحددين
        </Button>
      </Box>

      {/* Snackbar لإظهار الرسائل */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // إغلاق الرسالة تلقائيًا بعد 6 ثوانٍ
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notifications;