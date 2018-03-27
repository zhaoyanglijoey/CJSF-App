import React from "react";

import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Alert, NetInfo,
        Platform, ScrollView, AsyncStorage, PushNotificationIOS } from "react-native";
import { Container, Text, Header, Content, Button, Icon, List, ListItem,
         Left, Body, Right, Tab, Tabs, Root, ActionSheet, } from "native-base";
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import { EventRegister } from 'react-native-event-listeners';
import PushNotification from 'react-native-push-notification';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { weeklyScheduleUrl } from '../assets/constants/url.js' ;
import { addNotification, addFavorite } from '../util/Functions';

@connectActionSheet
export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, isConnected: false };
  }

  componentDidMount() {
    NetInfo.addEventListener('connectionChange', this._connectionChangeHandler);

    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected){
        fetch(weeklyScheduleUrl)
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Something went wrong on api server!');
          }
        })
        .then(responseJson => {
          this.setState({
            isLoading: false,
            data: responseJson
          });
        })
        .catch(error => {
          console.error(error);
        });

        this.setState({
          isConnected: true
        })
      }
    });


  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this._connectionChangeHandler);
  }

  _connectionChangeHandler = () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected){
        fetch(weeklyScheduleUrl)
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Something went wrong on api server!');
          }
        })
        .then(responseJson => {
          this.setState({
            isLoading: false,
            data: responseJson
          });
        })
        .catch(error => {
          console.error(error);
        });

        this.setState({
          isConnected: true
        })
      }
    });
  }

  _options = ["Details", "Add to favorite", "Cancel"];

  _onPressEntry = item => {
    this.props.showActionSheetWithOptions(
      {
        options: this._options,
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          Alert.alert(item.title, item.description);
        }
        if (buttonIndex === 1) {
          addFavorite(item);
        }
      }
    );
  }

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
    if(!this.state.isConnected){
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          }}>
          <Text>Network unavailable</Text>
        </View>
      )
    }

    if (this.state.isLoading) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          }}>
          <ActivityIndicator 
            size = 'large'
          />
        </View>
      );
    }

    return (
        <View style={styles.container}>
          <Tabs locked={false} tabBarUnderlineStyle={styles.tabUnderLine} >
            <Tab heading="Sun" tabStyle = {styles.tabBar} activeTabStyle = {styles.activeTabBar}
                      textStyle = {styles.tabText} activeTextStyle = {styles.activeTabText}>
              <List
                dataArray={this.state.data.Sunday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Mon" tabStyle={styles.tabBar} activeTabStyle = {styles.activeTabBar}
                      textStyle = {styles.tabText} activeTextStyle = {styles.activeTabText}>
              <List
                dataArray={this.state.data.Monday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Tue" tabStyle={styles.tabBar} activeTabStyle = {styles.activeTabBar}
                      textStyle = {styles.tabText} activeTextStyle = {styles.activeTabText}>
              <List
                dataArray={this.state.data.Tuesday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Wed" tabStyle={styles.tabBar} activeTabStyle = {styles.activeTabBar}
                      textStyle = {styles.tabText} activeTextStyle = {styles.activeTabText}>
              <List
                dataArray={this.state.data.Wednesday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Thu" tabStyle={styles.tabBar} activeTabStyle = {styles.activeTabBar}
                      textStyle = {styles.tabText} activeTextStyle = {styles.activeTabText}>
              <List
                dataArray={this.state.data.Thursday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Fri" tabStyle={styles.tabBar} activeTabStyle = {styles.activeTabBar}
                      textStyle = {styles.tabText} activeTextStyle = {styles.activeTabText}>
              <List
                dataArray={this.state.data.Friday}
                renderRow={this._renderItem}
              />
            </Tab>
            <Tab heading="Sat" tabStyle={styles.tabBar} activeTabStyle = {styles.activeTabBar}
                      textStyle = {styles.tabText} activeTextStyle = {styles.activeTabText}>
              <List
                dataArray={this.state.data.Saturday}
                renderRow={this._renderItem}
              />
            </Tab>
          </Tabs>
        </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  listItem: {
    height: '65@vs'
  },
  programTitle: {
    color: "#000",
    paddingBottom: '5@vs',
    fontSize: '16@s',
    fontWeight: "bold"
  },
  description: {
    fontSize: '13@s'
  },
  listIcon: {
    fontSize: '30@ms'
  },
  tabBar: {
    backgroundColor: 'white'
  },
  activeTabBar: {
    backgroundColor: 'white'
  },
  tabText: {
    color: 'black'
  },
  activeTabText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  tabUnderLine: {
    borderBottomWidth: 2,
    backgroundColor: 'blue'
  },

});