import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  fetchSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
} from "../Api/workScheduleApi";

const WorkSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    shiftname: "",
    startTime: "",
    endTime: "",
    days: [],
  });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // جلب جداول العمل عند تحميل الصفحة
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules();
        setSchedules(data);
      } catch (error) {
        setErrorMessage("خطأ في جلب جداول العمل.");
      }
    };

    loadSchedules();
  }, []);

  // فتح نافذة إضافة/تعديل الجدول
  const handleDialogOpen = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setNewSchedule({
        shiftname: schedule.shiftname,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        days: schedule.days,
      });
    } else {
      setNewSchedule({ shiftname: "", startTime: "", endTime: "", days: [] });
      setEditingSchedule(null);
    }
    setErrorMessage("");
    setOpenDialog(true);
  };

  // إغلاق نافذة الحوار
  const handleDialogClose = () => setOpenDialog(false);

  // التحقق من صحة البيانات المدخلة
  const validateSchedule = () => {
    if (!newSchedule.shiftname || !newSchedule.startTime || !newSchedule.endTime) {
      setErrorMessage("يرجى ملء جميع الحقول.");
      return false;
    }
    if (newSchedule.days.length === 0) {
      setErrorMessage("يرجى تحديد أيام العمل.");
      return false;
    }
    return true;
  };

  const handleScheduleSubmit = async () => {
    if (!validateSchedule()) {
      return;
    }
  
    try {
      // تحويل startTime و endTime إلى تنسيق Date
      const scheduleData = {
        ...newSchedule,
        startTime: new Date(`1970-01-01T${newSchedule.startTime}:00`), // تحويل النص إلى تاريخ
        endTime: new Date(`1970-01-01T${newSchedule.endTime}:00`),     // تحويل النص إلى تاريخ
      };
  
      console.log("Data to be sent:", scheduleData); // طباعة البيانات قبل الإرسال
  
      let updatedSchedules;
      if (editingSchedule) {
        updatedSchedules = await updateSchedule(editingSchedule._id, scheduleData);
      } else {
        updatedSchedules = await addSchedule(scheduleData);
      }
      setSchedules(updatedSchedules);
      handleDialogClose();
    } catch (error) {
      console.error("Error saving schedule:", error); // طباعة الخطأ
      setErrorMessage(error.message || "حدث خطأ أثناء حفظ الجدول.");
    }
  };

  // حذف الجدول
  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      setSchedules(schedules.filter((schedule) => schedule._id !== id));
    } catch (error) {
      console.error("Error deleting schedule:", error); // طباعة الخطأ
      setErrorMessage(error.message || "حدث خطأ أثناء حذف الجدول.");
    }
  };

  // التعامل مع التغييرات في الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // التعامل مع تغييرات أيام العمل
  const handleDaysChange = (day) => {
    setNewSchedule((prev) => {
      const days = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];
      return { ...prev, days };
    });
  };

  return (
    <Box p={3} sx={{ direction: "rtl", textAlign: "right" }}>
      <Typography variant="h4" gutterBottom>
        جدولة ساعات العمل
      </Typography>

      {/* الرسالة التحذيرية عند وجود خطأ */}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {/* زر إضافة جدول جديد */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
        sx={{ borderRadius: "8px", marginBottom: "20px" }}
      >
        إضافة جدول جديد
      </Button>

      {/* جدول عرض الجداول الحالية */}
      <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#3A6D8C" }}>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "right" }}>اسم الجدول</TableCell>
              <TableCell sx={{ color: "white", textAlign: "right" }}>وقت البدء</TableCell>
              <TableCell sx={{ color: "white", textAlign: "right" }}>وقت الانتهاء</TableCell>
              <TableCell sx={{ color: "white", textAlign: "right" }}>أيام العمل</TableCell>
              <TableCell sx={{ color: "white", textAlign: "right" }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  لا توجد جداول مضافة
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule._id} sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}>
                  <TableCell sx={{ textAlign: "right" }}>{schedule.shiftname}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>{schedule.startTime}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>{schedule.endTime}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    {Array.isArray(schedule.days) ? schedule.days.join(", ") : "غير محدد"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleDialogOpen(schedule)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteSchedule(schedule._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* نافذة إضافة/تعديل الجدول */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm" sx={{ direction: "rtl", textAlign: "right" }}>
        <DialogTitle>{editingSchedule ? "تعديل جدول العمل" : "إضافة جدول جديد"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="اسم الجدول"
                name="shiftname"
                value={newSchedule.shiftname}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!newSchedule.shiftname}
                helperText={!newSchedule.shiftname ? "يرجى إدخال اسم الجدول" : ""}
                sx={{ textAlign: "right" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="وقت البدء"
                name="startTime"
                value={newSchedule.startTime}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!newSchedule.startTime}
                helperText={!newSchedule.startTime ? "يرجى إدخال وقت البدء" : ""}
                sx={{ textAlign: "right" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="وقت الانتهاء"
                name="endTime"
                value={newSchedule.endTime}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!newSchedule.endTime}
                helperText={!newSchedule.endTime ? "يرجى إدخال وقت الانتهاء" : ""}
                sx={{ textAlign: "right" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">أيام العمل:</Typography>
              {daysOfWeek.map((day) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      checked={newSchedule.days.includes(day)}
                      onChange={() => handleDaysChange(day)}
                    />
                  }
                  label={day}
                  sx={{ textAlign: "right" }}
                />
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            إلغاء
          </Button>
          <Button onClick={handleScheduleSubmit} color="primary">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkSchedule;