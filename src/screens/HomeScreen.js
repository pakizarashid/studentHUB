import React, { useState, useEffect } from "react";
import { Platform, Keyboard } from "react-native";
import { PaperProvider } from "react-native-paper";

import LoginScreen from "../components/LoginMenu";
import SignUpScreen from "../components/SignUpMenu";
import BottomMenuScreen from "../components/BottomMenu";

import { setTheme } from "../components/styles";
import { useData } from "../contexts/DataContext";

export default function HomeScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { userData } = useData(); // Access userData from the DataContext

  useEffect(() => {
    const keyboardShowEvent =
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
    const keyboardHideEvent =
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";

    const keyboardDidShowListener = Keyboard.addListener(
      keyboardShowEvent,
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      keyboardHideEvent,
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <PaperProvider theme={setTheme}>
      {isSignUp ? (
        <SignUpScreen onBack={() => setIsSignUp(false)} />
      ) : (
        <LoginScreen onSignUp={handleToggleSignUp} />
      )}

      {Platform.OS === "android" ? (
        !isKeyboardVisible && <BottomMenuScreen />
      ) : (
        <BottomMenuScreen />
      )}
    </PaperProvider>
  );
}
