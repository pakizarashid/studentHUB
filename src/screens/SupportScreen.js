import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { List, Card, PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { setStyles, setTheme } from "../components/styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SupportScreen() {
  const navigation = useNavigation();

  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const renderAnswer = (answer) => {
    if (!answer) return null; // Add this line to handle undefined answer
    const words = answer.split(" ");
    return (
      <Text style={styles.answer}>
        {words.map((word, index) => {
          if (word === "Schedule") {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  navigation.navigate("Schedule");
                }}
              >
                <Text style={styles.link}>{word}</Text>
              </TouchableOpacity>
            );
          }
          return word + " ";
        })}
      </Text>
    );
  };

  const renderPoint = (points) => {
    return points.map((point, index) => {
      return (
        <View key={index} style={styles.pointsContainer}>
          <Text style={styles.pointText}>
            {point.split(" ").map((word, wordIndex) => {
              if (word.startsWith("http") || word.startsWith("www.")) {
                return (
                  <Text
                    key={wordIndex}
                    style={setStyles.link}
                    onPress={() => openLink(word)}
                  >
                    {word}{" "}
                  </Text>
                );
              } else if (word.startsWith("Office") || word.startsWith("office")) {
                return (
                  <TouchableOpacity
                    key={wordIndex}
                    onPress={() => {
                      navigation.navigate("Location");
                    }}
                  >
                    <Text style={styles.link}>{word}{""}</Text>
                  </TouchableOpacity>
                );
              }
              return word + " ";
            })}
          </Text>
        </View>
      );
    });
  };

  const faqs = [
    {
      question: "Admission Procedure",
      answer: "Follow the Steps below",
      points: [
        "1. Visit https://gcuf.edu.pk/",
        "2. Fill out the admission form accurately and submit with required documents and pay the application processing fee",
        "3. Some programs require an entry test; check specifics.",
        "4. After the application deadline, merit lists based on qualifications and test scores will determine admission.",
        "5. Confirm admission at the university office  within the specified timeframe, pay fees, and complete any additional formalities.",
      ],
    },
    {
      question: "Academic/Admission Schedule",
      answer: "Go to the Schedule  on the Home Screen",
      points: [
        "- In August, Fall semester admissions commence, while Spring semester admissions begin in January.",
      ],
    },
    {
      question: "Queries about Admission",
      answer: "...",
      points: ["24/7 customer support"],
    },
    {
      question: "Queries about Accomodation",
      answer: "Only on-campus hostel accommodation available",
      points: [
        "1. To apply, students must check the hostel facility option in the application form.",
        "2. Facilities typically include basic amenities such as beds and access to communal facilities like kitchens and laundry rooms. ",
        "3. International students can seek guidance from the university's International Students Office.",
      ],
    },
    {
      question: "Queries about Enrollment/Summer Semester",
      answer:
        "Enrollment exclusively for students retaking failed courses of fall/spring semesters",
      points: [
        "1. Obtain and fill out the enrollment form from the university bookshop with accurate course details.",
        "2. Get the enrollment fee slip from the fee section.",
        "3. Pay the fees at the designated bank.",
        "4. Submit the form and payment to complete enrollment for the specified semester.",
      ],
    },
    {
      question: "Queries about Fees",
      points: [
        "1. Tuition fees vary by program and credit hours, due before each semester; late submissions incur fines.",
        "2. Only students who have paid fees can enroll in semester courses and attend classes and exams.",
        "4. Financial aid options like scholarships and grants are available; but late payments may result in penalties or enrollment holds.",
      ],
    },
    {
      question: "Scholarships & Funding Schemes",
      answer: "Scholarship updates availabe on ",
      points: [
        "Visit https://gcuf.edu.pk/",
        "1. Merit-based scholarships for academic excellence",
        "2. Need-based scholarships for financial assistance.",
        "3. HEC scholarships including Indigenous PhD Fellowship and Prime Minister's Fee Reimbursement Scheme..",
        "4. Research grants for faculty and student projects.",
        "5. External scholarships for additional funding opportunities",
      ],
    },
    {
      question: "How to get DMC/Degree/Result Card",
      answer: "To verify your Degree / Result Card / DMC:",
      points: [
        "1. Open https://as.gcuf.edu.pk/degree-verification/",
        "2. Complete the application form with necessary information.",
        "3. Print the Fee Voucher and Verification Form, then Submit the Verification Fee in any Bank mentioned on Fee Voucher",
        "4. Attach required documents and send them via courier to the Degree & Verification Cell Office.",
        "5. Your verified degree will be returned via courier to the provided postal address.",
      ],
    },
  ];

  return (
    <SafeAreaView style={[setStyles.context, styles.context]}>
      <PaperProvider theme={setTheme}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card mode="outlined">
            <Card.Title
              title="Frequently Asked Questions (FAQ)"
              titleStyle={[setStyles.title, styles.title]}
            />
            <Card.Content>
              <Text style={setStyles.subTitle}>
                In case you don't find your answer below, you can always contact
                us.
              </Text>
            </Card.Content>
            <Card.Content>
              <List.Section>
                {faqs.map((faq, index) => (
                  <List.Accordion
                    title={faq.question}
                    key={index}
                    left={(props) => (
                      <List.Icon {...props} icon="help-network" />
                    )}
                    style={setStyles.selectedAccordion}
                    titleNumberOfLines={5}
                    expanded={expanded === index}
                    onPress={() => toggleExpand(index)}
                  >
                    <View style={styles.answerContainer}>
                      {renderAnswer(faq.answer)}
                      {faq.points && (
                        <View style={styles.pointsContainer}>
                          {renderPoint(faq.points)}
                        </View>
                      )}
                    </View>
                  </List.Accordion>
                ))}
              </List.Section>
            </Card.Content>
          </Card>
        </ScrollView>
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  context: {
    marginTop: windowHeight * 0.01,
    marginBottom: windowHeight * 0.01,
  },
  title: {
    fontSize: 20,
  },
  answerContainer: {
    marginHorizontal: 20,
  },
  answer: {
    color: "#666",
    marginLeft: -windowWidth * 0.075,
    marginBottom: 5,
  },
  pointsContainer: {
    marginLeft: -windowWidth * 0.03,
    marginBottom: 6, // Adjust the margin bottom as needed
    textAlign: "justify",
  },
  pointText: {
    lineHeight: 20, // Adjust the line height as needed
  },
  link: {
    fontStyle: "italic",
    color: "grey", // Set your desired color for the link
  },
});
