import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Dimensions, Text } from 'react-native';
import { List, PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from "../contexts/DataContext";
import { setStyles, setTheme } from '../components/styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CourseOutline = () => {
  const { userData } = useData();
  const [semesterVisibility, setSemesterVisibility] = useState({});
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {

    if (userData) {
      const studentId = Object.keys(userData)[0];
      const studentData = userData[studentId];

      if (studentData && studentData.academic_info && studentData.semesters) {
        const currentSemesterId = studentData.academic_info.semester;
        const semestersData = studentData.semesters;

        const semesterList = Object.keys(semestersData).map(semesterId => ({
          id: semesterId,
          courses: semestersData[semesterId].courses || {}, // Ensure courses is an object
        }));
        setSemesters(semesterList);

        // Set the current semester to be expanded by default
        const initialVisibility = {};
        semesterList.forEach(semester => {
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
    setSemesterVisibility(prevVisibility => ({
      ...prevVisibility,
      [semesterId]: !prevVisibility[semesterId],
    }));
  };

  const renderCourseItem = (course) => {
    return (
      <View style={styles.courseItemContainer}>
        <Text style={styles.courseName}>{course.name}</Text>
        <Text style={styles.courseCreditHours}>Credit Hours: {course.credits}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[setStyles.context, styles.context]}>
      <PaperProvider theme={setTheme}>
        <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
          <View style={styles.stickyHeader}>
            <List.Section>
              {semesters.map((semester) => (
                <List.Accordion
                  key={semester.id}
                  title={`Semester ${semester.id.split('_')[1]}`}
                  left={(props) => <List.Icon {...props} icon="book" color="#0A4081" />}
                  expanded={semesterVisibility[semester.id]}
                  onPress={() => handleAccordionPress(semester.id)}
                >
                  {Object.entries(semester.courses).map(([courseId, course]) => (
                    <List.Item
                      key={courseId}
                      title={() => renderCourseItem(course)}
                      titleStyle={styles.courseItem}
                    />
                  ))}
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
    marginTop: windowHeight * 0.003,
  },
  stickyHeader: {
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 10,
  },
  courseItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseName: {
    color: '#0A4081',
    fontSize: 15,
  },
  courseCreditHours: {
    color: 'rgba(10,64,129,0.5)',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default CourseOutline;

