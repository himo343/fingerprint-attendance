import React, { useState } from "react";
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

const Notifications = () => {
  const [title, setTitle] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [notificationText, setNotificationText] = useState("");

  const employees = [
    { id: 1, name: "محمد أحمد" },
    { id: 2, name: "سارة علي" },
    { id: 3, name: "خالد سعيد" },
  ]; // قائمة الموظفين

  const handleSendNotification = () => {
    console.log("العنوان:", title);
    console.log(
      "إرسال إلى:",
      selectedEmployee.length ? selectedEmployee : "الكل"
    );
    console.log("نص الإشعار:", notificationText);

    setTitle("");
    setSelectedEmployee([]);
    setNotificationText("");
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
          <InputLabel id="employee-label">إرسال إلى</InputLabel>
          <Select
            labelId="employee-label"
            multiple
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            renderValue={(selected) =>
              selected.length ? selected.join(", ") : "إرسال إلى الكل"
            }
          >
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.name}>
                <Checkbox
                  checked={selectedEmployee.indexOf(employee.name) > -1}
                />
                <ListItemText primary={employee.name} />
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
