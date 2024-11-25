import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    radius: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddLocation = () => {
    if (
      formData.name &&
      formData.address &&
      formData.city &&
      formData.latitude &&
      formData.longitude &&
      formData.radius
    ) {
      const newLocation = {
        ...formData,
        createdAt: new Date().toLocaleString(), // إضافة تاريخ الإنشاء
      };
      setLocations([...locations, newLocation]);
      setFormData({ name: "", address: "", city: "", latitude: "", longitude: "", radius: "" });
    } else {
      alert("يرجى ملء جميع الحقول.");
    }
  };

  return (
    <Box sx={{ padding: "20px", background: "#F7F9FC", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#001F3F", fontWeight: "bold" }}>
        إدارة المواقع
      </Typography>

      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "16px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#001F3F", marginBottom: "10px" }}>
          إضافة موقع جديد
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="اسم الموقع"
              name="name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="العنوان"
              name="address"
              variant="outlined"
              fullWidth
              value={formData.address}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="المدينة"
              name="city"
              variant="outlined"
              fullWidth
              value={formData.city}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="خطوط العرض"
              name="latitude"
              variant="outlined"
              fullWidth
              value={formData.latitude}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="خطوط الطول"
              name="longitude"
              variant="outlined"
              fullWidth
              value={formData.longitude}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="نطاق الموقع (radius)"
              name="radius"
              type="number"
              variant="outlined"
              fullWidth
              value={formData.radius}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: "56px", fontSize: "16px", fontWeight: "bold" }}
              onClick={handleAddLocation}
            >
              إضافة الموقع
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "16px" }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#001F3F", marginBottom: "10px" }}>
          قائمة المواقع
        </Typography>
        {locations.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#001F3F" }}>اسم الموقع</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#001F3F" }}>العنوان</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#001F3F" }}>المدينة</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#001F3F" }}>خطوط العرض</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#001F3F" }}>خطوط الطول</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#001F3F" }}>النطاق</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#001F3F" }}>تاريخ الإضافة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locations.map((location, index) => (
                  <TableRow key={index}>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>{location.address}</TableCell>
                    <TableCell>{location.city}</TableCell>
                    <TableCell>{location.latitude}</TableCell>
                    <TableCell>{location.longitude}</TableCell>
                    <TableCell>{location.radius}</TableCell>
                    <TableCell>{location.createdAt}</TableCell> {/* عرض createdAt */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" sx={{ color: "#6A6A6A" }}>
            لم يتم إضافة مواقع بعد.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Locations;
