import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore"; // Import Firestore
import { firestore } from "../../util/firebaseConfig"; // Import firestore
import { setStyles } from "../../components/styles";

const windowHeight = Dimensions.get("window").height;

const NewsContainer = ({ item, classIds }) => {

  const navigation = useNavigation();
  const translateX = useSharedValue(0);

  const handleGestureEvent = (event) => {
    translateX.value = event.nativeEvent.translationX;
  };

  const handleEnd = () => {
    if (translateX.value > 100) {
      navigation.navigate("TChat", { classId: item.id }); // Pass class list and class ID
    }
    translateX.value = 0;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <TouchableOpacity
      style={[setStyles.selectedAccordion, styles.newsContainer]}
      activeOpacity={1}
    >
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onEnded={handleEnd}
      >
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <Image
            source={item.newsPhoto}
            style={styles.newsPhoto}
          />
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.newsTextContainer}>
        <Text style={styles.newsTitle}>{item.newsTitle}</Text>
        <Text style={styles.newsDescription}>{item.newsDescription}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function TMessages({userData}) {
  const navigation = useNavigation();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (!userData) {
      console.log("No user data provided");
      return;
    }

    const fetchClasses = async () => {
      try {
        const teacherId = Object.keys(userData)[0];
        const teacherData = userData[teacherId];
        const classList = teacherData.classes_list || [];

        const classData = classList.map((className) => ({
          id: className,
          newsTitle: className,
          newsDescription: "Course title", // You can fetch course title from database if available
          newsPhoto: require("../../../assets/adaptive-icon.png"), // Replace with actual photo if available
        }));

        setClasses(classData);
        console.log("Classes fetched successfully:", classData);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [userData]);

  const renderItem = ({ item }) => (
    <NewsContainer item={item} classIds={classes.map(cls => cls.id)} />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[setStyles.context, styles.context]}>
        <Text style={[setStyles.title, styles.title]}> Make Announcements!! </Text>
        {classes.length === 0 ? (
          <Text style={styles.noClassesText}>No classes available.</Text>
        ) : (
          <FlatList
            data={classes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  context: {
    marginTop: windowHeight * 0.03,
    marginHorizontal: 0,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginVertical: "2%",
  },
  newsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: "3%",
    marginHorizontal: "4%",
    minHeight: 90,
    overflow: "hidden", // Prevents the iconContainer from moving outside the container
  },
  iconContainer: {
    position: "absolute",
    left: 15,
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "rgba(10,64,129,0.12)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  newsPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  newsTextContainer: {
    flex: 1,
    marginLeft: 90,
    marginRight: 10,
  },
  newsTitle: {
    fontWeight: "bold",
    color: "#0A4081",
  },
  newsDescription: {
    marginRight: 20,
  },
});

