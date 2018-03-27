import React from 'react';

import { StyleSheet, View, Platform, AsyncStorage, ListView, ActivityIndicator, Alert, NetInfo } from 'react-native';
import { Container, Text, Header, Content, Icon, List, ListItem, Root, ActionSheet, Left, Body, Right, Button } from 'native-base';
import { EventRegister } from 'react-native-event-listeners'
import PushNotification from 'react-native-push-notification'
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { weeklyScheduleUrl } from '../assets/constants/url.js' 
import { addNotification } from '../util/Functions';
import { pushNotifications } from '../services/index.js';
import Toast from 'react-native-root-toast';

export default class Favorites extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true,
      isConnected: false,
      data: [],
      scheduleData: null,
    };
    // Required for swipable list
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentDidMount() {
    // Listen to network connection change
    NetInfo.addEventListener('connectionChange', this._fetchData);

    this._fetchData();

    this.listener = EventRegister.addEventListener('favoriteUpdate', this._updateContent);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this._fetchData);
    EventRegister.removeEventListener(this.listener);
  }

  // retrieve favorite programs by ids
  _retrieveFavorites = (ids) => {
    var res = [];
    for(var i in ids){
      var found = 0;
      var item;

      // search every day and every program to match the id
      for(var day in this.state.scheduleData){
        var searchArray = this.state.scheduleData[day];
        for(var si in searchArray ){
          if(ids[i] === searchArray[si].program_id){
            if(found === 0){
              item = searchArray[si];
              item.intervals = [[searchArray[si].day , searchArray[si].start_time, searchArray[si].end_time]];
              found = 1;
            }
            // record all the occurrence of the program 
            else{
              item.intervals.push([searchArray[si].day , searchArray[si].start_time, searchArray[si].end_time]);
            }
          }
        }
      }

      if(found){
        res.push(item);
      }
    }
    // return an array of program items
    return res;
  }

  // fetch the weekly schedule
  _fetchData = () => {
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
            scheduleData: responseJson,
          });
          this._updateContent();
        })
        .catch(error => {
          console.error(error);
        });
        this.setState({
          isConnected: true,
        })
      }
    });
  }

  _updateContent = () => {
    AsyncStorage.getAllKeys() // keys are program ids
      .then(ids => {
        return this._retrieveFavorites(ids);
      })
      .then(items => {
        // sort by lexiorgraphic order of program title
        items.sort((a, b) => {
          return (a.title < b.title) ? -1 : 1;
        });
        // refresh notification to synchronize with the latest schedule
        PushNotification.cancelAllLocalNotifications();
        for (var i in items) {
          addNotification(items[i]);
        }
        this.setState({
          isLoading: false,
          data: items,
        })
      })
      .catch(error => {
        console.log(error);
      })
  }

  _onPressDelete = (item, secId, rowId, rowMap) => {
    Alert.alert(
      'Remove from favorites', 
      'Are you sure you want to remove "' + item.title + '" from favorites?',
      [
        {text: 'Cancel'},
        {text: 'Yes', onPress: () => this._removeItem(item, secId, rowId, rowMap)}
      ]
    );
  } 

  _removeItem = (item, secId, rowId, rowMap) => {
    AsyncStorage.removeItem(item.program_id)
    .then(() => {
      PushNotification.cancelLocalNotifications({id: item.program_id});
      Toast.show(item.title + ' removed from favorites', {
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.LONG,
        animation: true,
        shadow: true,
        })
      rowMap[`${secId}${rowId}`].props.closeRow();    
      this._updateContent();
    })
    .catch(error => {
      console.warn(error);
    })
  }

  _renderItem = item => (
    <ListItem style={styles.listItem}>
      <Body>
        <Text style={styles.programTitle}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {item.short_description}
        </Text>
      </Body>
    </ListItem>
  );

  _showInfo = item => {
    var res = item.description;
    res += '\n\nSchedules: \n';
    for(var i in item.intervals){
      res += item.intervals[i][0] + ' ' +  item.intervals[i][1] + ' - ' + item.intervals[i][2] + '\n'; 
    }
    return res;
  }


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
        <View style={styles.centerContainer}>
          <ActivityIndicator 
            size = 'large'
          />
        </View>
      );
    }

    if (this.state.data.length === 0){
      return (
        <Container style = {styles.centerContainer}>
        <Text style = {{
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}>No favorite yet</Text> 
        </Container>
      )
    }

    return (
        <View style={styles.container}>
          <List
            dataSource={this.ds.cloneWithRows(this.state.data)}
            renderRow={this._renderItem} 
            renderLeftHiddenRow={item =>
              <Button full onPress={() => Alert.alert(item.title, this._showInfo(item))}>
                <Icon active name="information-circle" />
              </Button>}
            renderRightHiddenRow={(item, secId, rowId, rowMap) =>
              <Button full danger onPress={_ => this._onPressDelete(item, secId, rowId, rowMap)}>
                <Icon active name="ios-trash" />
              </Button>}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    height: '65@vs'
  },
  programTitle: {
    color: "#000",
    paddingLeft: '10@s',
    paddingBottom: '5@vs',
    fontSize: '16@s',
    fontWeight: "bold"
  },
  description: {
    paddingLeft: '10@s',
    fontSize: '13@s'
  },
  listIcon: {
    fontSize: 30
  },
});
