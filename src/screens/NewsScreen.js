//import React, { useState, useEffect } from "react";
//import {
//  StyleSheet,
//  View,
//  ScrollView,
//  Text,
//  TouchableOpacity,
//  Dimensions,
//} from "react-native";
//import { Card, Icon, List, PaperProvider } from "react-native-paper";
//import { SafeAreaView } from "react-native-safe-area-context";
//import { setStyles, setTheme } from "../components/styles";
//
//const windowHeight = Dimensions.get("window").height;
//
//const AccouncementsData = [
//  {
//    show: "News",
//    icon: "newspaper-variant-outline",
//    data: [
//      { title: "News 1", description: "Description of News 1" },
//      { title: "News 2", description: "Description of News 2" },
//    ],
//  },
//  {
//    show: "Events",
//    icon: "ticket-confirmation-outline",
//    data: [{ description: "" }],
//  },
//  {
//    show: "Sports",
//    icon: "cricket",
//    data: [{ description: "Sports week March 18 to 22, 2024" }],
//  },
//  {
//    show: "Scholarships & Funding",
//    icon: "school-outline",
//    data: [{ description: "Not available at that time" }],
//  },
//  {
//    show: "Careers",
//    icon: "account-network",
//    data: [{ description: "N/A" }],
//  },
//  {
//    show: "Dates to Remember",
//    icon: "update",
//    data: [
//      { description: "Spring-Final Exam on June 10 to 14, 2024" },
//      { description: "Spring-Result on June 28, 2024" },
//    ],
//  },
//];
//
//const ListItem = ({ title, description }) => (
//  <View style={styles.listItem}>
//    <List.Item title={title} description={description} />
//  </View>
//);
//
//export default function NewsScreen() {
//  const [selectedData, setSelectedData] = useState(null);
//  const [notifications, setNotifications] = useState([]);
//
//  const showModal = (data) => {
//    setSelectedData(data);
//  };
//
//  const hideModal = () => {
//    setSelectedData(null);
//  };
//
//  const AnnouncementsItem = ({ category, index }) => {
//    return (
//      <View style={styles.surfaceContainer}>
//        <TouchableOpacity
//          style={[styles.touchableOpacity]}
//          onPress={() => showModal(category.data, index)}
//        >
//          <Icon source={category.icon} color="white" size={40} />
//          <Text style={[styles.boxText, { marginTop: 5 }]}>
//            {category.show}
//          </Text>
//        </TouchableOpacity>
//      </View>
//    );
//  };
//
//  const renderAnnouncementItems = () => {
//    return AccouncementsData.reduce((rows, category, index) => {
//      if (index % 3 === 0) rows.push([]);
//      const rowIndex = Math.floor(index / 3);
//      rows[rowIndex].push(
//        <AnnouncementsItem key={index} category={category} index={index} />
//      );
//      return rows;
//    }, []);
//  };
//
//  return (
//    <SafeAreaView style={[setStyles.context, styles.context]}>
//      <PaperProvider theme={setTheme}>
//        <Card style={styles.card}>
//          <Card.Cover
//            source={require("../../assets/splash.png")}
//            style={{ backgroundColor: "#0A4081", margin: 10, padding:10 }}
//          />
//        </Card>
//        <ScrollView showsVerticalScrollIndicator={false}>
//          <Card mode="outlined">
//            <Card.Title title="ANNOUNCEMENTS" titleStyle={setStyles.title} />
//            <Card.Content>
//              {renderAnnouncementItems().map((row, index) => (
//                <View key={index} style={styles.rowContainer}>
//                  {row}
//                </View>
//              ))}
//              {selectedData && (
//                <View>
//                  <ScrollView>
//                    {selectedData.map((item, index) => (
//                      <ListItem
//                        key={index}
//                        title={item.title}
//                        description={item.description}
//                      />
//                    ))}
//                  </ScrollView>
//                  <TouchableOpacity
//                    style={styles.closeButton}
//                    onPress={hideModal}
//                  >
//                    <Text style={styles.closeButtonText}>Close</Text>
//                  </TouchableOpacity>
//                </View>
//              )}
//            </Card.Content>
//          </Card>
//        </ScrollView>
//      </PaperProvider>
//    </SafeAreaView>
//  );
//}
//
//const styles = StyleSheet.create({
//  context: {
//    marginTop: windowHeight * 0.01,
//    marginHorizontal: 6,
//  },
//  card: {
//    backgroundColor: "#0A4081",
//    marginBottom: 10,
//  },
//  rowContainer: {
//    flexDirection: "row",
//    justifyContent: "space-between",
//    alignItems: "center",
//    marginBottom: 20,
//  },
//  surfaceContainer: {
//    alignItems: "center",
//  },
//  touchableOpacity: {
//    flex: 1,
//    alignItems: "center",
//    justifyContent: "center",
//    height: 100,
//    width: 100,
//    padding: 5,
//    backgroundColor: "#0A4081",
//    // borderRadius: 10,
//  },
//  boxText: {
//    color: "#fff",
//    textAlign: "center",
//  },
//  closeButton: {
//    backgroundColor: "#0A4081",
//    padding: 15,
//    alignItems: "center",
//    borderBottomLeftRadius: 20,
//    borderBottomRightRadius: 20,
//  },
//  closeButtonText: {
//    color: "#fff",
//  },
//  listItem: {
//    borderBottomWidth: 1,
//    borderBottomColor: "#ccc",
//    paddingVertical: 10,
//  },
//  listItemTitle: {
//    fontWeight: "bold",
//  },
//});


