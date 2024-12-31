import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="row-reverse"> {/* تغيير الاتجاه إلى row-reverse */}
      {/* القائمة الجانبية */}
      <Sidebar />
      {/* محتوى الصفحة */}
      <Box sx={{ flexGrow: 1, padding: 2, background: "#f0f2f5", height: "100vh" }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;