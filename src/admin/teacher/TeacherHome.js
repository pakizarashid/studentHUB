import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useData } from "../../contexts/DataContext";

const DashboardContainer = ({ userData }) => {
  const navigation = useNavigation();

  const data = [
    {
      id: "1",
      name: "Profile",
      icon: "account-details-outline",
      action: "TProfile",
    },
    {
      id: "2",
      name: "Classes",
      icon: "account-group-outline",
      action: "TClasses",
    },
    {
      id: "3",
      name: "Courses",
      icon: "book",
      action: "TCourses",
    },
  ]

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.container, styles.DashboardContainer]}
      onPress={() => {
        navigation.navigate(item.action, { userData });
      }}
    >
      <Icon source={item.icon} size={50} color="#0A4081" />
      <Text style={{ color: "#0A4081", marginTop: 5 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ marginStart: 15 }}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default function HomeMenu({ userData }) {
  const navigation = useNavigation();
  const studentId = Object.keys(userData)[0];
  const studentName = userData[studentId].name;

  return (
    <View style={{ flex: 1 }}>
      {/* <ScrollView style={{ paddingBottom: 50 }}> */}
      <View style={styles.greetingContainer}>
        <Text style={styles.title}>WELCOME, Prof {studentName || "Guest"}</Text>
      </View>
      <DashboardContainer />
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(10,64,129,0.12)",
    borderRadius: 20,
    alignItems: "center",
  },
  greetingContainer: {
    marginBottom: 10,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  DashboardContainer: {
    justifyContent: "center",
    width: 110,
    height: 140,
    marginEnd: 10,
  },
  newsContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: "row",
  },
  title: {
    color: "#0A4081",
    fontSize: 22,
    fontWeight: "bold",
  },
  subTile: { fontSize: 14, fontStyle: "italic", color: "grey" },
  newsTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginHorizontal: 20,
  },
});
