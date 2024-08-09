import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Icon, FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const boxSize = 150; // Size of each box
const maxBoxesPerRow = Math.floor(windowWidth / boxSize);

export default function NotesMenu({ userData }) {
  const navigation = useNavigation();

  const [updatedUserData, setUpdatedUserData] = useState(userData);
  const studentId = updatedUserData ? Object.keys(updatedUserData)[0] : null;

  useEffect(() => {
    if (studentId) {
      const userRef = firebase
        .database()
        .ref(`students/${studentId}/semesters`);

      const onValueChange = (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newUserData = { [studentId]: { semesters: data } };
          setUpdatedUserData(newUserData);
        }
      };

      userRef.on("value", onValueChange);
      // Cleanup listener on component unmount
      return () => {
        userRef.off("value", onValueChange);
      };
    }
  }, [studentId]);

  const renderNotesItems = () => {
    if (
      !updatedUserData ||
      !studentId ||
      !updatedUserData[studentId].semesters
    ) {
      return []; // Check if userData is available and has required structure
    }

    const semesters = updatedUserData[studentId].semesters;
    const courses = [];

    for (const semesterKey in semesters) {
      const semester = semesters[semesterKey];
      const semesterCourses = semester.courses;
      for (const courseKey in semesterCourses) {
        const course = semesterCourses[courseKey];
         if (!course || !course.name) {
           console.warn(`Course with key ${courseKey} does not have a name`);
           continue;
         }

        const courseAbbreviation = course.name
          .split(" ")
          .map((word) => word.charAt(0))
          .join("");
        const courseWithNotes = {
          show: courseAbbreviation,
          icon: "laptop",
          notes: course.notes || [],
          studentID: studentId,
          semester: semesterKey,
          semesterNo: semesterKey.split("_")[1], // Extract semester number from the key
          courseid: courseKey,
        };
        courses.push(courseWithNotes);
      }
    }

    // Group courses into rows of three boxes each
    const rows = [];
    // for (let i = 0; i < courses.length; i += 3) {
    //   rows.push(courses.slice(i, i + 3));
    // }
    for (let i = 0; i < courses.length; i += maxBoxesPerRow) {
      rows.push(courses.slice(i, i + maxBoxesPerRow));
    }

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.rowContainer}>
        {row.map((course, index) => (
          <NotesItem
            key={index}
            course={course}
            semesterKey={course.semester}
          />
        ))}
      </View>
    ));
  };

  const NotesItem = ({ course, semesterKey }) => {
    const { studentID, courseid, notes } = course;

  const handleNavigation = () => {
    navigation.navigate("NoteBook", {
      selectedCourse: {
        ...course,
        notes: notes,
        studentID: studentID,
        semesterNo: semesterKey.split("_")[1], // Extract semester number from the key
        courseid: courseid,
      },
    });
  };
    return (
      <TouchableOpacity
        style={[styles.touchableOpacity]}
        // onPress={
        //   () => navigation.navigate("NoteBook", { selectedCourse: course }) // Pass onDeleteNote
        // }
        onPress={handleNavigation}
      >
        <Icon source={course.icon} color="white" size={30} />
        <Text style={[styles.boxText, { marginTop: 8 }]}>{course.show}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.context}>
      <ScrollView>
        <View style={styles.container}>{renderNotesItems()}</View>
      </ScrollView>
      <FAB
        style={styles.FAB}
        color="white"
        icon="plus"
        onPress={() => {
          navigation.navigate("Upload", { userData });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  context: {
    flex: 1,
    marginTop: -windowHeight * 0.03,
  },
  container: {
    marginVertical: "20%",
    marginHorizontal: "6%",
  },
  rowContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  touchableOpacity: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    padding: 5,
    backgroundColor: "#0A4081",
    borderRadius: 15,
  },
  boxText: {
    color: "#fff",
    textAlign: "center",
  },
  FAB: {
    position: "absolute",
    right: "5%",
    bottom: "5%",
    backgroundColor: "rgba(10,64,129,0.12)",
  },
});