//import React, { useState, useEffect } from "react";
//import {
//  StyleSheet,
//  View,
//  ScrollView,
//  Text,
//  TouchableOpacity,
//  Dimensions,
//} from "react-native";
//import { Card, Icon, List, PaperProvider } from "react-native-paper";
//import { SafeAreaView } from "react-native-safe-area-context";
//import { setStyles, setTheme } from "../components/styles";
//
//const windowHeight = Dimensions.get("window").height;
//
//const AccouncementsData = [
//  {
//    show: "News",
//    icon: "newspaper-variant-outline",
//    data: [], // Initialize data as empty array
//  },
//  {
//    show: "Events",
//    icon: "ticket-confirmation-outline",
//    data: [{ description: "" }],
//  },
//  {
//    show: "Sports",
//    icon: "cricket",
//    data: [{ description: "Sports week March 18 to 22, 2024" }],
//  },
//  {
//    show: "Scholarships & Funding",
//    icon: "school-outline",
//    data: [{ description: "Not available at that time" }],
//  },
//  {
//    show: "Careers",
//    icon: "account-network",
//    data: [{ description: "N/A" }],
//  },
//  {
//    show: "Dates to Remember",
//    icon: "update",
//    data: [
//      { description: "Spring-Final Exam on June 10 to 14, 2024" },
//      { description: "Spring-Result on June 28, 2024" },
//    ],
//  },
//];
//
//const ListItem = ({ title, description }) => (
//  <View style={styles.listItem}>
//    <List.Item title={title} description={description} />
//  </View>
//);
//
//export default function NewsScreen({ notifications }) {
//  const [selectedData, setSelectedData] = useState(null);
//  const [announcementsData, setAnnouncementsData] = useState(AccouncementsData);
//
//  const showModal = (data) => {
//      // Find the "News" category
//      const newsCategoryIndex = announcementsData.findIndex(
//        (category) => category.show === "News"
//      );
//
//      if (newsCategoryIndex !== -1) {
//        // Update the "News" category data with notifications
//        setAnnouncementsData((prevState) => {
//          const newState = [...prevState];
//          newState[newsCategoryIndex].data = data;
//          return newState;
//        });
//      }
//
//      setSelectedData(data);
//    };
//
//  const hideModal = () => {
//    setSelectedData(null);
//  };
//
//  const AnnouncementsItem = ({ category, index }) => {
//    return (
//      <View style={styles.surfaceContainer}>
//        <TouchableOpacity
//          style={[styles.touchableOpacity]}
//          onPress={() => showModal(category.data)}
//        >
//          <Icon source={category.icon} color="white" size={40} />
//          <Text style={[styles.boxText, { marginTop: 5 }]}>
//            {category.show}
//          </Text>
//        </TouchableOpacity>
//      </View>
//    );
//  };
//
//    const renderAnnouncementItems = () => {
//    return AccouncementsData.reduce((rows, category, index) => {
//      if (index % 3 === 0) rows.push([]);
//      const rowIndex = Math.floor(index / 3);
//      rows[rowIndex].push(
//        <AnnouncementsItem key={index} category={category} index={index} />
//      );
//      return rows;
//    }, []);
//  };
//
//  return (
//    <SafeAreaView style={[setStyles.context, styles.context]}>
//      <PaperProvider theme={setTheme}>
//        <ScrollView showsVerticalScrollIndicator={false}>
//          <Card style={styles.card}>
//            <Card.Cover
//              source={require("../../assets/splash.png")}
//              style={{ backgroundColor: "#0A4081", margin: 10, padding: 10 }}
//            />
//          </Card>
//          <Card mode="outlined">
//            <Card.Title title="ANNOUNCEMENTS" titleStyle={setStyles.title} />
//            <Card.Content>
//                {renderAnnouncementItems().map((row, index) => (
//                <View key={index} style={styles.rowContainer}>
//                  {row}
//                </View>
//              ))}
//              {selectedData && (
//                <View>
//                  <ScrollView>
//                    {selectedData.map((item, index) => (
//                      <ListItem
//                        key={index}
//                        title={item.title}
//                        description={item.description}
//                      />
//                    ))}
//                  </ScrollView>
//                  <TouchableOpacity
//                    style={styles.closeButton}
//                    onPress={hideModal}
//                  >
//                    <Text style={styles.closeButtonText}>Close</Text>
//                  </TouchableOpacity>
//                </View>
//              )}
//            </Card.Content>
//          </Card>
//        </ScrollView>
//      </PaperProvider>
//    </SafeAreaView>
//  );
//}
//
//const styles = StyleSheet.create({
//  context: {
//    marginTop: windowHeight * 0.01,
//    marginHorizontal: 6,
//  },
//  card: {
//    backgroundColor: "#0A4081",
//    marginBottom: 10,
//  },
//  rowContainer: {
//    flexDirection: "row",
//    justifyContent: "space-between",
//    alignItems: "center",
//    marginBottom: 20,
//  },
//  surfaceContainer: {
//    alignItems: "center",
//  },
//  touchableOpacity: {
//    flex: 1,
//    alignItems: "center",
//    justifyContent: "center",
//    height: 100,
//    width: 100,
//    padding: 5,
//    backgroundColor: "#0A4081",
//    // borderRadius: 10,
//  },
//  boxText: {
//    color: "#fff",
//    textAlign: "center",
//  },
//  closeButton: {
//    backgroundColor: "#0A4081",
//    padding: 15,
//    alignItems: "center",
//    borderBottomLeftRadius: 20,
//    borderBottomRightRadius: 20,
//  },
//  closeButtonText: {
//    color: "#fff",
//  },
//  listItem: {
//    borderBottomWidth: 1,
//    borderBottomColor: "#ccc",
//    paddingVertical: 10,
//  },
//  listItemTitle: {
//    fontWeight: "bold",
//  },
//});
//
//


