import React from 'react';
import { StyleSheet, Text, View, Platform, Image} from 'react-native';
import { Linking,} from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';

const IMG_PATH = '../../res/assets/splashscreen.png'
const CJSF_URL = 'http://www.cjsf.ca/'

export default class Schedule extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>About tab</Text>
        <Content>
            <Icon name='information-circle'/>
        </Content>
        <Image source={require(IMG_PATH)}
          style={{width: 275, height: 275,}}/>
        <Text style={styles.header}>Diverse * Independent * Yours</Text>

        <Text style={styles.body}>
          CJSF 90.1 FM is Vancouver’s independent indie music, public affairs and social justice radio station.
          CJSF Radio located at Simon Fraser University’s Burnaby campus and broadcasts at 90.1FM or Greater Vancouver and via the internet to the world.
          CJSF is operated by a small staff over 150 volunteers from the campus and the community.
        </Text>

        <Text style={styles.header}>Be the Media</Text>

        <Text style={styles.body}>
          Want to get involved, attend one of our Orientations for New Volunteers.
          There are several every month; check the website at

          <Text style={{color: 'cornflowerblue'}}
            onPress={() => {Linking.openURL(CJSF_URL)}}> www.cjsf.ca </Text>

          <Text> for the next upcoming orientations.</Text>
        </Text>
        <Text style={styles.body}>
          CJSF 90.1FM Radio is supported and made possible by the students of Simon Fraser University
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ?  24 : 0,
  },
  header: {
    fontSize: 14,
    fontWeight:'bold',
    paddingBottom: 12
  },
  body: {
    fontSize: 12,
    paddingLeft: 14,
    paddingRight: 14,
    textAlign: 'justify',
    paddingBottom: 12
  },
});
