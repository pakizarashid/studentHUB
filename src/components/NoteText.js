import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const NoteList = ({ notes, studentID, semesterNo, courseid, toggle }) => {
  const [noteTextArray, setNoteTextArray] = useState([]);

  useEffect(() => {
    if (!notes) return; // Ensure notes is defined
    try {
      const updatedNoteTextArray = [];
      notes.forEach((note) => {
        if (note.noteText && note.noteText.length > 0) {
          // Check if note.noteText is defined and not empty
          note.noteText.forEach((text) => {
            updatedNoteTextArray.push(text.content);
          });
        }
      });
      setNoteTextArray(updatedNoteTextArray);
    } catch (error) {
      console.error("Error processing notes:", error);
    }
  }, [notes]);
  

  const handleDeleteNote = async (index) => {
    try {
      const noteRef = firebase
        .database()
        .ref(`students/${studentID}/semesters/semester_${semesterNo}/courses/${courseid}/notes/0/noteText`);
      
      noteRef.once("value", (snapshot) => {
        const data = snapshot.val();
        
        if (data && data[index]) {
          data.splice(index, 1);

          noteRef
            .set(data)
            .then(() => {
              const updatedNoteTextArray = [...noteTextArray];
              updatedNoteTextArray.splice(index, 1);
              setNoteTextArray(updatedNoteTextArray);
            })
            .catch((error) => {
              console.error("Error deleting note text:", error);
            });
        }
      });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <>
      {noteTextArray.map((text, index) => (
        <View key={index} style={styles.containerItem}>
          <Text style={styles.itemText}>{text}</Text>
          {toggle !== "All" && (
            <TouchableOpacity onPress={() => handleDeleteNote(index)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(10,64,129,0.12)",
    borderRadius: 20,
    marginVertical: 6,
    minHeight: 100,
  },
  itemText: {
    fontSize: 18,
    color: "#0A4081",
    fontWeight: "500",
  },
  //   itemTime: {
  //     fontSize: 14,
  //     color: "#666",
  //   },
  // });
});

export default NoteList;
