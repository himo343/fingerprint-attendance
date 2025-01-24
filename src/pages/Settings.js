import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("changePassword");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [language, setLanguage] = useState("العربية");
  const [themeColor, setThemeColor] = useState("#e5e6e6");
  const [dateTime, setDateTime] = useState("");

  const handleLogout = () => {
    // منطق تسجيل الخروج (يمكنك إضافة ما يناسبك هنا)
    localStorage.removeItem("authToken");
    console.log("تم تسجيل الخروج");
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setMessage("يرجى إدخال كل من كلمة المرور القديمة والجديدة.");
      return;
    }

    const token = localStorage.getItem("authToken");
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
            Authorization: token,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
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

  const renderContent = () => {
    switch (activeSection) {
      case "changePassword":
        return (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
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
          </Box>
        );
      case "changeLanguage":
        return (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
              تغيير اللغة
            </Typography>
            <TextField
              select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              fullWidth
              sx={{ backgroundColor: "#f7f7f7", borderRadius: "5px" }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="العربية">العربية</option>
              <option value="English">English</option>
            </TextField>
            <Typography variant="body2" sx={{ marginTop: "20px" }}>
              اللغة الحالية: {language}
            </Typography>
          </Box>
        );
      case "changeTheme":
        return (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
              تغيير لون الصفحة
            </Typography>
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              style={{
                width: "100%",
                height: "50px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            />
            <Typography variant="body2" sx={{ marginTop: "20px" }}>
              اللون الحالي: {themeColor}
            </Typography>
          </Box>
        );
      case "changeDateTime":
        return (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
              تغيير الوقت والتاريخ
            </Typography>
            <TextField
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              fullWidth
              sx={{ backgroundColor: "#f7f7f7", borderRadius: "5px" }}
            />
            <Typography variant="body2" sx={{ marginTop: "20px" }}>
              الوقت والتاريخ الحالي: {dateTime || "غير محدد"}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* المحتوى الرئيسي */}
      <Box
        sx={{
          flex: 1,
          padding: "40px",
          backgroundColor: themeColor,
          color: "#fff",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px",
          }}
        >
          {renderContent()}
        </Paper>
      </Box>

      {/* القائمة الجانبية */}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#001F3F",
          color: "#fff",
          padding: "20px",
          borderTopRightRadius: "15px",
          borderBottomRightRadius: "15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
            الإعدادات
          </Typography>
          <Divider sx={{ backgroundColor: "#fff", marginBottom: "10px" }} />

          <List>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: "8px",
                  marginBottom: "10px",
                  "&:hover": { backgroundColor: "#e5e6e6" },
                }}
                onClick={() => setActiveSection("changePassword")}
              >
                <ListItemText primary="تغيير كلمة المرور" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: "8px",
                  marginBottom: "10px",
                  "&:hover": { backgroundColor: "#e5e6e6" },
                }}
                onClick={() => setActiveSection("changeLanguage")}
              >
                <ListItemText primary="تغيير اللغة" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: "8px",
                  marginBottom: "10px",
                  "&:hover": { backgroundColor: "#e5e6e6" },
                }}
                onClick={() => setActiveSection("changeTheme")}
              >
                <ListItemText primary="تغيير اللون" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: "8px",
                  marginBottom: "10px",
                  "&:hover": { backgroundColor: "#e5e6e6" },
                }}
                onClick={() => setActiveSection("changeDateTime")}
              >
                <ListItemText primary="تغيير الوقت والتاريخ" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* إضافة زر تسجيل الخروج في الأسفل */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogout}
          sx={{
            background: "#f44336",
            fontWeight: "bold",
            "&:hover": { background: "#d32f2f" },
          }}
        >
          تسجيل الخروج
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
