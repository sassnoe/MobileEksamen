import * as React from "react";
import { useState, useContext } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-web";
import { FavoritesContext } from "./FavoritesContext";

export default function MapScreen() {
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (location) => {
    setFavorites([...favorites, location]);
  };

  return (
    <View>
      <Text>Map Screen</Text>
      {/* TODO: needs map marker/location to finish functionality */}
      <Button title="Add to Favorites" onPress={() => addToFavorites({ latitude: 0, longitude: 0 })} />
    </View>
  );
}
