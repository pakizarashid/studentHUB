import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Checkbox } from "react-native-paper";
import { setStyles } from "../components/styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const QecForm = ({ navigation, route }) => {
  const { teacherName } = route.params;

  const dummyMCQs = [
    {
      question: "1. The Instructor is prepared for each lecture.",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
    {
      question: "2. The Instructor demonstrates knowledge of the subject. ",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
    {
      question: "3. The Instructor arrives and leaves on time.",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
    {
      question:
        "4. The Instructor provides additional material apart from the text book.",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
    {
      question:
        "5. The Instructor creates the environment that is conductive to learn.",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
    {
      question: "6. The Instructor is fair in examination.",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
    {
      question: "7. The Instructor follows moral and ethical norms. ;",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
    {
      question:
        "8. The Instructor remains available for consultation during specified office hours.",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
    {
      question:
        "9. The Instructor shows respect towards students and encourages class participation.",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
    {
      question:
        "10. The Instructor returns the graded scripts etc in a reasonable duration of time.",
      choices: [
        "1. Strongly Agree",
        "2. Agree",
        "3. Uncertain Agree",
        "4. Disagree",
        "5. Strongly Disagree",
      ],
      selected: null,
    },
  ];

  const [selectedChoices, setSelectedChoices] = useState({});

  const handleCheckBoxPress = (questionIndex, choiceIndex) => {
    setSelectedChoices((prevState) => ({
      ...prevState,
      [questionIndex]: choiceIndex,
    }));
  };

  const handleSubmit = () => {
    // Handle form submission here
    navigation.goBack(); // Navigate back to TeacherListScreen
  };

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={setStyles.context}>
          <Text
            style={[
              setStyles.title,
              { textAlign: "center", fontSize: 28, marginTop: 10 },
            ]}
          >
            {teacherName}
          </Text>
          {dummyMCQs.map((mcq, index) => (
            <View
              key={index}
              style={[
                setStyles.selectedAccordion,
                { backgroundColor: "transparent" },
              ]}
            >
              <Text style={styles.subTitle}>{mcq.question}</Text>
              {mcq.choices.map((choice, choiceIndex) => (
                <TouchableOpacity
                  key={choiceIndex}
                  style={styles.choiceButton}
                  onPress={() => handleCheckBoxPress(index, choiceIndex)}
                >
                  <Checkbox
                    status={
                      selectedChoices[index] === choiceIndex
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => handleCheckBoxPress(index, choiceIndex)}
                  />
                  <Text style={styles.choiceText}>{choice}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  choiceButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
    height: 15,
    // backgroundColor: '#DDDDDD',
    justifyContent: "flex-start",
    borderRadius: 1,
    marginBottom: 5,
    marginLeft: 20,
  },
  choiceText: {
    fontSize: 10,
    marginLeft: 10,
  },
  submitButton: {
    width: "50%",
    height: 50,
    backgroundColor: "#0A4081",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 90,
    marginRight: 90,
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 20,
    color: "white",
  },
  subTitle: {
    marginTop: 10,
    color: "#0A4081",
    marginBottom: 5,
    textAlign: "center",
  },
  subTitle: {
    color: "#0A4081",
    // marginBottom: 10,
    textAlign: "left",
    fontSize: 15,
    // marginLeft:10,
    // margintop: 10,
    padding: 15,
  },
});

export default QecForm;
