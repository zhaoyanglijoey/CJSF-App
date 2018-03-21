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

function stringToDay(str) {
  switch(str){
    case 'Sunday': return 0; break;
    case 'Monday': return 1; break;
    case 'Tuesday': return 2; break;
    case 'Wednesday': return 3; break;
    case 'Thursday': return 4; break;
    case 'Friday': return 5; break;
    case 'Saturday': return 6; break;
    default: return 0;
  }
}

export default class Favorites extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true,
      isConnected: false,
      data: [],
      scheduleData: null,
    };
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentDidMount() {
    NetInfo.addEventListener('connectionChange', this._fetchData);

    this._fetchData();

    this.listener = EventRegister.addEventListener('favoriteUpdate', this._updateContent);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this._fetchData);
    EventRegister.removeEventListener(this.listener);
  }

  _retrieveFavorites = (items) => {
    var res = [];
    for(var i in items){
      var searchArray = this.state.scheduleData[items[i].day];
      var found = false;
      for(var si in searchArray ){
        if(items[i].program_id === searchArray[si].program_id){
          if(items[i].start_time !== searchArray[si].start_time){
            PushNotification.cancelLocalNotifications({id: items[i].program_id});
            addNotification(searchArray[si]);
          }
          found = true;
          res.push(searchArray[si]);
        }
      }
      if(!found){
        pushNotifications.cancelLocalNotifications({id: items[i].program_id});
      }
    }
    return res;
  }

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
    AsyncStorage.getAllKeys()
    .then(keys => {
      AsyncStorage.multiGet(keys)
        .then(pairs => {
          return pairs.map((cur, i, arr) => {
            return JSON.parse(cur[1]);
          })
        })
        /*
        Problem to sychronize with the website: same program played multiple times in a week
        */
        // .then(items => {          
        //   return this._retrieveFavorites(items);
        // })
        .then(res => {
          res.sort( (a, b) => {
            if(stringToDay(a.day) === stringToDay(b.day)){
              var hourA = parseInt(a.start_time);
              var minuteA = parseInt(a.start_time.slice(4));
              var hourB = parseInt(b.start_time);
              var minuteB = parseInt(b.start_time.slice(4));
              return hourA === hourB? minuteA - minuteB : hourA - hourB;
            }
            else{
              return stringToDay(a.day) - stringToDay(b.day);
            }
          } )
          this.setState({
            isLoading: false,
            data: res
          })
        }).catch(error => {
          console.log(error);
        })
    }).catch(error => {
      console.warn(error);
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
      <Right>
        <Text note numberOfLine={1} style={{fontSize: scale(12)}}>{item.day}</Text>
        <Text note numberOfLine={1} style={{fontSize: scale(12)}}> {item.start_time} - {item.end_time}</Text>
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
              <Button full onPress={() => Alert.alert(item.title, item.description)}>
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
