import React, { useEffect, useRef } from "react";
import { Animated, View, Dimensions, Easing, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "./HomeScreen"
const SplashScreen = () => {
  // SafeArea Value...
  const edges = useSafeAreaInsets();

  const startAnimation = useRef(new Animated.Value(0)).current;
  const scaleLogo = useRef(new Animated.Value(1)).current;
  const scaleTitle = useRef(new Animated.Value(1)).current;
  const moveLogo = useRef(new Animated.ValueXY()).current;
  const moveTitle = useRef(new Animated.ValueXY()).current;

  // Animating COntent...
  const contentTransition = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(startAnimation, {
          toValue: -Dimensions.get("window").height + (edges.top + 75),
          useNativeDriver: true,
          duration: 800,
          easing: Easing.bezier(0.42, 0, 0.58, 1),
        }),
        Animated.timing(scaleLogo, {
          toValue: 0.3,
          useNativeDriver: true,
        }),
        Animated.timing(scaleTitle, {
          toValue: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(moveLogo, {
          toValue: {
            x: Dimensions.get("window").width / 2 - 55,
            y: Dimensions.get("window").height / 2 - 5,
          },
          useNativeDriver: true,
        }),
        Animated.timing(moveTitle, {
          toValue: {
            x: -Dimensions.get("window").width / 2 + 130,
            y: Dimensions.get("window").height / 2 - 90,
          },
          useNativeDriver: true,
        }),
        ,
        Animated.timing(contentTransition, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        // position: "absolute",
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0,
      }}
    >
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: startAnimation }] },
        ]}
      >
        <Animated.View style={styles.contentContainer}>
          <Animated.Image
            source={require("../../assets/ico.png")}
            style={[
              styles.image,
              {
                transform: [
                  { translateX: moveLogo.x },
                  { translateY: moveLogo.y },
                  { scale: scaleLogo },
                ],
              },
            ]}
          />
          <Animated.Text
            style={[
              styles.text,
              {
                transform: [
                  { translateX: moveTitle.x },
                  { translateY: moveTitle.y },
                  { scale: scaleTitle },
                ],
              },
            ]}
          >
            STUDENT HUB
          </Animated.Text>
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={[
          styles.overlay,
          { transform: [{ translateY: contentTransition }] },
        ]}
      >
        <HomeScreen />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A4081",
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.27,
  },
  text: {
    fontSize: Dimensions.get("window").width * 0.1,
    fontWeight: "bold",
    color: "#FEFEFE",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.04)",
    zIndex: 0,
  },
});

export default SplashScreen;
