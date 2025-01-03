// React
import React, { useContext, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
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
