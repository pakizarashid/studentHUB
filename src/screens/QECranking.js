//import React from 'react';
//import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
//import { setStyles } from '../components/styles';
//import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
//import { SafeAreaView } from 'react-native-safe-area-context';
//
//const windowWidth = Dimensions.get("window").width;
//const windowHeight = Dimensions.get("window").height;
//
//const QECranking = ({ navigation }) => {
//  const teachers = [
//    { name: 'Mr. Sheikh M.Amir', color: "#0A4081" },
//    { name: 'Dr. Irfan Khan', color: "#0A4081" },
//
//    { name: 'Mr. Muhammad Usman', color: "#0A4081" },
//    { name: 'Dr. Bushra Zafar', color: "#0A4081" },
//    { name: 'Mr. Nafees Ayub', color: "#0A4081" },
//    { name: 'Misss Farhat Naaz', color: "#0A4081" },
//  ];
//
//  const handleRankNowPress = (teacherName) => {
//    navigation.navigate('QecForm', { teacherName });
//  };
//
//  return (
//    <GestureHandlerRootView>
//    <ScrollView showsVerticalScrollIndicator={false}>
//      <SafeAreaView style={[setStyles.context, {marginTop:10}]}>
//    <View style={styles.container}>
//      {teachers.map((teacher, index) => (
//        <TouchableOpacity
//          key={index}
//          style={[styles.teacherContainer, { backgroundColor: teacher.color }]}
//          onPress={() => handleRankNowPress(teacher.name)}
//        >
//          <Text style={styles.teacherName}>{teacher.name}</Text>
//          <Text style={styles.rankNowButton}>Rank Now</Text>
//        </TouchableOpacity>
//      ))}
//    </View>
//    </SafeAreaView>
//    </ScrollView>
//    </GestureHandlerRootView>
//  );
//};
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//  },
//  teacherContainer: {
//    width: '80%',
//    height: 100,
//    borderRadius: 10,
//    marginBottom: 20,
//    justifyContent: 'center',
//    alignItems: 'center',
//  },
//  teacherName: {
//    fontSize: 20,
//    fontWeight: 'bold',
//    color: 'white',
//  },
//  rankNowButton: {
//    fontSize: 16,
//    color: 'white',
//    marginTop: 10,
//  },
//});
//
//export default QECranking;


import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from "../contexts/DataContext";
import fetchTeachersInfo from '../util/teachersModule';

const QECranking = ({ navigation }) => {
  const { userData } = useData();
  const [teachersInfo, setTeachersInfo] = useState([]);

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

  const handleRankNowPress = (teacherName) => {
    navigation.navigate('QecForm', { teacherName });
  };

  return (
    <GestureHandlerRootView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          {teachersInfo.map((teacher, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.teacherContainer, { backgroundColor: '#0A4081' }]}
              onPress={() => handleRankNowPress(teacher.name)}
            >
              <Text style={styles.teacherName}>{teacher.name}</Text>
              <Text style={styles.rankNowButton}>Rank Now</Text>
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  teacherContainer: {
    width: '80%',
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teacherName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  rankNowButton: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
});

export default QECranking;
