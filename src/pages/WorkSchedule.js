import React, { useState } from "react";
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
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

const WorkSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    type: "daily", // daily or weekly
    startTime: "",
    endTime: "",
    employees: "",
    daysOff: [], // New field for days off
  });

  const daysOfWeek = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  // Handle Dialog Open/Close
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  // Handle New Schedule Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Days Off Change
  const handleDaysOffChange = (day) => {
    setNewSchedule((prev) => {
      const daysOff = prev.daysOff.includes(day)
        ? prev.daysOff.filter((d) => d !== day)
        : [...prev.daysOff, day];
      return { ...prev, daysOff };
    });
  };

  // Add New Schedule
  const addSchedule = () => {
    setSchedules((prev) => [...prev, { ...newSchedule, id: prev.length + 1 }]);
    setNewSchedule({
      name: "",
      type: "daily",
      startTime: "",
      endTime: "",
      employees: "",
      daysOff: [],
    });
    handleDialogClose();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        جدولة ساعات العمل
      </Typography>

      {/* جدول عرض الجداول الحالية */}
      <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>اسم الجدول</TableCell>
              <TableCell>النوع</TableCell>
              <TableCell>وقت البدء</TableCell>
              <TableCell>وقت الانتهاء</TableCell>
              <TableCell>الموظفون</TableCell>
              <TableCell>أيام الإجازة</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  لا توجد جداول مضافة
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.name}</TableCell>
                  <TableCell>{schedule.type === "daily" ? "يومي" : "أسبوعي"}</TableCell>
                  <TableCell>{schedule.startTime}</TableCell>
                  <TableCell>{schedule.endTime}</TableCell>
                  <TableCell>{schedule.employees}</TableCell>
                  <TableCell>{schedule.daysOff.join(", ")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* زر إضافة جدول جديد */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleDialogOpen}
        sx={{ borderRadius: "8px" }}
      >
        إضافة جدول جديد
      </Button>

      {/* نافذة إضافة جدول جديد */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>إضافة جدول جديد</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="اسم الجدول"
                name="name"
                value={newSchedule.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                label="النوع"
                name="type"
                value={newSchedule.type}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="daily">يومي</MenuItem>
                <MenuItem value="weekly">أسبوعي</MenuItem>
              </Select>
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="الموظفون (أدخل الأسماء مفصولة بفواصل)"
                name="employees"
                value={newSchedule.employees}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                أيام الإجازة:
              </Typography>
              <FormGroup row>
                {daysOfWeek.map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={newSchedule.daysOff.includes(day)}
                        onChange={() => handleDaysOffChange(day)}
                      />
                    }
                    label={day}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            إلغاء
          </Button>
          <Button onClick={addSchedule} variant="contained" color="primary">
            إضافة
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkSchedule;
