import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert
} from "react-native";
import { Icon } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const ImageList = ({
  imageUrls = [],
  showUploadButton = true,
  numColumns = 2,
  studentID, semesterNo, courseid
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImages, setLoadingImages] = useState([]); 

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
        await uploadImageToFirebase(uri, studentID, semesterNo, courseid);
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
          await uploadImageToFirebase(uri, studentID, semesterNo, courseid);
        } else {
          console.log("No image assets found in the picker result.");
        }
      } else {
        console.log("Image selection cancelled by the user.");
      }
    };

    const handleImageOptionPress = () => {
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

  const handleUploadPress = async () => {
    try {
      if (selectedOption === "camera") {
        await launchCamera();
      }
      if (selectedOption === "library") {
        await launchImageLibrary();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderPhoto = ({ item }) => {
    const isLoading = loadingImages[item]; // Check if the image is loading

    return (
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: item }}
          style={styles.photo}
          onLoadStart={() =>
            setLoadingImages((prev) => ({ ...prev, [item]: true }))
          }
          onLoadEnd={() =>
            setLoadingImages((prev) => ({ ...prev, [item]: false }))
          }
        />
        {isLoading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0A4081" />
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (item.id === "upload" && showUploadButton) {
      return (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImageOptionPress}
        >
          <Icon source="plus" size={44} color="#0A4081" />
        </TouchableOpacity>
      );
    }
    return renderPhoto({ item });
  };

  const dataWithUploadButton = showUploadButton
    ? [{ id: "upload" }, ...imageUrls]
    : imageUrls;

  return (
    <View>
      <FlatList
        data={dataWithUploadButton}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No images</Text>}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  //image
  container2: {
    flex: 1,
    alignItems: "center",
  },
  gridContainer: {},

  photoContainer: {
    margin: 4,
    width: "48%",
    height: 180,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  uploadButton: {
    width: "48%",
    // width: "100%",
    height: 180,
    margin: 4,
    borderRadius: 10,
    backgroundColor: "rgba(10,64,129,0.06)",
    alignItems: "center",
    justifyContent: "center",
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
  loadingIndicator: {
    marginVertical: 20,
  },
  emptyMessage: {
    // textAlign: "center",
    marginHorizontal: 40,
    marginVertical: 40,
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
});

export default ImageList;