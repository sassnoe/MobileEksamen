import React, { createContext, useState } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (location) => {
    setFavorites([...favorites, location]);
  };

  return <FavoritesContext.Provider value={{ favorites, addToFavorites }}>{children}</FavoritesContext.Provider>;
};
