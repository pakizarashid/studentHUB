import React, { useEffect } from "react";
import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Icon,
  Card,
  Title,
  Paragraph,
  Text,
  PaperProvider,
} from "react-native-paper";
import { Circle } from "react-native-progress";
import { useNavigation } from "@react-navigation/native";
import { setTheme } from "./styles";

const DashboardContainer = ({ userData }) => {
  const navigation = useNavigation();

  const data = [
    {
      id: "1",
      name: "Profile",
      icon: "account-details-outline",
      action: "Profile",
    },
    {
      id: "2",
      name: "Student ID",
      icon: "smart-card-outline",
      action: "StudentID",
    },
    {
      id: "3",
      name: "Class Mates",
      icon: "account-group-outline",
      action: "ClassList",
    },
//    {
//      id: "4",
//      name: "Reminders",
//      icon: "bell-ring-outline",
//      action: "Reminder",
//    },
  ];

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

const TodayTimetableCard = ({ studentData }) => {
  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  const timetable = studentData.timetable || [];
  const todayTimetable = timetable.find((entry) => entry.day === today);

  // Function to get course name from course id
  const getCourseName = (courseId) => {
    let courseName = "";
    const semesters = studentData.semesters || {};
    for (const semesterKey in semesters) {
      const semester = semesters[semesterKey];
      const courses = semester.courses || {};
      if (courseId in courses) {
        courseName = courses[courseId].name;
        break;
      }
    }
    return courseName;
  };

  return (
    <Card style={[styles.card, { flex: 1, marginRight: 12 }]} mode="contained">
      <Card.Title
        title="Timetable"
        titleStyle={styles.cardTitle}
        right={(props) => <Icon {...props} source="calendar" color="#0A4081" />}
      />
      <Card.Content>
        <View style={styles.timetable}>
          <Title style={styles.day}>{today}</Title>
          {todayTimetable ? (
            Object.entries(todayTimetable.schedule).map(([time, courseId]) => (
              <View key={time} style={styles.timetableRow}>
                <Text style={styles.time}>{time}</Text>
                <Text style={styles.subject}>{getCourseName(courseId)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.time}>No classes scheduled for today</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const AttendanceCard = ({ studentData }) => {
  const getCircleColor = (attendance) => {
    if (attendance >= 85) return "#00FF00"; // Green for attendance >= 85
    else if (attendance >= 75)
      return "#FFA500"; // Yellow for attendance >= 75 and < 85
    else return "#FF0000"; // Red for attendance < 75
  };

  const semesterCourses =
    studentData.semesters[studentData.academic_info.semester].courses;

  return (
    <Card style={[styles.card, { flex: 1 }]} mode="contained">
      <Card.Title title="Attendance" titleStyle={styles.cardTitle} />
      <Card.Content>
        {Object.values(semesterCourses).map((course) => (
          <View key={course.id} style={styles.attendanceRow}>
            <Circle
              size={45}
              progress={parseInt(course.attendance) / 100}
              showsText
              formatText={() => `${parseInt(course.attendance)}%`}
              color={getCircleColor(parseInt(course.attendance))}
              borderColor="transparent"
              thickness={3}
              style={styles.progress}
            />
            <Text style={styles.circleText}>{course.name}</Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

const calculateCGPA = (studentData) => {
  let totalMarks = 0;
  let maxMarks = 0;

  for (const semesterKey in studentData.semesters) {
    const semester = studentData.semesters[semesterKey];
    for (const courseKey in semester.courses) {
      const course = semester.courses[courseKey];
      const grades = course.grades;

      if (grades && typeof grades === "object") {
        const { sem_work, midterm, final, max_marks } = grades;

        // Calculate total marks for the course
        const courseTotal = (sem_work || 0) + (midterm || 0) + (final?.theory || 0) + (final?.practical || 0);
        const courseMaxMarks = max_marks || 0;

        if (isNaN(courseTotal) || isNaN(courseMaxMarks)) {
          console.warn(`Invalid marks for course: ${courseKey}`);
          continue;
        }

        totalMarks += courseTotal;
        maxMarks += courseMaxMarks;
      }
    }
  }

  if (maxMarks === 0) {
    return 0;
  }

  return totalMarks / maxMarks  ; // CGPA as a ratio
};

export default function HomeMenu({ userData }) {
  const navigation = useNavigation();

  const studentId = Object.keys(userData)[0];
  const studentData = userData[studentId];

  const studentName = userData[studentId].name;
  const cgpa = calculateCGPA(studentData);

  return (
    <PaperProvider theme={setTheme}>
      <ScrollView
        style={{ flex: 1, paddingBottom: 50, marginBottom:10 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingContainer}>
          <Text style={styles.title}>WELCOME, {studentName || "Guest"}</Text>
          <Text style={styles.subTile}>Happy to help you!</Text>
        </View>
        <DashboardContainer />

        <View style={styles.row}>
          <TodayTimetableCard studentData={studentData} />
          <AttendanceCard studentData={studentData} />
        </View>

        <View style={styles.row}>
          <Card
            style={[styles.card, { flex: 1, marginRight: 12, minWidth: "30%" }]}
            mode="contained"
          >
            <Card.Title
              title="Fees"
              titleStyle={styles.cardTitle}
              right={(props) => (
                <Icon {...props} source="cash" color="#0A4081" size={23} />
              )}
            />
            <Card.Content>
              <Paragraph>Fees Due: 0 (PKR)</Paragraph>
            </Card.Content>
          </Card>

          <Card
            style={[styles.card, { flex: 1, marginRight: 12 }]}
            mode="contained"
          >
            <Card.Title title="CGPA" titleStyle={styles.cardTitle} />
            <Card.Content>
              <Circle
                size={80}
                progress={cgpa}
                showsText
                formatText={() => `${(cgpa * 4).toFixed(2)}`}
                color="rgba(10,64,129,0.8)"
                borderColor="transparent"
                thickness={5}
                style={styles.progress}
              />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </PaperProvider>
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
  title: {
    color: "#0A4081",
    fontSize: 22,
    fontWeight: "bold",
  },
  subTile: { fontSize: 14, fontStyle: "italic", color: "grey" },
  row: {
    marginHorizontal: 15,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  card: {
    padding: 7,
    backgroundColor: "rgba(10,64,129,0.06)",
  },
  cardTitle: {
    color: "#0A4081",
  },
  timetable: {
    marginTop: -18,
  },
  day: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
    backgroundColor: "rgba(10,64,129,0.4)",
    marginHorizontal: "-15%",
    padding: 5,
    borderRadius: 5,
  },
  timetableRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#0A4081",
  },
  time: {
    fontSize: 16,
    color: "rgba(10,64,129,0.6)",
    marginBottom: 2,
  },
  subject: {
    fontSize: 16,
    color: "#0A4081",
    marginBottom: 10,
  },
  circleText: {
    textAlign:"center",
    marginBottom: 10,
  },
  progress: {
    alignSelf: "center",
    marginBottom: 10,
  },
 
});
