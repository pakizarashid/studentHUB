import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { List, PaperProvider, DataTable } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useData } from "../contexts/DataContext";
import { setStyles, setTheme } from "../components/styles";

const windowHeight = Dimensions.get("window").height;

const Academics = () => {
  const { userData } = useData();
  const [semesterVisibility, setSemesterVisibility] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    if (userData) {
      const studentId = Object.keys(userData)[0];
      const studentData = userData[studentId];

      if (studentData && studentData.academic_info && studentData.semesters) {
        const currentSemesterId = studentData.academic_info.semester;
        const semestersData = studentData.semesters;

        const semesterList = Object.keys(semestersData).map((semesterId) => ({
          id: semesterId,
          courses: semestersData[semesterId].courses || {}, // Ensure courses is an object
        }));

        // Calculate GPA for each semester
        semesterList.forEach((semester) => {
          let totalGradePoints = 0;
          let totalCreditHours = 0;

          Object.values(semester.courses).forEach((course) => {
            totalGradePoints += calculateGradePoints(course.grades) * course.credits;
            totalCreditHours += course.credits;
          });

          semester.gpa = totalGradePoints / totalCreditHours;
        });

        setSemesters(semesterList);

        const initialVisibility = {};
        semesterList.forEach((semester) => {
          initialVisibility[semester.id] = semester.id === currentSemesterId;
        });
        setSemesterVisibility(initialVisibility);
      } else {
        console.error("Incomplete student data or semesters data not found");
      }
    } else {
      console.error("User data is not available");
    }
  }, [userData]);

  const handleAccordionPress = (semesterId) => {
    setSemesterVisibility((prevVisibility) => ({
      ...prevVisibility,
      [semesterId]: !prevVisibility[semesterId],
    }));
    setSelectedSubject(null); // Reset selected subject when toggling semester visibility
  };

  const toggleSubjectContainer = (subject) => {
    setSelectedSubject(selectedSubject === subject ? null : subject);
  };

  const calculateGrade = (totalMarks) => {
    if (totalMarks >= 90) return "A+";
    if (totalMarks >= 80) return "A";
    if (totalMarks >= 70) return "B";
    if (totalMarks >= 60) return "C";
    if (totalMarks >= 50) return "D";
    return "F";
  };

  const calculateGradePoints = (grades) => {
    const totalMarks = grades.sem_work + grades.midterm + grades.final.theory + grades.final.practical;
    return totalMarks >= 90 ? 4.0 :
           totalMarks >= 80 ? 3.7 :
           totalMarks >= 70 ? 3.3 :
           totalMarks >= 60 ? 3.0 :
           totalMarks >= 50 ? 2.7 : 0.0; // Return 0 for failing grade
  };

  const renderGradeRow = (label, value) => (
    <DataTable.Row style={styles.tableRow}>
      <DataTable.Cell style={styles.tableCell}>{label}</DataTable.Cell>
      <DataTable.Cell numeric>{value}</DataTable.Cell>
    </DataTable.Row>
  );

  const renderCourseGrades = (grades) => {
    if (!grades) return null;

    const totalMarks =
      grades.sem_work +
      grades.midterm +
      grades.final.theory +
      grades.final.practical;
    const grade = calculateGrade(totalMarks);

    grades.total_marks = totalMarks;
    grades.grade = grade;

    return (
      <View style={styles.tableContainer}>
        <DataTable>
          {renderGradeRow("Sessional Mark", grades.sem_work)}
          {renderGradeRow("Mid Exam", grades.midterm)}
          <DataTable.Header style={styles.tableRow}>
            <DataTable.Title
              textStyle={styles.boldText}
              sortDirection="descending"
            >
              Final Exam
            </DataTable.Title>
          </DataTable.Header>
          {renderGradeRow("Theory", grades.final.theory)}
          {renderGradeRow("Practical", grades.final.practical)}
          <DataTable.Header style={styles.tableRow}>
            <DataTable.Title
              textStyle={styles.boldText}
              sortDirection="descending"
            >
              Total Marks
            </DataTable.Title>
          </DataTable.Header>
          {renderGradeRow("Gained", grades.total_marks)}
          {renderGradeRow("Max Marks", grades.max_marks)}
          <DataTable.Row>
            <DataTable.Cell
              style={styles.tableCell}
              textStyle={styles.boldText}
            >
              Grade
            </DataTable.Cell>
            <DataTable.Cell numeric textStyle={styles.boldText}>
              {grades.grade}
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
    );
  };

  const renderCourseGradesSummary = (grades) => {
    if (!grades) return null;

    const totalMarks =
      grades.sem_work +
      grades.midterm +
      grades.final.theory +
      grades.final.practical;
    const grade = calculateGrade(totalMarks);

    return (
      <View style={styles.gradeSummaryContainer}>
        <Text style={styles.gradeSummaryText}>Total Marks: {totalMarks}</Text>
        <Text style={styles.gradeSummaryText}>Grade: {grade}</Text>
      </View>
    );
  };

  const renderCourseItem = (course) => (
    <View key={course.id}>
      <TouchableOpacity
        onPress={() => toggleSubjectContainer(course.id)}
        style={styles.courseItemContainer}
      >
        <Text style={styles.courseName}>{course.name}</Text>
        <View style={styles.courseRow}>
          {renderCourseGradesSummary(course.grades)}
          <Text style={styles.courseCreditHours}>Credit Hours: {course.credits}</Text>
        </View>
      </TouchableOpacity>
      {selectedSubject === course.id && renderCourseGrades(course.grades)}
    </View>
  );

  return (
    <SafeAreaView style={[setStyles.context, styles.context]}>
      <PaperProvider theme={setTheme}>
        <ScrollView>
          <View style={styles.stickyHeader}>
            <List.Section>
              {semesters.map((semester) => (
                <List.Accordion
                  key={semester.id}
                  title={`Semester ${semester.id.split("_")[1]}  ---  GPA: ${semester.gpa.toFixed(2)}`}
                  left={(props) => (
                    <List.Icon {...props} icon="book" color="#0A4081" />
                  )}
                  expanded={semesterVisibility[semester.id]}
                  onPress={() => handleAccordionPress(semester.id)}
                >
                  {Object.entries(semester.courses).map(
                    ([courseId, course]) => (
                      <List.Item
                        key={courseId}
                        title={() =>
                          renderCourseItem({ id: courseId, ...course })
                        }
                        titleStyle={styles.courseItem}
                      />
                    )
                  )}
                </List.Accordion>
              ))}
            </List.Section>
          </View>
        </ScrollView>
      </PaperProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  context: {
    marginTop: windowHeight * 0.01,
  },
  stickyHeader: {
    backgroundColor: "white",
    marginBottom: 5,
    borderRadius: 10,
  },
  courseItemContainer: {
//    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0A4081",
    marginBottom: 2,
  },
  courseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseCreditHours: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  gradeSummaryContainer: {
    marginTop: 5,
  },
  gradeSummaryText: {
    fontSize: 14,
    color: "rgba(10,64,129,0.5)",
  },
  courseItem: {
    fontSize: 16,
    fontWeight: "normal",
  },
  tableContainer: {
    borderWidth: 1.5,
    borderColor: "#0A4081",
    borderRadius: 10,
    padding: 2,
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#0A4081",
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: "#0A4081",
  },
  boldText: {
    color: "#0A4081",
    fontWeight: "bold",
  },
});

export default Academics;
