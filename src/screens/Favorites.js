import React from 'react';

import { StyleSheet, View, Platform, AsyncStorage, ActivityIndicator, Alert } from 'react-native';
import { Container, Text, Header, Content, Icon, List, ListItem, Toast, Root, ActionSheet, Left, Body, Right, Button } from 'native-base';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import { EventRegister } from 'react-native-event-listeners'
import PushNotification from 'react-native-push-notification'

@connectActionSheet
export default class Favorites extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true,
      data: [],
    };
  }

  componentWillMount() {
    AsyncStorage.getAllKeys()
    .then(keys => {
      AsyncStorage.multiGet(keys)
        .then(pairs => {
          return pairs.map((cur, i, arr) => {
            return JSON.parse(cur[1]);
          })
        }).then(res => {
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
            this.setState({
              data: res
            })
        })
    }).catch(error => {
      console.warn(error);
    })
  }
  
  _options = ["Details", "Remove from favorite", "Cancel"];
  // TODO: turn off notification 
  // Maybe using a clock icon
  _onPressEntry = item => {
    this.props.showActionSheetWithOptions(
      {
        options: this._options,
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        // title: item.title
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          Alert.alert(item.title, item.description);
        }
        if (buttonIndex === 1) {
          AsyncStorage.removeItem(item.program_id)
          .then(() => {
            PushNotification.cancelLocalNotifications({id: item.program_id});
            this._updateContent()
          })
          .catch(error => {
            console.warn(error);
          })
        } 
      }
    )
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
          <List dataArray={this.state.data}
            renderRow={this._renderItem} 
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
});
