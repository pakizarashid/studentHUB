import { StyleSheet, Dimensions } from "react-native";
import { DefaultTheme } from "react-native-paper";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const setTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0A4081",
    secondaryContainer: "rgba(10,64,129,0.12)",
    surface: "white",
    outline: "#0A4081",
    elevation: {
      level3: "rgba(10,64,129,0.12)",
      level5: "rgb(10,64,129)",
    },
    backdrop: "transparent",
    background: "white",
  },
};

export const setStyles = StyleSheet.create({
  context: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10,
  },
  title: {
    color: "#0A4081",
    fontWeight: "bold",
  },
  subTitle: {
    color: "#0A4081",
    marginBottom: 5,
    textAlign: "center",
  },
  button: {
    margin: 3,
    marginHorizontal: 0,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 13,
  },
  selectedAccordion: {
    backgroundColor: "rgba(10,64,129,0.12)",
    borderRadius: windowHeight * 0.05,
    marginBottom: 5,
  },
});
