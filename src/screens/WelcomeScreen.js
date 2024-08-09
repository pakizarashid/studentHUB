import React from 'react';
import { View, Text, ScrollView, Image, Button } from 'react-native';
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowAlert: true,
        };
    },
});

export default function WelcomeScreen () {

  function scheduleNotificationHandler() {
      Notifications.scheduleNotificationAsync({
        content:{
        title: 'First notification',
        body: 'This is the body',
        data: { userName: "Max"}
      },
      trigger : {
        seconds: 3
      }
      });
      console.log("pressed")
    }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{ width: '80%', height: 200, marginHorizontal: 20}}
          source={require('../../assets/ico.png')} // Make sure to provide correct image path
          resizeMode="contain"
          accessibilityLabel="App Name"
        />
        <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', color:"#0A4081"}}>
          Welcome to Student HUB
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', marginHorizontal: 20, marginTop: 10 }}>
          Struck searching your notes for the exam or forgot to submit the assignment on time? Don't worry, we're there to help you.
        </Text>
        <Button title='Notification' onPress={scheduleNotificationHandler} />
      </View>
    </ScrollView>
  );
};