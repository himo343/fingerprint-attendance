import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LoginIcon from "@mui/icons-material/Login";

const Header = () => {
  const location = useLocation();

  // قائمة العناوين مع الأيقونات
  const pageTitles = {
    "/dashboard": { title: "لوحة التحكم", icon: <DashboardIcon /> },
    "/attendance": { title: "إدارة الحضور", icon: <EventNoteIcon /> },
    "/reports": { title: "التقارير", icon: <EventNoteIcon /> },
    "/employees": { title: "إدارة الموظفين", icon: <PeopleIcon /> },
    "/locations": { title: "إدارة المواقع", icon: <LocationOnIcon /> },
    "/notifications": { title: "الإشعارات", icon: <NotificationsIcon /> },
    "/login": { title: "تسجيل الدخول", icon: <LoginIcon /> },
  };

  // تحديد العنوان الحالي
  const currentPage = pageTitles[location.pathname] || { title: "صفحة غير معروفة", icon: null };

  return (
    <AppBar position="static" sx={{ background: "#001F3F", padding: "10px 0" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "white",
          }}
        >
          {currentPage.icon && <Box sx={{ fontSize: "18px" }}>{currentPage.icon}</Box>}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              fontSize: "14px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            {currentPage.title}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
