import React from "react";

import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import {
  Container,
  Text,
  Header,
  Toast,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Tab,
  Tabs,
  Root,
  ActionSheet
} from "native-base";
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    var url = "http://cjsf.ca/api/station/programs_by_week";
    return fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          data: responseJson
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  _options = ["Details", "Add to favorite", "Cancel"];

  _onPressEntry = item =>
    ActionSheet.show(
      {
        options: this._options,
        cancelButtonIndex: 2,
        title: item.title
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          Alert.alert(item.title, item.description);
        }
        if (buttonIndex === 1) {
          Toast.show({
            text: "Added to favorite",
            position: "bottom"
          });
        }
      }
    );

  _renderItem = item => (
    <ListItem style={styles.listItem}>
      <Body>
        <Text style={styles.programTitle}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {item.start_time} - {item.end_time} {item.short_description}
        </Text>
      </Body>
      <Right>
        <Button transparent onPress={() => this._onPressEntry(item)}>
          <Icon name="ios-list" style={styles.listIcon} />
        </Button>
      </Right>
    </ListItem>
  );

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <Root>
        <View style={styles.container}>
          <Tabs renderTabBar={() => <ScrollableTabBar />}>
            <Tab heading="Sun">
              <List
                dataArray={this.state.data.Sunday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Mon">
              <List
                dataArray={this.state.data.Monday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Tue">
              <List
                dataArray={this.state.data.Tuesday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Wed">
              <List
                dataArray={this.state.data.Wednesday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Thu">
              <List
                dataArray={this.state.data.Thursday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Fri">
              <List
                dataArray={this.state.data.Friday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Sat">
              <List
                dataArray={this.state.data.Saturday}
                renderRow={this._renderItem}
              />
            </Tab>
          </Tabs>
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    padding: 15,
    backgroundColor: "rgba(240, 253, 245, 0.5)"
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  entry: {
    // alignItems: 'stretch',
    height: 65,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(50, 50, 50, 0.2)"
  },
  listItem: {
    height: 65
  },
  programTitle: {
    color: "#000",
    paddingBottom: 5,
    fontSize: 18,
    fontWeight: "bold"
  },
  description: {
    fontSize: 14
  },
  listIcon: {
    fontSize: 33
  }
});
