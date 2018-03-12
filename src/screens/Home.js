import React from 'react';

import { StyleSheet, View, Platform, Slider, Image} from 'react-native';
import { Container, Header, Content, Icon , H1, H2, H3, Text,Button} from 'native-base';

import {
  Player,
  MediaStates
} from 'react-native-audio-toolkit';

import { stremingUrl } from '../assets/constants/url';

var player =  new Player(stremingUrl);
var buttonImg ;

export default class Home extends React.Component {

  constructor(){
    super();
    console.log(stremingUrl);
    
    player.prepare((err) => {
      console.log("Error: "+ err);

    });

    buttonImg = [require('../../res/assets/play.png'), require('../../res/assets/stop.png')];
    this.state = {
      seackBarVal : 40,
      playingButtonImg : 0,
      IsPlaying: false
    }
  }

  _onPress(){
    console.log("Play And Payse!!");
    player.playPause((err, playing) => {
      this.setState({IsPlaying: !playing});

      if (err) console.log("Error: " + err);
      console.log("Playing: "+ this.state.IsPlaying);
      if(this.state.playingButtonImg == 1){
        this.state.playingButtonImg = 0
      }else{
        this.state.playingButtonImg = 1
      }
      
      console.log("URL: "+ this.state.playingButtonImg );
    });
  }



  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../res/assets/splashscreen.png')} style={styles.imageAlbum}/>

        <Content>
          <Text>
            Democracy Now!
          </Text>
          <Slider style={styles.seakBar}
                  step = { this.state.seackBarVal }
                  minimumValue = { 0 }
                  maximumValue = { 100 }
                  minimumTrackTintColor = "#009688"
          ></Slider>
          
          <Button rounded light onPress={() => this._onPress()}>
            <Image source={buttonImg[this.state.playingButtonImg]} style={styles.playButton}/>
          </Button>

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
  playButton: {
    height: 40,
    width : 40
  },
  imageAlbum:{
    height:300, 
    width: 300
  },
  seakBar:{
    width: '100%'
  }

});

