import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const response = await fetch("https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
        setTimeout(() => navigate("/"), 5000); // إعادة التوجيه إلى صفحة تسجيل الدخول بعد 5 ثوانٍ
      } else {
        setMessage(data.message || "حدث خطأ أثناء محاولة إعادة تعيين كلمة المرور.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("حدث خطأ أثناء الاتصال بالخادم. الرجاء المحاولة مرة أخرى.");
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
          إعادة تعيين كلمة المرور
        </Typography>
        <Typography
          variant="body1"
          align="center"
          gutterBottom
          sx={{ color: "#555" }}
        >
          الرجاء إدخال بريدك الإلكتروني لإرسال رابط إعادة التعيين
        </Typography>
        <TextField
          label="البريد الإلكتروني"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={handleResetPassword}
        >
          إرسال
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

export default ResetPassword;
