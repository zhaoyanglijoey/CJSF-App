import PushNotification from 'react-native-push-notification';
import { EventRegister } from 'react-native-event-listeners';
import { AsyncStorage, Alert } from 'react-native';
import Toast from 'react-native-root-toast';

const addNotification = (item) => {
  for(var i in item.intervals){
    item.day = item.intervals[i][0];
    item.start_time = item.intervals[i][1];
    item.end_time = item.intervals[i][2];

    var now = new Date();
    var scheduleDay;
    switch(item.day){
      case 'Sunday': scheduleDay = 0; break;
      case 'Monday': scheduleDay = 1; break;
      case 'Tuesday': scheduleDay = 2; break;
      case 'Wednesday': scheduleDay = 3; break;
      case 'Thursday': scheduleDay = 4; break;
      case 'Friday': scheduleDay = 5; break;
      case 'Saturday': scheduleDay = 6; break;
    }
    var hour = parseInt(item.start_time);
    var minute = parseInt(item.start_time.slice(4));
    if(hour === NaN || minute == NaN){
      console.warn('set notification failed: Invalid start time');
    }
    var scheduleDate = new Date(now.getFullYear(), now.getMonth(),
                                now.getDate() + (scheduleDay - now.getDay()), hour, minute, 0, 0);
    scheduleDate = new Date(scheduleDate - 10 * 60 * 1000);

    if(scheduleDate < now){
      scheduleDate = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(),
                              scheduleDate.getDate() + 7, scheduleDate.getHours(), scheduleDate.getMinutes(), 0, 0);
    }
    // scheduleDate = new Date(Date.now() + 10 * 1000); //for test
    PushNotification.localNotificationSchedule({
      // id: item.program_id,
      title: item.title,
      message: 'Starting at ' + item.start_time + '!',
      playSound: true,
      repeatType: 'week',
      date: scheduleDate,
      // ongoing: false,
      
      //required for iOS to cancel notification
      userInfo: {
        id: item.program_id,
      },
      number: 1,
    })
    console.log('notification created ' + item.title + ' ' + item.day + ' ' + item.start_time + ' ');
  }
}

const addFavorite = item => {
    AsyncStorage.setItem(item.program_id, item.program_id)
    .then(
      () => {
        // addNotification(item);
        Toast.show(item.title + ' added to favorites', {
            position: Toast.positions.BOTTOM,
            duration: Toast.durations.LONG,
            animation: true,
            shadow: true,
        })
        EventRegister.emit('favoriteUpdate', '');
      }
    ).catch(
      error => {
        console.warn(error);
      }
    )
}

const removeFavorite = item => {
    Alert.alert(
        'Remove from favorites', 
        'Are you sure you want to remove "' + item.title + '" from favorites?',
        [
          {text: 'Cancel'},
          {text: 'Yes', onPress: () => {
            AsyncStorage.removeItem(item.program_id)
            .then(() => {
              // PushNotification.cancelLocalNotifications({id: item.program_id});
              Toast.show(item.title + ' removed from favorites', {
                position: Toast.positions.BOTTOM,
                duration: Toast.durations.LONG,
                animation: true,
                shadow: true,
                })
              EventRegister.emit('favoriteUpdate', '');
            })
            .catch(error => {
              console.warn(error);
            })
          }}
        ]
      );
}

export {
    addNotification,
    addFavorite,
    removeFavorite,
}