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

const Message = ({ message }) => {
  const { text, timestamp } = message;
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{text}</Text>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      key: "1",
      text: "Salam, how are you?",
      timestamp: "12:00 PM",
    },
    {
      key: "2",
      text: "Great to hear about you!",
      timestamp: "12:05 PM",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [containerMargin, setContainerMargin] = useState(20); // Initial marginBottom

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

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          key: Date.now().toString(),
          text: inputText,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setInputText("");
    }
  };

  const renderMessageItem = ({ item }) => <Message message={item} />;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { marginBottom: containerMargin }]}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.messages}
      />
      <View style={[styles.inputContainer, { bottom: keyboardHeight }]}>
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
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: "#0A4081",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0A4081",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Chat;