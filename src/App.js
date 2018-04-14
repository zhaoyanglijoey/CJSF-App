import React from 'react';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import { Tabs } from './config/router'
import { pushNotifications } from './services';
import SplashScreen from 'react-native-splash-screen'

export default class App extends React.Component {
  componentDidMount() {
    	  // Do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        pushNotifications.configure();
        SplashScreen.hide();
  }
  render() {
    return  (
      <ActionSheetProvider>
        <Tabs/>
      </ActionSheetProvider>
    );
  }
}
