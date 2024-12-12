import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";
import SignUpScreen from "./SignUpScreen";
import MapScreen from "./Components/MapScreen";
import ReviewScreen from "./Components/ReviewScreen";
import UserScreen from "./Components/UserScreen";
import { FavoritesProvider } from "./Components/FavoritesContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Reviews") {
            iconName = focused ? "star" : "star-outline";
          } else if (route.name === "User") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Reviews" component={ReviewScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={MainTabs} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
