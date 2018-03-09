import React from 'react';
import { Text, View, Image, StyleSheet, Platform} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Container, Header, Content, Icon } from 'native-base';


import Home  from '../screens/Home';
import Favorites  from '../screens/Favorites';
import Scheduale from '../screens/Scheduale';
import About from '../screens/About';

//Styles fot the bottom nav bad icons
var styles = StyleSheet.create({
    container: {

    },
    mainHeader: {
        //paddingTop: (Platform.OS === 'android') ? Expo.Constants.statusBarHeight : 20,
        //height: ( (Platform.OS === 'android') ? 56 : 44 ) + Expo.Constants.statusBarHeight

    },
    headerTitle: {
        alignSelf:'center',
        textAlign: 'center',
        width: '100%'
    },
});

var navIconStyles = StyleSheet.create({
    container: {

    }
});

const HomeStack = StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            headerTitle: 'Home',
            headerStyle: styles.mainHeader,
            headerTitleStyle : styles.headerTitle,
            headerRight: (<View></View>)
        }
    }
});

const FavoritesStack = StackNavigator({
    Favorites: {
        screen: Favorites,
        navigationOptions: {
            headerTitle: 'Favorites',
            headerStyle: styles.mainHeader,
            headerTitleStyle : styles.headerTitle,
            headerRight: (<View></View>)
        }
    }
});

const SchedualeStack = StackNavigator({
    Scheduale: {
        screen: Scheduale,
        navigationOptions: {
            headerTitle: 'Scheduale',
            headerStyle: styles.mainHeader,
            headerTitleStyle : styles.headerTitle,
            headerRight: (<View></View>)
        }
    }
});

const AboutStack = StackNavigator({
    About: {
        screen: About,
        navigationOptions: {
            headerTitle: 'About',
            headerStyle: styles.mainHeader,
            headerTitleStyle : styles.headerTitle,
            headerRight: (<View></View>)
        }
    }
});

export const Tabs = TabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions:{
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) =><Icon name='ios-home' style={navIconStyles.container}/>,
        }
    },
    Favorites: {
        screen : FavoritesStack,
        navigationOptions:{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({ tintColor }) =><Icon name='star' style={navIconStyles.container}/>,
        }
    },
    Scheduale: {
        screen : SchedualeStack,
        navigationOptions:{
            tabBarLabel: 'Schedule',
            tabBarIcon: ({ tintColor }) =><Icon name='calendar' style={navIconStyles.container}/>,
        }
    },
    About: {
        screen : AboutStack,
        navigationOptions:{
            tabBarLabel: 'About',
            tabBarIcon: ({ tintColor }) =><Icon name='information-circle' style={navIconStyles.container}/>,
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
    navigationOptions: {
        header: {
            visible: true,
        },
    },
    animationEnabled: true,
    configureTransition: (currentTransitionProps,nextTransitionProps) => ({
      timing: Animated.spring,
      tension: 1,
      friction: 35,
    }),
    swipeEnabled: false,
  },
);


//Styles fot the bottom nav bad icons
var navIconStyles = StyleSheet.create({
    container: {
      color: Platform.OS === 'ios' ? 'cornflowerblue': 'white',
    }
  });
