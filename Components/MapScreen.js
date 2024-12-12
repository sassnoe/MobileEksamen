import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { API_KEY } from "../config.js";
import { database } from "../firebase.js";
import { Button } from "react-native-web";

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 55,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  const [radius, setRadius] = useState(50000); // Default radius 50km

  const mapView = useRef(null);
  const locationSubscribtion = useRef(null);

  useEffect(() => {
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status != "granted") {
        alert("No access to location");
        return;
      }
      locationSubscribtion.current = await Location.watchPositionAsync(
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
          console.log("Fetching parks for location:", location.coords.latitude, location.coords.longitude);
          fetchParks(location.coords.latitude, location.coords.longitude, radius);
        }
      );
    }

    startListening();
    return () => {
      if (locationSubscribtion.current) {
        locationSubscribtion.current.remove();
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
      console.log("Parks fetched:", parks);
      const newMarkers = parks.map((park) => ({
        coordinate: {
          latitude: park.geometry.location.lat,
          longitude: park.geometry.location.lng,
        },
        key: park.place_id,
        title: park.name,
        description: park.vicinity,
      }));
      console.log("Markers created:", newMarkers);
      setMarkers(newMarkers);
    } catch (error) {
      console.error("Error fetching parks: ", error);
    }
  };

  const addToFavorites = async (userId, placeId, placeDetails) => {
    try {
      await database.ref(`users/${userId}/favorites`).push({
        placeId: placeId,
        name: placeDetails.name,
        type: placeDetails.types[0], // Hovedkategori
        location: placeDetails.geometry.location, // Koordinater
      });
      console.log("Location added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
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
              description={marker.description}
            >
              <Callout>
                <Text>{marker.title}</Text>
                <Text>{marker.description}</Text>
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
        position: 'absolute',
        bottom: 20, // Adjust this value to give some room at the bottom
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    slider: {
        width: '100%',
    },
    radiusText: {
        marginBottom: 10,
        fontSize: 16,
    }
});

export default MapScreen;
