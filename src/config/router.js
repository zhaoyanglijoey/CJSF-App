import React from 'react';
import { Text, View, Image, StyleSheet} from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Container, Header, Content, Icon } from 'native-base';


import Home  from '../screens/Home';
import Favorites  from '../screens/Favorites';
import Scheduale from '../screens/Scheduale';
import Chat from '../screens/Chat';

export const Tabs = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions:{
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) =><Icon name='ios-home' style={navIconStyles.container}/>,
        }
    },
    Favorites: {
        screen : Favorites,
        navigationOptions:{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({ tintColor }) =><Icon name='star' style={navIconStyles.container}/>,
        }
    },
    Scheduale: {
        screen : Scheduale,
        navigationOptions:{
            tabBarLabel: 'Schedule',
            tabBarIcon: ({ tintColor }) =><Icon name='calendar' style={navIconStyles.container}/>,
        }
    },
    Chat: {
        screen : Chat,
        navigationOptions:{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ tintColor }) =><Icon name='chatboxes' style={navIconStyles.container}/>,
        }
    }
},
{
    tabBarPosition: 'bottom',
    tabBarOptions: {
         showIcon: true,
         labelStyle: {
            fontSize: 12,
            margin: 0,
        },    
    },
    animationEnabled: true,
    configureTransition: (currentTransitionProps,nextTransitionProps) => ({
      timing: Animated.spring,
      tension: 1,
      friction: 35,
    }),
    swipeEnabled: false,
  }
);


//Styles fot the bottom nav bad icons
var navIconStyles = StyleSheet.create({
    container: {
      color: 'white',
    }
  });
