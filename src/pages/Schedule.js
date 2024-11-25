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
    <Box p={3}>
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
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>الفتره</InputLabel>
        <Select
          name="shift"
          value={schedule.shift}
          onChange={handleInputChange}
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
      />
      <Button onClick={handleAddSchedule} variant="contained" color="primary">إضافة الجدول</Button>
    </Box>
  );
}

export default Schedule;
