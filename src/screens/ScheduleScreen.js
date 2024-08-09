import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import {
  Card,
  Portal,
  Modal,
  DataTable,
  Provider as PaperProvider,
  Surface,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { setStyles, setTheme } from "../components/styles";

const windowHeight = Dimensions.get("window").height;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const responsiveWidth = (percentage) => {
  return screenWidth * (percentage / 100);
};

const responsiveHeight = (percentage) => {
  return screenHeight * (percentage / 100);
};

const MonthData = [
  {
    name: "January",
    show: "Final Exams",
    admi: "Spring-Admission Test",
    gradient: ["#ADD8E6", "#ADD8E6"],
    data: [
      { description: "Fall-Classes Resumption", date: "Jan 1 to 5, 2024" },
      { description: "Spring-Admission Test", date: "Jan 6 to 7, 2024" },
      { description: "Fall-Final Exams", date: "Jan 8 to 12, 2024" },
      { description: "Fall-Result", date: "Jan 26, 2024" },
      { description: "Spring-Fee Submission", date: "Jan 15 to 26, 2024" },
      { description: "Spring-Semester Start", date: "Jan 29, 2024" },
    ],
  },
  {
    name: "February",
    show: "Spring Classes",
    gradient: ["#CEEF85", "#CEEF85"],
    data: [{ description: "Spring-Classes", date: "Feb 1 to 29, 2024" }],
  },
  {
    name: "March",
    show: "Mid Exams",
    gradient: ["#CEEF85", "#CEEF85"],
    data: [
      { description: "Spring-Mid Exam", date: "March 18 to 22, 2024" },
      { description: "Classes Resumption", date: "March 25 to 29, 2024" },
    ],
  },
  {
    name: "April",
    show: "Ramadan | Eid Break",
    gradient: ["#FFA07A", "#CEEF85"],
    data: [
      { description: "Ramadan/Eid Break", date: "April 1 to 12, 2024" },
      { description: "Classes Resume", date: "April 15, 2024" },
    ],
  },
  {
    name: "May",
    show: "Classes",
    gradient: ["#CEEF85", "#CEEF85"],
    data: [{ description: "Spring-Classes", date: "May 1 to 31, 2024" }],
  },
  {
    name: "June",
    show: "Final Exams",
    gradient: ["#CEEF85", "#CEEF85"],
    data: [
      { description: "Spring-Final Exam", date: "June 10 to 14, 2024" },
      { description: "Spring-Result", date: "June 28, 2024" },
    ],
  },
  {
    name: "July",
    show: "Summer Semester",
    admi: "Fall Admission",
    gradient: ["#FFA07A", "#FFD700", "#FFC0CB"],
    data: [
      {
        description: "Summer-Semester Registration",
        date: "July 1 to 5, 2024",
      },
      { description: "Summer-Classes Start", date: "July 8, 2024" },
      { description: "Summer-Mid Exam", date: "July 22, 2024" },
      { description: "Fall Admission 2024", date: "July 20 to Aug 10, 2024" },
    ],
  },
  {
    name: "August",
    show: "Summer Vacations",
    admi: "Fall-Admission Test",
    gradient: ["#FFA07A", "#FFA07A"],
    data: [
      { description: "Fall Admission Test", date: "Aug 16 to 17, 2024" },
      { description: "Summer-Final Exam", date: "Aug 19 to 23, 2024" },
      { description: "Summer-Result", date: "Aug 30, 2024" },
      { description: "Fall-Fee Submission", date: "Aug 19 to 30, 2024" },
    ],
  },
  {
    name: "September",
    show: "Fall Classes",
    gradient: ["#ADD8E6", "#ADD8E6"],
    data: [{ description: "Fall-Semester Start", date: "Sep 4, 2024" }],
  },
  {
    name: "October",
    show: "Classes",
    gradient: ["#ADD8E6", "#ADD8E6"],
    data: [
      { description: "Fall-Classes", date: "Oct 1 to 27, 2024" },
      { description: "Fall-Mid Classes", date: "Oct 30-31, 2024" },
    ],
  },
  {
    name: "November",
    show: "Mid Exams",
    gradient: ["#ADD8E6", "#ADD8E6"],
    data: [
      { description: "Fall-Mid Classes", date: "Nov 1 to 3, 2024" },
      { description: "Fall-Classes Resumption", date: "Nov 6, 2024" },
    ],
  },
  {
    name: "December",
    show: "Winter Vactions",
    admi: "Spring Admission",
    gradient: ["#ADD8E6", "#FFC0CB", "#FFA07A"],
    data: [
      { description: "Fall-Classes", date: "Dec 1 to 22, 2024" },
      { description: "Winter Vactions", date: "Dec 25 to 29, 2024" },
      { description: "Spring Admission 2025", date: "Dec 1 to 29, 2024" },
    ],
  },
];

const semesterData = [
  { name: "Fall", description: "Semester", backgroundColor: "#ADD8E6" },
  { name: "Spring", description: "Semester", backgroundColor: "#CEEF85" },
  { name: "Summer", description: "Semester", backgroundColor: "#FFD700" },
  { description: "Vacation", backgroundColor: "#FFA07A" },
  { description: "Admission", backgroundColor: "#FFC0CB" },
];

export default function ScheduleScreen() {
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const showModal = (month) => {
    setSelectedMonth(month);
    setVisibleModal(true);
  };

  const hideModal = () => setVisibleModal(false);

  const MonthItem = ({ month, onPress }) => {
    return (
      <View style={styles.surfaceContainer}>
        <TouchableOpacity
          onPress={() => onPress(month)}
          style={[styles.touchableOpacity]}
        >
          <LinearGradient
            colors={month.gradient}
            style={[styles.linearGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={{ textAlign: "center" }}>{month.show}</Text>
            <Text style={{ color: "grey", fontSize: 8 }}>{month.admi}</Text>
            <Text
              style={{
                color: "grey",
                fontSize: 12,
                textDecorationLine: "underline",
              }}
            >
              more
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.text}>{month.name}</Text>
      </View>
    );
  };

  const MonthModal = ({ month }) => {
    return (
      <View style={{ backgroundColor: "white" }}>
        <Text style={[setStyles.title, { textAlign: "center" }]}>{month.name}</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title numeric>Date</DataTable.Title>
          </DataTable.Header>
          {month.data.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{item.description}</DataTable.Cell>
              <DataTable.Cell numeric>{item.date}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    );
  };

  const renderMonthItems = () => {
    return MonthData.reduce((rows, month, index) => {
      if (index % 3 === 0) rows.push([]);
      const rowIndex = Math.floor(index / 3);
      rows[rowIndex].push(
        <MonthItem key={month.name} month={month} onPress={showModal} />
      );
      return rows;
    }, []);
  };
  
  const SemesterItem = ({ semester }) => {
    return (
      <View style={styles.surfaceContainer}>
        <Surface
          style={[
            styles.surface,
            { backgroundColor: semester.backgroundColor },
          ]}
          elevation={4}
        >
          <Text style={styles.surfaceText}>{semester.name}</Text>
        </Surface>
        <Text style={styles.text2}>{semester.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[setStyles.context, styles.context]}>
      <PaperProvider theme={setTheme}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card mode="outlined">
            <Card.Title title="CALENDER" titleStyle={setStyles.title} />
            <Card.Content>
              {renderMonthItems().map((row, index) => (
                <View key={index} style={styles.rowContainer}>
                  {row}
                </View>
              ))}
              <Portal>
                <Modal
                  visible={visibleModal}
                  onDismiss={hideModal}
                  contentContainerStyle={styles.containerStyle}
                >
                  {selectedMonth && <MonthModal month={selectedMonth} />}
                </Modal>
              </Portal>
            </Card.Content>

            <Card.Content>
              <View style={styles.rowContainer}>
                {semesterData.map((semester, index) => (
                  <SemesterItem key={index} semester={semester} />
                ))}
              </View>
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
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 15,
    marginTop: -121,
    margin: 15,
    height: 550,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  surfaceContainer: {
    alignItems: "center",
  },
  touchableOpacity: {
    height: 100,
    width: 100,
  },
  text: {
    marginTop: 1,
    marginBottom: 3,
  },
  surface: {
    marginTop: responsiveHeight(5),
    marginBottom: responsiveHeight(1),
    height: 30,
    width: 50,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  surfaceText: {
    fontSize: 10,
  },
  text2: {
    marginTop: 1,
    marginBottom: 3,
    fontSize: 10,
  },
  linearGradient: {
    flex: 1,
    padding: 5,
    height: 100,
    width: 100,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
