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

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules();
        // تحقق من أن البيانات هي مصفوفة قبل تعيينها في الحالة
        if (Array.isArray(data)) {
          setSchedules(data);
        } else {
          setErrorMessage("Invalid data format received.");
        }
      } catch (error) {
        setErrorMessage("Error fetching work schedules.");
      }
    };

    loadSchedules();
  }, []);

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

  const handleDialogClose = () => setOpenDialog(false);

  const validateSchedule = () => {
    if (!newSchedule.shiftname || !newSchedule.startTime || !newSchedule.endTime) {
      setErrorMessage("Please fill all fields.");
      return false;
    }
    if (newSchedule.days.length === 0) {
      setErrorMessage("Please select working days.");
      return false;
    }
    return true;
  };

  const handleScheduleSubmit = async () => {
    if (!validateSchedule()) {
      return;
    }

    try {
      const scheduleData = {
        ...newSchedule,
        startTime: new Date(`1970-01-01T${newSchedule.startTime}:00Z`), // تحويل النص إلى تاريخ مع توقيت UTC
        endTime: new Date(`1970-01-01T${newSchedule.endTime}:00Z`), // تحويل النص إلى تاريخ مع توقيت UTC
      };

      let updatedSchedules;
      if (editingSchedule) {
        updatedSchedules = await updateSchedule(editingSchedule._id, scheduleData);
      } else {
        updatedSchedules = await addSchedule(scheduleData);
      }
      setSchedules(updatedSchedules);
      handleDialogClose();
    } catch (error) {
      console.error("Error saving schedule:", error);
      setErrorMessage(error.message || "حدث خطأ أثناء حفظ الجدول.");
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      setSchedules(schedules.filter((schedule) => schedule._id !== id));
    } catch (error) {
      console.error("Error deleting schedule:", error);
      setErrorMessage(error.message || "Error deleting the schedule.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

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

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
        sx={{ borderRadius: "8px", marginBottom: "20px" }}
      >
        إضافة جدول جديد
      </Button>

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
            {Array.isArray(schedules) && schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  لا توجد جداول مضافة
                </TableCell>
              </TableRow>
            ) : (
              Array.isArray(schedules) &&
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
                type="time"
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
                type="time"
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
            {editingSchedule ? "تعديل الجدول" : "إضافة الجدول"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkSchedule;
