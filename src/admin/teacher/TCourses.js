import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Card, List, PaperProvider } from "react-native-paper";
import { setStyles, setTheme } from "../../components/styles";
import { useData } from "../../contexts/DataContext";
import firebase from "../../util/firebaseConfig";

const TCourses = () => {
  const { userData } = useData();
  const [coursesInfo, setCoursesInfo] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (userData) {
      const teacherId = Object.keys(userData)[0]; // Assuming there's only one teacher in the userData
      const teacherData = userData[teacherId];

      if (teacherData && teacherData.teaching_courses) {
        fetchCoursesInfo(teacherData.teaching_courses);
      } else {
        console.warn("Teaching courses not found for teacherId:", teacherId);
      }
    } else {
      console.warn("No userData found");
    }
  }, [userData]);

  const fetchCoursesInfo = async (courseIds) => {
    try {
      const coursesRef = firebase.database().ref("courses");
      const snapshot = await coursesRef.once("value");
      const coursesData = snapshot.val();

      const fetchedCourses = courseIds.map((courseId) => ({
        id: courseId,
        ...coursesData[courseId],
      }));

      setCoursesInfo(fetchedCourses);
    } catch (error) {
      console.error("Error fetching courses info:", error);
    }
  };

  const handleCourseClick = (course) => {
    setCourseDetails(course);
    setModalVisible(true);
  };

  const hideModal = () => {
    setCourseDetails(null);
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={setStyles.context}>
        <PaperProvider theme={setTheme}>
          {coursesInfo.length > 0 ? (
            coursesInfo.map((course, index) => (
              <TouchableOpacity
                key={index}
                style={{ marginVertical: 8 }}
                onPress={() => handleCourseClick(course)}
              >
                <Card mode="contained" style={styles.card}>
                  <View style={styles.cardContainer}>
                    <Text style={styles.name}>{course.name}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No classes found</Text>
          )}
          {courseDetails && (
            <Modal
              visible={modalVisible}
              onRequestClose={hideModal}
              transparent={true}
            >
              <TouchableOpacity
                style={styles.modalContainer}
                activeOpacity={1}
                onPressOut={hideModal}
              >
                <View style={styles.modalContent}>
                  <ScrollView>
                    <List.Section>
                      <List.Subheader style={styles.subHeader}>
                        Course Details
                      </List.Subheader>
                      <List.Item
                        title={
                          <View>
                            <Text style={styles.descriptionText}>
                              Course Name: {courseDetails.name}
                            </Text>
                            <Text style={styles.descriptionText}>
                              Credits: {courseDetails.credits}
                            </Text>
                            <Text style={styles.descriptionText}>
                              Location: {courseDetails.location}
                            </Text>
                          </View>
                        }
                      />
                    </List.Section>
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={hideModal}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </PaperProvider>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  card: {
    backgroundColor: "rgba(10,64,129,0.1)",
    marginVertical: 1,
    marginHorizontal: 20,
  },
  cardContainer: {
    flexDirection: "row",
    alignSelf: "center",
    padding: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A4081",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0A4081",
    padding: 15,
    width: "75%",
    maxHeight: "70%",
  },
  closeButton: {
    marginBottom: 10,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#0A4081",
    fontWeight: "bold",
    fontSize: 16,
  },
  subHeader: { textAlign: "center", marginBottom: -15 },
  descriptionText: {
    color: "#0A4081", // Change the color of the description text
    marginTop: 8, // Add margin bottom to create space between lines
  },
});

export default TCourses;
