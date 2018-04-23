import React from 'react';

import { StyleSheet, View, Platform, Slider, Image, ActivityIndicator,  TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, NetInfo} from 'react-native';
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
import Toast from 'react-native-root-toast';  // TO DO:  Change it to use better library or custom native toast 

//---------Import all images --------------
import volMin from '../../res/assets/vol-min.imageset/vol-min.png';
import volMax from '../../res/assets/vol-max.imageset/vol-max.png';
import playImg from '../../res/assets/btn-play.imageset/btn-play2x.png';
import stopImg from '../../res/assets/btn-pause.imageset/btn-pause2x.png';
import backgroundImg from '../../res/assets/background.imageset/background.png';


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
      seackBarVal : 5,
      playingButtonImg : 0,
      IsPlaying: false,
      animating: false,
      nowPlayingData : { short_description : "Loading"},
      seeakBarVal : 10,
      netAvailble: false
    }
  }

  //Lifecycles  methods
  componentWillMount(){
    buttonImg = [playImg, stopImg];

    console.log("Player status : " + player.state);

    if ( player.state == 4){
      this.setState({
        IsPlaying : true
      });
    }
  }

  componentDidMount() {
    console.log("Player status : " + player.state);
    //--------------------------------------------Load now playing data to display--------------------------------
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      if ( connectionInfo.type == 'cellular' || connectionInfo.type == 'wifi' ){
        Toast.show('Stremming over ' + connectionInfo.type, {
          position: Toast.positions.TOP,
          duration: Toast.durations.LONG,
          animation: true,
          shadow: true,
          toastStyle,
        });

        this.setState({
          netAvailble : true
        });

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

      }else {
        this.setState({
          netAvailble : false
        });

        Toast.show('No internet connection', {
          position: Toast.positions.TOP,
          duration: Toast.durations.LONG,
          animation: true,
          shadow: true,
          toastStyle,
        });
      }
      
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
  }

  _onPressPlayHandler(){
    if (this.state.netAvailble){
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
    }else{
      Toast.show('No internet connection', {
        position: Toast.positions.TOP,
        duration: Toast.durations.LONG,
        animation: true,
        shadow: true,
        toastStyle,
      });
    }
    
  }

  playAndPause(){
    if (this.state.netAvailble){
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
  }

  changeVolume(value) {
    console.log(value);
  }

  //-----------------------------HTML renderig --------------------------------------------
  render() {
    const resizeMode = 'cover';
    return (
      <View style={styles.container}>
             <Image
              style={{
                backgroundColor: '#ccc',
                flex: 1,
                resizeMode,
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
              }}
              source={backgroundImg}
            />


            <Image source={require('../../res/assets/album.png')} style={styles.imageAlbum} resizeMode="contain" />
            
            {/* ----------------Spinning wheel --------------------------- */}
            {this.state.animating ?  
              <ActivityIndicator
              animating = {true}
              color = '#172d51'
              size = "large"
              style = {styles.activityIndicator}/> : 
              <View></View>
            }
            {/* ----------------------------- END speening wheel----------------------------- */}
          
            <Text style={styles.currentPlayText}>
              {this.state.nowPlayingData.short_description}
            </Text>
          
          {/* ---------------- Seek bar -----------------------------  */}
          {/* <View style={styles.row}>
            <Text > Left </Text>
            <Progress.Bar  progress={0.3} width={200} style={styles.seakBar} />
            <Text> Right </Text>
          </View> */}
          {/* ----------------- END Seek bar -------------------------------- */}

          {/* ---------------- Volume bar -----------------------------  */}
          {/* <View style= {styles.row} >
            <Image source={volMin}  resizeMode="contain" />
            <Slider style={styles.seakBar}
                  step = { this.state.seackBarVal }
                  minimumValue = { 0 }
                  maximumValue = { 100 }
                  minimumTrackTintColor = "#009688"
            ></Slider>
            <Image source={volMax} resizeMode="contain" />
          </View> */}
          {/* ----------------- END Volume bar -------------------------------- */}

          <View style={styles.playButtonContainer}>
            <TouchableWithoutFeedback  onPress={() => this._onPressPlayHandler()} style={styles.playButton}>
              <Image source={buttonImg[this.state.playingButtonImg]} />
            </TouchableWithoutFeedback >
          </View>

      </View>
    );
  }
}

//-------------------------------STYLES-------------------------------------------------------
const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },  
  
  row: {
    flexDirection: "row",
    width : '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentPlayText: {
    color: 'white',
    fontSize: 22,
    padding : 20,
    paddingTop: 0,
    textAlign: 'center'
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width : 80
  },
  
  imageAlbum:{
    flex:1, 
    resizeMode: 'stretch'
  },
  
  seakBar:{
    borderColor: 'black',
    width: '80%',
    padding : 10
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
  },
});

const  toastStyle =  {
  backgroundColor: "#4ADDFB",
  width: 300,
  height: Platform.OS === ("ios") ? 50 : 100,
  color: "#ffffff",
  fontSize: 15,
  lineHeight: 2,
  lines: 4,
  borderRadius: 15,
}
