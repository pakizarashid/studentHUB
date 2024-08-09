import React, { useState } from "react";
import { StyleSheet, ScrollView, View, Text, Linking, Dimensions } from "react-native";
import { List, Card, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { setStyles, setTheme } from "../components/styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function FinancialAid() {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };


  const renderAnswer = (points) => {
    return points.split(" ").map((word, index) => {
      if (word.startsWith("http") || word.startsWith("www.")) {
        return (
          <Text key={index} style={styles.link} onPress={() => openLink(word)}>
            {word}{" "}
          </Text>
        );
      }
      return <Text key={index}>{word} </Text>;
    });
  };

  const faqs = [
    {
      question: "Eligibility Criteria for Financial Aid",
      answer: "Follow the Steps below",
      points:["1.  Financial aid eligibility criteria vary depending on the institution and the type of aid." ,
      "2. Generally, eligibility is determined based on factors such as financial need, academic performance, citizenship status, and enrollment status",
      "3.Some institutions may also consider factors like community involvement, leadership qualities, and specific demographics. ",
      
     ]
    },
    {
      question: "What are some examples of need-based scholarships available?",
      answer:" Few of the Need based Scholarships that the Government of Pakistan Offers are as follow :" ,
      points:[ "1. Prime Minister's Scholarship Program (PMSP): Provides financial assistance to talented and deserving students from less developed areas.",
              "2. Higher Education Commission (HEC) Need-Based Scholarships: Supports students with financial constraints pursuing undergraduate and postgraduate studies.",
              "3. Benazir Income Support Program (BISP) Scholarship: Aims to uplift socio-economic status by providing financial aid to needy students.",
              "4. Punjab Educational Endowment Fund (PEEF) Scholarships: Offers scholarships to deserving students based on financial need and academic merit.",
              "5. Sindh Endowment Fund (SEF) Scholarships: Provides financial support to students from Sindh province with limited financial resources.",
              "6. Balochistan Educational Endowment Fund(BEEF)Scholarships: Assists talented students from Balochistan in pursuing higher education by offering financial aid.",
      ]
    },
   
    {
      question: "How can we Apply for Need Based Scholarships?",
      answer: "The easiest way to apply for these scholarships is to visit their respective websites, where you'll find detailed information and application procedures. Follow the instructions provided on each website to register, complete the application form, and submit the required documents online. Be sure to check the eligibility criteria before applying.",
      points:[ "1.Prime Minister's Scholarship Program (PMSP): https://pmyp.gov.pk/pmyphome/Scholarship",
      "2. Higher Education Commission (HEC) Need-Based Scholarships: https://www.hec.gov.pk/english/scholarshipsgrants ",
      "3. Benazir Income Support Program (BISP) Scholarship: https://bisp.gov.pk/",
      "4. Punjab Educational Endowment Fund (PEEF) Scholarships: https://www.peef.org.pk/peef-scholarships",
      "5. Sindh Endowment Fund (SEF) Scholarships: https://sef.org.pk/ ",
      "6. Balochistan Educational Endowment Fund(BEEF)Scholarships: https://beef.org.pk/ ",
      ]
    },
    {
      question: "Which documents are typically required when applying for scholarships?",
      answer: "The Documents that are compulsory for applying for Financial Aid/ Scholarship are :",
      points:["1.  Completed scholarship application form.",
      "2. Academic transcripts or records.",
      "3. Letters of recommendation from teachers, counselors, or community leaders.",
      "4. Personal statement or essay.",
      "5. Proof of financial need, such as the Free Application for Federal Student Aid (FAFSA) or other financial aid forms.",
      "6. Any additional documents requested by the scholarship provider, such as proof of citizenship or residency. ",

      ]
    },
    {
      question: "Can International students apply for financial aid or scholarships?",
      answer: "Yes, International students can also apply for the scholarships. ",
      points:["1. Seek guidance from university financial aid offices or international student advisors.",
      "2. Research scholarship opportunities for international students.",
      "3. Review eligibility criteria and application requirements carefully.",
      "4. Prepare necessary documents, including academic transcripts and letters of recommendation.",
      "5. Submit completed applications before the specified deadlines.",
      ]
    },
    {
      question: "How are scholarship recipients selected?",
      answer: "Scholarship selection criteria depends on different factors, it also vary from institution to institution..",
      points:["1. Merit-based Scholarships: Awarded based on academic performance.",
    "2. Need-based Scholarships: Provided to students with financial need.",
  "3. HEC Scholarships: Participation in programs like Indigenous PhD Fellowship, Need-Based Scholarship, and Prime Minister's Fee Reimbursement Scheme.",
"4. Research Grants: Funding opportunities for faculty and student research projects.",
"5. External Scholarships: Assistance for students seeking scholarships from various organizations.",
"6. Scholarship committees may review applications and assess candidates based on these criteria. ",
"7. In some cases, finalists may be invited for interviews or additional evaluation before scholarship recipients are chosen.",
"8. Recipients are typically notified by email or mail, and scholarship awards may be disbursed directly to the student's educational institution to cover tuition, fees, and other educational expenses. ",
]
    },
   
    
  ];

  return (
    <SafeAreaView style={styles.context}>
      <PaperProvider theme={setTheme}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card mode="outlined">
            <Card.Title
              title="Frequently Asked Questions (FAQ)"
              titleStyle={styles.title}
            />
            <Card.Content>
              <Text style={styles.subTitle}>
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
                    style={styles.item}
                    titleNumberOfLines={5}
                    expanded={expanded === index}
                    onPress={() => toggleExpand(index)}
                  >
                    <View style={styles.answerContainer}>
                      <Text style={styles.answer}>{faq.answer}</Text>
                      {faq.points && (
                        <View style={styles.pointsContainer}>
                          {faq.points.map((point, pointIndex) => (
                            <Text
                              key={pointIndex}
                            >
                              {renderAnswer(point)}{'\n'}
                              {/* - {point} */}
                            </Text>
                          ))}
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
    flex: 1,
    marginTop: windowHeight * 0.01,
    marginHorizontal: 10,
  },
  title: {
    color: "#0A4081",
    fontWeight: "bold",
    fontSize: 20,
  },
  subTitle: {
    color: "#0A4081",
    marginBottom: 5,
    textAlign: "center",
  },
  item: {
    marginBottom: 5,
    backgroundColor: "rgba(10,64,129,0.12)",
    borderRadius: windowHeight * 0.05,
  },
  answerContainer: {
    marginHorizontal: 20,
  },
  answer: {
    color: "#666",
    marginLeft: -windowWidth * 0.075,
    marginBottom: 5,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 13,
  },
  pointsContainer: {
    marginLeft: -windowWidth * 0.05,
  },
});
