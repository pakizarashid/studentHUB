import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Card, PaperProvider } from "react-native-paper";
import { setStyles, setTheme } from "../../components/styles";
import { useData } from "../../contexts/DataContext";

const Classes = () => {
  const { userData } = useData();
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    if (userData) {
      const teacherId = Object.keys(userData)[0];
      const teacherData = userData[teacherId];

      // Set the class list
      setClassList(teacherData.classes_list || []);
    }
  }, [userData]);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={setStyles.context}>
        <PaperProvider theme={setTheme}>
        {classList.length > 0 ? (
            classList.map((className, index) => (
              <TouchableOpacity
                key={index}
                style={{ marginVertical: 8 }}
              >
                <Card mode="contained" style={styles.card}>
                  <View style={styles.cardContainer}>
                    <Text style={styles.className}>{className}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No classes found</Text>
          )}
        </PaperProvider>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginHorizontal: 30
  },
  card: {
    backgroundColor: "rgba(10,64,129,0.1)",
  },
  cardContainer: {
    flexDirection: "row",
    alignSelf:"center",
    padding: 20,
  },
  className: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A4081",
    textAlign:"center",
    alignSelf:"center"
  },
});

export default Classes;
