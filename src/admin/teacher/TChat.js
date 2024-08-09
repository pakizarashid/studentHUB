import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useData } from "../../contexts/DataContext";
import firebase from "firebase/compat/app";
import { firestore } from "../../util/firebaseConfig";

const Message = ({ message }) => {
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

const TChat = ({ route }) => {
  const { classId } = route.params; // Get the class ID from the route parameters
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [containerMargin, setContainerMargin] = useState(20); // Initial marginBottom
  const currentUser = useData(); // Get current user
  const userId = Object.keys(currentUser.userData)[0];

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setContainerMargin(0); // Set marginBottom to zero when keyboard is shown
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setContainerMargin(20); // Reset marginBottom when keyboard is hidden
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("classes")
      .doc(classId)
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const messagesData = snapshot.docs.map((doc) => doc.data());
        setMessages(messagesData);
      });

    return () => {
      unsubscribe();
    };
  }, [classId]);

  const handleSend = async () => {
    if (!currentUser || !userId) {
      console.error("No current user or user ID.");
      return;
    }

    try {
      // Log the userId and classId for debugging
      console.log("User ID:", userId);
      console.log("Class ID:", classId);

      // Fetch the class data from Firestore
      const classDocRef = firestore.collection("classes").doc(classId);
      const classDoc = await classDocRef.get();
      const classData = classDoc.data();
      console.log("Class Data:", classData);

      // Check if the current user is a teacher of the class
      if (classData && classData.teachers && classData.teachers.includes(userId)) {
        const newMessage = {
          message_content: inputText,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          sender_id: userId,
          is_read: false,
        };
        setInputText("");
        await firestore
          .collection("classes")
          .doc(classId)
          .collection("messages")
          .add(newMessage);
      } else {
        console.error("User is not authorized to send a message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessageItem = ({ item }) => <Message message={item} />;
  const keyExtractor = (item, index) =>
    `${item.timestamp ? item.timestamp.seconds : "unknown"}_${index}`;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { marginBottom: containerMargin }]}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.messages}
      />
      <View style={[styles.inputContainer, { bottom: keyboardHeight - 400 }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            handleSend();
            inputRef.current.blur();
          }}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  messages: {
    flexGrow: 1,
    padding: 3,
  },
  messageContainer: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: "rgba(10,64,129,0.12)",
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#0A4081",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  inputContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    top: 300,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    height: 60,
    borderColor: "#0A4081",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 7,
  },
  sendButton: {
    backgroundColor: "#0A4081",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TChat;
