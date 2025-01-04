import React, { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

function Schedule() {
  const [schedule, setSchedule] = useState({ employee: "", shift: "", date: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = () => {
    if (!schedule.employee || !schedule.shift || !schedule.date) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    console.log("جدول العمل تم إضافته", schedule);
    setSchedule({ employee: "", shift: "", date: "" });
    setError("");
  };

  return (
    <Box p={3} sx={{ direction: "rtl", textAlign: "right" }}>
      <Typography variant="h4" gutterBottom>جدولة العمل</Typography>

      {error && <Typography color="error">{error}</Typography>}

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
        <InputLabel sx={{ textAlign: "right" }}>الفتره</InputLabel>
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