import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Icon, IconButton, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import NoteList from "../components/NoteText";
import ImageList from "../components/NoteImage";
import DocumentList from "../components/NoteDoc";

import firebase from "firebase/compat/app";
import "firebase/compat/database";

const NotesCard = ({ route }) => {
  const { selectedCourse } = route.params;
  const { studentID, semesterNo, courseid, notes } = selectedCourse;
  const [toggle, setToggle] = useState("All");
  const [textInputValue, setTextInputValue] = useState("");
  const [noteTexts, setNoteTexts] = useState(notes || []);
  const [imageUrls, setImageUrls] = useState([]);
  const [documentUrls, setDocumentUrls] = useState([]);

  useEffect(() => {
      const fetchNoteTexts = async () => {
        try {
          const dbPath = `students/${studentID}/semesters/semester_${semesterNo}/courses/${courseid}/notes/0/noteText`;
          const dbRef = firebase.database().ref(dbPath);
          const snapshot = await dbRef.once("value");
          const data = snapshot.val();
          if (data) {
            // Map the object to an array with unique keys
            const notesArray = Object.keys(data).map((key) => ({
              id: key,
              content: data[key].content,
            }));
            setNoteTexts(notesArray);
          }
        } catch (error) {
          console.error("Error fetching note texts:", error);
        }
      };

      fetchNoteTexts();
    }, [studentID, semesterNo, courseid]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const dbPath = `students/${studentID}/semesters/semester_${semesterNo}/courses/${courseid}/notes/0/noteImage`;
        const dbRef = firebase.database().ref(dbPath);
        const snapshot = await dbRef.once("value");
        const data = snapshot.val();
        if (data) {
          const urls = Object.values(data).map((item) => item.url);
          setImageUrls(urls);
        }
      } catch (error) {
        console.error("Error fetching image URLs:", error);
      }
    };

    fetchImageUrls();
  }, [studentID, semesterNo, courseid]);

  useEffect(() => {
    const fetchDocumentUrls = async () => {
      try {
        const dbPath = `students/${studentID}/semesters/semester_${semesterNo}/courses/${courseid}/notes/0/noteDoc`;
        const dbRef = firebase.database().ref(dbPath);
        const snapshot = await dbRef.once("value");
        const data = snapshot.val();
        if (data) {
          const urls = Object.values(data).map((item, index) => ({
            id: item.id || index,
            title: item.title || `Document ${index + 1}`,
            subject: item.subject || "Unknown Subject",
            date: item.date || "Unknown Date",
            postedBy: item.postedBy || "Unknown",
            uri: item.url || "",
          }));
          setDocumentUrls(urls);
        }
      } catch (error) {
        console.error("Error fetching document URLs:", error);
      }
    };

    fetchDocumentUrls();
  }, [studentID, semesterNo, courseid]);

  useEffect(() => {
      requestPermissions();
    }, []);

  const requestPermissions = async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        Alert.alert("Permission Error", "Camera or library permission denied");
      }
    };

  const handleCameraOptionPress = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the camera is required!");
      return;
    }
    launchCamera();
  };

  const launchCamera = async () => {
      const pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.cancelled) {
        const uri = pickerResult.assets[0].uri; // Access URI from assets array
        console.log("Image URI from camera:", uri);
        await uploadImageToFirebase(uri, studentID, semesterNo, courseid);
      } else {
        console.log("Image selection cancelled by the user.");
      }
    };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
        console.log("DocumentPicker Result:", result); // Log the entire result

          if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            console.log("DocumentPicker Result URI:", uri); // Log the URI
            await uploadDocumentToFirebase(uri, studentID, semesterNo, courseid);
          }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTextUpload = async () => {
    if (!textInputValue.trim()) {
      Alert.alert("Validation Error", "Please enter some text.");
      return;
    }

    try {
      // Determine the next numeric ID
      const maxId = noteTexts.length > 0
        ? Math.max(...noteTexts.map(note => parseInt(note.id, 10)))
        : -1;
      const newId = (maxId + 1).toString();

      const dbPath = `students/${studentID}/semesters/semester_${semesterNo}/courses/${courseid}/notes/0/noteText`;
      const dbRef = firebase.database().ref(dbPath);
      await dbRef.child(newId).set({ content: textInputValue });

      // Update local state
      const newNote = { id: newId, content: textInputValue };

      setNoteTexts((prevNotes) => [...prevNotes, newNote]);
      setTextInputValue(""); // Clear input after successful upload
    } catch (err) {
      Alert.alert("Error", "Failed to upload text. Please try again.");
      console.error("Error uploading text:", err);
    }
  };

  const uploadImageToFirebase = async (uri, studentID, semesterNo, courseid) => {
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
        await saveImageURLToDatabase(downloadURL, studentID, semesterNo, courseid);
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

  const saveImageURLToDatabase = async (url, studentID, semesterNo, courseid) => {
    try {
        // Construct the database reference using the provided parameters
        const dbPath = `students/${studentID}/semesters/semester_${semesterNo}/courses/${courseid}/notes`;
        const notesRef = firebase.database().ref(dbPath);

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
        await saveDocURLToDatabase(downloadURL, studentID, semesterNo, courseid);
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

  const saveDocURLToDatabase = async (url, studentID, semesterNo, courseid) => {
      try {
              // Construct the database reference using the provided parameters
              const dbPath = `students/${studentID}/semesters/semester_${semesterNo}/courses/${courseid}/notes`;
              const notesRef = firebase.database().ref(dbPath);

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

              Alert.alert("Success", "Image URL saved successfully!");
          } catch (err) {
              Alert.alert("Error", "Failed to save doc URL. Please try again.");
              console.error("Error saving doc URL:", err);
          }
    };

  const renderContent = () => {
    const notesData = notes ? notes : [];
    switch (toggle) {
      case "Notes":
        return (
          <NoteList
            notes={notesData}
            studentID={studentID}
            semesterNo={semesterNo}
            courseid={courseid}
            toggle={toggle}
          />
        );
      case "Images":
        return <ImageList
        imageUrls={imageUrls}
        notes={notesData}
         studentID={studentID}
         semesterNo={semesterNo}
         courseid={courseid}
         />;
      case "Files":
        return <DocumentList documentUrls={documentUrls} />;
      case "All":
      default:
        return (
          <>
            <View style={styles.allContainer}>
              <View style={styles.noteColumn}>
                <ScrollView showsVerticalScrollIndicator={false}>
                <NoteList
                  notes={notesData}
                  studentID={studentID}
                  semesterNo={semesterNo}
                  courseid={courseid}
                  toggle={toggle}
                />
                </ScrollView>
              </View>
              <View style={styles.imageColumn}>
                <ImageList
                  imageUrls={imageUrls}
                  showUploadButton={false}
                  numColumns={1}
                />
              </View>
            </View>
            <DocumentList documentUrls={documentUrls} />
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.context}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ClassNotes</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Icon source="magnify" size={26} color="#0A4081" />
          </TouchableOpacity>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, toggle === "All" && styles.active]}
            onPress={() => setToggle("All")}
          >
            <Text
              style={[styles.toggleText, toggle === "All" && styles.activeText]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, toggle === "Notes" && styles.active]}
            onPress={() => setToggle("Notes")}
          >
            <Text
              style={[styles.toggleText, toggle === "Notes" && styles.activeText]}
            >
              Notes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, toggle === "Images" && styles.active]}
            onPress={() => setToggle("Images")}
          >
            <Text
              style={[styles.toggleText, toggle === "Images" && styles.activeText]}
            >
              Images
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, toggle === "Files" && styles.active]}
            onPress={() => setToggle("Files")}
          >
            <Text
              style={[styles.toggleText, toggle === "Files" && styles.activeText]}
            >
              Files
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton}>
            <Icon source="sort" size={24} color="#0A4081" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentContainer}>
          {renderContent()}
          </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.writeButton}>
            <View style={styles.leftContainer}>
              <IconButton
                icon="plus"
                rippleColor="transparent"
                iconColor="#0A4081"
                size={24}
                onPress={handleTextUpload}
              />
              <TextInput
                underlineColor = "transparent"
                activeUnderlineColor = "transparent"
                selectionColor= "#0A4081"
                cursorColor="#0A4081"
                textColor="#0A4081"
                style={styles.writeText}
                placeholder="Write a new note..."
                value={textInputValue}
                onChangeText={setTextInputValue}

              />
            </View>
            <View style={styles.rightContainer}>
              <IconButton
                icon="camera-outline"
                rippleColor="transparent"
                iconColor="#0A4081"
                size={24}
                onPress={handleCameraOptionPress}
              />
              <IconButton
                icon="dots-vertical"
                rippleColor="transparent"
                iconColor="#0A4081"
                size={24}
                onPress={handleFileUpload}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  context: {
    flex: 1,
    marginTop: -50,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A4081",
  },
  searchButton: {
    // padding: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 16,
    marginHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  toggleButton: {
    padding: 7,
    marginBottom: -6,
  },
  active: {
    borderColor: "#0A4081",
    borderBottomWidth: 1,
    color: "#0A4081",
  },
  toggleText: {
    fontSize: 16,

  },
  activeText: {
      color: "#0A4081",
  },
  sortButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  bottomContainer: {
    padding: 16,
    position: "absolute",
    bottom: "0.1%",
    left: 0,
    right: 0,
  },
  writeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderRadius: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: "#f2f2f2",
    borderColor: "#0A4081",
    marginHorizontal: -18, // Ensure the button spans full width
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  writeText: {
    backgroundColor: "transparent",
  },
  //all
  allContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 380, // Set a fixed height for the allContainer
  },
  noteColumn: {
    width: "50%",
    marginRight: 7,
  },
  imageColumn: {
    width: "100%",
  },
});

export default NotesCard;
