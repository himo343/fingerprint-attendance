import React from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import SettingsIcon from "@mui/icons-material/Settings"; // إضافة أيقونة الإعدادات

const Sidebar = () => {
  const menuItems = [
    { text: "لوحة التحكم", icon: <DashboardIcon />, link: "/dashboard" },
    { text: "إدارة الحضور", icon: <EventNoteIcon />, link: "/attendance" },
    { text: "إدارة المواقع", icon: <LocationOnIcon />, link: "/locations" },
    { text: "إدارة الموظفين", icon: <PeopleIcon />, link: "/employees" },
    { text: "إدارة نماذج الدوام", icon: <EventNoteIcon />, link: "/work-schedule" },
    { text: "طلبات الاستئذان", icon: <RequestPageIcon />, link: "/leave-requests" },
    { text: "التقارير", icon: <EventNoteIcon />, link: "/reports" },
    { text: "الإشعارات", icon: <NotificationsIcon />, link: "/notifications" },
    { text: "الإعدادات", icon: <SettingsIcon />, link: "/Settings" }, // عنصر الإعدادات الجديد
  ];

  return (
    <Box
    sx={{
      width: "250px",
      background: "linear-gradient(145deg, #001F3F, #3A6D8C)",
      color: "white",
      height: "100vh",
      p: 2,
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      position: "fixed", // تجعل القائمة الجانبية ثابتة
      top: 0,
      right: 0, // إذا كنت تستخدم الاتجاه rtl
      direction: "rtl",
    }}
  >
  
      <Typography
        variant="h5"
        component="h2"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#EADBB1",
          marginBottom: "20px",
        }}
      >
        بصمة تواجد
      </Typography>
      <Divider sx={{ background: "#EADBB1", marginBottom: "20px" }} />
      <List sx={{ direction: "rtl", textAlign: "right" }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              to={item.link}
              sx={{
                borderRadius: "12px",
                transition: "0.3s",
                "&:hover": {
                  background: "#6A9AB0",
                },
                textAlign: "right", // إضافة textAlign: "right"
              }}
            >
              <ListItemIcon sx={{ color: "#EADBB1", marginLeft: "8px" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;