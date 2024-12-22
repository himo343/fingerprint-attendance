import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    // التحقق: التأكد من أن كلا الحقلين قد تم تعبئتهما
    if (!oldPassword || !newPassword) {
      setMessage("يرجى إدخال كل من كلمة المرور القديمة والجديدة.");
      return;
    }
  
    const token = localStorage.getItem("authToken"); // استرداد التوكن من التخزين المحلي
    if (!token) {
      setMessage("يرجى تسجيل الدخول أولاً.");
      return;
    }
  
    try {
      const response = await fetch(
        "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/admin/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // إرسال التوكن في الهيدر
          },
          body: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword,
          }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("تم تغيير كلمة المرور بنجاح!");
      } else {
        setMessage(data.message || "حدث خطأ أثناء تغيير كلمة المرور.");
      }
    } catch (error) {
      console.error("خطأ:", error);
      setMessage("حدث خطأ أثناء الاتصال بالخادم.");
    }
  };
  
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        background: "linear-gradient(135deg, #001F3F, #3A6D8C)",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: "40px",
          width: "350px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "12px",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#001F3F" }}
        >
          تغيير كلمة المرور
        </Typography>
        <TextField
          label="كلمة المرور الحالية"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          sx={{ backgroundColor: "#f7f7f7", borderRadius: "5px" }}
        />
        <TextField
          label="كلمة المرور الجديدة"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ backgroundColor: "#f7f7f7", borderRadius: "5px" }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: "20px",
            background: "linear-gradient(135deg, #001F3F, #3A6D8C)",
            fontWeight: "bold",
            padding: "10px 0",
            "&:hover": { background: "#001F3F" },
          }}
          onClick={handleChangePassword}
        >
          تغيير كلمة المرور
        </Button>
        {message && (
          <Typography
            variant="body2"
            align="center"
            sx={{
              marginTop: "20px",
              color: message.includes("تم") ? "green" : "red",
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ChangePassword;
