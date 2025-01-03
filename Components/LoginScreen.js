// React
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Image } from "react-native";

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

// Styles
import styles from "../ComponentStyling/LoginScreenStyles";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POIFinder</Text>
      <Image source={require("../assets/POI.jpg")} style={styles.image} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.passwordInput} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} color="green" />
    </View>
  );
};

export default LoginScreen;
