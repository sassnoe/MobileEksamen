import React, { createContext, useState, useEffect } from "react";
import { collection, doc, addDoc, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebase.js"; // Ensure you import auth for currentUser

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Get the currently logged-in user's ID
  const getUserId = () => {
    const user = auth.currentUser;
    return user.uid;
  };

  // Add a favorite location
  const addToFavorites = async (location) => {
    const userId = getUserId();
    if (!userId) {
      alert("You need to be logged in to save favorites.");
      return;
    }

    try {
      // Save to the user's favorites subcollection
      const userRef = doc(firestore, "users", userId);
      const favoritesRef = collection(userRef, "favorites");
      const docRef = await addDoc(favoritesRef, location);

      console.log("Document written with ID: ", docRef.id);

      // Update local state
      setFavorites([...favorites, { ...location, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Load favorites from Firestore
  const loadFavorites = async () => {
    const userId = getUserId();
    if (!userId) {
      console.error("No user is logged in.");
      return;
    }

    try {
      const userRef = doc(firestore, "users", userId);
      const favoritesRef = collection(userRef, "favorites");
      const querySnapshot = await getDocs(favoritesRef);
      const loadedFavorites = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFavorites(loadedFavorites);
    } catch (error) {
      console.error("Error loading favorites: ", error);
    }
  };

  useEffect(() => {
    loadFavorites(); // Automatically load favorites when the provider mounts
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, loadFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
