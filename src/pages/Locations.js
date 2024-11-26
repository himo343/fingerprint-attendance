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
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    latitude: 15.5527, // إحداثيات افتراضية
    longitude: 48.5164,
    radius: 1000, // النطاق الافتراضي
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
        createdAt: new Date().toLocaleString(),
      };
      setLocations([...locations, newLocation]);
      setFormData({
        name: "",
        address: "",
        city: "",
        latitude: 15.5527,
        longitude: 48.5164,
        radius: 1000,
      });
    } else {
      alert("يرجى ملء جميع الحقول.");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData({
          ...formData,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });

    return (
      <Marker position={[formData.latitude, formData.longitude]} />
    );
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
              label="نطاق الموقع (radius)"
              name="radius"
              type="number"
              variant="outlined"
              fullWidth
              value={formData.radius}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ marginTop: "20px", color: "#001F3F" }}>
          تحديد الإحداثيات:
        </Typography>
        <Box sx={{ height: "400px", width: "100%", marginTop: "10px" }}>
          <MapContainer
            center={[formData.latitude, formData.longitude]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
            <Circle
              center={[formData.latitude, formData.longitude]}
              radius={parseInt(formData.radius)}
              pathOptions={{ fillColor: "blue", color: "#001F3F" }}
            />
          </MapContainer>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ height: "56px", fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}
          onClick={handleAddLocation}
        >
          إضافة الموقع
        </Button>
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
                    <TableCell>{location.createdAt}</TableCell>
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
