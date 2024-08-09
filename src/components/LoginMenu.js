import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { login, sendPasswordResetEmail } from "../util/auth";
import { DataProvider, useData } from "../contexts/DataContext";

import { setStyles } from "./styles";

const InputField = ({
  label,
  icon,
  onPressIcon,
  value,
  onChangeText,
  iconColor = "#0A4081", // Use JavaScript default parameter
  ...rest
}) => {
  return (
    <TextInput
      mode="outlined"
      label={label}
      value={value}
      onChangeText={onChangeText}
      right={
        <TextInput.Icon icon={icon} onPress={onPressIcon} color={iconColor} />
      }
      style={{ marginBottom: 2 }}
      {...rest}
    />
  );
};

const CustomButton = ({ children, onPress, ...rest }) => {
  return (
    <Button {...rest} onPress={onPress} rippleColor="transparent">
      {children}
    </Button>
  );
};

export default function LoginScreen({ onSignUp, onLoginSuccess }) {
  const navigation = useNavigation();
  const { storeUserData } = useData(); // Use the useData hook to access storeUserData function

  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [forgetPasswordMode, setForgetPasswordMode] = useState(false);
  const [userData, setUserData] = useState(null); // Initialize userData state

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleForgetPassword = () => {
    setForgetPasswordMode(true);
  };

  const handleLoginSuccess = async () => {
    try {
      const response = await login(email, password); // Log in and get the response

      if (!response || !response.userData) {
        throw new Error("Invalid login response");
      }

      const { userData } = response;

      if (email.endsWith("@example.com")) {
        // If the email is admin or teacher and userData is valid
        storeUserData(userData); // Set user data in component state
        navigation.reset({
          index: 0,
          routes: [{ name: "Teacher", params: { userData } }], // Route to AdminPortal
        });
      } else {
        // If the email is not admin or teacher, or if userData is invalid
        storeUserData(userData); // Set user data in component state
        navigation.reset({
          index: 0,
          routes: [{ name: "Main", params: { userData } }], // Route to Main
        });
      }
    } catch (error) {
      let errorMessage =
        "An error occurred while logging in. Please try again.";
      console.error(errorMessage, error);
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      const { userData } = await login(email, password);
      // Pass userData to the DataProvider
      setUserData(userData);

      handleLoginSuccess();
    } catch (error) {
      let errorMessage =
        "An error occurred while logging in. Please try again.";

      if (error.response) {
        // The request was made and the server responded with a status code
        const { status, data } = error.response;
        if (status === 400) {
          // Bad Request - Invalid email or password
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (status === 401) {
          // Unauthorized - Incorrect email or password
          errorMessage = "Incorrect email or password. Please try again.";
        }
        console.error(`Login error status: ${status}`, data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", error.message);
      }

      alert(errorMessage);
    }
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(email);
      alert("Password reset email sent. Check your inbox.");
    } catch (error) {
      console.error("Password reset error:", error);
      alert("An error occurred while sending the password reset email.");
    }
  };

  return (
    <DataProvider userData={userData}>
      <SafeAreaView style={setStyles.context}>
        <Card mode="outlined">
          <Card.Title
            title={forgetPasswordMode ? "Forget Password" : "WELCOME"}
            titleStyle={setStyles.title}
          />
          <Card.Content>
            {forgetPasswordMode ? (
              <>
                <InputField
                  label="CNIC"
                  placeholder="Enter your CNIC Number"
                  icon="card-account-details-outline"
                  value={cnic}
                  onChangeText={setCnic}
                />
                <InputField
                  label="E-mail"
                  placeholder="Enter your E-mail Address"
                  icon="email-edit-outline"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
                <CustomButton
                  mode="contained"
                  style={styles.button}
                  onPress={handleReset}
                >
                  Submit
                </CustomButton>
                <CustomButton
                  mode="text"
                  onPress={() => setForgetPasswordMode(false)}
                >
                  Back
                </CustomButton>
              </>
            ) : (
              <>
                <InputField
                  label="Email"
                  icon="account"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none" // This line sets caps lock off by default
                />
                <InputField
                  label="Password"
                  icon={passwordVisible ? "lock" : "lock-open"}
                  secureTextEntry={passwordVisible}
                  onPressIcon={togglePasswordVisibility}
                  value={password}
                  onChangeText={setPassword}
                />
                <CustomButton
                  icon="account-question"
                  onPress={handleForgetPassword}
                >
                  Forget Password
                </CustomButton>
                <CustomButton
                  mode="contained"
                  style={setStyles.button}
                  onPress={handleLogin}
                  // onPress={handleLoginSuccess}
                >
                  Login
                </CustomButton>
                <CustomButton
                  mode="contained-tonal"
                  style={setStyles.button}
                  buttonColor="rgba(10,64,129,0.12)"
                  onPress={onSignUp}
                >
                  Sign up
                </CustomButton>
              </>
            )}
          </Card.Content>
        </Card>
      </SafeAreaView>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 100,
    marginTop: 10,
    marginBottom: 0,
  },
});
