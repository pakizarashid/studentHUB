import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ActionButton = ({ icon, text, onPress, isHighlighted }) => {
  const buttonStyles = isHighlighted
    ? [
        styles.highlightedButton,
        styles.actionButtonContainer,
        { marginTop: -30 },
      ]
    : styles.actionButtonContainer;

  const textStyles = isHighlighted
    ? styles.highlightedText
    : { color: "#ffffff" };

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles}>
      <Appbar.Action color="#ffffff" icon={icon} />
      <Text style={{ color: "#ffffff" }}>{text}</Text>
    </TouchableOpacity>
  );
};

export default function BottomMenuScreen() {
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <Appbar
      style={[
        styles.bottom,
        {
          height: 100 + bottom,
        },
      ]}
      safeAreaInsets={{ bottom }}
    >
      <View style={styles.buttonContainer}>
        <ActionButton
          text="Support"
          icon="content-paste"
          onPress={() => {
            navigation.navigate("Support");
          }}
        />
        <ActionButton
          text="Schedule"
          icon="calendar-month-outline"
          onPress={() => {
            navigation.navigate("Schedule");
          }}
        />
        <View style={styles.highlightedView}>
          <ActionButton
            // text="News"
            icon="sphere"
            onPress={() => {
              navigation.navigate("News");
            }}
            isHighlighted={true}
          />
          <Text style={styles.highlightedText}>News</Text>
        </View>
        <ActionButton
          text="Map"
          icon="map-marker-circle"
          onPress={() => {
            navigation.navigate("Location");
          }}
        />
        <ActionButton
          text="Help"
          icon="help-circle-outline"
          onPress={() => {
            navigation.navigate("Help");
          }}
        />
      </View>
    </Appbar>
  );
}

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: "#0A4081",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  actionButtonContainer: {
    alignItems: "center",
  },
  highlightedView: {
    flexDirection: "column",
    alignItems: "center",
  },
  highlightedButton: {
    borderColor: "#ffffff",
    backgroundColor: "#0A4081",
    borderWidth: 3,
    borderRadius: 50, // Adjust the border radius as needed
    paddingHorizontal: 5,
    paddingVertical: 0,
    height: 60,
  },
  highlightedText: {
    fontWeight: "bold", // Optionally add bold text for emphasis
    color: "white",
    fontSize: 16,
    marginVertical: 7,
  },
});
