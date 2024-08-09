import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-paper";
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
        style={[setStyles.selectedAccordion, styles.newsContainer]}
        onPress={() => onPress(item.goTo)}
      >
        <View style={styles.iconContainer}>
          <Icon source="bell-ring-outline" size={30} color="#0A4081" />
        </View>
        <View style={styles.newsTextContainer}>
          <Text style={styles.newsTitle}>{item.newsTitle}</Text>
          <Text style={{ marginRight: 20 }}>{item.newsDescription}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default function ReminderScreen() {
  const navigation = useNavigation();
  const [newsList, setNewsList] = useState([
    {
      id: "1",
      newsTitle: "Notification 1",
      newsDescription: "Description of notification 1",
      goTo: "Notes",
    },
    {
      id: "2",
      newsTitle: "Notification 2",
      newsDescription: "Description of notification 2",
      goTo: "Notes",
    },
  ]);

  const handleDelete = (id) => {
    console.log("Deleting item with id:", id);
    setNewsList(newsList.filter(item => item.id !== id));
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
        <Text style={[setStyles.title, styles.title]}> Remind That!! </Text>
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
    marginTop: -windowHeight * 0.03,
    marginHorizontal: 0
    // marginTop: "0.1%",
  },
  title: {
    textAlign:"center",
    fontSize: 24,
    marginVertical: "2%"
  },
  newsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: "3%",
    marginHorizontal: "4%",
    minHeight: 90
  },
  iconContainer: {
    width: "10%",
    marginLeft: 20,
  },
  newsTextContainer: {
    width: "80%",
    marginHorizontal: 20,
  },
  newsTitle: {
    fontWeight: "bold",
    color: "#0A4081",
  },
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

