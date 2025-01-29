import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import logo from "../assets/logo.png";
import { login } from "../Api/authApi"; // استيراد دالة تسجيل الدخول من API

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // حالة لإدارة رسائل الخطأ
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const token = await login(username, password); // استخدام دالة تسجيل الدخول
      localStorage.setItem("authToken", token); // حفظ التوكن في التخزين المحلي
      setIsLoggedIn(true);
      navigate("/dashboard");
    } catch (error) {
      setError("كلمة المرور أو اسم المستخدم غير صحيح"); // عرض رسالة الخطأ
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
        <Box display="flex" justifyContent="center" mb={2}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "60%",
              filter: "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))",
            }}
          />
        </Box>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#001F3F" }}
        >
          مرحبًا بك!
        </Typography>
        <Typography
          variant="body1"
          align="center"
          gutterBottom
          sx={{ color: "#555" }}
        >
          الرجاء تسجيل الدخول للمتابعة
        </Typography>
        <TextField
          label="اسم المستخدم"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ backgroundColor: "#f7f7f7", borderRadius: "5px" }}
        />
        <TextField
          label="كلمة المرور"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ backgroundColor: "#f7f7f7", borderRadius: "5px" }}
        />
        {error && ( // عرض رسالة الخطأ إذا كانت موجودة
          <Typography
            variant="body2"
            align="center"
            sx={{ color: "red", mt: 1 }}
          >
            {error}
          </Typography>
        )}
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
          onClick={handleLogin}
        >
          تسجيل الدخول
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;