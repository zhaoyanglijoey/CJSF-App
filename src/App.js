import React from 'react';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import { Tabs } from './config/router'
import { Root } from "native-base";
import { pushNotifications } from './services';

pushNotifications.configure();

export default class App extends React.Component {
  render() {
    return  (
      <ActionSheetProvider>
        <Root>
          <Tabs/>
        </Root>
      </ActionSheetProvider>
    );
  }
}
