import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useData } from "../contexts/DataContext";
import fetchTeachersInfo from "../util/teachersModule";

export default function Attendance() {
  const { userData } = useData();
  const [courses, setCourses] = useState([]);
  const [teachersInfo, setTeachersInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const teachers = await fetchTeachersInfo();
      setTeachersInfo(teachers);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData && teachersInfo.length > 0) {
      const studentData = userData[Object.keys(userData)[0]];
      const semesterId = studentData.academic_info.semester;
      const semesterData = studentData.semesters[semesterId];
      const coursesData = semesterData.courses;

      if (!coursesData) {
        console.error("Courses data not found");
        return;
      }

      const formattedCourses = Object.entries(coursesData).map(([courseId, course]) => {
        const attendance = course.attendance ? parseInt(course.attendance) : 0;
        const teacherId = course.teacher;
        const teacherData = teachersInfo.find(teacher => teacher.id === teacherId);
        const teacherName = teacherData ? teacherData.name : "Unknown Teacher";

          // Alert messages based on attendance percentage
          if (attendance < 85) {
            if (attendance < 75) {
              Alert.alert(
                "Low Attendance Alert",
                "You are not eligible to sit in the examination. You need to enroll yourself in the next semester/summer semester.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            } else {
              Alert.alert(
                "Low Attendance Alert",
                "Focus on your attendance, there will chances of attendance shortage.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            }
          }

          return {
            name: course.name,
            teacher: teacherName,
            attendance: attendance,
            color: getColor(attendance),
            message: attendance < 85 ? (attendance < 75 ? "You are not eligible to sit in the examination. You need to enroll yourself in the next semester/summer semester." : "Focus on your attendance, there will chances of attendance shortage.") : null,
          };
        }
      );

      setCourses(formattedCourses);
    }
  }, [userData, teachersInfo]);

  const getColor = (percentage) => {
    if (percentage >= 80) return "rgba(102,204,255,1)";
    if (percentage >= 85) return "rgba(241,153,40,1)";
    if (percentage >= 75) return "rgba(253,149,141,1)";
    return "rgba(187,134,252,1)";
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {courses.map((course, index) => (
          <View key={index} style={[styles.courseContainer, { backgroundColor: course.color }]}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.teacherName}>Teacher: {course.teacher}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${course.attendance}%` }]} />
            </View>
            <Text style={styles.attendancePercentage}>{course.attendance}%</Text>
            {course.message && <Text style={styles.message}>{course.message}</Text>}
          </View>
        ))}
      </View>
    </ScrollView>    
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    paddingHorizontal: 20,
  },
  courseContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 2,
    color: "#FFF",
  },
  teacherName: {
    fontSize: 16,
    marginBottom: 5,
    color: "#FFF",
    textAlign: "right",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFF",
  },
  attendancePercentage: {
    fontSize: 14,
    color: "#FFF",
  },
  message: {
    fontSize: 12,
    color: 'red',
    marginTop: 10,
    textAlign: "justify",
  }
});
