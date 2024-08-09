import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Avatar, Card, PaperProvider } from "react-native-paper";
import { setStyles, setTheme } from "../components/styles";
import { useData } from "../contexts/DataContext";
import firebase from "../util/firebaseConfig";

const ClassList = () => {
  const { userData } = useData();
  const [classMembersData, setClassMembersData] = useState([]);

  useEffect(() => {
    if (userData) {
      const studentId = Object.keys(userData)[0];
      const studentData = userData[studentId];
      const classMembers = studentData.academic_info.class_members;

      // Function to fetch class member details from Firebase
      const fetchClassMemberDetails = async (memberId) => {
        try {
          const memberSnapshot = await firebase
            .database()
            .ref(`students/${memberId}`)
            .once("value");
          return memberSnapshot.val();
        } catch (error) {
          console.error("Error fetching class member details:", error);
          return null;
        }
      };

      const getClassMembersData = async () => {
        const membersDataPromises = classMembers.map(async (memberId) => {
          const memberData = await fetchClassMemberDetails(memberId);
          return memberData;
        });
        const membersData = await Promise.all(membersDataPromises);
        setClassMembersData(membersData);
      };

      getClassMembersData();
    }
  }, [userData]);

  const openGmail = (email) => {
    // Construct the mailto link with the recipient's email address
    const mailtoUrl = `mailto:${email}`;

    // Open the default email application with the recipient's email pre-filled
    Linking.openURL(mailtoUrl).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={setStyles.context}>
        <PaperProvider theme={setTheme}>
          {classMembersData.length > 0 ? (
            classMembersData.map((memberData, index) => {
              if (memberData) {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{marginVertical:8}}
                    onPress={() => openGmail(memberData.email)}
                  >
                    <Card mode="contained" style={styles.card}>
                      <View style={styles.cardContainer}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.name}>{memberData.name}</Text>
                          <Text style={styles.email}>{memberData.email}</Text>
                        </View>
                        <View style={styles.img}>
                          <Avatar.Image
                            size={60}
                            source={require("../../assets/icon.png")}
                          />
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              } else {
                return null;
              }
            })
          ) : (
            <Text>Loading...</Text>
          )}
        </PaperProvider>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
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
  img: {
    position: "absolute",
    right: 10,
  },
});

export default ClassList;
