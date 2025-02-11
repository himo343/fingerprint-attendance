import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

function Reports() {
  const [tabValue, setTabValue] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [locationData, setLocationData] = useState({
    location: "",
    address: "",
    city: "",
    coordinates: "",
    range: "",
  });
  const [employeeData, setEmployeeData] = useState({
    name: "",
    phone: "",
    email: "",
    department: "",
    birthDate: "",
    salary: "",
  });
  const [leaveData, setLeaveData] = useState({
    employee: "",
    leaveType: "",
    reason: "",
    approvalStatus: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [tabValue]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let response;
      if (tabValue === 0) {
        response = await fetch("https://guarded-ocean-10405-67e33b12d874.herokuapp.com/api/attendance/getallreports");
        const data = await response.json();
        if (Array.isArray(data)) {
          setAttendanceData(data);
        } else {
          console.error("البيانات ليست مصفوفة");
          setAttendanceData([]);
        }
      } else if (tabValue === 1) {
        response = await fetch("https://api.example.com/notifications");
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (event) => setLocationData({ ...locationData, [event.target.name]: event.target.value });
  const handleEmployeeChange = (event) => setEmployeeData({ ...employeeData, [event.target.name]: event.target.value });
  const handleLeaveChange = (event) => setLeaveData({ ...leaveData, [event.target.name]: event.target.value });

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "-";
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const hoursWorked = Math.abs((end - start) / (1000 * 60 * 60)).toFixed(2);
    return `${hoursWorked} ساعة`;
  };

  return (
    <Box p={3} sx={{ background: "#F7F9FC", minHeight: "100vh", borderRadius: "16px" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#001F3F", fontWeight: "bold" }}>
        التقارير
      </Typography>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ marginBottom: "20px" }}>
        <Tab icon={<AccessTimeIcon />} label="الحضور والانصراف" />
        <Tab icon={<NotificationsActiveIcon />} label="الإشعارات" />
        <Tab icon={<LocationOnIcon />} label="الموقع" />
        <Tab icon={<PersonIcon />} label="الموظفين" />
        <Tab icon={<EventAvailableIcon />} label="الاستئذانات" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress />
        </Box>
      ) : tabValue === 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead sx={{ background: "#3A6D8C" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>اسم الموظف</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>وقت الحضور</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>وقت الانصراف</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>عدد ساعات العمل</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{new Date(record.checkin).toLocaleString()}</TableCell>
                  <TableCell>{record.checkout ? new Date(record.checkout).toLocaleString() : "-"}</TableCell>
                  <TableCell>{calculateWorkHours(record.checkin, record.checkout)}</TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : tabValue === 1 ? (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead sx={{ background: "#3A6D8C" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>التاريخ</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الرسالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(notification.date).toLocaleString()}</TableCell>
                  <TableCell>{notification.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : tabValue === 2 ? (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead sx={{ background: "#3A6D8C" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>اسم الموقع</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>العنوان</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>المدينة</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الإحداثيات</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>النطاق</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{locationData.location}</TableCell>
                <TableCell>{locationData.address}</TableCell>
                <TableCell>{locationData.city}</TableCell>
                <TableCell>{locationData.coordinates}</TableCell>
                <TableCell>{locationData.range}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : tabValue === 3 ? (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead sx={{ background: "#3A6D8C" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الاسم</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>رقم الهاتف</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>البريد الإلكتروني</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>القسم</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>تاريخ الميلاد</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الراتب</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{employeeData.name}</TableCell>
                <TableCell>{employeeData.phone}</TableCell>
                <TableCell>{employeeData.email}</TableCell>
                <TableCell>{employeeData.department}</TableCell>
                <TableCell>{employeeData.birthDate}</TableCell>
                <TableCell>{employeeData.salary}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : tabValue === 4 ? (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead sx={{ background: "#3A6D8C" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>اسم الموظف</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>نوع الاستئذان</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>السبب</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>حالة الموافقة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{leaveData.employee}</TableCell>
                <TableCell>{leaveData.leaveType}</TableCell>
                <TableCell>{leaveData.reason}</TableCell>
                <TableCell>{leaveData.approvalStatus}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Box>
  );
}

export default Reports;
