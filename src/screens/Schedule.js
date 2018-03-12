import React from "react";

import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Alert,
        Platform, ScrollView, AsyncStorage, PushNotificationIOS } from "react-native";
import { Container, Text, Header, Content, Button, Icon, List, ListItem,
         Left, Body, Right, Tab, Tabs, Root, ActionSheet, } from "native-base";
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import { EventRegister } from 'react-native-event-listeners'
import { pushNotifications } from '../services';
import PushNotification from 'react-native-push-notification'
import Toast, {DURATION} from 'react-native-easy-toast'

@connectActionSheet
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

  _addFavorite = item => {
    AsyncStorage.setItem(item.program_id, JSON.stringify(item))
    .then(
      () => {
        var now = new Date();
        var scheduleDay;
        switch(item.day){
          case 'Sunday': scheduleDay = 0; break;
          case 'Monday': scheduleDay = 1; break;
          case 'Tuesday': scheduleDay = 2; break;
          case 'Wednesday': scheduleDay = 3; break;
          case 'Thursday': scheduleDay = 4; break;
          case 'Friday': scheduleDay = 5; break;
          case 'Saturday': scheduleDay = 6; break;
        }
        var hour = parseInt(item.start_time);
        var minute = parseInt(item.start_time.slice(4));
        if(hour === NaN || minute == NaN){
          console.warn('set notification failed: Invalid start time');
        }
        var scheduleDate = new Date(now.getFullYear(), now.getMonth(),
                                    now.getDate() + (scheduleDay - now.getDay()), hour, minute, 0, 0);
        
        if(scheduleDate < now){
          scheduleDate = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(),
                                  scheduleDate.getDate() + 7, hour, minute, 0, 0);
        }
        // scheduleDate = new Date(Date.now() + 60 * 1000)
        PushNotification.localNotificationSchedule({
          id: item.program_id,
          title: item.title,
          message: 'Your favorite programs is about to be on the air in ' + item.start_time,
          playSound: true,
          repeatType: 'week',
          date: scheduleDate,
        })
        // Alert.alert(item.title + ' added to favorites' , 'Notification created:' + scheduleDate.toString());
        this.refs.toast.show(item.title + ' added to favorites', DURATION.LENGTH_LONG);
        EventRegister.emit('favoriteUpdate', 'add worked!!');
      }
    ).catch(
      error => {
        console.warn(error);
      }
    )
  }

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
          this._addFavorite(item);
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
        <Toast
          ref="toast"
          position='bottom'
          positionValue={200}
          fadeInDuration={250}
          fadeOutDuration={500}
          opacity={0.8}
        />
        </View>
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
    height: 60
  },
  programTitle: {
    color: "#000",
    paddingBottom: 5,
    fontSize: 16,
    fontWeight: "bold"
  },
  description: {
    fontSize: 13
  },
  listIcon: {
    fontSize: 30
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
