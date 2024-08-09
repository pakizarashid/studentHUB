import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Linking,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Avatar, Card, List, PaperProvider } from "react-native-paper";
import { setStyles, setTheme } from "../components/styles";
import { useData } from "../contexts/DataContext";
import fetchTeachersInfo from "../util/teachersModule";

const Staff = () => {
  const { userData } = useData();
  const [teachersInfo, setTeachersInfo] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (userData) {
      const studentId = Object.keys(userData)[0];
      const studentData = userData[studentId];
      const semesters = studentData.semesters;

      const teacherIds = [];
      Object.values(semesters).forEach((semester) => {
        if (semester.courses) {
          Object.values(semester.courses).forEach((course) => {
            if (!teacherIds.includes(course.teacher)) {
              teacherIds.push(course.teacher);
            }
          });
        }
      });

      const fetchData = async () => {
        const allTeachersInfo = await fetchTeachersInfo();
        const filteredTeachers = allTeachersInfo.filter((teacher) =>
          teacherIds.includes(teacher.id)
        );
        setTeachersInfo(filteredTeachers);
      };

      fetchData();
    }
  }, [userData]);

  const openGmail = (email) => {
    const mailtoUrl = `mailto:${email}`;
    Linking.openURL(mailtoUrl).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  const showModal = (teacher) => {
    setSelectedTeacher(teacher);
    setModalVisible(true);
  };

  const hideModal = () => {
    setSelectedTeacher(null);
    setModalVisible(false);
  };

  const [animatedValue] = useState(new Animated.Value(0));
  const handleAvatarPress = (teacher) => {
    // Add animation to the avatar
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setSelectedTeacher(teacher);
      setModalVisible(true);
      animatedValue.setValue(0);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={setStyles.context}>
        <PaperProvider theme={setTheme}>
          {teachersInfo.length > 0 ? (
            teachersInfo.map((teacher, index) => (
              <TouchableOpacity
                key={index}
                style={{ marginVertical: 8 }}
                onPress={() => openGmail(teacher.email)}
              >
                <Card mode="contained" style={styles.card}>
                  <View style={styles.cardContainer}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{teacher.name}</Text>
                      <Text style={styles.email}>{teacher.email}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.img}
                      onPress={() => handleAvatarPress(teacher)}
                      activeOpacity={1} // Disable default TouchableOpacity opacity effect
                    >
                      <Animated.Image
                        style={[
                          styles.avatar,
                          {
                            transform: [
                              {
                                scale: animatedValue.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [1, 0.9], // Adjust the scale as needed
                                }),
                              },
                            ],
                          },
                        ]}
                        source={require("../../assets/icon.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Loading.....</Text>
          )}
          <Modal
            visible={modalVisible}
            onRequestClose={hideModal}
            transparent={true}
          >
            <TouchableOpacity
              style={styles.modalContainer}
              activeOpacity={1}
              onPressOut={hideModal}
            >
              <View style={styles.modalContent}>
                <ScrollView>
                  <List.Section>
                    <List.Subheader style={styles.subHeader}>
                      Teacher Details
                    </List.Subheader>
                    <List.Item
                      title={
                        <View>
                          <Text style={styles.descriptionText}>
                            Nmae: {selectedTeacher?.name}
                          </Text>
                          <Text style={styles.descriptionText}>
                            Designation:{" "}
                            {selectedTeacher?.personal_info.designation}
                          </Text>
                          <Text style={styles.descriptionText}>
                            Experience:{" "}
                            {selectedTeacher?.personal_info.yearsofTeaching}
                          </Text>
                          <Text style={styles.descriptionText}>
                            Education:{" "}
                            {selectedTeacher?.personal_info.education}
                          </Text>
                        </View>
                      }
                    />
                  </List.Section>
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={hideModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </PaperProvider>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  card: {
    backgroundColor: "rgba(10,64,129,0.1)",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A4081",
    marginTop: 5,
    marginLeft: 10,
  },
  email: {
    fontSize: 16,
    marginTop: 3,
    marginLeft: 10,
    color: "grey",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // Ensure borderRadius is half of width and height to create a circular avatar
  },
  img: {
    position: "absolute",
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0A4081",
    padding: 15,
    width: "75%",
    maxHeight: "70%",
  },
  closeButton: {
    marginBottom: 10,
    alignSelf: "center",
    // backgroundColor: "#0A4081",
    //     padding: 15,
    //     borderBottomLeftRadius: 20,
    //     borderBottomRightRadius: 20,
  },
  closeButtonText: {
    //     color: "#fff",
    color: "#0A4081",
    fontWeight: "bold",
    fontSize: 16,
  },
  subHeader: { textAlign: "center", marginBottom: -15 },
  descriptionText: {
    color: "#0A4081", // Change the color of the description text
    marginTop: 8, // Add margin bottom to create space between lines
  },
});

export default Staff;
