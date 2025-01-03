const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  sliderContainer: {
    position: "absolute",
    left: 10,
    top: "30%",
    alignItems: "center",
  },
  slider: {
    width: 200,
    height: 40,
    transform: [{ rotate: "270deg" }], // Rotate the slider to make it vertical
  },
  sliderText: {
    color: "#000000",
    marginTop: 10,
  },
});

export default styles;
