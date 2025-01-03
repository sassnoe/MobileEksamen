// React
import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Slider from "@react-native-community/slider";

// Expo
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";

// Axios
import axios from "axios";

import { API_KEY } from "../config.js";

// Firebase
import { doc, setDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase.js";

// Styles
import styles from "../ComponentStyling/MapScreenStyles.js";

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [region, setRegion] = useState({
    latitude: 55,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  const [radius, setRadius] = useState(50000);
  const [isScanning, setIsScanning] = useState(false); // New state for scanning toggle
  const mapView = useRef(null);
  const locationSubscription = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("No access to location");
        return;
      }
      locationSubscription.current = await Location.watchPositionAsync(
        {
          distanceInterval: 100,
          accuracy: Location.Accuracy.High,
        },
        (location) => {
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setRegion(newRegion);
          if (mapView.current) {
            mapView.current.animateToRegion(newRegion);
          }
          fetchParks(location.coords.latitude, location.coords.longitude, radius);
        }
      );
    }

    startListening();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current); // Clear scan interval on unmount
      }
    };
  }, [radius]);

  const fetchParks = async (latitude, longitude, radius) => {
    if (radius < 10000) {
      console.log("Radius too low, not fetching parks.");
      return;
    }
    const type = "park";
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      console.log("Fetched parks response:", response.data.results);

      const parks = response.data.results;
      console.log("Parks:", parks);

      const newMarkers = parks.map((park) => ({
        coordinate: {
          latitude: park.geometry.location.lat,
          longitude: park.geometry.location.lng,
        },
        key: park.place_id,
        title: park.name,
        description: park.vicinity,
        rating: park.rating,
        totalRatings: park.user_ratings_total,
      }));

      setMarkers(newMarkers);
    } catch (error) {
      console.error("Error fetching parks: ", error);
    }
  };

  const toggleScanning = () => {
    if (isScanning) {
      // Stop scanning
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
      setIsScanning(false);
      alert("Scanning stopped.");
    } else {
      // Start scanning
      scanIntervalRef.current = setInterval(() => {
        if (region.latitude && region.longitude) {
          fetchParks(region.latitude, region.longitude, radius);
        }
      }, 300000); // 5 minutes
      setIsScanning(true);
      alert("Scanning started. Parks will refresh every 5 minutes.");
    }
  };
  const addToFavorites = async () => {
    console.log("Adding to favorites:", selectedMarker);

    if (!selectedMarker) {
      alert("Please select a park first");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert("You need to be logged in to save favorites.");
      return;
    }

    const userId = user.uid;
    const favoriteRef = doc(firestore, "users", userId, "favorites", selectedMarker.key.toString()); // Create a reference to the favorite

    try {
      await setDoc(favoriteRef, {
        latitude: selectedMarker.coordinate.latitude,
        longitude: selectedMarker.coordinate.longitude,
        title: selectedMarker.title,
        description: selectedMarker.description,
      });

      alert(`${selectedMarker.title} has been added to your favorites!`);
      setSelectedMarker(null); // Reset selection after adding
    } catch (error) {
      alert("Error saving to favorites: " + error.message);
      console.error("Error adding favorite marker:", error);
    }
  };
  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    console.log("Selected marker:", marker.title);
  };

  return (
    <View style={styles.container}>
      <MapView ref={mapView} style={styles.map} region={region} onRegionChangeComplete={setRegion}>
        {markers.map((marker) => (
          <Marker key={marker.key} coordinate={marker.coordinate} title={marker.title} onPress={() => handleMarkerPress(marker)}>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutDescription}>{marker.description}</Text>
                <Text>
                  {marker.rating} stars ({marker.totalRatings})
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {selectedMarker && (
        <View style={styles.selectedParkContainer}>
          <Text style={styles.selectedParkText}>Selected: {selectedMarker.title}</Text>
          <Pressable style={({ pressed }) => [styles.favoriteButton, pressed && styles.favoriteButtonPressed]} onPress={addToFavorites}>
            <Text style={styles.favoriteButtonText}>Add to Favorites</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.sliderContainer}>
        <Text style={styles.radiusText}>View distance: {(radius / 1000).toFixed(1)} km</Text>
        <Slider style={styles.slider} minimumValue={10000} maximumValue={100000} step={5000} value={radius} onValueChange={(value) => setRadius(value)} />
      </View>

      <Pressable style={styles.scanButton} onPress={toggleScanning}>
        <Text style={styles.scanButtonText}>{isScanning ? "Stop Scanning" : "Start Scanning"}</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
};

export default MapScreen;
