import React, { useEffect, useState } from "react";
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
import { setStyles } from "../components/styles";
import fetchTeachersInfo from "../util/teachersModule"; // Ensure this import is correct

const windowHeight = Dimensions.get("window").height;

const NewsContainer = ({ item, userData }) => {
  const navigation = useNavigation();
  const translateX = useSharedValue(0);

  const handleGestureEvent = (event) => {
    translateX.value = event.nativeEvent.translationX;
  };

  const handleEnd = () => {
    if (translateX.value > 100) {
      navigation.navigate(item.goTo, { classId: item.classId, teacherId: item.teacherId, userData}); // Pass the id parameter
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
          <Image source={item.newsPhoto} style={styles.newsPhoto} />
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.newsTextContainer}>
        <Text style={styles.newsTitle}>{item.newsTitle}</Text>
        <Text style={styles.newsDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MsgScreen({ userData }) {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const defaultAnnouncement = {
      id: "1",
      newsTitle: "Welcome to Student-Hub",
      description: "Hope you are enjoying the app and All the best",
      goTo: "Messages",
      newsPhoto: require("../../assets/adaptive-icon.png")
    };

    setNewsList([defaultAnnouncement]);

    if (userData) {
      const studentId = Object.keys(userData)[0];
      const studentData = userData[studentId];
      const semesters = studentData.semesters;

      const teachersMap = new Map();

      Object.values(semesters).forEach(semester => {
        if (semester.courses) {
          Object.values(semester.courses).forEach(course => {
            if (teachersMap.has(course.teacher)) {
              teachersMap.get(course.teacher).courses.push(course.name);
            } else {
              teachersMap.set(course.teacher, {
                teacherId: course.teacher,
                courses: [course.name]
              });
            }
          });
        }
      });

      fetchTeachersInfo().then(allTeachersInfo => {
        const teacherItems = Array.from(teachersMap.values()).map(item => {
          const teacher = allTeachersInfo.find(teacher => teacher.id === item.teacherId);
          return {
            id: item.teacherId,
            newsTitle: teacher ? `Prof ${teacher.name}` : `Prof ${item.teacherId}`,
            description: item.courses.join(", "),
            goTo: "Messages",
            newsPhoto: require("../../assets/icon.png"),
            classId: studentData.class, // Assuming all courses belong to the same class, adjust if needed
            teacherId: item.teacherId
          };
        });

      setNewsList(teacherItems);
    });
    }
  }, [userData]);

  const renderItem = ({ item }) => <NewsContainer item={item} userData={userData} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[setStyles.context, styles.context]}>
        <Text style={[setStyles.title, styles.title]}>Announcements!!</Text>
        {newsList.length === 0 ? (
          <Text style={styles.noClassesText}>No announcements available.</Text>
        ) : (
          <FlatList
            data={newsList}
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
    marginTop: windowHeight * 0.02,
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
    borderRadius: 50,
    backgroundColor: "rgba(10,64,129,0.12)",
  },
  newsTextContainer: {
    flex: 1,
    marginLeft: 90,
    marginRight: 10,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0A4081",
  },
  newsDescription: {
    color: "rgba(10,64,129,0.5)",
    fontStyle: "italic",
    textAlign: "right",
    marginTop: 3,
    marginRight: 18,
  },
});

