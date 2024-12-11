import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function MapScreen() {
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (location) => {
    setFavorites([...favorites, location]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Screen</Text>
      {/* TODO: needs map marker/location to finish functionality */}
      <Button
        title="Add to Favorites"
        onPress={() => addToFavorites({ latitude: 0, longitude: 0 })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
