// React
import React, { useContext, useCallback } from "react";
import { View, Text, FlatList, Pressable, Linking } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { FavoritesContext } from "./FavoritesContext";

// Styles
import styles from "../ComponentStyling/FavoritesScreenStyles";

const FavoritesScreen = () => {
  const { favorites, loadFavorites, removeFromFavorites } = useContext(FavoritesContext);

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
    Linking.openURL(url).catch((err) => console.error("Error opening Google Maps: ", err));
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
              <Pressable style={({ pressed }) => [styles.removeButton, pressed && styles.removeButtonPressed]} onPress={() => handleRemove(item.id)}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.navigateButton, pressed && styles.navigateButtonPressed]}
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

export default FavoritesScreen;
