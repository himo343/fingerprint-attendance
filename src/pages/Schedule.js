import React, { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

function Schedule() {
  const [schedule, setSchedule] = useState({ employee: "", shift: "", date: "" });

  const handleInputChange = (e) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = () => {
    console.log("جدول العمل تم إضافته", schedule);
    setSchedule({ employee: "", shift: "", date: "" });
  };

  return (
    <Box p={3} sx={{ direction: "rtl", textAlign: "right" }}> {/* إضافة direction: "rtl" */}
      <Typography variant="h4" gutterBottom>جدولة العمل</Typography>

      {/* نموذج إضافة جدول العمل */}
      <TextField
        label="اسم الموظف"
        name="employee"
        value={schedule.employee}
        onChange={handleInputChange}
        fullWidth
        variant="outlined"
        margin="normal"
        sx={{ textAlign: "right" }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ textAlign: "right" }}>الفتره</InputLabel> {/* تعديل محاذاة النص */}
        <Select
          name="shift"
          value={schedule.shift}
          onChange={handleInputChange}
          sx={{ textAlign: "right" }}
        >
          <MenuItem value="Morning">صباحي</MenuItem>
          <MenuItem value="Evening">مسائي</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="التاريخ"
        name="date"
        value={schedule.date}
        onChange={handleInputChange}
        type="date"
        fullWidth
        variant="outlined"
        margin="normal"
        InputLabelProps={{ shrink: true }}
        sx={{ textAlign: "right" }}
      />
      <Button onClick={handleAddSchedule} variant="contained" color="primary" sx={{ textAlign: "right" }}>
        إضافة الجدول
      </Button>
    </Box>
  );
}

export default Schedule;