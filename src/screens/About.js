import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';

export default class About extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Chat tab</Text>
        <Content>
            <Icon name='chatboxes' />
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
