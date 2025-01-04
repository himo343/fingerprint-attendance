// src/api/locationApi.js
const API_URL = "https://shrouded-harbor-25880-c6a9ab9411a9.herokuapp.com/api/locations";

// جلب جميع المواقع
export const fetchLocations = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

// إضافة موقع جديد
export const addLocation = async (locationData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(locationData),
    });
    if (!response.ok) {
      throw new Error("Failed to add location");
    }
    return response.json();
  } catch (error) {
    console.error("Error adding location:", error);
    throw error;
  }
};

// حذف موقع
export const deleteLocation = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete location");
    }
  } catch (error) {
    console.error("Error deleting location:", error);
    throw error;
  }
};