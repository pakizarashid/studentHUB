import React from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { Card, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { setStyles, setTheme } from "../components/styles";

const IDCard = ({ title, source }) => (
  <View style={styles.container}>
    <Text style={[setStyles.title, styles.title]}>{title}</Text>
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.horizontalContent}
    >
      <Card mode="outlined" style={styles.card}>
        <Card.Cover source={source} style={styles.cover} />
      </Card>
    </ScrollView>
  </View>
);

export default function IDScreen() {
  return (
    <ScrollView>
    <SafeAreaView style={setStyles.context}>
      <PaperProvider theme={setTheme}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <IDCard
            title="Front Student ID"
            source={require("../../assets/images/frontID1.jpg")}
          />
          <IDCard
            title="Back Student ID"
            source={require("../../assets/images/backID.jpg")}
          />
        </ScrollView>
      </PaperProvider>
    </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  card: {
     marginHorizontal: 10,
    marginVertical: 20,
    minWidth: "90%",
  },
  cover: {
    margin: 4,
    backgroundColor: "transparent",
    // padding: 10,
    borderRadius: 5,
  },
  horizontalScroll: {
    flexDirection: "row",
  },
  horizontalContent: {
    minWidth: "100%", // Ensure content takes up full width
    paddingHorizontal: 10, // Adjust as needed
  },
});
