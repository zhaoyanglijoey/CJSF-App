import React from 'react';
import { Text, Linking } from 'react-native';

/* Constant resources used by the application */
// Text and Constants for About Screen //
export const LOGO = require('../../../res/assets/ic_launcher-web.png');
export const LOGO_HEIGHT = 260;
export const LOGO_WIDTH = 260;

export const TEXT_SIZE_HEADER=14;
export const TEXT_SIZE_BODY=12;

export const ABOUT_HEADER1='Diverse * Independent * Yours'
export const ABOUT_BODY1='CJSF 90.1 FM is Vancouver’s independent indie music, '
+ 'public affairs and social justice radio station. CJSF Radio located at '
+ 'Simon Fraser University’s Burnaby campus and broadcasts at 90.1FM or '
+ 'Greater Vancouver and via the internet to the world.  CJSF is operated by '
+ 'a small staff over 150 volunteers from the campus and the community.';
export const ABOUT_HEADER2='Be the Media'

const ABOUT_BODY2_1='Want to get involved, attend one of our Orientations'
+ ' for New Volunteers. There are several every month check the website at';
const CJSF_URL = 'http://www.cjsf.ca/';
const ABOUT_BODY2_2= 'for the next upcoming orientations.';

export const ABOUT_BODY2 =
  <Text>
    <Text>{ABOUT_BODY2_1}</Text>
    <Text style={{color: 'cornflowerblue'}}
      onPress={() => {Linking.openURL(CJSF_URL)}}> www.cjsf.ca </Text>
    <Text>{ABOUT_BODY2_2}</Text>
  </Text>

export const ABOUT_BODY3='CJSF 90.1FM Radio is supported and made possible by '
+ 'the students of Simon Fraser University';
