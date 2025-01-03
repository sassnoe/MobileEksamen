import React, { createContext, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Add a favorite location
  const addToFavorites = async (location) => {
    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, "favorites"), location);
      console.log("Document written with ID: ", docRef.id);

      // Update local state
      setFavorites([...favorites, { ...location, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Load favorites from Firestore
  const loadFavorites = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "favorites"));
      const loadedFavorites = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFavorites(loadedFavorites);
    } catch (error) {
      console.error("Error loading favorites: ", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, loadFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
