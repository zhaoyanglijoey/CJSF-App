import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';

export default class Favorites extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Favorites tab</Text>
        <Content>
            <Icon name='star' />
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
