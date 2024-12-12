import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";

export default function UserScreen() {
  const userProfile = {
    name: "John Doe",
    avatar: require("../assets/avatar.png"),
  };

  const savedLocations = [
    { id: "1", name: "Saved Location 1" },
    { id: "2", name: "Saved Location 2" },
    // Add more saved locations
  ];

  const reviewedLocations = [
    { id: "1", name: "Reviewed Location 1" },
    { id: "2", name: "Reviewed Location 2" },
    // Add more reviewed locations
  ];

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleLocationPress(item)}>
      <Text style={styles.item}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleLocationPress = (location) => {
    // Handle navigation to location details
    console.log("Selected location:", location);
  };

  return (
    <View style={styles.container}>
      <Image source={userProfile.avatar} style={styles.avatar} />
      <Text style={styles.name}>{userProfile.name}</Text>

      <Text style={styles.sectionTitle}>Saved Locations</Text>
      <FlatList data={savedLocations} keyExtractor={(item) => item.id} renderItem={renderLocationItem} />

      <Text style={styles.sectionTitle}>Reviewed Locations</Text>
      <FlatList data={reviewedLocations} keyExtractor={(item) => item.id} renderItem={renderLocationItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  item: {
    padding: 10,
    fontSize: 16,
  },
});
