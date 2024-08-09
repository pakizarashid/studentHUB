import React, { Fragment, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import { createUser } from "../util/auth";
import firebase from "firebase/compat/app";
import 'firebase/compat/database'

import { setStyles } from "./styles";

export default function SignUpScreen({ onBack }) {
  const { control, setFocus, handleSubmit, errors } = useForm({
    defaultValues: {
      CNIC: "",
      FName: "",
      LName: "",
      Email: "",
      setPassword: "",
    },
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const checkCNICExists = async (cnic) => {
    const snapshot = await firebase.database().ref("students").orderByChild("cnic").equalTo(cnic).once("value");
    return snapshot.exists();
  };

  const checkEmailExists = async (email) => {
    const snapshot = await firebase.database().ref("students").orderByChild("email").equalTo(email).once("value");
    return snapshot.exists();
  };

  const checkEmailAssociatedWithCNIC = async (cnic, email) => {
    const snapshot = await firebase.database().ref("students").orderByChild("cnic").equalTo(cnic).once("value");
    const students = snapshot.val();
    if (students) {
      for (const key in students) {
        if (students[key].email && students[key].email === email) {
          return true; // Email is associated with this CNIC
        }
      }
    }
    return false; // Email is not associated with this CNIC
  };

  const insertEmailForCNIC = async (cnic, email) => {
    const snapshot = await firebase.database().ref("students").orderByChild("cnic").equalTo(cnic).once("value");
    const students = snapshot.val();
    if (students) {
      const studentKeys = Object.keys(students);
      if (studentKeys.length === 1) {
        const studentKey = studentKeys[0];
        const studentRef = firebase.database().ref(`students/${studentKey}`);
        const studentData = students[studentKey];
        if (!studentData.email) {
          await studentRef.update({ email: email });
          return true; // Email inserted successfully
        } else if (studentData.email !== email) {
          throw new Error("This CNIC is already associated with an email.");
        }
      } else {
        throw new Error("Multiple students found with the same CNIC.");
      }
    } else {
      return false; // CNIC does not exist
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {

      // Step 1: Check if the submitted CNIC is present in the database
      const cnicExists = await checkCNICExists(data.CNIC);
      if (!cnicExists) {
        // Step 1.2: If CNIC does not exist, show an error message
        Alert.alert("Error", "CNIC does not exist in the database. Please enter a valid CNIC.");
        setLoading(false); // Reset loading state
        return;
      }

      const emailAssociated = await checkEmailAssociatedWithCNIC(data.CNIC, data.Email);
      if (emailAssociated) {
        // Step 1.1.2: If email is associated with the CNIC, show an error message
        Alert.alert("Error", "CNIC is already registered with an email.");
        setLoading(false);
        return;
      }

      // Step 1.1.1: If email doesn't exist, check if the entered email is already in use
      const emailExists = await checkEmailExists(data.Email);
      if (emailExists) {
        Alert.alert("Error", "Email is already in use.");
        setLoading(false);
        return;
      }

      // If CNIC exists and email checks passed, create the user account
      await createUser(data.Email, data.setPassword);
      await insertEmailForCNIC(data.CNIC, data.Email);

      Alert.alert("Success", "Account created successfully!");
      onBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const renderInputs = () => {
    return (
      <>
        <Fragment>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              {
                name: "CNIC",
                type: "text",
                textInputProps: {
                  label: "CNIC Number",
                  keyboardType: "numbers-and-punctuation",
                  maxLength: 15,
                  right: (
                    <TextInput.Icon
                      icon="smart-card-outline"
                      color={"#0A4081"}
                    />
                  ),
                },
                rules: {
                  required: {
                    value: true,
                    message: "CNIC is required",
                  },
                  pattern: {
                    value: /^\d{5}-\d{7}-\d{1}$/,
                    message: "Enter in the format: XXXXX-XXXXXXX-X",
                  },
                },
              },
              [
                {
                  name: "FName",
                  type: "text",
                  textInputProps: {
                    label: "First Name",
                    right: (
                      <TextInput.Icon
                        icon="account-edit-outline"
                        color={"#0A4081"}
                      />
                    ),
                  },
                  rules: {
                    required: {
                      value: true,
                      message: "First Name is required",
                    },
                  },
                },
                {
                  name: "LName",
                  type: "text",
                  textInputProps: {
                    label: "Last Name",
                    right: (
                      <TextInput.Icon
                        icon="account-edit-outline"
                        color={"#0A4081"}
                      />
                    ),
                  },
                  rules: {
                    required: {
                      value: true,
                      message: "Last Name is required",
                    },
                  },
                },
              ],
              {
                name: "Email",
                type: "email",
                textInputProps: {
                  label: "E-mail Address",
                  keyboardType: "email-address",
                  right: (
                    <TextInput.Icon
                      icon="email-edit-outline"
                      color={"#0A4081"}
                    />
                  ),
                },
                rules: {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter in the format: XXXX@mail.com",
                  },
                },
              },
              {
                name: "setPassword",
                type: "password",
                textInputProps: {
                  label: "Set Password",
                  secureTextEntry: true,
                  right: (
                    <TextInput.Icon
                      icon="lock-plus-outline"
                      color={"#0A4081"}
                    />
                  ),
                },
                rules: {
                  required: {
                    value: true,
                    message: "Please set a strong password",
                  },
                },
              },
            ]}
          />
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
          >
            Sign Up
          </Button>
        </Fragment>
      </>
    );
  };

  return (
    <SafeAreaView style={setStyles.context}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card mode="outlined" style={{ marginTop: 160 }}>
            <Card.Title title="SIGN UP" titleStyle={setStyles.title} />
            <Card.Content>
              {renderInputs()}
              <Button
                style={styles.button}
                onPress={onBack}
                rippleColor="transparent"
              >
                Back
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  firstNameInput: {
    flex: 1,
    marginRight: 4,
  },
  lastNameInput: {
    flex: 1,
    marginLeft: 4,
  },
  input: {
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 5,
  },
  button: {
    marginHorizontal: 100,
    marginTop: 10,
  },
});