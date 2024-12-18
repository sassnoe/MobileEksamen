import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { API_KEY } from "../config.js";

// Firebase
import { database, auth } from "../firebase.js";
import { ref, set } from "firebase/database";

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
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
      console.log("Fetched parks data:", parks);

      const newMarkers = parks.map((park) => {
        console.log("Processing park:", park.name);
        return {
          coordinate: {
            latitude: park.geometry.location.lat,
            longitude: park.geometry.location.lng,
          },
          key: park.place_id,
          title: park.name,
          description: park.vicinity,
        };
      });

      console.log("New markers created:", newMarkers);
      setMarkers(newMarkers);
    } catch (error) {
      console.error("Error fetching parks: ", error);
    }
  };

  const addToFavorites = (marker) => {
    const user = auth.currentUser;

    if (!user) {
      alert("You need to be logged in to save favorites.");
      return;
    }

    const userId = user.uid;
    const favoriteRef = ref(database, `favorites/${userId}/${marker.key}`);

    set(favoriteRef, {
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      title: marker.title,
      description: marker.description,
    })
      .then(() => {
        alert(`${marker.title} has been added to your favorites!`);
      })
      .catch((error) => {
        alert("Error saving to favorites: " + error.message);
        console.error("Error adding favorite marker:", error);
      });
  };

  const handleMarkerPress = (marker) => {
    console.log("Marker pressed:", {
      title: marker.title,
      description: marker.description,
      coordinate: marker.coordinate,
      key: marker.key,
    });
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
                <Pressable
                  style={({ pressed }) => [
                    styles.favoriteButton,
                    pressed && styles.favoriteButtonPressed,
                  ]}
                  onPress={() => addToFavorites(marker)}
                >
                  <Text style={styles.favoriteButtonText}>
                    Add to Favorites
                  </Text>
                </Pressable>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

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
    minWidth: 150,
    maxWidth: 250,
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
    marginBottom: 10,
    color: "#666",
  },
  favoriteButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
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
});

export default MapScreen;
