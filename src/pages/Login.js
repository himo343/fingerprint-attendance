import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import logo from "../assets/logo.png";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // إرسال طلب تسجيل الدخول
      const response = await fetch("https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Aname: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // حفظ التوكن في التخزين المحلي
        localStorage.setItem("authToken", data.token);
        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        alert("بيانات تسجيل الدخول غير صحيحة!");
      }
    } catch (error) {
      console.error("خطأ أثناء تسجيل الدخول:", error);
      alert("حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.");
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
              width: "100px",
              height: "100px",
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
        <Typography
          variant="body2"
          align="center"
          sx={{
            marginTop: "20px",
            color: "#777",
            "& a": { color: "#3A6D8C", textDecoration: "none" },
          }}
        >
          نسيت كلمة المرور؟ <a href="/reset">إعادة تعيين</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
