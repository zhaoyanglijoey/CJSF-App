import React from 'react';

import { StyleSheet, View, Platform, Slider, Image, ActivityIndicator} from 'react-native';
import { Container, Header, Content, Icon , 
  H1, H2, H3, 
  Text, Button,
  Card, CardItem,
  Left, Right,Body
} from 'native-base';

import {
  Player,
  MediaStates
} from 'react-native-audio-toolkit';

import moment from 'moment';
import * as Progress from 'react-native-progress';

import { stremingUrl, nowPlayingUrl } from '../assets/constants/url';


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
      animating: false,
      nowPlayingData : { short_description : "Loading"},
      seeakBarVal : 10
    }
  }

  //Lifecycles  methods
  componentWillMount(){
    buttonImg = [require('../../res/assets/play.png'), require('../../res/assets/stop.png')];
  }

  componentDidMount() {

    //--------------------------------------------Load now playing data to display--------------------------------
    return fetch(nowPlayingUrl)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          nowPlayingData: responseJson
        });
        console.log(responseJson);
        this.calculateTime(responseJson.start_time, responseJson.end_time);
      })
      .catch(error => {
        console.error(error);
      });
    
    //--------------------------------------------Prepare player to stream--------------------------------
    player.prepare((err)=> {
      console.log(err);
    });

  }

  calculateTime(start, end){
    
    let totalMinutes = this.timeDiff(start, end);

    let date = new Date();
    let minuteNow = date.getMinutes();
    let hourNow = date.getHours();
    
    let timeNow = hourNow +  ":" + minuteNow;

    let timeLeft = this.timeDiff( timeNow, end );

    let seeakBarVal = parseInt((timeLeft/totalMinutes)*100);

    this.setState({
      seeakBarVal : seeakBarVal
    });
    console.log("Time remaining : " + this.state.seeakBarVal);
  }

  timeDiff(start, end){
    let hourStart = parseInt(start.substring(0,2));
    let hourEnd = parseInt(end.substring(0,2));
    let minStart = parseInt(start.substring(3,5));
    let minEnd = parseInt(end.substring(3,5));

    if (hourStart > hourEnd) hourEnd += 24;

    let hourDiff = Math.abs(hourEnd - hourStart);
    let minDiff = Math.abs(minEnd - minStart);

    return hourDiff*60 + (minDiff);
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

  _onPressPlayHandler(){
    console.log("Play And Pause!!");
    console.log("Player can play: player.canPlay");
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
    });
   
  }

  //-----------------------------HTML renderig --------------------------------------------
  render() {
    return (
      <Container>
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
              {this.state.nowPlayingData.short_description}
            </Text>
            <View style={{flexDirection: "row", position: "absolute",  left: 0, right: 0, justifyContent: 'space-between', padding: 8}}>
              <Text > Left </Text>
              <Progress.Bar  progress={0.3} width={200} style={styles.seakBar} />
              <Text> Right </Text>
            </View>

            <View style={styles.playButtonContainer}>
              <Button light onPress={() => this._onPressPlayHandler()}>
                <Image source={buttonImg[this.state.playingButtonImg]} style={styles.playButton}/>
              </Button>
            </View>

        </View>
      </Container>
    );
  }
}

//-------------------------------STYLES-------------------------------------------------------
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
    borderColor: 'black',
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

