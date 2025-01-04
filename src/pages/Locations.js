import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Grid,
  TextField,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import { fetchLocations, addLocation, deleteLocation } from "../Api/locationApi"; // استيراد الدوال من API

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const defaultCenter = {
  lat: 15.5527, // Default latitude
  lng: 48.5164, // Default longitude
};

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng,
    radius: 1000, // Default radius
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // جلب المواقع عند تحميل الصفحة
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchLocations();
        setLocations(data);
      } catch (error) {
        setSnackbarMessage("خطأ في جلب المواقع.");
        setOpenSnackbar(true);
      }
    };

    loadLocations();
  }, []);

  // تغيير القيم في النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "radius" ? parseInt(value) || 1000 : value;
    setFormData({ ...formData, [name]: newValue });
  };

  // إضافة موقع جديد
  const handleAddLocation = async () => {
    if (
      formData.name &&
      formData.address &&
      formData.city &&
      !isNaN(formData.latitude) &&
      formData.latitude !== 0 &&
      !isNaN(formData.longitude) &&
      formData.longitude !== 0 &&
      !isNaN(formData.radius) &&
      formData.radius > 0
    ) {
      try {
        await addLocation(formData);
        const updatedLocations = await fetchLocations();
        setLocations(updatedLocations);
        setFormData({
          name: "",
          address: "",
          city: "",
          latitude: defaultCenter.lat,
          longitude: defaultCenter.lng,
          radius: 1000,
        });
      } catch (error) {
        setSnackbarMessage("خطأ في إضافة الموقع.");
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage("يجب تحديد قيمة للنطاق (radius) بشكل صحيح.");
      setOpenSnackbar(true);
    }
  };

  // النقر على الخريطة لتحديد الإحداثيات
  const handleMapClick = (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    });
  };

  // إغلاق الإشعار
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // حذف موقع
  const handleDeleteLocation = async (id) => {
    try {
      await deleteLocation(id);
      const updatedLocations = await fetchLocations();
      setLocations(updatedLocations);
    } catch (error) {
      setSnackbarMessage("خطأ في حذف الموقع.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ padding: "20px", background: "#F7F9FC", minHeight: "100vh", textAlign: "right" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#001F3F", fontWeight: "bold" }}>
        إدارة المواقع
      </Typography>

      <IconButton
        color="primary"
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "#fff",
          boxShadow: 2,
          borderRadius: "50%",
        }}
        onClick={fetchLocations}
      >
        <RefreshIcon />
      </IconButton>

      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "16px", marginBottom: "20px", textAlign: "right" }}>
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
              sx={{ textAlign: "right" }}
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
              sx={{ textAlign: "right" }}
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
              sx={{ textAlign: "right" }}
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
              sx={{ textAlign: "right" }}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ marginTop: "20px", color: "#001F3F" }}>
          تحديد الإحداثيات:
        </Typography>
        <Box sx={{ height: "400px", width: "100%", marginTop: "10px" }}>
          <LoadScript googleMapsApiKey="AIzaSyA4-CJz--oZSkVaAlsSK8K2PaIVIAaEaFU">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: formData.latitude, lng: formData.longitude }}
              zoom={10}
              onClick={handleMapClick}
            >
              <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
              <Circle
                center={{ lat: formData.latitude, lng: formData.longitude }}
                radius={formData.radius}
                options={{ fillColor: "blue", strokeColor: "#001F3F" }}
              />
            </GoogleMap>
          </LoadScript>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            height: "56px",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "20px",
          }}
          onClick={handleAddLocation}
        >
          إضافة الموقع
        </Button>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ color: "#001F3F", marginBottom: "10px" }}>
        المواقع المسجلة
      </Typography>

      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "16px", textAlign: "right" }}>
        <Grid container spacing={2}>
          {locations.length > 0 ? (
            <Grid item xs={12}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>اسم الموقع</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>العنوان</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>المدينة</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>الإحداثيات</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>النطاق</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>تاريخ الإنشاء</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location, index) => (
                    <tr key={index}>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.name}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.address}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.city}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.latitude}, {location.longitude}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.radius}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.createdAt}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        <IconButton color="secondary" onClick={() => handleDeleteLocation(location._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ textAlign: "center", color: "#999" }}>
                لا توجد مواقع مسجلة بعد.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Locations;