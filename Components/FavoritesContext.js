// React
import React, { createContext, useState, useEffect } from "react";

// Firebase
import { collection, doc, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase.js";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

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
  const removeFromFavorites = async (id) => {
    const userId = getUserId();
    if (!userId) {
      console.error("No user is logged in.");
      return;
    }

    try {
      const docRef = doc(firestore, "users", userId, "favorites", id);

      await deleteDoc(docRef);

      setFavorites(favorites.filter((favorite) => favorite.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing favorite: ", error);
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
    loadFavorites();
  }, []);

  return <FavoritesContext.Provider value={{ favorites, addToFavorites, loadFavorites, removeFromFavorites }}>{children}</FavoritesContext.Provider>;
};
