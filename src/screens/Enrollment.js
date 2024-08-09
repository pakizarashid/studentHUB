import React, { Fragment } from "react";
import { Alert, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Button, Card, PaperProvider, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setStyles, setTheme } from "../components/styles";

export default function Enrollment() {
  const { control, setFocus, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      CNIC: "",
      FullName: "",
      fatherName: "",
      coursetitle: "",
      Registration: "",
      setPassword: "",
      Semesternum: "",
      Coursecode: "",
      firstattempt: "",
      teacher: "",
      department: "",
      program: "",
      session: "",
      faculty: "",
    },
    mode: "onChange",
  });

  const formConfig = [
    { name: "FullName", label: "Name of Student", icon: "account-edit-outline", rules: { required: true, message: "Name is required" } },
    { name: "fatherName", label: "Father's Name", icon: "account-edit-outline", rules: { required: true, message: "Father's Name is required" } },
    { name: "department", label: "Department", icon: "home-outline", rules: { required: true, message: "Department Name is required" } },
    { name: "faculty", label: "Faculty", icon: "circle-outline", rules: { required: true, message: "Faculty Name is required" } },
    { name: "program", label: "Program", icon: "book", rules: { required: true, message: "Department Name is required" } },
    { name: "session", label: "Session", icon: "calendar-outline", keyboardType: "numbers-and-punctuation", maxLength: 15, rules: { required: true, message: "Session is required" }, pattern: /^\d{4}-\d{4}$/ },
    { name: "CNIC", label: "CNIC Number", icon: "badge-account-horizontal-outline", keyboardType: "numbers-and-punctuation", maxLength: 15, rules: { required: "CNIC is required", pattern: { value: /^\d{5}-\d{7}-\d{1}$/, message: "Enter in the format: XXXXX-XXXXXXX-X" } } },
    { name: "Registration", label: "Registration Number", icon: "card-outline", maxLength: 15, rules: { required: true, message: "Registration Number is required" }, pattern: /^\d{4}-[A-Z]{4}-\d{5}$/ },
    { name: "Semesternum", label: "Semester", icon: "book-outline", maxLength: 2 },
    { name: "coursetitle", label: "Course Title", icon: "book-outline" },
    { name: "Coursecode", label: "Course Code", icon: "book-outline", maxLength: 10 },
    { name: "firstattempt", label: "Marks/Grade in first Attempt", icon: "book-outline" },
    { name: "teacher", label: "Teacher Name", icon: "account-outline" },
  ];

  const renderInputs = () => {
    return (
      <Fragment>
      <FormBuilder
        control={control}
        setFocus={setFocus}
        formConfigArray={formConfig.map(config => ({
          name: config.name,
          type: "text",
          textInputProps: {
          label: config.label,
          right: <TextInput.Icon icon={config.icon} color={"#0A4081"} />
        },
        rules: config.rules,
        pattern: config.pattern,
        }))}
      />
      </Fragment>
    );
  };

  const onSubmit = (data) => {
    console.log("Form data: ", data);
    Alert.alert("Form Submitted");
    // Handle form submission here
  };

  return (
    <GestureHandlerRootView>
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : null}
    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={[setStyles.context, {marginTop: 3}]}>
          <PaperProvider theme={setTheme}>
            <Card mode="outlined" style={{marginBottom:60}}>
              <Card.Title title="Enrollment Form (for FAILED Students)" titleStyle={setStyles.title} />
              <Card.Content>
                {renderInputs()}
                <Button mode="contained" style={styles.button} onPress={handleSubmit(onSubmit)}>
                Submit
                </Button>
              </Card.Content>
            </Card>
          </PaperProvider>
        </SafeAreaView>
      </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // input: {
  //   marginBottom: 10,
  // },
  button: {
    marginHorizontal: 100,
    marginTop: 10,
  },
});


