import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    // DK koordinater så det bliver vist først
    latitude: 55,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  const mapView = useRef(null);
  const locationSubscribtion = useRef(null);

  useEffect(() => {
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status != "granted") {
        alert("ingen adgang til lokation");
        return;
      }
      locationSubscribtion.current = await Location.watchPositionAsync(
        {
          distanceInterval: 100,
          accuracy: Location.Accuracy.High,
        },
        (lokation) => {
          const newRegion = {
            latitude: lokation.coords.latitude,
            longitude: lokation.coords.longitude,
            latitudeDelta: 20,
            longitudeDelta: 20,
          };
          setRegion(newRegion);
          if (mapView.current) {
            mapView.current.animateToRegion(region);
          }
        }
      );
    }
    startListening();
    return () => {
      if (locationSubscribtion.current) {
        locationSubscribtion.current.remove();
      }
    };
  }, []);

  function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
    const newMarker = {
      coordinate: { latitude, longitude },
      key: data.timeStamp,
      title: "Copenhagen",
    };
    setMarkers([...markers, newMarker]);
    saveMarkerToFirestore(newMarker);
  }

//   const saveMarkerToFirestore = async (marker) => {
//     try {
//       const db = firebase.firestore();
//       await db.collection("markers").add(marker);
//     } catch (error) {
//       console.error("Error adding marker: ", error);
//     }
//   };


return (
 
 <View style={styles.container}>
      <MapView style={styles.map} region={region} onLongPress={addMarker}>
        {markers.map((marker) => (
          <Marker
            coordinate={marker.coordinate}
            key={marker.key}
            title={marker.title}
          />
        ))}
      </MapView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;