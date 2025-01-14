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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from "@react-google-maps/api";
import { fetchLocations, addLocation, deleteLocation } from "../Api/locationApi";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const defaultCenter = {
  lat: 15.5527,
  lng: 48.5164,
};

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng,
    radius: 1000,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      try {
        const data = await fetchLocations();
        setLocations(data);
      } catch (error) {
        showSnackbar("خطأ في جلب المواقع.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "radius" ? parseInt(value) || 1000 : value;
    setFormData({ ...formData, [name]: newValue });
  };

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
      setLoading(true);
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
        showSnackbar("تمت إضافة الموقع بنجاح.", "success");
      } catch (error) {
        showSnackbar("خطأ في إضافة الموقع.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      showSnackbar("يجب ملء جميع الحقول بشكل صحيح.", "error");
    }
  };

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

  const handleDeleteLocation = async (id) => {
    setLoading(true);
    try {
      await deleteLocation(id);
      const updatedLocations = await fetchLocations();
      setLocations(updatedLocations);
      showSnackbar("تم حذف الموقع بنجاح.", "success");
    } catch (error) {
      showSnackbar("خطأ في حذف الموقع.", "error");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const handleDeleteDialogOpen = (id) => {
    setLocationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setLocationToDelete(null);
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
        onClick={() => window.location.reload()}
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
              {locations.map((location) => (
                <Marker
                  key={location._id}
                  position={{ lat: location.latitude, lng: location.longitude }}
                  onClick={() => handleMarkerClick(location)}
                />
              ))}
              {selectedLocation && (
                <InfoWindow
                  position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div>
                    <h3>{selectedLocation.name}</h3>
                    <p>{selectedLocation.address}</p>
                    <p>{selectedLocation.city}</p>
                  </div>
                </InfoWindow>
              )}
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "إضافة الموقع"}
        </Button>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ color: "#001F3F", marginBottom: "10px" }}>
        المواقع المسجلة
      </Typography>

      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "16px", textAlign: "right" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress />
          </Box>
        ) : locations.length > 0 ? (
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
              {locations.map((location) => (
                <tr key={location._id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.name}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.address}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.city}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.latitude}, {location.longitude}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.radius}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{location.createdAt}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <IconButton color="secondary" onClick={() => handleDeleteDialogOpen(location._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", color: "#999" }}>
            لا توجد مواقع مسجلة بعد.
          </Typography>
        )}
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد من حذف هذا الموقع؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            إلغاء
          </Button>
          <Button onClick={() => handleDeleteLocation(locationToDelete)} color="secondary">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Locations;