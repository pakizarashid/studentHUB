import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView
import { useNavigation } from "@react-navigation/native";
import { setStyles } from "./styles";

const windowHeight = Dimensions.get("window").height;

const NewsContainer = ({ item, onPress, onDelete }) => {
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteContainer}
      onPress={() => onDelete(item.id)}
    >
      <Text style={styles.deleteText}>Dismiss</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={[styles.container, styles.newsContainer]}
        onPress={() => onPress(item.goTo)}
      >
        <View style={styles.newsPhotoView}>
          <Image source={item.newsPhoto} style={styles.newsPhoto} />
        </View>
        <View style={styles.newsTextContainer}>
          <Text style={styles.newsTitle}>{item.newsTitle}</Text>
          <Text style={styles.newsDescription}>{item.newsDescription}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default function NotifiScreen() {
  const navigation = useNavigation();
  const [newsList, setNewsList] = useState([
    {
      id: "1",
      newsTitle: "Welcome to Student-Hub",
      newsDescription: "Hope you are enjoying the app and All the best",
      goTo: "Welcome",
      newsPhoto: require("../../assets/adaptive-icon.png"),
    },
    {
      id: "2",
      newsTitle: "Notification 1",
      newsDescription: "Description of notification 1",
      goTo: "Notes",
      newsPhoto: require("../../assets/icon.png"),
    },
    {
      id: "3",
      newsTitle: "Notification 2",
      newsDescription: "Description of notification 2",
      goTo: "Notes",
      newsPhoto: require("../../assets/icon.png"),
    },
  ]);

  const handleDelete = (id) => {
    console.log("Deleting item with id:", id);
    setNewsList(newsList.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <NewsContainer
      item={item}
      onPress={(route) => navigation.navigate(route)}
      onDelete={handleDelete}
    />
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={[setStyles.context, styles.context]}>
        <Text style={[setStyles.title, styles.title]}> Focus Please!! </Text>
        <FlatList
          data={newsList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  context: {
    marginTop: windowHeight * 0.02,
    marginHorizontal: 0,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginVertical: "2%",
  },
  container: {
    backgroundColor: "rgba(10,64,129,0.12)",
    borderRadius: 20,
  },
  newsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: "2.5%",
    marginHorizontal: "4%",
  },
  newsPhotoView: {
    overflow: "hidden",
    borderRadius: 20,
    width: "40%",
  },
  newsPhoto: {
    width: "100%",
    height: 120,
  },
  newsTextContainer: { width: "60%", marginLeft: 15 },
  newsTitle: { fontWeight: "bold", color: "#0A4081" },
  newsDescription: { marginRight: 30 },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
  },
  deleteText: {
    color: "#0A4081",
    fontWeight: "bold",
  },
});
