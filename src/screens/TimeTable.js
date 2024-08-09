import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, StatusBar, Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TimeTable from "@mikezzb/react-native-timetable";
import { useData } from "../contexts/DataContext";
import fetchTeachersInfo from "../util/teachersModule";

export default function TimeTableScreen() {
  const { userData } = useData();
  const [events, setEvents] = useState([]);
  const [teachersInfo, setTeachersInfo] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const teachers = await fetchTeachersInfo();
      setTeachersInfo(teachers);
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    if (userData && teachersInfo.length > 0) {
      const studentData = userData[Object.keys(userData)[0]];
      const timetable = studentData.timetable;
      const semesterId = studentData.academic_info.semester;
      const semesterData = studentData.semesters[semesterId];
      const courses = semesterData.courses;

      const allEvents = [];
      let colorIndex = 0;

      timetable.forEach(({ day, schedule }) => {
        Object.entries(schedule).forEach(([time, id]) => {
          const courseName = courses[id].name;
          const location = courses[id].location;
          const teacherId = courses[id].teacher;
          const teacherData = teachersInfo.find(teacher => teacher.id === teacherId);
          const courseTeacher = teacherData.name;
          
          const event = {
            courseId: courseName,
            title: id,
            teacher: courseTeacher,
            location: location,
            day: getDayIndex(day),
            startTime: time.split(" - ")[0],
            endTime: time.split(" - ")[1],
            color: getColor(colorIndex++),
          };
          allEvents.push(event);
        });
      });
      setEvents(allEvents);
    }
  }, [userData, teachersInfo]);

  const formatEventData = (event) => {
    return (
      `Title: ${event.courseId}\n` +
      `Course ID: ${event.title}\n` +
      `Teacher: ${event.teacher}\n` +
      `Start Time: ${event.startTime}\n` +
      `End Time: ${event.endTime}\n` +
      `Location: ${event.location}` 
    );
  };

  const getColor = (index) => {
    return index % 2 === 0 ? "rgba(0,142,204,1)" : "rgba(253,149,141,1)";
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar backgroundColor="rgba(21,101,192,1)" />
        <View style={styles.container}>
          <TimeTable
            events={events}
            eventOnPress={(event) =>
              Alert.alert(
                "Class Details",
                formatEventData(event),
                [{ text: "Cancel", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              )
            }
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function getDayIndex(day) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return days.indexOf(day) + 1;
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
