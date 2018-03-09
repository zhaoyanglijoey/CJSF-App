import React from 'react';

import { StyleSheet, Text, View, Platform} from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Home tab</Text>
        <Content>
            <Icon name='home' />
        </Content>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
