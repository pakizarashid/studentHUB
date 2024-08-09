import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Avatar, Card, Icon, PaperProvider } from "react-native-paper";
import { useData } from "../../contexts/DataContext";
import { setTheme } from "../../components/styles";

const PersonalInfo = ({ title, data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {data.map((info, index) => (
        <View style={styles.row} key={index}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.infoContainer}>
              <View style={{ alignItems: "center", marginRight: 20 }}>
                <Text style={styles.label}>{info.label1}</Text>
                <Text style={styles.value}>{info.value1}</Text>
              </View>
              <Icon source={info.icon1} size={20} color="#0A4081" />
            </View>
            <View style={styles.divider} />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.infoContainer} key={index}>
              <View style={{ alignItems: "center", marginRight: 20 }}>
                <Text style={styles.label}>{info.label2}</Text>
                <Text style={styles.value}>{info.value2}</Text>
                <Text style={styles.value}>{info.value3}</Text>
              </View>
              <Icon source={info.icon2} size={20} color="#0A4081" />
            </View>
            <View style={styles.divider} />
          </View>
        </View>
      ))}
    </View>
  );
};

const TProfileScreen = () => {
  const { userData } = useData();

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  const studentId = Object.keys(userData)[0];
  const studentData = userData[studentId];

  const { name, cnic, email, personal_info } = studentData;

  return (
    <PaperProvider theme={setTheme}>
      <View style={styles.profileContainer}>
        <Card mode="outlined" style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Avatar.Image
                  size={90}
                  source={require("../../../assets/pc.jpg")}
                />
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => {}}>
                <Icon source="pencil" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.class}>
                {personal_info.designation}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <PersonalInfo
          title="Personal Information"
          data={[
            {
              label1: "Designation",
              value1: personal_info.designation,
              icon1: "account",
              label2: "Contact Info",
              value2: email,
              icon2: "card-account-phone-outline",
            },
            {
              label1: "CNIC",
              value1: cnic,
              icon1: "card-account-details-outline",
              label2: "Gender",
              value2: personal_info.gender,
              icon2: "human-male-female",
            }
          ]}
        />
        <PersonalInfo
          title="More Information"
          data={[
            {
              label1: "Years of Teaching",
              value1: personal_info.yearsofTeaching,
              label2: "Education",
              value2: personal_info.education,
            }
          ]}
        />
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  card: {
    width: "90%",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    flex: 1,
    alignItems: "center",
  },
  avatarBorder: {
    borderColor: "#0A4081",
    borderWidth: 3,
    borderRadius: 100, // Make sure to set the radius equal to half of the avatar size
    padding: 3, // Add padding to ensure the border is visible
  },
  editButton: {
    position: "absolute",
    right: 30,
    bottom: 0,
    backgroundColor: "#0A4081",
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A4081",
  },
  class: {
    fontSize: 18,
    color: "rgba(10,64,129,0.6)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0A4081",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginRight: 20,
  },
  label: {
    marginBottom: 3,
    color: "rgba(10,64,129,0.7)",
  },
  value: {
    color: "#333",
  },
  divider: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(10,64,129,0.6)",
    marginVertical: 10,
    width: "60%",
  },
});

export default TProfileScreen;
