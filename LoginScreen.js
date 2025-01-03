import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

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
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16, textAlign: "center" }}>POIFinder</Text>
      <Image source={require("./assets/POI.jpg")} style={{ height: 300, width: 400, alignSelf: "center", marginBottom: 16 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 8, padding: 8, borderWidth: 1, borderRadius: 4 }} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          marginBottom: 16,
          padding: 8,
          borderWidth: 1,
          borderRadius: 4,
        }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} color="green" />
    </View>
  );
};

export default LoginScreen;
