import React, { useState } from "react";
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

  const [openSnackbar, setOpenSnackbar] = useState(false); // حالة لفتح الإشعار
  const [snackbarMessage, setSnackbarMessage] = useState(""); // الرسالة التي ستظهر في الإشعار

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // تحويل القيمة إلى عدد فقط إذا كانت النطاق
    const newValue = name === "radius" ? parseInt(value) : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleAddLocation = () => {
    // تحقق من صحة الإحداثيات والنطاق
    if (
      formData.name &&
      formData.address &&
      formData.city &&
      !isNaN(formData.latitude) && formData.latitude !== 0 &&
      !isNaN(formData.longitude) && formData.longitude !== 0
    ) {
      const radiusValue = isNaN(formData.radius) || formData.radius <= 0 ? 1000 : formData.radius; // تعيين قيمة افتراضية للنطاق
      const newLocation = {
        ...formData,
        radius: radiusValue, // إضافة النطاق المحدد
        createdAt: new Date().toLocaleString(),
      };
      setLocations([...locations, newLocation]);
      setFormData({
        name: "",
        address: "",
        city: "",
        latitude: 15.5527,
        longitude: 48.5164,
        radius: 1000, // إعادة تعيين القيمة الافتراضية للنطاق
      });
    } else {
      // إذا لم يتم تحديد النطاق بشكل صحيح، إظهار إشعار
      setSnackbarMessage("يجب تحديد قيمة للنطاق (radius) بشكل صحيح.");
      setOpenSnackbar(true);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        // التحقق من صحة الإحداثيات قبل التحديث
        if (!isNaN(lat) && !isNaN(lng)) {
          setFormData({
            ...formData,
            latitude: lat,
            longitude: lng,
          });
        }
      },
    });

    return (
      <Marker position={[formData.latitude, formData.longitude]} />
    );
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // دالة لتحديث القائمة
  const handleRefreshLocations = () => {
    // محاكاة عملية التحديث
    setLocations([...locations]); // يمكن استبدال هذه الوظيفة بجلب بيانات جديدة إذا لزم الأمر
  };

  return (
    <Box sx={{ padding: "20px", background: "#F7F9FC", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#001F3F", fontWeight: "bold" }}>
        إدارة المواقع
      </Typography>

      {/* زر التحديث كأيقونة */}
      <IconButton
        color="primary"
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "#fff",
          boxShadow: 2,
          borderRadius: "50%",
        }}
        onClick={handleRefreshLocations}
      >
        <RefreshIcon />
      </IconButton>

      {/* إضافة جدول عرض المواقع */}
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
              radius={parseInt(formData.radius) || 1000} // إذا كانت القيمة فارغة أو غير صحيحة، استخدام النطاق الافتراضي
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

      <Typography variant="h6" gutterBottom sx={{ color: "#001F3F", marginBottom: "10px" }}>
        المواقع المسجلة
      </Typography>

      {/* عرض بيانات المواقع المسجلة في جدول */}
      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "16px" }}>
        <Grid container spacing={2}>
          {locations.length > 0 ? (
            <Grid item xs={12}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>اسم الموقع</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>العنوان</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>المدينة</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>الإحداثيات</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>النطاق</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>تاريخ الإنشاء</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location, index) => (
                    <tr key={index}>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.name}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.address}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.city}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {location.latitude}, {location.longitude}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {location.radius} 
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.createdAt}</td>
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

      {/* Snackbar لعرض الرسائل */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Locations;
