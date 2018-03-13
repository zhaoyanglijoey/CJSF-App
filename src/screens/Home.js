import React from 'react';

import { StyleSheet, View, Platform, Slider, Image, ActivityIndicator} from 'react-native';
import { Container, Header, Content, Icon , 
  H1, H2, H3, 
  Text, Button,
  Card, CardItem,
} from 'native-base';

import {
  Player,
  MediaStates
} from 'react-native-audio-toolkit';

import { stremingUrl } from '../assets/constants/url';


var playbackOptions = {
  // Boolean to indicate whether the player should self-destruct after
  // playback is finished. If this is not set, you are responsible for
  // destroying the object by calling player.destroy().
  autoDestroy : true,

  // (Android only) Should playback continue if app is sent to background?
  // iOS will always pause in this case.
  continuesToPlayInBackground : true
};

var player =  new Player(stremingUrl, playbackOptions);
var buttonImg ;

export default class Home extends React.Component {

  constructor(){
    super();
    console.log(stremingUrl);
    

    this.state = {
      seackBarVal : 40,
      playingButtonImg : 0,
      IsPlaying: false,
      animating: false
    }
  }

  componentWillMount(){
    buttonImg = [require('../../res/assets/play.png'), require('../../res/assets/stop.png')];
  }

  componentDidMount(){
    player.playPause((err, playing) => {
      console.log(err);
    });
  }
  closeActivityIndicator(){
    
    this.setState({ animating: false });
    console.log("Closeing now! = "+ this.state.animating);
  }
  startActivityIndicator(){
    this.state.animating = true;
    this.setState({ animating: true });
    console.log("Starting now!: "+ this.state.animating);
  }


  _onPressHandler(){
    console.log("Play And Pause!!");

    if (player.canPlay){
      this.playAndPause();
    }else {
      this.startActivityIndicator();
      console.log("Animating! = "+ this.state.animating);
      player.prepare((err) => {
        console.log("Error: "+ err);
        this.closeActivityIndicator();
        this.playAndPause();
      });
    }
    
  }

  playAndPause(){
    player.playPause((err, playing) => {
      this.setState({IsPlaying: !playing});

      if (err) console.log("Error: " + err);
      console.log("Playing: "+ this.state.IsPlaying);
      
      if(this.state.playingButtonImg == 0){
        this.state.playingButtonImg = 1
      }else{
        this.state.playingButtonImg = 0
      }

      this.setState((prevState, props) => {
        return {playingButtonImg: this.state.playingButtonImg};
      });
      
      console.log("URL: "+ this.state.playingButtonImg );
    });
   
  }



  render() {
    return (
      <View style={styles.container}>
        
          <Image source={require('../../res/assets/splashscreen.png')} style={styles.imageAlbum} resizeMode="contain" />
          {this.state.animating ?  
            <ActivityIndicator
            animating = {true}
            color = '#172d51'
            size = "large"
            style = {styles.activityIndicator}/> : 
            <View></View>
          }
          
          <Text>
            Democracy Now!
          </Text>
          <Slider style={styles.seakBar}
                  step = { this.state.seackBarVal }
                  minimumValue = { 0 }
                  maximumValue = { 100 }
                  minimumTrackTintColor = "#009688"
          ></Slider>
          <View style={styles.playButtonContainer}>
            <Button light onPress={() => this._onPressHandler()}>
              <Image source={buttonImg[this.state.playingButtonImg]} style={styles.playButton}/>
            </Button>
          </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width : 50
  },
  imageAlbum:{
    flex:1, 
  },
  seakBar:{
    width: '80%'
  },
  playButtonContainer: {
    padding: 20,

  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'

  }

});

