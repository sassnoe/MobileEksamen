import React, { useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FavoritesContext } from "./FavoritesContext";

const FavoritesScreen = () => {
  const { favorites, loadFavorites, removeFromFavorites } =
    useContext(FavoritesContext);

  // Reload favorites when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemove = (id) => {
    removeFromFavorites(id);
  };

  // Function to open Google Maps and navigate to the favorite location
  const handleNavigate = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps: ", err)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorites</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <View style={styles.favoriteTextContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.removeButton,
                  pressed && styles.removeButtonPressed,
                ]}
                onPress={() => handleRemove(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.navigateButton,
                  pressed && styles.navigateButtonPressed,
                ]}
                onPress={() => handleNavigate(item.latitude, item.longitude)} // Navigate to location
              >
                <Text style={styles.navigateButtonText}>Navigate</Text>
              </Pressable>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noFavorites}>No favorites added yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  favoriteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  favoriteTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    color: "#555",
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonPressed: {
    backgroundColor: "#e63939",
    opacity: 0.9,
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  navigateButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  navigateButtonPressed: {
    backgroundColor: "#388E3C",
    opacity: 0.9,
  },
  navigateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  noFavorites: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 32,
  },
});

export default FavoritesScreen;
