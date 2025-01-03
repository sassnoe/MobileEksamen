// React, expo, axios
import { useState, useRef, useEffect } from "react";
import { Text, View } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import axios from "axios";

// Firebase
import { API_KEY } from "./config.js";

// Styles
import styles from "./MapStyles";

const Map = () => {
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

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} ref={mapView}>
        {markers.map((marker) => (
          <Marker coordinate={marker.coordinate} key={marker.key} title={marker.title} description={marker.description}>
            <Callout>
              <View>
                <Text>{marker.title}</Text>
                <Text>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={5000}
          maximumValue={150000}
          step={1000}
          value={radius}
          onValueChange={(value) => setRadius(value)}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
          thumbTintColor="#000000"
        />
        <Text style={styles.sliderText}>Radius: {radius / 1000} km</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default Map;
