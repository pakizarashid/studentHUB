import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Linking,
  Text,
  Dimensions,
} from "react-native";
import {
  Button,
  Card,
  SegmentedButtons,
  Searchbar,
  List,
  PaperProvider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { setStyles, setTheme } from "../components/styles";

// import MapView from "react-native-maps";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AccordionItem = ({ title, icon, expanded, onPress, children, style }) => (
  <List.Accordion
    title={title}
    left={(props) => <List.Icon {...props} icon={icon} />}
    style={style}
    expanded={expanded}
    onPress={onPress}
  >
    {children}
  </List.Accordion>
);
const ListItem = ({ title, floor, icon, onPress }) => (
  <View style={styles.listItemContainer}>
    <List.Item
      title={title}
      left={(props) => <List.Icon {...props} icon={icon} color="#0A4081" />}
      onPress={onPress}
    />
    <Text style={styles.floorText}>{floor}</Text>
  </View>
);

const navigateTo = (latitude, longitude) => {
  const mapsUrl = `http://maps.google.com/?daddr=${latitude},${longitude}`;
  Linking.openURL(mapsUrl);
};

export default function MapScreen() {
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAccordions, setExpandedAccordions] = useState([]);
  const [listVisibility, setListVisibility] = useState({
    department: true,
    office: false,
    other: false,
  });

  const [accordionStates, setAccordionStates] = useState({
    YousafBlock: false,
    ZakirBlock: false,
    MuhammadAliBlock: false,
    ScienceBlock: false,
    ZologyBlock: false,
    QuaidEAzamBlock: false,
    PhysicsBlock: false,
    Cafeteria: false,
    Ground: false,
    Hostel: false,
  });

  const toggleAccordion = (accordionKey) => {
    const updatedAccordionStates = { ...accordionStates };
    updatedAccordionStates[accordionKey] =
      !updatedAccordionStates[accordionKey];

    for (const key in updatedAccordionStates) {
      if (key !== accordionKey) {
        updatedAccordionStates[key] = false;
      }
    }
    setAccordionStates(updatedAccordionStates);
  };

  const toggleList = (listType) => {
    setListVisibility((prevState) => ({
      ...Object.fromEntries(
        Object.keys(prevState).map((key) => [key, key === listType])
      ),
    }));
  };

  const allDepartments = [
    {
      name: "Yousaf Block",
      data: [
        { name: "Law Department", floor: "GF-Right" },
        { name: "Data Science Department", floor: "GF-Left" },
        { name: "Computer Science Department", floor: "FF" },
        { name: "IT Department", floor: "SF-Left" },
        { name: "Software Engineering Department", floor: "SF-R" },
      ],
      location: { latitude: 31.415368, longitude: 73.06896 },
    },
    {
      name: "Zakir Block",
      data: [
      { name: "Bio-Tech Department", floor: "GF-Right" },
      ],
      location: { latitude: 31.415368, longitude: 73.06896 },
    },
    {
      name: "Muhammad Ali Block",
      data: [
       { name: "English Department", floor: "FF-Right" },
      ],
      location: { latitude: 31.415368, longitude: 73.06896 },
    },
    {
      name: "Science Block",
      data: [
      { name: "Pharm-D Department", floor: "GF" },
      { name: "DPT Department", floor: "FF-Right" },
      ],
      location: { latitude: 31.415368, longitude: 73.06896 },
    },
    {
      name: "Zoology Block",
      data: [
      { name: "Zoology Department"},
      ],
      location: { latitude: 31.415368, longitude: 73.06896 },
    },
    {
      name: "Quaid-e-Azam Block",
      data: [
      { name: "Islamic Studies Department"}
      ],
      location: { latitude: 31.415368, longitude: 73.06896 },
    },
    {
      name: "Physics Block",
      data: [
      { name: "Physics Department"}
      ],
      location: { latitude: 31.415368, longitude: 73.06896 },
    },
  ];

  const allOffices = [
    {
      name: "IT Office",
      location: { latitude: 31.416114, longitude: 73.069571 },
    },
    {
      name: "Registar Office",
      location: { latitude: 31.416114, longitude: 73.069571 },
    },
    {
      name: "Dean's Office",
      location: { latitude: 31.416114, longitude: 73.069571 },
    },
    {
      name: "VC Office",
      location: { latitude: 31.416114, longitude: 73.069571 },
    },
    {
      name: "Security Office",
      location: { latitude: 31.416114, longitude: 73.069571 },
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    const matchingDepartments = [];
    allDepartments.forEach((department) => {
      const matches = department.data.some((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      if (matches) {
        matchingDepartments.push(department.name);
      }
    });
    setExpandedAccordions(matchingDepartments);
  };


//  const handleSearch = (query) => {
//    setSearchQuery(query);
//    const matchingDepartments = [];
//    allDepartments.forEach((department) => {
//      const matches = department.data.some((item) =>
//        item.includes(query)
//      );
//      if (matches) {
//        matchingDepartments.push(department.name);
//      }
//    });
//    setExpandedAccordions(matchingDepartments);
//  };

  useEffect(() => {
    // Automatically expand accordion for matching departments
    const accordionStatesCopy = { ...accordionStates };
    expandedAccordions.forEach((department) => {
      accordionStatesCopy[department.replace(/\s+/g, "")] = true;
    });
    setAccordionStates(accordionStatesCopy);
  }, [expandedAccordions]);
  
  // const [region, setRegion] = useState({
  //   latitude: 31.416,
  //   longitude: 73.07009,
  //   latitudeDelta: 0.000012,
  //   longitudeDelta: 0.018,
  // });

  return (
    <SafeAreaView style={[setStyles.context, styles.context]}>
      <PaperProvider theme={setTheme}>
        
        {/* <MapView
          style={styles.map}
          initialRegion={region}
        /> */}
        <Card mode="outlined" style={{ marginBottom: windowHeight * 0.01 }}>
          <Card.Title title="FIND THE" titleStyle={setStyles.title} />
          <Card.Content>
            <Button
              mode="contained"
              style={[setStyles.button, styles.button]}
              onPress={() => navigateTo(31.4161, 73.07)}
            >
              Main Campus
            </Button>
          </Card.Content>
          <Card.Content>
            <Text style={setStyles.subTitle}>Gate 2 or 6 is for Entrance</Text>
            <Text style={setStyles.subTitle}>
              Gate 4 or 6 is for Exits (Entrance for only Hostelites )
            </Text>
          </Card.Content>
        </Card>

        <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
          <View style={styles.stickyHeader} >
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  value: "block",
                  label: "Department",
                  onPress: () => toggleList("department"),
                },
                {
                  value: "office",
                  label: "Offices",
                  onPress: () => toggleList("office"),
                },
                {
                  value: "other",
                  label: "Other",
                  onPress: () => toggleList("other"),
                },
              ]}
            />
          </View>
          <Card mode="outlined" style={{marginBottom:2}}>
            <Card.Content>
              <List.Section>
                {Object.entries(listVisibility).map(([type, isVisible]) =>
                  isVisible ? (
                    <React.Fragment key={type}>
                      {type === "department" && (
                        <>
                          <Searchbar
                            placeholder="Search Department"
                            onChangeText={handleSearch}
                            value={searchQuery}
                            style={styles.searchBar}
                          />
                          {allDepartments.map((department) => (
                            <AccordionItem
                              key={department.name}
                              title={department.name}
                              icon="office-building-outline"
                              style={{
                                ...(accordionStates[
                                  department.name.replace(/\s+/g, "")
                                ]
                                  ? setStyles.selectedAccordion
                                  : null),
                              }}
                              expanded={
                                accordionStates[
                                  department.name.replace(/\s+/g, "")
                                ]
                              }
                              onPress={() =>
                                toggleAccordion(
                                  department.name.replace(/\s+/g, "")
                                )
                              }
                            >
                              {department.data.map((item, index) => (
                                <ListItem
                                key={index}
                                title={item.name} // Use the department name from the data object
                                floor={item.floor}
                                />
                              ))}
                              <Text
                                style={styles.Subheader}
                                onPress={() =>
                                  navigateTo(
                                    department.location.latitude,
                                    department.location.longitude
                                  )
                                }
                              >
                                LOCATE
                              </Text>
                            </AccordionItem>
                          ))}
                        </>
                      )}
                      {type === "office" && (
                        <>
                          {allOffices.map((office) => (
                            <ListItem
                              key={office.name}
                              title={office.name}
                              icon="office-building-cog-outline"
                              onPress={() =>
                                navigateTo(
                                  office.location.latitude,
                                  office.location.longitude
                                )
                              }
                            />
                          ))}
                        </>
                      )}
                      {type === "other" && (
                        <>
                          <ListItem
                            title="Bank"
                            icon="bank"
                            onPress={() => navigateTo(31.413889, 73.068215)}
                          />
                          <ListItem title="BookShop" icon="bookshelf" onPress={() => navigateTo(31.413889, 73.068215)} />
                          <ListItem
                            title="Dispensary"
                            icon="hospital-box-outline"
                            onPress={() => navigateTo(31.413889, 73.068215)}
                          />
                          <ListItem title="Masjid" icon="hands-pray" onPress={() => navigateTo(31.413889, 73.068215)} />
                          <ListItem title="Bus Stand" icon="bus-stop" onPress={() => navigateTo(31.413889, 73.068215)} />
                          <ListItem title="Parking" icon="parking" onPress={() => navigateTo(31.413889, 73.068215)} />
                          <ListItem title="Library" icon="library" onPress={() => navigateTo(31.413889, 73.068215)} />
                          <AccordionItem
                            title="Cafeteria"
                            icon="food-outline"
                            style={{
                              ...(accordionStates.Cafeteria
                                ? setStyles.selectedAccordion
                                : null),
                            }}
                            expanded={accordionStates.Cafeteria}
                            onPress={() => toggleAccordion("Cafeteria")}
                          >
                            <List.Item title="Main Canteen" onPress={() => navigateTo(31.413889, 73.068215)}/>
                            <List.Item title="UA Canteen" onPress={() => navigateTo(31.413889, 73.068215)}/>
                          </AccordionItem>
                          <AccordionItem
                            title="Ground"
                            icon="foot-print"
                            style={{
                              ...(accordionStates.Ground
                                ? setStyles.selectedAccordion
                                : null),
                            }}
                            expanded={accordionStates.Ground}
                            onPress={() => toggleAccordion("Ground")}
                          >
                            <List.Item title="Cricket Ground" onPress={() => navigateTo(31.413889, 73.068215)}/>
                            <List.Item title="FootBall Canteen" onPress={() => navigateTo(31.413889, 73.068215)}/>
                            <List.Item title="Hockey Canteen" onPress={() => navigateTo(31.413889, 73.068215)}/>
                          </AccordionItem>
                          <AccordionItem
                            title="Hostel"
                            icon="warehouse"
                            style={{
                              ...(accordionStates.Hostel
                                ? setStyles.selectedAccordion
                                : null),
                            }}
                            expanded={accordionStates.Hostel}
                            onPress={() => toggleAccordion("Hostel")}
                          >
                            <List.Item
                            title="Federal Hostel"
                            onPress={() => navigateTo(31.415495, 73.067966)}
                             />
                            <List.Item
                              title="Khadija Hostel"
                              onPress={() => navigateTo(31.415495, 73.067966)}
                            />
                          </AccordionItem>
                        </>
                      )}
                    </React.Fragment>
                  ) : null
                )}
              </List.Section>
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
  map: {
    width: "100%",
    height: "20%",
    marginBottom: 10,
    borderRadius: 15,
  },
  button: {
    marginTop: 0,
    marginBottom: windowHeight * 0.01,
  },
  stickyHeader: {
    backgroundColor: "white",
    marginBottom: 5,
    borderRadius: 20,
  },
  searchBar: {
    marginBottom: 2,
  },
  listItemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 1
  },
  floorText: {
      color: "#0A4081",
      fontWeight: "bold",
      marginRight: 30
 },
  Subheader: {
    color: "#0A4081",
    fontWeight: "bold",
    textAlign: "right",
    marginRight: windowWidth * 0.05,
    textDecorationLine: "underline",
  },
});
