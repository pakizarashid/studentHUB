import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useData } from "../contexts/DataContext";

const MenuContainer = ({userData}) => {
  const navigation = useNavigation();

  const data = [
    {
      id: "1",
      name: "Profile",
      icon: "account-cog-outline",
      action: "Profile",
    },
    {
      id: "2",
      name: "Timetable",
      icon: "timetable",
      action: "TimeTable",
    },
    { id: "3", name: "Attendace", icon: "checkbook", action: "Attendance" },
    {
      id: "4",
      name: "Course Outline",
      icon: "account-details-outline",
      action: "Courses",
    },
    {
      id: "5",
      name: "Assignment",
      icon: "book-open-variant",
      action: "Assignment",
    },
    {
      id: "6",
      name: "Academics",
      icon: "book-education-outline",
      action: "Academics",
    },
    {
      id: "7",
      name: "Enroll in course",
      icon: "book-alert-outline",
      action: "Enrollment",
    },
    {
      id: "8",
      name: "Fee",
      icon: "credit-card-search-outline",
      action: "Fee",
    },
    {
      id: "9",
      name: "QEC Ranking",
      icon: "star-outline",
      action: "Qec",
    },
    {
      id: "10",
      name: "Staff directory",
      icon: "contacts-outline",
      action: "Staff",
    },
    {
      id: "11",
      name: "Financial Aid",
      icon: "cash-register",
      action: "Aid",
    },
    {
      id: "12",
      name: "Library",
      icon: "bookshelf",
      action: "Library",
    },
    {
      id: "13",
      name: "Schedule",
      icon: "calendar-month-outline",
      action: "Schedule",
    },
    {
      id: "14",
      name: "Map",
      icon: "map-search-outline",
      action: "Location",
    },
    {
      id: "15",
      name: "Emergency info",
      icon: "alert-circle-outline",
      action: "Help",
    },
    {
      id: "16",
      name: "more",
      icon: "dots-vertical",
      action: "News",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItemContainer}
      onPress={() => {
        navigation.navigate(item.action, {userData});
      }}
    >
      <View style={styles.iconContainer}>
        <Icon source={item.icon} size={30} color="#0A4081" />
      </View>
      <Text style={styles.menuItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      numColumns={4} // Display four items in each row
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

export default function MenuScreen() {
  const { userData } = useData();

  return (
    <View style={styles.container}>
      <MenuContainer userData={userData}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: "20%",
    marginHorizontal: "2%",
    // padding: 20,
  },
  flatListContainer: {
    alignItems: "center", // Center items horizontally
  },
  menuItemContainer: {
    alignItems: "center",
    margin: 10,
    width: "20%",
  },
  iconContainer: {
    backgroundColor: "rgba(10,64,129,0.12)",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    color: "#0A4081",
    marginTop: 5,
    textAlign: "center", // Center text horizontally
    // flexWrap: 'wrap',
  },
});
