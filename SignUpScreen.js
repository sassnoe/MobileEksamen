// React
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

// Styles
import styles from "./SignUpScreenStyles";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    setErrorMessage(""); // Reset error message
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6 || password.length > 20) {
      setErrorMessage("Password must be between 6 and 20 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "User registered successfully");
      navigation.navigate("Home");
    } catch (error) {
      // Map Firebase errors to user-friendly messages
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("This email is already in use. Please try another.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email address.");
          break;
        case "auth/weak-password":
          setErrorMessage("The password is too weak.");
          break;
        default:
          setErrorMessage("An unexpected error occurred. Please try again.");
          break;
      }
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Sign Up</Text>
      {errorMessage ? <Text style={{ color: "red", marginBottom: 16 }}>{errorMessage}</Text> : null}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.confirmPasswordInput} />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Already have an account? Log In" onPress={() => navigation.navigate("Login")} color="gray" />
    </View>
  );
};

export default SignUpScreen;
