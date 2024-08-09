import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NoteProvider } from "./src/contexts/NoteContext";
import { DataProvider } from "./src/contexts/DataContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import messaging from '@react-native-firebase/messaging';

import SplashScreen from "./src/screens/SplashScreen";
import SupportScreen from "./src/screens/SupportScreen";
import ScheduleScreen from "./src/screens/ScheduleScreen";
import NewsScreen from "./src/screens/NewsScreen";
import MapScreen from "./src/screens/MapScreen";
import HelpScreen from "./src/screens/HelpScreen";
import MainPage from "./src/screens/MainPage";

import ClassNotes from "./src/screens/ClassNotes";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import UploadFilesActivity from "./src/screens/UploadNotes";
import Chat from "./src/screens/Messages";
import TimeTableScreen from "./src/screens/TimeTable";
import ProfileScreen from "./src/screens/Profile";
import Attendance from "./src/screens/Attendance";
import CourseOutline from "./src/screens/CourseOutline";
import Assignment from "./src/screens/Assignment";
import Academics from "./src/screens/Academics";
import Enrollment from "./src/screens/Enrollment";
import Fee from "./src/screens/Fee";
import Staff from "./src/screens/Staff";
import QecForm from "./src/screens/QecForm";
import QECranking from "./src/screens/QECranking";
import FinancialAid from "./src/screens/FinancialAid";
import LibraryScreen from "./src/screens/Library";
import IDScreen from "./src/screens/StudentID";
import ClassList from "./src/screens/ClassList";
import ReminderScreen from "./src/components/Reminder";

import NotesCard from "./src/screens/NoteScreen";

import TeacherScreen from "./src/admin/teacher/TeacherScreen"
import TProfileScreen from "./src/admin/teacher/TeacherProfile";
import Classes from "./src/admin/teacher/Classes";
import TCourses from "./src/admin/teacher/TCourses";
import TChat from "./src/admin/teacher/TChat";
import Message from "./src/screens/Messages";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App({ userData }) {

   const [notifications, setNotifications] = useState([]);

 useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
           console.log('Received a new FCM message:');
           Alert.alert(
                        remoteMessage.notification.title,
                        remoteMessage.notification.body
           );
          const { title, body } = remoteMessage.notification;
          const newNotification = { title, body };
          console.log(newNotification)
          setNotifications(prevNotifications => [...prevNotifications, newNotification]);
        });
      messaging().getToken().then(token => {
      console.log('Device FCM Token:', token);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey="pk_test_51PJ0wqFt8twZCtdFmuM5CMDbhMYQ6g3pTeHoP2gRfeLyJRWotl1DR6D8EP9dQL5Dzr5JvtBRXxLQn1hDYoq088t000E4fzYorD">
        <DataProvider>
          <NoteProvider>
            <NavigationContainer>
              <Navigator
                initialRouteName="Splash"
                screenOptions={{
                  headerStyle: { backgroundColor: "#0A4081" },
                  headerTintColor: "white",
                  headerBackTitleVisible: false,
                }}
              >
                <Screen
                  name="Splash"
                  component={SplashScreen}
                  options={{ headerShown: false }}
                />
                <Screen name="Support" component={SupportScreen} />
                <Screen name="Schedule" component={ScheduleScreen} />
                 <Screen name="News">
                   {(props) => <NewsScreen {...props} notifications={notifications} />}
                 </Screen>
                <Screen name="Location" component={MapScreen} />
                <Screen name="Help" component={HelpScreen} />

                <Screen name="Main" options={{ headerShown: false }}>
                  {(props) => <MainPage {...props} userData={userData} />}
                </Screen>
                <Screen name="Welcome" component={WelcomeScreen} />
                <Screen name="Chat" component={Chat} />
                <Screen name="Messages" component={Message} />
                <Screen name="Notes" component={ClassNotes} />
                <Screen name="Upload" component={UploadFilesActivity} />
                <Screen name="StudentID" component={IDScreen} />
                <Screen name="ClassList" component={ClassList} />
                <Screen name="Profile" component={ProfileScreen} />
                <Screen name="TimeTable" component={TimeTableScreen} />
                <Screen name="Attendance" component={Attendance} />
                <Screen name="Courses" component={CourseOutline} />
                <Screen name="Assignment" component={Assignment} />
                <Screen name="Academics" component={Academics} />
                <Screen name="Enrollment" component={Enrollment} />
                <Screen name="Fee" component={Fee} />

                <Screen name="Qec" component={QECranking} />
                <Screen name="QecForm" component={QecForm} />
                <Screen name="Staff" component={Staff} />
                <Screen name="Aid" component={FinancialAid} />
                <Screen name="Library" component={LibraryScreen} />
                <Screen name="Reminder" component={ReminderScreen} />
                <Screen name="NoteBook" component={NotesCard} />

                <Screen name="Teacher" options={{ headerShown: false }}>
                  {(props) => <TeacherScreen {...props} userData={userData} />}
                </Screen>
                <Screen name="TProfile" component={TProfileScreen} />
                <Screen name="TClasses" component={Classes} />
                <Screen name="TCourses" component={TCourses} />
                <Screen name="TChat" component={TChat} />
              </Navigator>
            </NavigationContainer>
          </NoteProvider>
        </DataProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}

