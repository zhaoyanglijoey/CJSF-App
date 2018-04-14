import React from 'react';
import { StyleSheet, Text, View, Platform, Image, Linking} from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';
import { ABOUT_BODY1, ABOUT_HEADER1, ABOUT_HEADER2, ABOUT_BODY2, ABOUT_BODY3,
LOGO, LOGO_HEIGHT, LOGO_WIDTH, CJSF_URL, TEXT_SIZE_BODY, TEXT_SIZE_HEADER,
BACKGROUND, }from '../assets/constants/ABOUT_SCREEN.js';


export default class Schedule extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={BACKGROUND} style={styles.background} blurRadius={7}/>
        <Image source={LOGO} style={styles.logo}/>
        <Text style={styles.header}>{ABOUT_HEADER1}</Text>
        <Text style={styles.body}>{ABOUT_BODY1}</Text>
        <Text style={styles.header}>{ABOUT_HEADER2}</Text>
        <Text style={styles.body}>{ABOUT_BODY2}</Text>
        <Text style={styles.body}>{ABOUT_BODY3}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    position: 'absolute',
    opacity: 0.7,
    width: '100%',
    height: '100%',
  },
  logo: {
    flex: 1,
    width: LOGO_HEIGHT,
    height: LOGO_WIDTH,
    resizeMode: 'contain',
  },
  header: {
    color: 'white',
    fontSize: TEXT_SIZE_HEADER,
    fontWeight:'bold',
    paddingBottom: TEXT_SIZE_BODY,
  },
  body: {
    color: 'white',
    fontSize: TEXT_SIZE_BODY,
    paddingLeft: TEXT_SIZE_HEADER,
    paddingRight: TEXT_SIZE_HEADER,
    textAlign: 'justify',
    paddingBottom: TEXT_SIZE_BODY
  },
});
