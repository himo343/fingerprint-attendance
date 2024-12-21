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
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // جلب المواقع عند تحميل الصفحة
  useEffect(() => {
    axios.get('https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        setSnackbarMessage("حدث خطأ أثناء جلب المواقع.");
        setOpenSnackbar(true);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      const radiusValue = isNaN(formData.radius) || formData.radius <= 0 ? 1000 : formData.radius;

      const newLocation = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
        radius: radiusValue,
        createdAt: new Date().toLocaleString(),
      };

      // إرسال الطلب لإضافة الموقع
      axios.post('https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/locations', newLocation)
        .then(response => {
          setLocations([...locations, response.data]);
          setFormData({
            name: "",
            address: "",
            city: "",
            latitude: 15.5527,
            longitude: 48.5164,
            radius: 1000,
          });
          setSnackbarMessage("تم إضافة الموقع بنجاح.");
          setOpenSnackbar(true);
        })
        .catch(error => {
          console.error(error);
          setSnackbarMessage("حدث خطأ أثناء إضافة الموقع.");
          setOpenSnackbar(true);
        });
    } else {
      setSnackbarMessage("يجب تحديد جميع الحقول بشكل صحيح.");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteLocation = (id) => {
    // إرسال طلب لحذف الموقع
    axios.delete(`https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/locations/${id}`)
      .then(response => {
        setLocations(locations.filter(location => location._id !== id));
        setSnackbarMessage("تم حذف الموقع بنجاح.");
        setOpenSnackbar(true);
      })
      .catch(error => {
        setSnackbarMessage("حدث خطأ أثناء حذف الموقع.");
        setOpenSnackbar(true);
      });
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (!isNaN(lat) && !isNaN(lng)) {
          setFormData({
            ...formData,
            latitude: lat,
            longitude: lng,
          });
        }
      },
    });

    return <Marker position={[formData.latitude, formData.longitude]} />;
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleRefreshLocations = () => {
    // جلب البيانات من جديد من API
    axios.get('https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        setSnackbarMessage("حدث خطأ أثناء التحديث.");
        setOpenSnackbar(true);
      });
  };

  return (
    <Box sx={{ padding: "20px", background: "#F7F9FC", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#001F3F", fontWeight: "bold" }}>
        إدارة المواقع
      </Typography>

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

      {/* إضافة موقع جديد */}
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
              radius={parseInt(formData.radius) || 1000}
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
      {/* عرض قائمة المواقع */}
      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "16px" }}>
        <Grid container>
          {locations.length > 0 ? (
            <Grid item xs={12}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>الاسم</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>العنوان</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>المدينة</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>نطاق</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr key={location._id}>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {location.name}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {location.address}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {location.city}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {location.radius} م
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteLocation(location._id)}
                        >
                          حذف
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" sx={{ padding: "10px" }}>
                لا توجد مواقع مسجلة حالياً.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarMessage.includes("نجاح") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Locations;
