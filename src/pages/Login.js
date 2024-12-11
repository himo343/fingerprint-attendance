import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "himo" && password === "1234") {
      setIsLoggedIn(true); // تحديث حالة تسجيل الدخول
      localStorage.setItem("isLoggedIn", "true"); // تخزين حالة تسجيل الدخول في localStorage
      navigate("/dashboard"); // الانتقال إلى صفحة لوحة التحكم
    } else {
      alert("بيانات تسجيل الدخول غير صحيحة!");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      style={{ backgroundColor: "#001F3F" }}
    >
      <Paper style={{ padding: "40px", width: "300px" }}>
        <Typography variant="h5" align="center" gutterBottom>
          تسجيل الدخول
        </Typography>
        <TextField
          label="اسم المستخدم"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="كلمة المرور"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
          onClick={handleLogin}
        >
          دخول
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
