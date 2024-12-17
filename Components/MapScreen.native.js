import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { API_KEY } from "../config.js";
import { database } from "../firebase.js";
import { ref, set } from "firebase/database";

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
  const locationSubscription = useRef(null);

  useEffect(() => {
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 100,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setRegion((prevRegion) => ({
            ...prevRegion,
            latitude,
            longitude,
          }));
        }
      );
    }

    startListening();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const response = await axios.get(`https://api.example.com/markers?lat=${region.latitude}&lng=${region.longitude}&radius=${radius}&key=${API_KEY}`);
        setMarkers(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMarkers();
  }, [region, radius]);

  return (
    <View style={styles.container}>
      <MapView ref={mapView} style={styles.map} region={region} onRegionChangeComplete={setRegion}>
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}>
            <Callout>
              <Text>{marker.title}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.sliderContainer}>
        <Text style={styles.radiusText}>Radius: {radius / 1000} km</Text>
        <Slider style={styles.slider} minimumValue={1000} maximumValue={100000} step={1000} value={radius} onValueChange={setRadius} />
      </View>
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
  },
  slider: {
    width: "100%",
  },
  radiusText: {
    marginBottom: 10,
    fontSize: 16,
  },
});

export default MapScreen;
