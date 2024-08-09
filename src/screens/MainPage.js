import React, { useState, useEffect } from "react";
import {
  Appbar,
  PaperProvider,
  DefaultTheme,
  BottomNavigation,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { DataProvider } from "../contexts/DataContext";

import HomeMenu from "../components/HomeMenu";
import MsgScreen from "../components/MessagesMenu";
import NotesMenu from "../components/NotesMenu";
import NotifiScreen from "../components/NotificationsMenu";
import MenuScreen from "../components/Menu";

export const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    secondaryContainer: "white", // Icon background
    surface: "#0A4081", // Bar background
    onSurfaceVariant: "white", // Icons color
    onSurface: "white", // Text color
    onSecondaryContainer: "#0A4081", // Active icon color
  },
};

const HomeRoute = ({ userData }) => <HomeMenu userData={userData} />;
const MessagesRoute = ({ userData }) => <MsgScreen userData={userData} />;
const NotesRoute = ({ userData }) => <NotesMenu userData={userData}/>;
const NotificationsRoute = () => <NotifiScreen />;
const MenuRoute = ({ userData }) =>  <MenuScreen userData={userData} />;

export default function MainPage({ route }) {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const { userData } = route.params;

  useEffect(() => {
  }, [userData]);

  const routes = [
    {
      key: "home",
      title: "Home",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
    },
    {
      key: "messages",
      title: "Messages",
      focusedIcon: "message-settings-outline",
    },
    { key: "notes", title: "Notes", focusedIcon: "notebook-outline" },
    {
      key: "notifications",
      title: "Notifications",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
    },
    {
      key: "menu",
      title: "Menu",
      focusedIcon: "dots-grid",
      unfocusedIcon: "dots-grid",
    },
  ];

  const renderScene = BottomNavigation.SceneMap({
    home: () => <HomeRoute userData={userData} />, // Pass userData to HomeRoute
    messages: () => <MessagesRoute userData={userData} />,
    notes:() => <NotesRoute userData={userData} />,
    notifications: NotificationsRoute,
    menu: () => < MenuRoute userData={userData} />,
  });

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Splash" }],
    });
  };

  return (
    <DataProvider userData={userData}>
      <PaperProvider theme={Theme}>
        <Appbar.Header mode="small" statusBarHeight={4}>
          <Appbar.Action
            icon={require("../../assets/ico.png")}
            rippleColor="transparent"
            size={65}
            // onPress={HomeRoute}
          />
          <Appbar.Content
            title="Student HUB"
            titleStyle={{ fontSize: 23 }}
            color="white"
          />
          <Appbar.Action icon="logout" onPress={handleLogout} />
        </Appbar.Header>

        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{ backgroundColor: "#0A4081" }}
        />
      </PaperProvider>
    </DataProvider>
  );
}
