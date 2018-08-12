import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, BackHandler,
  FlatList, ActivityIndicator, SafeAreaView, ScrollView, WebView, Vibration } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { List, ListItem, SearchBar } from 'react-native-elements';

class MyWeb extends Component {
  render() {
          Vibration.vibrate(1000);
    return (
      <WebView
        source={{uri: 'https://github.com/facebook/react-native'}}
        style={{marginTop: 20}}
      />
    );
  }
}

class WelcomeView extends Component {

  static navigationOptions = {
    title: 'Bienvenue',
  };

  render() {
    const sautDeLigne = '\n';
    const { navigate } = this.props.navigation;

    return (
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>Cliquez sur le bouton "Commencer"</Text><Text>{sautDeLigne}</Text>
        <Text style={styles.text}>pour démarrer le questionnaire</Text><Text>{sautDeLigne}</Text>
        <Button style={styles.button} onPress={() => navigate('FlatLDemo')} title="Commencer"/>
        <Button style={styles.button} onPress={() => navigate('Report')} title="Rapport"/>
      </View>
    </SafeAreaView>
    );
  }
}

class FlatListDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };
  }

  static navigationOptions = {
  title: 'Liste',
  };

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  renderSeparator = () => {
    return(
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
      }} />
    );
  };

  renderHeadeer = () => {
    return <SearchBar placeholder="Type here..." lightTheme round />;
  };

  renderFooter = () => {
    if (!this.state.loading) {return null;}
    else {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderTopColor: '#CED0CE'
          }}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              roundAvatar
              title={`${item.name.first} ${item.name.last}`}
              subtitle={item.email}
              avatar={{ uri: item.picture.thumbnail }}
              containerStyle={{ borderBottomWidth: 0 }}
            />
          )}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeadeer}
          ListFooterComponent={this.renderFooter}
        />
        <Button style={styles.button} onPress={() => navigate('Report')} title="Suivant"/>
      </List>
    );
  }
}

class QuestionsView extends Component {
    static navigationOptions = {
    title: 'Questionnaire',
  };

  render() {
    const sautDeLigne = '\n';
    const { navigate } = this.props.navigation;
    const textColor = this.props.selected ? "red" : "black";

    return (
      <View style={styles.container}>
        <FlatList
          data={[{key: 'a'}, {key: 'b'}]}
          renderItem={({item}) => <Text>{item.key}</Text>}
        /><Text>{sautDeLigne}</Text>
        <Button style={styles.button} onPress={() => navigate('Report')} title="Rapport"/>
      </View>
    );
  }
}

class ReportView extends Component {
  static navigationOptions = {
    title: 'Rapport',
  };

  quitApp = () => {
    Alert.alert(
          'Exit app',
          'Souhaitez-vous quitter ?',
          [
            {text: 'Non', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Oui', onPress: () => BackHandler.exitApp() + console.log('je quitte')},
          ],
          { cancelable: false });

          return true;
    }

  render() {
    const sautDeLigne = '\n';
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
          <Button style={styles.button} title="Quitter" onPress={this.quitApp} />
      </View>
    );
  }
}

const App = createStackNavigator({
//  Test: {screen: MyWeb},
  Welcome: {screen: WelcomeView},
  Questions: {screen: QuestionsView},
  Report: {screen: ReportView},
  FlatLDemo: {screen: FlatListDemo}
});

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'blue',
  },
  text: {
    fontSize:18,
    color: 'black',
  },
  button: {
    color: 'black',
    backgroundColor: 'white'
  },
});
