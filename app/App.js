import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  Text,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import firebase from 'react-native-firebase';
import {
  BASE_API_URL,
  SCREEN_WIDTH,
  SCREEN_HEIGHT}  from './components/StaticValues';
import MainStack from './components/HomeRouter';
import NavigationMain from "./components/NavigationMain";
if(Platform.OS === 'ios'){

    KeyboardManager.setEnable(true);
    KeyboardManager.setEnableDebugging(true);
    KeyboardManager.setKeyboardDistanceFromTextField(10);
    KeyboardManager.setPreventShowingBottomBlankSpace(true);
    KeyboardManager.setEnableAutoToolbar(true);
    KeyboardManager.setToolbarDoneBarButtonItemText("Done");
    KeyboardManager.setToolbarManageBehaviour(0);
    KeyboardManager.setShouldToolbarUsesTextFieldTintColor(false);
    KeyboardManager.setToolbarPreviousNextButtonEnable(false);
    KeyboardManager.setShouldShowTextFieldPlaceholder(true);
    KeyboardManager.setOverrideKeyboardAppearance(false);
    KeyboardManager.setShouldResignOnTouchOutside(true);
    KeyboardManager.resignFirstResponder();
}
import SingleTon from "./components/SingleTon";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isloading: true,
    } 
  }

  componentDidMount() {
    const firebaseMessaging = firebase.messaging();
    const firebaseNotifications = firebase.notifications();
    const restaurantInfourl = BASE_API_URL+'/api/storeinfo/1/storeinfo';

    firebaseMessaging.hasPermission()
    .then((enabled) => {
      if (enabled) {
        // user has permissions
        console.log(enabled);
      } else {
        // user doesn't have permission
        firebaseMessaging.requestPermission()
          .then(() => {
            // User has authorised
          })
          .catch((error) => {
            // User has rejected permissions
          });
      }
    });

    firebaseMessaging.getToken()
    .then((token) => {
      console.log(token);
      SingleTon.devicefcm = token;
    }).catch((error) => {
    });

    // onNotification
    this.notificationListener = firebaseNotifications
    .onNotification((notification) => {
      var notify_title = notification.title;
      var notify_body = notification.body;
      Alert.alert(
        notify_title,
        notify_body,
        [
          {text: 'View', onPress: () => {
            console.log("delete");
            firebaseNotifications.setBadge(0)
            .then(() => {
              console.log("badge number cleared");
            })
            .catch((error) => {
              console.log(error);
            });
          }},
          {text: 'Close', onPress: () => {
            console.log("delete");
          }},
        ],
        { cancelable: false }
      )
    });

    // onNotificationOpened
    this.notificationOpenedListener = firebaseNotifications
    .onNotificationOpened((notificationOpen) => {
      firebaseNotifications.setBadge(0)
      .then(() => {
        console.log("badge number cleared");
      })
      .catch((error) => {
        console.log(error);
      });
    });

    fetch(restaurantInfourl)
    .then((response) => response.json())
    .then((responseJson) => {
      SingleTon.restaurantInfo = responseJson.data;
      setTimeout(function() {
        this.setState({isloading: false});
      }.bind(this), 1000);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  render() {
    return (
      this.state.isloading?
      <View style={styles.splashView} >
        <Text style={{color: '#fff', fontSize: 24, fontWeight: 'bold'}} >FOOD DELIVER</Text>
      </View>
      :
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <MainStack ref={navigatorRef => {
            NavigationMain.setTopLevelNavigator(navigatorRef)
          }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  containerOpen: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'visible',
    borderRadius: 10,
  },
  splashView: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#0CA2E9',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
