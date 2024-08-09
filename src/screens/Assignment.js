import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Modal,
  Alert,
  Linking,
  ActivityIndicator
} from "react-native";
import { setStyles } from "../components/styles";
import { useData } from "../contexts/DataContext";
import * as DocumentPicker from "expo-document-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";

export default function Assignment() {
  const { userData } = useData();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false); // Track if a document is currently being uploaded

  useEffect(() => {
    if (userData) {
      const studentId = Object.keys(userData)[0];
      const studentData = userData[studentId];

      if (studentData && studentData.academic_info && studentData.semesters) {
        const currentSemesterId = studentData.academic_info.semester;
        const currentSemesterCourses =
          studentData.semesters[currentSemesterId].courses;

        const assignmentList = Object.entries(currentSemesterCourses).map(
          ([courseId, courseData]) => ({
            courseId, // Include courseId here
            course: courseData.name,
            creditHours: courseData.credits,
            assignments: courseData.assignments || [], // Assignments array or empty array if not defined
          })
        );

        setAssignments(assignmentList);
      } else {
        console.error("Incomplete student data or semesters data not found");
      }
    } else {
      console.error("User data is not available");
    }
  }, [userData]);

  const handleAssignmentDetails = (assignment, courseId) => {
    setSelectedAssignment({ ...assignment, courseId });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAssignment(null);
  };

  const handleFileUpload = async (assignmentId) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const documentName = result.assets[0].name; // Fetch document name
        await uploadDocumentToFirebase(
          uri,
          assignmentId.replace(/<|>/g, ""),
          documentName
        ); // Pass document name to upload function
      }
    } catch (err) {
      Alert.alert("Error", "Failed to upload file. Please try again.");
      console.error("Error uploading file:", err);
    }
  };

  const uploadDocumentToFirebase = async (uri, assignmentId, documentName) => {
    setUploading(true); // Set uploading state to true while uploading

    try {
      if (!uri || !assignmentId) {
        console.error("No URI or assignment ID provided for the document.");
        return;
      }

      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = firebase
        .storage()
        .ref()
        .child(`documents/${documentName}`); // Use document name for storage path
      const snapshot = await storageRef.put(blob);
      const downloadURL = await snapshot.ref.getDownloadURL();
      await saveDocURLToDatabase(downloadURL, assignmentId, documentName);
      setUploading(false); // Set uploading state back to false after successful upload
    } catch (err) {
      setUploading(false); // Set uploading state back to false on error
      console.error("Error uploading document to Firebase:", err);
      // Display error message using Alert.alert
      Alert.alert("Error", "Failed to upload document. Please try again.");

      // Log detailed error information
      if (err.code && err.code.startsWith("storage/")) {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.error("Firebase Storage Error Code:", errorCode);
        console.error("Firebase Storage Error Message:", errorMessage);
      }
    }
  };

  const saveDocURLToDatabase = async (url, assignmentId, documentName) => {
    try {

      if (!url || !assignmentId || !selectedAssignment) {
        Alert.alert(
          "Validation Error",
          "URL, assignment ID, or selected assignment is missing."
        );
        return;
      }

      const studentId = Object.keys(userData)[0];
      const studentData = userData[studentId];
      const currentSemesterId = studentData.academic_info.semester;

      if (!studentData || !currentSemesterId || !selectedAssignment.courseId) {
        Alert.alert("Data Error", "Selected course not found.");
        return;
      }

      const assignmentsRef = firebase
        .database()
        .ref(
          `students/${studentId}/semesters/${currentSemesterId}/courses/${selectedAssignment.courseId}/assignments`
        );


      // Fetch the assignments array
      const snapshot = await assignmentsRef.once("value");
      const assignmentsArray = snapshot.val();

      if (!assignmentsArray) {
        Alert.alert("Data Error", "Assignments not found.");
        return;
      }

      // Find the specific assignment by ID
      const assignmentIndex = assignmentsArray.findIndex(
        (assignment) => assignment.id === assignmentId
      );

      if (assignmentIndex === -1) {
        Alert.alert("Data Error", "Assignment not found.");
        return;
      }

      // Update the assignment with the uploaded document URL and name
      assignmentsArray[assignmentIndex].uploadedDocument = url;
      assignmentsArray[assignmentIndex].uploadedDocumentName = documentName;

      // Update the assignments array in the database
      await assignmentsRef.set(assignmentsArray);

      // Update the local state to reflect the changes
      setSelectedAssignment((prevAssignment) => ({
        ...prevAssignment,
        uploadedDocument: url,
        uploadedDocumentName: documentName,
      }));

    } catch (err) {
      Alert.alert("Error", "Failed to save URL. Please try again.");
      console.error("Error saving document URL:", err);
    }
  };

  const handleOpenDocument = async (url) => {
    if (!url) {
      Alert.alert("Error", "Document URL is missing.");
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening document:", error);
      Alert.alert("Error", "Failed to open the document.");
    }
  };

  return (
    <ScrollView contentContainerStyle={[setStyles.context, styles.context]}>
      {assignments.map((course, index) => (
        <View
          key={index}
          style={[
            styles.courseContainer,
            { backgroundColor: getCourseColor(index) },
          ]}
        >
          <Text style={styles.courseTitle}>{course.course}</Text>
          {course.assignments.length > 0 && (
            <View style={styles.assignmentList}>
              {course.assignments.map((assignment, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.assignmentItem}
                  onPress={() =>
                    handleAssignmentDetails(assignment, course.courseId)
                  }
                >
                  <Text style={styles.assignmentTitle}>
                    Assignment {idx + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

      {/* Assignment Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedAssignment?.title}</Text>
            <Text style={styles.modalSubTitle}>Questions:</Text>
            {selectedAssignment?.questions &&
              Object.entries(selectedAssignment.questions).map(
                ([key, question], index) => (
                  <Text key={key} style={styles.questionText}>
                    {index + 1}: {question}
                  </Text>
                )
              )}
            <View style={styles.modalDetailsContainer}>
              <Text style={styles.modalDetailsText}>
                Deadline: {selectedAssignment?.deadline}
              </Text>
              <Text style={styles.modalDetailsText}>
                Marks: {selectedAssignment?.marks}
              </Text>
            </View>
            <Text style={styles.modalDetailsText2}>
              Format: {selectedAssignment?.pattern}
            </Text>
            <View style={styles.modalButtonContainer}>
              {uploading ? (
                <ActivityIndicator size="small" color="#0A4081" />
              ) : selectedAssignment && !selectedAssignment.uploadedDocument ? (
                <Button
                  title="Upload Assignment"
                  color="#0A4081"
                  onPress={() => handleFileUpload(selectedAssignment.id)} // Pass assignmentId to handleFileUpload
                  disabled={uploading} // Disable button while uploading
                />
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    handleOpenDocument(selectedAssignment.uploadedDocument)
                  }
                  style={{alignSelf:"center"}}
                >
                  <View style={styles.documentLinkTextContainer}>
                      <Text style={styles.documentLink}>
                        {selectedAssignment &&
                          selectedAssignment.uploadedDocumentName}
                      </Text>
                    </View>
                </TouchableOpacity>
              )}
              <Button
                title="Cancel"
                color="#0A4081"
                onPress={handleCloseModal}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getCourseColor = (index) => {
  switch (index) {
    case 0:
      return "#20b2aa"; // Course 1
    case 1:
      return "#f08080"; // Course 2
    case 2:
      return "#db7093"; // Course 3
    case 3:
      return "#26C6DA"; // Course 4
    case 4:
      return "#dda0dd"; // Course 5
    case 5:
      return "#5C6BC0"; // Course 6
    default:
      return "#B9D9EB"; // Default color
  }
};

const styles = StyleSheet.create({
  context: {
    flexGrow: 1,
  },
  courseContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  assignmentList: {
    marginTop: 5,
  },
  assignmentItem: {
    paddingVertical: 5,
  },
  assignmentTitle: {
    fontSize: 16,
    color: "#FFF",
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
    padding: 23,
    width: "90%",
    maxWidth: 400,
    borderColor: "#0A4081",
    borderWidth: 2.5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0A4081",
    textAlign: "center",
  },
  modalSubTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#0A4081",
  },
  questionText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "justify",
  },
  modalDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalDetailsText: {
    fontSize: 14,
    marginBottom: 8,
    color: "rgba(10,64,129,0.8)",
  },
  modalDetailsText2: {
    fontSize: 14,
    color: "rgba(10,64,129,0.55)",
  },
  documentLinkTextContainer: {
    maxWidth: "90%", // Set the maximum width for the text container
  },
  documentLink: {
    color: "#0A4081",
    fontSize: 18,
    textDecorationLine: "underline",
  },
  modalButtonContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
