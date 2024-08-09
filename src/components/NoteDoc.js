import React, { useState, useEffect } from "react";
import { Share, View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Platform  } from "react-native";
import { PaperProvider, Card, IconButton } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from 'expo-document-picker';
import { setStyles, setTheme } from "../components/styles";

const DocumentList = ({ documentUrls = [] }) => {

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    setDocuments(documentUrls);
  }, [documentUrls]);

  const handleOpen = async (uri) => {
    if (!uri) {
      Alert.alert("Error", "Document URI is missing.");
      return;
    }
  
    try {
      await Linking.openURL(uri);
    } catch (error) {
      console.error("Error opening file:", error);
      Alert.alert("Error", "Failed to open the document.");
    }
  };

 const handleDownload = async (uri) => {
   if (!uri) {
     Alert.alert("Error", "Document URI is missing.");
     return;
   }

   try {
     const fileUri = FileSystem.cacheDirectory + 'documents/' + uri.split('/').pop();
     await FileSystem.makeDirectoryAsync(fileUri, { intermediates: true });
     const { uri: downloadedFileUri } = await FileSystem.downloadAsync(uri, fileUri);
     Alert.alert("File downloaded to", downloadedFileUri);
   } catch (error) {
     console.error("Error downloading file:", error);
     Alert.alert("Error", "Failed to download the file.");
   }
 };

 const handleShare = async (url) => {
   if (!url) {
     Alert.alert("Error", "URL is missing.");
     return;
   }

   try {
     await Share.share({
       message: url,
     });
   } catch (error) {
     console.error("Error sharing URL:", error);
     Alert.alert("Error", "Failed to share the URL.");
   }
 };

  const handleDelete = (id) => {
    setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id));
  };

  return documents.map((course) => (
    <PaperProvider theme={setTheme} key={course.id}>
      <Card mode="outlined" style={{ marginVertical: "2%" }}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[setStyles.title, styles.cardTitle]}>{course.title}</Text>
            <View style={styles.cardIcons}>
              <IconButton
                icon="open-in-new"
                size={22}
                iconColor="white"
                style={styles.icon}
                onPress={() => handleOpen(course.uri)}
              />
              <IconButton
                icon="download"
                size={22}
                iconColor="white"
                style={styles.icon}
                onPress={() => handleDownload(course.uri)}
              />
              <IconButton
                icon="share"
                size={22}
                iconColor="white"
                style={styles.icon}
                onPress={() => handleShare(course.uri)}
              />
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>{course.subject}</Text>
            <Text style={styles.cardText}>Other Files</Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.postedBy}>Posted by {course.postedBy} | {course.date}</Text>
            <TouchableOpacity style={styles.cardDelete} onPress={() => handleDelete(course.id)}>
              <IconButton
                icon="delete-forever-outline"
                size={20}
                iconColor="#d32f2f"
                style={{ marginHorizontal: 0 }}
              />
              <Text style={styles.deleteFile}>Delete File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </PaperProvider>
  ));
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardIcons: {
    flexDirection: "row",
  },
  icon: {
    backgroundColor: "#0A4081",
    color: "red",
    borderRadius: 20,
    marginLeft: 5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  cardText: {
    color: "#0A4081",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postedBy: {
    fontSize: 12,
    color: "#9e9e9e",
  },
  cardDelete: {
    flexDirection: "row",
  },
  deleteFile: {
    fontSize: 13,
    color: "#d32f2f",
    alignSelf: "center",
  },
});

export default DocumentList;