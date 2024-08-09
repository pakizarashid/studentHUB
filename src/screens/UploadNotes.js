import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { PaperProvider, Card, TextInput, Button } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { setStyles, setTheme } from "../components/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";

const UploadFilesActivity = ({ route }) => {
  const { userData } = route.params;
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");

  useEffect(() => {
    if (userData) {
      const courses = [];
      for (const studentId in userData) {
        const semesters = userData[studentId]?.semesters;
        for (const semesterKey in semesters) {
          const semester = semesters[semesterKey];
          const semesterCourses = semester?.courses;
          for (const courseKey in semesterCourses) {
            const course = semesterCourses[courseKey];
            courses.push({ label: course.name, value: course.name });
          }
        }
      }
      setItems(courses);
    }
  }, [userData]);

  useEffect(() => {
    requestPermissions();
  }, []);

  ////////////////////////////////////////////////////IMAGES
  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert("Permission Error", "Camera or library permission denied");
    }
  };

  const launchCamera = async () => {
    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("Picker Result from Camera:", pickerResult); // Log the entire result

    if (!pickerResult.cancelled) {
      const uri = pickerResult.assets[0].uri; // Access URI from assets array
      console.log("Image URI from camera:", uri);
      await uploadImageToFirebase(uri);
    } else {
      console.log("Image selection cancelled by the user.");
    }
  };

  const launchImageLibrary = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("Picker Result from Library:", pickerResult); // Log the entire result

    if (!pickerResult.cancelled) {
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        const uri = pickerResult.assets[0].uri; // Access URI from assets array
        console.log("Image URI from library:", uri);
        await uploadImageToFirebase(uri);
      } else {
        console.log("No image assets found in the picker result.");
      }
    } else {
      console.log("Image selection cancelled by the user.");
    }
  };

  const handleImageOptionPress = () => {
    setFileType("Image");
    setModalVisible(true);
  };

  const handleCameraOptionPress = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Error", "Camera permission denied");
      return;
    }
    launchCamera();
  };

  const handleLibraryOptionPress = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Error", "Library permission denied");
      return;
    }
    launchImageLibrary();
  };

  const uploadImageToFirebase = async (uri) => {
    try {
      if (!uri) {
        throw new Error("No URI provided for the image");
      }
      console.log("Uploading image with URI:", uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = firebase.storage().ref().child(`images/${Date.now()}`);
      const snapshot = await storageRef.put(blob);
      const downloadURL = await snapshot.ref.getDownloadURL();
      console.log("Image uploaded successfully, URL:", downloadURL);
      await saveImageURLToDatabase(downloadURL);
      Alert.alert("Success", "Image uploaded successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to upload image. Please try again.");
      console.error("Error uploading image:", err);
      // Log detailed Firebase error information
      if (err.code && err.code.startsWith("storage/")) {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.error("Firebase Storage Error Code:", errorCode);
        console.error("Firebase Storage Error Message:", errorMessage);
      }
    }
  };

  const saveImageURLToDatabase = async (url) => {
    try {
      if (!subject) {
        Alert.alert("Validation Error", "Please select a subject.");
        return;
      }

      const { studentId, semesterId, courseId } = findCourseIds(
        subject,
        userData
      );
      if (!courseId || !semesterId || !studentId) {
        Alert.alert("Data Error", "Selected subject not found.");
        return;
      }

      const notesRef = firebase
        .database()
        .ref(
          `students/${studentId}/semesters/${semesterId}/courses/${courseId}/notes`
        );

      const snapshot = await notesRef.once("value");
      const notes = snapshot.val();

      if (!notes || Object.keys(notes).length === 0) {
        // If there are no existing notes, create a new one
        const newNoteRef = notesRef.push();
        await newNoteRef.set({
          noteText: [],
          noteImage: [{ url }],
          noteDoc: [],
        });
      } else {
        const noteKey = Object.keys(notes)[0]; // Assuming the note is at index 0
        const noteRef = notesRef.child(noteKey);

        const existingNote = notes[noteKey] || {}; // Ensure existingNote is an object

        const updatedNote = {
          noteImage: [...(existingNote.noteImage || []), { url }], // Ensure noteImage array exists
        };

        await noteRef.update(updatedNote);
      }

      Alert.alert("Success", "Image URL saved successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to save image URL. Please try again.");
      console.error("Error saving image URL:", err);
    }
  };

  ////////////////////////////////////////////////////Documents

  const uploadDocumentToFirebase = async (uri) => {
    console.log("URI received by uploadDocumentToFirebase: ", uri);

    try {
      if (!uri) {
        throw new Error("No URI provided for the doc");
      }
      console.log("Uploading document with URI:", uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = firebase
        .storage()
        .ref()
        .child(`documents/${Date.now()}`);
      const snapshot = await storageRef.put(blob);
      const downloadURL = await snapshot.ref.getDownloadURL();
      console.log("Document uploaded successfully, URL:", downloadURL);
      await saveDocURLToDatabase(downloadURL);
      Alert.alert("Success", "Document uploaded successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to upload document. Please try again.");
      console.error("Error uploading document:", err);
      // Log detailed Firebase error information
      if (err.code && err.code.startsWith("storage/")) {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.error("Firebase Storage Error Code:", errorCode);
        console.error("Firebase Storage Error Message:", errorMessage);
      }
    }
  };

  const saveDocURLToDatabase = async (url) => {
    try {
      if (!subject) {
        Alert.alert("Validation Error", "Please select a subject.");
        return;
      }

      const { studentId, semesterId, courseId } = findCourseIds(
        subject,
        userData
      );
      if (!courseId || !semesterId || !studentId) {
        Alert.alert("Data Error", "Selected subject not found.");
        return;
      }

      const notesRef = firebase
        .database()
        .ref(
          `students/${studentId}/semesters/${semesterId}/courses/${courseId}/notes`
        );

      const snapshot = await notesRef.once("value");
      const notes = snapshot.val();

      if (!notes || Object.keys(notes).length === 0) {
        // If there are no existing notes, create a new one
        const newNoteRef = notesRef.push();
        await newNoteRef.set({
          noteText: [],
          noteImage: [],
          noteDoc: [{ url }],
        });
      } else {
        const noteKey = Object.keys(notes)[0]; // Assuming the note is at index 0
        const noteRef = notesRef.child(noteKey);
        const existingNote = notes[noteKey] || {}; // Ensure existingNote is an object

        const updatedNote = {
          noteDoc: [...(existingNote.noteDoc || []), { url }], // Ensure noteImage array exists
        };

        await noteRef.update(updatedNote);
      }

      Alert.alert("Success", " URL saved successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to save URL. Please try again.");
      console.error("Error saving image URL:", err);
    }
  };

  ////////////////////////////// Function to handle document upload

  const handleFileUpload = async () => {
    try {
      if (!subject) {
        Alert.alert("Validation Error", "Please select a subject.");
        return;
      }

      const { studentId, semesterId, courseId } = findCourseIds(
        subject,
        userData
      );
      if (!courseId || !semesterId || !studentId) {
        Alert.alert("Data Error", "Selected subject not found.");
        return;
      }

      const notesRef = firebase
        .database()
        .ref(
          `students/${studentId}/semesters/${semesterId}/courses/${courseId}/notes`
        );

      const snapshot = await notesRef.once("value");
      const notes = snapshot.val();

      if (!notes || Object.keys(notes).length === 0) {
        // If there are no existing notes, create a new one
        await notesRef.push({
          noteText: [],
          noteImage: [],
          noteDoc: [],
        });
      }

      const noteKey = Object.keys(notes)[0]; // Assuming the note is at index 0
      const noteRef = notesRef.child(noteKey);
      const noteSnapshot = await noteRef.once("value");
      const noteData = noteSnapshot.val();

      switch (fileType) {
        case "Image":
          if (selectedOption === "camera") {
            await launchCamera();
          }
          if (selectedOption === "library") {
            await launchImageLibrary();
          }
          break;
        case "Document":
          const result = await DocumentPicker.getDocumentAsync({});
          console.log("DocumentPicker Result:", result); // Log the entire result

          // if (result.type !== "cancel") {
          //   const uri = result.uri;
          //   console.log("DocumentPicker Result URI:", uri); // Log the URI
          //   await uploadDocumentToFirebase(uri);
          // }
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            console.log("DocumentPicker Result URI:", uri); // Log the URI
            await uploadDocumentToFirebase(uri);
          }
          break;
        case "Text":
          if (!textInputValue.trim()) {
            Alert.alert("Validation Error", "Please enter some text.");
            return;
          }
          // Add text to noteText array
          const updatedNoteText = [
            ...noteData.noteText,
            { content: textInputValue },
          ];
          await noteRef.child("noteText").set(updatedNoteText);
          Alert.alert("Successfully uploaded your Text in Notes.")
          setTextInputValue(""); // Clear input after successful upload
          break;
        default:
          console.log("Invalid file type");
          break;
      }
    } catch (err) {
      Alert.alert("Error", "Failed to upload file. Please try again.");
      console.error("Error uploading file:", err);
    }
  };

  const findCourseIds = (subject, userData) => {
    let studentId, semesterId, courseId;
    for (const stdId in userData) {
      const semesters = userData[stdId]?.semesters;
      for (const semId in semesters) {
        const semester = semesters[semId];
        for (const cId in semester.courses) {
          const course = semester.courses[cId];
          if (course.name === subject) {
            courseId = cId;
            semesterId = semId;
            studentId = stdId;
            break;
          }
        }
        if (courseId) break;
      }
      if (courseId) break;
    }
    return { studentId, semesterId, courseId };
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, marginVertical: "-30%" }}
      >
        <ScrollView>
          <PaperProvider theme={setTheme}>
            <Card mode="outlined" style={styles.card}>
              <Card.Title
                title="Upload Notes or Question Papers"
                titleStyle={[setStyles.title, styles.title]}
              />
              <Card.Content>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  placeholder="Enter Name of Topic or Question Paper"
                />
                <DropDownPicker
                  open={open}
                  value={subject}
                  items={items}
                  setOpen={setOpen}
                  setValue={setSubject}
                  setItems={setItems}
                  placeholder="Select Subject"
                  style={styles.input}
                  dropDownContainerStyle={styles.dropDownContainer}
                  onOpen={() => setOpen(true)}
                  onClose={() => setOpen(false)}
                />
              </Card.Content>
              <Card.Content
                style={[
                  styles.fileTypeContainer,
                  open ? { marginTop: 110 } : { marginTop: 5 },
                ]}
              >
                <Text style={styles.label}>Choose File Type</Text>
                <View style={styles.fileTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.fileTypeButton,
                      fileType === "Image" && styles.activeButton,
                    ]}
                    onPress={handleImageOptionPress}
                  >
                    <Icon name="camera-image" color="white" size={16} />
                    <Text style={styles.buttonText}>Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.fileTypeButton,
                      fileType === "Document" && styles.activeButton,
                    ]}
                    onPress={() => setFileType("Document")}
                    onPressIn={handleFileUpload}
                    // onPress={() => {
                    //   setFileType("Document");
                    //   handleFileUpload("Document");
                    // }}
                  >
                    <Icon name="file-document" color="white" size={16} />
                    <Text style={styles.buttonText}>Document</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.fileTypeButton,
                      fileType === "Text" && styles.activeButton,
                    ]}
                    onPress={() => setFileType("Text")}
                  >
                    <Icon name="card-text" color="white" size={16} />
                    <Text style={styles.buttonText}>Text</Text>
                  </TouchableOpacity>
                </View>
              </Card.Content>
              <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
              >
                <Pressable
                  style={styles.centeredModal}
                  onPress={() => setModalVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={handleCameraOptionPress}
                    >
                      <Text>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={handleLibraryOptionPress}
                    >
                      <Text>Choose from Library</Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </Modal>
              {fileType === "Text" && (
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your notes in text..."
                  value={textInputValue}
                  onChangeText={setTextInputValue}
                  multiline={true}
                  blurOnSubmit={false}
                />
              )}
              <Button
                style={styles.button}
                onPress={handleFileUpload}
                rippleColor="transparent"
              >
                Upload File
              </Button>
            </Card>
          </PaperProvider>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: "30%",
    marginHorizontal: "4%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
  },
  input: {
    marginVertical: 10,
    borderRadius: 5,
    height: 51,
  },
  dropDownContainer: {
    borderColor: "#0A4081",
    maxHeight: 120,
  },
  fileTypeContainer: {
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "grey",
  },
  fileTypeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  fileTypeButton: {
    flexDirection: "row",
    backgroundColor: "#0A4081",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    minWidth: 80,
  },
  activeButton: {
    backgroundColor: "#003366",
  },
  buttonText: {
    color: "#FFFFFF",
    marginLeft: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#0A4081",
    backgroundColor: "transparent",
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  centeredModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 0,
  },
});

export default UploadFilesActivity;
