import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button, Card, PaperProvider } from "react-native-paper";
import { setStyles, setTheme } from "../components/styles";
import { useData } from "../contexts/DataContext";
import { useStripe } from "@stripe/stripe-react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export default function Fee() {
  const { userData } = useData();
  const [studentId, setStudentId] = useState(null);
  const [fees, setFees] = useState([]);
  const [selectedSection, setSelectedSection] = useState("Unpaid");
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    if (userData) {
      const studentId = Object.keys(userData)[0];
      setStudentId(studentId);
    }
  }, [userData]);

  useEffect(() => {
    if (studentId && userData) {
      const studentData = userData[studentId];
      if (studentData && studentData.semesters) {
        const semestersData = studentData.semesters;
        const baseReceiveDate = new Date("2023-09-26");
        const feeData = Object.keys(semestersData).map((semesterId, index) => {
          const { receiveDate, dueDate } = generateDates(
            baseReceiveDate,
            index * 6
          );
          return {
            semester: "Semester Fee",
            semesterId: semesterId, // Store semesterId along with fee data
            amount: semestersData[semesterId].fees,
            paid: semestersData[semesterId].fee_status === "Paid",
            duedate: dueDate,
            receiveddate: receiveDate,
            transactionId: `TXN${Math.floor(100000 + Math.random() * 900000)}`,
            challanNo: generateRandomChallanNo(),
            installment: `${index + 1}`, // Assuming installment number is the index + 1
          };
        });
        setFees(feeData);
      } else {
        console.error("Semesters data not found");
      }
    }
  }, [studentId, userData]);