import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Card, Icon, List, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { setStyles, setTheme } from "../components/styles";

const windowHeight = Dimensions.get("window").height;

const AccouncementsData = [
  {
    show: "News",
    icon: "newspaper-variant-outline",
    data: [], // Initialize data as empty array
  },
  {
    show: "Events",
    icon: "ticket-confirmation-outline",
    data: [{ description: "" }],
  },
  {
    show: "Sports",
    icon: "cricket",
    data: [{ description: "Sports week March 18 to 22, 2024" }],
  },
  {
    show: "Scholarships & Funding",
    icon: "school-outline",
    data: [{ description: "Not available at that time" }],
  },
  {
    show: "Careers",
    icon: "account-network",
    data: [{ description: "N/A" }],
  },
  {
    show: "Dates to Remember",
    icon: "update",
    data: [
      { description: "Spring-Final Exam on June 10 to 14, 2024" },
      { description: "Spring-Result on June 28, 2024" },
    ],
  },
];

const ListItem = ({ category, title, body, description }) => (
  <View style={styles.listItem}>
    <List.Item title={category === 'News' ? null : body } description={description} />
  </View>
);

export default function NewsScreen({ notifications }) {
  const [selectedData, setSelectedData] = useState(null);
  const [announcementsData, setAnnouncementsData] = useState(AccouncementsData);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const showModal = (data, category) => {
      // Find the "News" category
      const newsCategoryIndex = announcementsData.findIndex(
        (category) => category.show === "News"
      );

      if (newsCategoryIndex !== -1) {
        // Update the "News" category data with notifications
        setAnnouncementsData((prevState) => {
          const newState = [...prevState];
          newState[newsCategoryIndex].data = notifications;
          return newState;
        });
      }

      setSelectedData(data);
      setSelectedCategory(category);
    };

  const hideModal = () => {
    setSelectedData(null);
  };

  const AnnouncementsItem = ({ category, index }) => {
    return (
      <View style={styles.surfaceContainer}>
        <TouchableOpacity
          style={[styles.touchableOpacity]}
          onPress={() => showModal(category.data)}
        >
          <Icon source={category.icon} color="white" size={40} />
          <Text style={[styles.boxText, { marginTop: 5 }]}>
            {category.show}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

    const renderAnnouncementItems = () => {
    return announcementsData.reduce((rows, category, index) => {
      if (index % 3 === 0) rows.push([]);
      const rowIndex = Math.floor(index / 3);
      rows[rowIndex].push(
        <AnnouncementsItem key={index} category={category} index={index} />
      );
      return rows;
    }, []);
  };

  return (
    <SafeAreaView style={[setStyles.context, styles.context]}>
      <PaperProvider theme={setTheme}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Card.Cover
              source={require("../../assets/splash.png")}
              style={{ backgroundColor: "#0A4081", margin: 5, padding: 18 }}
            />
          </Card>
          <Card mode="outlined">
            <Card.Title title="ANNOUNCEMENTS" titleStyle={setStyles.title} />
            <Card.Content>
                {renderAnnouncementItems().map((row, index) => (
                <View key={index} style={styles.rowContainer}>
                  {row}
                </View>
              ))}
              {selectedData && (
                <View>
                  <ScrollView>
                    {selectedData.map((item, index) => (
                      <ListItem
                        key={index}
                        category={selectedCategory}
                        title={item.title}
                        body={item.body}
                        description={item.description}
                      />
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={hideModal}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    marginHorizontal: 6,
  },
  card: {
    backgroundColor: "#0A4081",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  surfaceContainer: {
    alignItems: "center",
  },
  touchableOpacity: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    padding: 5,
    backgroundColor: "#0A4081",
    // borderRadius: 10,
  },
  boxText: {
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#0A4081",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  closeButtonText: {
    color: "#fff",
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  listItemTitle: {
    fontWeight: "bold",
  },
});
