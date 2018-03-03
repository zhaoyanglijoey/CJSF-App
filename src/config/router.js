import React from 'react';
import { Text, View } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Container, Header, Content, Icon } from 'native-base';

import Home  from '../screens/Home';
import Favorites  from '../screens/Favorites';


export const Tabs = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions:{
            tabBarLabel: 'Home',
            tabBarIcon : ({tintColor}) => <Icon name='home' />
        }
    },
    Favorites: {
        screen : Favorites,
        navigationOptions:{
            tabBarLabel: 'Favorites',
            tabBarIcon : ({tintColor}) => <Icon name='star' />
        }
    }
},
{
    tabBarPosition: 'bottom',
    animationEnabled: true,
    configureTransition: (currentTransitionProps,nextTransitionProps) => ({
      timing: Animated.spring,
      tension: 1,
      friction: 35,
    }),
    swipeEnabled: false,
  }
);