//  useEffect(() => {
//    if (studentId) {
//      const databaseRef = firebase
//        .database()
//        .ref(`students/${studentId}/semesters`);
//      const handleData = (snapshot) => {
//        const data = snapshot.val();
//        // Update local state with the new data
//        if (data) {
//          const feeDataFromFirebase = Object.keys(data).map((semesterId) => {
//            return {
//              semesterId: semesterId,
//              paid: data[semesterId].fee_status === "Paid",
//            };
//          });
//          // Merge feeDataFromFirebase with the existing fees state
//          const updatedFees = fees.map((fee) => {
//            const correspondingFirebaseFee = feeDataFromFirebase.find(
//              (item) => item.semesterId === fee.semesterId
//            );
//            if (correspondingFirebaseFee) {
//              return {
//                ...fee,
//                paid: correspondingFirebaseFee.paid,
//              };
//            }
//            return fee;
//          });
//          setFees(updatedFees);
//        }
//      };
//
//      databaseRef.on("value", handleData);
//
//      return () => {
//        // Unsubscribe from database updates when the component unmounts
//        databaseRef.off("value", handleData);
//      };
//    }
//  }, [studentId, fees]); // Include fees in the dependency array

  const generateRandomChallanNo = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  };

  const generateDates = (baseDate, monthsGap) => {
    const receiveDate = new Date(baseDate);
    receiveDate.setMonth(receiveDate.getMonth() + monthsGap);
    const dueDate = new Date(receiveDate);
    dueDate.setMonth(dueDate.getMonth() + 1);
    return {
      receiveDate: receiveDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
    };
  };

  const handlePayment = async (fee, semesterId) => {
    try {
      const paymentIntent = await fetchPaymentIntent(fee.amount);
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: "Your Merchant Name", // Add your merchant name here
        style: "alwaysLight",
        returnURL: "yourapp://payment-return", // Provide a return URL for iOS
      });
      if (!error) {
        const { error } = await presentPaymentSheet();

        if (!error) {
          Alert.prompt("Payment successful!");

          firebase
            .database()
            .ref(`students/${studentId}/semesters/${semesterId}/fee_status`)
            .set("Paid");

          console.log("Payment Status: Paid");
        } else {
          console.error("Error presenting payment sheet:", error);
          Alert.alert(`Error: ${error.message}`);
        }
      } else {
        console.error("Error initializing payment sheet:", error);
        Alert.alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        "Failed to process payment. Please try again later."
      );
    }
  };

  const fetchPaymentIntent = async (amount) => {
    const response = await fetch(
      "http://192.168.56.1:3000/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      }
    );
    const { paymentIntent } = await response.json();
    return paymentIntent;
  };

  const handleDownloadVoucher = (semester) => {
    alert(`Download voucher for ${semester}`);
  };

  const filteredFees = fees.filter((fee) =>
    selectedSection === "Paid" ? fee.paid : !fee.paid
  );

  return (
    <PaperProvider theme={setTheme}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={[
              styles.sectionButton,
              selectedSection === "Unpaid" && styles.activeSection,
            ]}
            onPress={() => setSelectedSection("Unpaid")}
          >
            <Text
              style={[
                styles.sectionText,
                selectedSection === "Unpaid" && styles.activeSectionText,
              ]}
            >
              Unpaid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sectionButton,
              selectedSection === "Paid" && styles.activeSection,
            ]}
            onPress={() => setSelectedSection("Paid")}
          >
            <Text
              style={[
                styles.sectionText,
                selectedSection === "Paid" && styles.activeSectionText,
              ]}
            >
              Paid
            </Text>
          </TouchableOpacity>
        </View>
        {filteredFees.map((fee, index) => (
          <View key={index}>
            <Card mode="outlined" style={styles.card}>
              <Card.Title title={fee.semester} titleStyle={setStyles.title} />
              <Card.Content style={{ marginTop: -10 }}>
                <View style={styles.amountContainer}>
                  {fee.paid && (
                    <View style={styles.challanContainer}>
                      <Text style={styles.challanText}>Challan No.</Text>
                      <Text style={styles.challanNumber}>{fee.challanNo}</Text>
                      <Text style={styles.challanText}>Transaction Id</Text>
                      <Text style={styles.challanNumber}>
                        {fee.transactionId}
                      </Text>
                      <Text style={styles.challanText}>Semester:</Text>
                      <Text style={styles.challanNumber}>
                        {fee.installment}
                      </Text>
                    </View>
                  )}
                  {selectedSection === "Unpaid" && (
                    <Text style={setStyles.title}>
                      {`Semester ${fee.installment}`}
                    </Text>
                  )}
                  <Text style={styles.amount}>
                    {fee.paid ? "Paid Fee: Rs. " : "Amount: Rs."}
                    {fee.amount}
                  </Text>
                </View>
                {fee.paid ? (
                  <>
                    <View style={styles.amountContainer}>
                      <View>
                        <Text style={styles.challanText}>Due Date</Text>
                        <Text style={styles.detailText}> {fee.duedate}</Text>
                      </View>
                      <View>
                        <Text style={styles.challanText}>Received Date</Text>
                        <Text style={styles.detailText}>
                          {" "}
                          {fee.receiveddate}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <Button
                      mode="contained"
                      style={[
                        setStyles.button,
                        { marginVertical: 15, marginHorizontal: 15 },
                      ]}
                      onPress={() => handlePayment(fee, fee.semesterId)}
                    >
                      Pay Now
                    </Button>
                    <TouchableOpacity
                      onPress={() => handleDownloadVoucher(fee.semester)}
                    >
                      <Text style={styles.downloadVoucherText}>
                        Download Voucher
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Card.Content>
            </Card>
            {index < filteredFees.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  sectionButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0A4081",
  },
  activeSection: {
    backgroundColor: "rgba(10,64,129,0.12)",
    borderWidth: 2,
  },
  sectionText: {
    color: "#0A4081",
    fontSize: 15,
  },
  activeSectionText: {
    fontWeight: "bold",
  },
  card: {
    minHeight: 150,
    marginVertical: 20,
    justifyContent: "center",
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challanContainer: {
    flexDirection: "column",
  },
  challanText: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 5,
    marginRight: 5,
    color: "#0A4081",
  },
  challanNumber: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    color: "#0A4081",
  },
  amount: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0A4081",
    alignSelf: "flex-start",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
  detailText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
    color: "black",
    marginBottom: 2,
  },
  downloadVoucherText: {
    fontSize: 15,
    marginTop: -5,
    color: "rgba(10,64,129,0.6)",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
