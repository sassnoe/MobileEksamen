import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { API_KEY } from "../config.js";
import { Picker } from "@react-native-picker/picker";
import { Menu, Button, Provider } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

// Firebase
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase.js";

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("park");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [region, setRegion] = useState({
    latitude: 55,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const [radius, setRadius] = useState(10000);
  const [isScanning, setIsScanning] = useState(false);
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
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (mapView.current) {
            mapView.current.animateToRegion(newRegion);
          }
          fetchPOIs(
            location.coords.latitude,
            location.coords.longitude,
            radius,
            selectedCategory
          );
        }
      );
    }

    startListening();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [radius, selectedCategory]);

    const fetchPOIs = async (latitude, longitude, radius, category) => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${category}&key=${API_KEY}`;
        const response = await axios.get(url);
        const places = response.data.results;
        const newMarkers = places.map((place) => ({
          coordinate: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
          key: place.place_id,
          title: place.name,
          description: place.vicinity,
          rating: place.rating,
          totalRatings: place.user_ratings_total,
        }));
        setMarkers(newMarkers);
      } catch (error) {
        console.error("Error fetching POIs:", error);
      }
    };

  const toggleScanning = () => {
    if (isScanning) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
      setIsScanning(false);
      alert("Scanning stopped.");
    } else {
      scanIntervalRef.current = setInterval(() => {
        if (region.latitude && region.longitude) {
          fetchPOIs(region.latitude, region.longitude, radius);
        }
      }, 300000);
      setIsScanning(true);
      alert("Scanning started.");
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
      firestore,
      "users",
      userId,
      "favorites",
      selectedMarker.key.toString()
    );

    try {
      await setDoc(favoriteRef, {
        latitude: selectedMarker.coordinate.latitude,
        longitude: selectedMarker.coordinate.longitude,
        title: selectedMarker.title,
        description: selectedMarker.description,
      });

      alert(`${selectedMarker.title} has been added to your favorites!`);
      setSelectedMarker(null);
    } catch (error) {
      alert("Error saving to favorites: " + error.message);
      console.error("Error adding favorite marker:", error);
    }
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button
                mode="outlined"
                onPress={openMenu}
                style={styles.menuButton}
              >
                {selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)}
                <FontAwesome
                  name="caret-down"
                  size={14}
                  color="#000"
                  style={styles.arrowIcon} // Added style for better positioning
                />
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setSelectedCategory("park");
                closeMenu();
              }}
              title="Parks"
            />
            <Menu.Item
              onPress={() => {
                setSelectedCategory("church");
                closeMenu();
              }}
              title="Churches"
            />
            <Menu.Item
              onPress={() => {
                setSelectedCategory("river");
                closeMenu();
              }}
              title="Rivers"
            />
            <Menu.Item
              onPress={() => {
                setSelectedCategory("forest");
                closeMenu();
              }}
              title="Forests"
            />
            <Menu.Item
              onPress={() => {
                setSelectedCategory("lake");
                closeMenu();
              }}
              title="Lakes"
            />
          </Menu>
        </View>
        <MapView
         
        ref={mapView}
         
        style={styles.map}
         
        region={region}
         
        onRegionChangeComplete={setRegion}
        
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
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
            minimumValue={1000}
            maximumValue={20000}
            step={1000}
            value={radius}
            onValueChange={(value) => setRadius(value)}
          />
        </View>

        <Pressable style={styles.scanButton} onPress={toggleScanning}>
          <Text style={styles.scanButtonText}>
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </Text>
        </Pressable>

        <StatusBar style="auto" />
      </View>
    </Provider>
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
    bottom: 100,
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
  scanButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  sliderContainer: {
    position: "absolute",
    bottom: 20, 
    left: 10,
    right: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    zIndex: 5, 
  },
  slider: {
    width: "100%",
  },
  menuContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  menuButton: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  arrowIcon: {
    marginLeft: 8,
  },
});

export default MapScreen;
