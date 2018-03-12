import React from 'react';

import { StyleSheet, View, Platform, AsyncStorage, ListView, ActivityIndicator, Alert } from 'react-native';
import { Container, Text, Header, Content, Icon, List, ListItem, Root, ActionSheet, Left, Body, Right, Button } from 'native-base';
// import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import { EventRegister } from 'react-native-event-listeners'
import PushNotification from 'react-native-push-notification'
import Toast, {DURATION} from 'react-native-easy-toast'

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

// @connectActionSheet
export default class Favorites extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true,
      data: [],
    };
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentDidMount() {
    AsyncStorage.getAllKeys()
    .then(keys => {
      AsyncStorage.multiGet(keys)
        .then(pairs => {
          return pairs.map((cur, i, arr) => {
            return JSON.parse(cur[1]);
          })
        }).then(res => {
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
        })
    }).catch(error => {
      console.warn(error);
    })

    this.listener = EventRegister.addEventListener('favoriteUpdate', this._updateContent);
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  _updateContent = () => {
    AsyncStorage.getAllKeys()
    .then(keys => {
      AsyncStorage.multiGet(keys)
        .then(pairs => {
          return pairs.map((cur, i, arr) => {
            return JSON.parse(cur[1]);
          })
        }).then(res => {
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
            data: res
          })
        })
    }).catch(error => {
      console.warn(error);
    })
  }
  
  // _options = ["Details", "Remove from favorite", "Cancel"];
  // TODO: turn off notification 
  // Maybe using a clock icon

  // _onPressEntry = item => {
  //   this.props.showActionSheetWithOptions(
  //     {
  //       options: this._options,
  //       cancelButtonIndex: 2,
  //       destructiveButtonIndex: 1,
  //       // title: item.title
  //     },
  //     buttonIndex => {
  //       if (buttonIndex === 0) {
  //         Alert.alert(item.title, item.description);
  //       }
  //       if (buttonIndex === 1) {
  //         AsyncStorage.removeItem(item.program_id)
  //         .then(() => {
  //           PushNotification.cancelLocalNotifications({id: item.program_id});
  //           this.refs.toast.show(item.title + ' removed from favorites', DURATION.LENGTH_LONG);
  //           this._updateContent();
  //         })
  //         .catch(error => {
  //           console.warn(error);
  //         })
  //       } 
  //     }
  //   )
  // }

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
      this.refs.toast.show(item.title + ' removed from favorites', DURATION.LENGTH_LONG);
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
        <Text note numberOfLine={1} style={{fontSize: 12}}>{item.day}</Text>
        <Text note numberOfLine={1} style={{fontSize: 12}}> {item.start_time} - {item.end_time}</Text>
      </Right>
    </ListItem>
  );


  render() {
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
          fontSize: 20,
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
          <Toast
            ref="toast"
            position='bottom'
            positionValue={200}
            fadeInDuration={500}
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
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    height: 60
  },
  programTitle: {
    color: "#000",
    paddingLeft: 10,
    paddingBottom: 5,
    fontSize: 16,
    fontWeight: "bold"
  },
  description: {
    paddingLeft: 10,
    fontSize: 13
  },
  listIcon: {
    fontSize: 30
  },
});
