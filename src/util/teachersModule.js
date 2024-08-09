import firebase from "./firebaseConfig";

const fetchTeachersInfo = async () => {
  try {
    const teachersRef = firebase.database().ref("teachers");
    const snapshot = await teachersRef.once("value");
    const teachersData = snapshot.val();

    if (teachersData) {
      const teachersArray = Object.entries(teachersData).map(
        ([key, value]) => ({
          id: key,
          ...value,
        })
      );
      return teachersArray;
    }
  } catch (error) {
    console.error("Error fetching teachers' information:", error);
    return [];
  }
};

export default fetchTeachersInfo;
