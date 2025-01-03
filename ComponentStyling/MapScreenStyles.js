import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  selectedParkContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedParkText: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  favoriteButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
    minWidth: 130,
    alignItems: "center",
  },
  favoriteButtonPressed: {
    backgroundColor: "#45a049",
    opacity: 0.9,
  },
  favoriteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  sliderContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  slider: {
    width: "100%",
  },
  radiusText: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
  },
  calloutContainer: {
    padding: 12,
    minWidth: 200,
    backgroundColor: "white",
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  calloutDescription: {
    fontSize: 14,
    color: "#666",
  },
  scanButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  sliderContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    zIndex: 5,
  },
  slider: {
    width: "100%",
  },
  menuContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "white",
    zIndex: 1,
    padding: 0,
    borderRadius: 0, // Remove border radius to make the button square
  },
  menuButton: {
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 0, // Remove border radius to make the button square
  },
  arrowIcon: {
    marginLeft: 5,
  },
});

export default styles;
