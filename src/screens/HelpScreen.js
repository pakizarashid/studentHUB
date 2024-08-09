import React, { useState, Fragment, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Linking,
  Text,
  Keyboard,
  Dimensions,
  Alert,
} from "react-native";
import {
  PaperProvider,
  Card,
  Surface,
  IconButton,
  List,
  TextInput,
  Button,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import { setStyles, setTheme } from "../components/styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AccordionItem = ({ title, description, icon, children }) => (
  <List.Accordion
    title={title}
    description={description}
    left={(props) => <List.Icon {...props} icon={icon} />}
  >
    {children}
  </List.Accordion>
);

const ListItem = ({ title, icon, onPress }) => (
  <List.Item
    title={title}
    left={(props) => <List.Icon {...props} icon={icon} color="#0A4081" />}
    onPress={() => {
      Linking.openURL(onPress);
    }}
  />
);

export default function HelpScreen() {
  const initialState = {
    departClerkListVisible: false,
    focalPersonListVisible: false,
    dsaListVisible: false,
    secChiefListVisible: false,
    medTeamListVisible: false,
    reportListVisible: false,
  };

  const [state, setState] = useState(initialState);

  const toggleListVisibility = (listName) => {
    setState((prevState) => ({
      ...initialState,
      [listName]: !prevState[listName],
    }));
  };

  const {
    departClerkListVisible,
    focalPersonListVisible,
    dsaListVisible,
    secChiefListVisible,
    medTeamListVisible,
    reportListVisible,
  } = state;

  const toggleList = (listName) => () => toggleListVisibility(listName);

  const { control, handleSubmit, setFocus, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://192.168.56.1:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      Alert.alert("Email sent successfully");

      // Reset form fields after successful submission
      reset();
    } catch (error) {
      console.error("Error sending email:", error.message);
    }
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderContactList = (data) => (
    <View style={styles.rowContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.surfaceContainer}>
          <Surface style={styles.surface} elevation={5}>
            <IconButton
              icon={item.icon}
              iconColor="white"
              size={40}
              onPress={item.onPress}
            />
          </Surface>
          <Text style={styles.text}>{item.label}</Text>
        </View>
      ))}
    </View>
  );

  const renderContacts = () => (
    <ScrollView>
      {departClerkListVisible && (
        <List.Section title="Department Clerks">
          <AccordionItem
            title="Computer Science"
            description="1st Floor Yousaf Block"
            icon="office-building-outline"
          >
            <ListItem
              title="0300-0000000"
              icon="phone"
              onPress={"tel:03000000000"}
            />
          </AccordionItem>
          <AccordionItem title="Pharm-D" icon="office-building-outline">
            <List.Subheader>Ground floor Science Block</List.Subheader>
            <ListItem
              title="0300-0000000"
              icon="phone"
              onPress={"tel:"}
            />
          </AccordionItem>
        </List.Section>
      )}
      {focalPersonListVisible && (
        <List.Section title="Department Focal Persons">
          <AccordionItem
            title="Computer Science"
            description="1st Floor Yousaf Block"
            icon="account"
          >
            <ListItem
              title="0300-0000000"
              icon="phone"
              onPress={"tel:03000000000"}
            />
            <ListItem
              title="com-sci-focal@mail.com"
              icon="email"
              onPress={"mailto:"}
            />
          </AccordionItem>
          <AccordionItem title="Pharm-D" icon="account">
            <List.Subheader>Ground floor Science Block</List.Subheader>
            <ListItem
              title="0300-0000000"
              icon="phone"
              onPress={"tel:0300000"}
            />
            <ListItem
              title="dsa@mail.com"
              icon="email"
              onPress={"mailto:fo@mail.com"}
            />
          </AccordionItem>
        </List.Section>
      )}
      {dsaListVisible && (
        <List.Section>
          <List.Subheader>
            Ground Floor Directorate Student Affairs
          </List.Subheader>
          <ListItem
            title="pharm-d-focal@mail.com"
            icon="email"
            onPress={"mailto:fo@mail.com"}
          />
        </List.Section>
      )}
      {secChiefListVisible && (
        <List.Section>
          <List.Subheader>
            Ground Floor Security Office near Fee section
          </List.Subheader>
          <ListItem
            title="0300-0000000"
            icon="phone"
            onPress={"tel:03000000000"}
          />
          <ListItem
            title="sec-off@mail.com"
            icon="email"
            onPress={"mailto:fo@mail.com"}
          />
        </List.Section>
      )}
      {medTeamListVisible && (
        <List.Section>
          <List.Subheader>Dispensary</List.Subheader>
          <ListItem
            title="0300-0000000"
            icon="phone"
            onPress={"tel:03000000000"}
          />
          <ListItem
            title="1122"
            icon="email-outline"
            onPress={"sms:"}
          />
          <ListItem
            title="med-team@mail.com"
            icon="email"
            onPress={"mailto:fo@mail.com"}
          />
        </List.Section>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={[setStyles.context, styles.context]}>
      <PaperProvider theme={setTheme}>
        <View>
          <Card mode="outlined">
            <Card.Title title="CONTACT US" titleStyle={setStyles.title} />
            <Card.Content>
              {!isKeyboardVisible &&
                renderContactList([
                  {
                    icon: "phone-voip",
                    label: "Depart. Clerk",
                    onPress: toggleList("departClerkListVisible"),
                  },
                  {
                    icon: "shield-account",
                    label: "Focal Person",
                    onPress: toggleList("focalPersonListVisible"),
                  },
                  {
                    icon: "domain",
                    label: "DSA",
                    onPress: toggleList("dsaListVisible"),
                  },
                ])}
              {!isKeyboardVisible &&
                renderContactList([
                  {
                    icon: "security",
                    label: "Security Chief",
                    onPress: toggleList("secChiefListVisible"),
                  },
                  {
                    icon: "hospital-box",
                    label: "Medical Team",
                    onPress: toggleList("medTeamListVisible"),
                  },
                  {
                    icon: "email-edit",
                    label: "Report",
                    onPress: toggleList("reportListVisible"),
                  },
                ])}
              {renderContacts()}
              {reportListVisible && (
                <View>
                  <Card.Title
                    title="Your Message | Complain"
                    titleStyle={styles.title}
                  />
                  <Card.Content>
                    <Fragment>
                      <FormBuilder
                        control={control}
                        setFocus={setFocus}
                        formConfigArray={[
                          {
                            name: "name",
                            type: "text",
                            textInputProps: {
                              label: "Name",
                              left: (
                                <TextInput.Icon
                                  icon="account"
                                  color={"#0A4081"}
                                />
                              ),
                            },
                            rules: {
                              required: {
                                value: true,
                                message: "Name is required",
                              },
                            },
                          },
                          {
                            name: "email",
                            type: "email",
                            textInputProps: {
                              label: "Email",
                              left: (
                                <TextInput.Icon
                                  icon="email"
                                  color={"#0A4081"}
                                />
                              ),
                            },
                            rules: {
                              required: {
                                value: true,
                                message: "Email is required",
                              },
                              pattern: {
                                value:
                                  /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                                message: "Email is invalid",
                              },
                            },
                          },
                          {
                            name: "message",
                            type: "text",
                            textInputProps: {
                              label: "Message",
                              left: (
                                <TextInput.Icon
                                  icon="pencil-plus"
                                  color={"#0A4081"}
                                />
                              ),
                              multiline: true,
                            },
                          },
                        ]}
                      />
                      <Card.Actions>
                        <Button
                          mode="contained"
                          onPress={handleSubmit(onSubmit)}
                        >
                          Submit
                        </Button>
                      </Card.Actions>
                    </Fragment>
                  </Card.Content>
                </View>
              )}
            </Card.Content>
          </Card>
        </View>
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  context: {
    marginTop: windowHeight * 0.01,
  },
  text: {
    marginTop: 6,
    marginBottom: 10,
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
  surfaceContainer: {
    alignItems: "center",
  },
  surface: {
    marginTop: 10,
    padding: 8,
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
});
