import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";
import SignUpScreen from "./SignUpScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "./Components/MapScreen";
import ReviewScreen from "./Components/ReviewScreen";
import UserScreen from "./Components/UserScreen";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { FavoritesProvider } from "./Components/FavoritesContext";

const Stack = createStackNavigator();




const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
      <FavoritesProvider>
        <Tab.Navigator>
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Reviews" component={ReviewScreen} />
          <Tab.Screen name="User" component={UserScreen} />
        </Tab.Navigator>
      </FavoritesProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
