// import React from "react";
// import { Text } from "react-native-paper";
// export default function ClassNotes () {
//     return(
//         <Text>....</Text>
//     );
// };

import React, { useContext } from "react";
import { Button, FlatList, View, Text } from "react-native";
import NoteContext from "../contexts/NoteContext";

export default function ClassNotes() {
  const { data, addNotePost } = useContext(NoteContext);

  return (
    <View>
      <Text>Note Screen</Text>
      <Button title="Add Note" onPress={addNotePost} />
      <FlatList
        data={data}
        keyExtractor={notePosts => notePosts.title}
        renderItem={({ item }) => {
          return <Text>{item.title}</Text>;
        }}
      />
    </View>
  );
}

