import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Card, Title, Paragraph, PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setStyles, setTheme } from '../components/styles';

const LibraryScreen = () => {
  const data = [
    // Example data
    { sr: '1', bookName: 'React Native in Action', issueDate: '01-10-23', status: 'Issued', returnDate: '01-20-23' },
    { sr: '2', bookName: 'Learning React Native', issueDate: '01-15-23', status: 'Returned', returnDate: '01-25-2024' },
    // Add more data as needed
  ];

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.sr}</Text>
      <Text style={styles.cell}>{item.bookName}</Text>
      <Text style={styles.cell}>{item.issueDate}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <Text style={styles.cell}>{item.returnDate}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PaperProvider theme={setTheme}>
      <Card mode='outlined' style={styles.card}>
        <Card.Content>
          <Title style={[setStyles.title, styles.title]}>Student Library Record</Title>
        </Card.Content>
        <Card.Content>
        <View style={styles.header}>
          <Text style={styles.headerCell}>Sr.</Text>
          <Text style={styles.headerCell}>Book Name</Text>
          <Text style={styles.headerCell}>Issue Date</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Return Date</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.sr}
          ListEmptyComponent={<Text style={styles.emptyText}>No records found</Text>}
        />
        </Card.Content>
      </Card>
      </PaperProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
  },
  card: {
    margin: 10,
  },
  title: {
    textAlign:"center"
  },
  header: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems:"center",
    paddingVertical: 10,
    backgroundColor: 'rgba(10,64,129,0.12)',
  },
  headerCell: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
});

export default LibraryScreen;
