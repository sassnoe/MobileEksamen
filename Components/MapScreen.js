import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { API_KEY } from "../config.js";

// Firebase
import { collection, doc, setDoc } from "firebase/firestore"; // Firestore functions
import { firestore, auth } from "../firebase.js";

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
  const mapView = useRef(null);
  const locationSubscription = useRef(null);

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
          fetchParks(
            location.coords.latitude,
            location.coords.longitude,
            radius
          );
        }
      );
    }

    startListening();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
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
      const parks = response.data.results;
      const newMarkers = parks.map((park) => ({
        coordinate: {
          latitude: park.geometry.location.lat,
          longitude: park.geometry.location.lng,
        },
        key: park.place_id,
        title: park.name,
        description: park.vicinity,
      }));

      setMarkers(newMarkers);
    } catch (error) {
      console.error("Error fetching parks: ", error);
    }
  };

  const addToFavorites = async () => {
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
    const favoriteRef = doc(
      collection(firestore, "favorites"),
      userId,
      selectedMarker.key
    ); // Create a reference to the favorite

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
      <MapView
        ref={mapView}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
            title={marker.title}
            onPress={() => handleMarkerPress(marker)}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutDescription}>
                  {marker.description}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {selectedMarker && (
        <View style={styles.selectedParkContainer}>
          <Text style={styles.selectedParkText}>
            Selected: {selectedMarker.title}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.favoriteButton,
              pressed && styles.favoriteButtonPressed,
            ]}
            onPress={addToFavorites}
          >
            <Text style={styles.favoriteButtonText}>Add to Favorites</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.sliderContainer}>
        <Text style={styles.radiusText}>
          View distance: {(radius / 1000).toFixed(1)} km
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={10000}
          maximumValue={100000}
          step={5000}
          value={radius}
          onValueChange={(value) => setRadius(value)}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  selectedParkContainer: {
    position: "absolute",
    bottom: 100, // Position above the slider
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedParkText: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  favoriteButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
    minWidth: 130,
    alignItems: "center",
  },
  favoriteButtonPressed: {
    backgroundColor: "#45a049",
    opacity: 0.9,
  },
  favoriteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  sliderContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  slider: {
    width: "100%",
  },
  radiusText: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
  },
  calloutContainer: {
    padding: 12,
    minWidth: 200,
    backgroundColor: "white",
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  calloutDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default MapScreen;
