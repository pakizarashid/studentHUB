import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { firestore } from "../util/firebaseConfig";

const MessageItem = ({ message }) => {
  const { message_content, timestamp } = message;
  const readableTimestamp = timestamp
    ? new Date(timestamp.seconds * 1000).toLocaleString()
    : "Unknown time";

  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{message_content}</Text>
      <Text style={styles.timestamp}>{readableTimestamp}</Text>
    </View>
  );
};

const Messages = ({ route }) => {
  const { classId, teacherId, userData } = route.params;
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const classDocRef = firestore.collection("classes").doc(classId);
        const classDoc = await classDocRef.get();

        if (!classDoc.exists) {
          return;
        }

        const classData = classDoc.data();
        const studentId = Object.keys(userData)[0];

        const isStudentInClass = classData.students.includes(studentId);
        const isTeacherInClass = classData.teachers.includes(teacherId);

        if (!isStudentInClass && !isTeacherInClass) {
          throw new Error("You are not authorized to view these messages.");
        }

        const unsubscribe = firestore
          .collection(`classes/${classId}/messages`)
          .where("sender_id", "==", teacherId) // Filter messages by sender_id
          .orderBy("timestamp")
          .onSnapshot(
            (snapshot) => {
              const messagesData = snapshot.docs.map((doc) => doc.data());
              setMessages(messagesData);
              setIsLoading(false);
            },
            (err) => {
              console.error("Error fetching messages:", err);
              setError("Error fetching messages.");
              setIsLoading(false);
            }
          );

        return () => unsubscribe();
      } catch (err) {
        console.error("Error authorizing student:", err);
        setError("Error authorizing student.");
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [classId, teacherId, userData]);

  const renderItem = ({ item }) => <MessageItem message={item} />;
  const keyExtractor = (item, index) =>
    `${item.timestamp ? item.timestamp.seconds : "unknown"}_${index}`;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A4081" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.container}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    color: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    textAlign: "center",
  },
  messageContainer: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "rgba(10,64,129,0.12)",
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#0A4086"
  },
  timestamp: {
    fontSize: 10.5,
    color: "rgba(10,64,129,0.5)",
    alignSelf: "flex-end",
  },
});

export default Messages;
