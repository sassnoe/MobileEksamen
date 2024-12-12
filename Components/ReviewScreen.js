// ./Components/ReviewScreen.js

import React, { useContext } from "react";
import { View, Text } from "react-native";
import { FavoritesContext } from "./FavoritesContext";

export default function ReviewScreen() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <View>
      <Text>Favorites List:</Text>
      {favorites.map((location, index) => (
        <Text key={index}>
          Location {index + 1}: {location.latitude}, {location.longitude}
        </Text>
      ))}
    </View>
  );
}
