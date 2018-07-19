import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  Text,
  AppState,
  AsyncStorage,
  NetInfo,
  Modal,
  TouchableOpacity,
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
      isConnected: true,
      isloading: true,
      isloadingTest: true,
      appState: AppState.currentState,
    } 
  }

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
    if(isConnected) {
      this.loadAllComponent();
    }
  };

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      this.checkBadgeNumber();
    }
    this.setState({appState: nextAppState});
  }

  checkBadgeNumber() {
    AsyncStorage.getItem('loginToken')
    .then((val) => {
        const badgeFetchUrl = BASE_API_URL+'/api/getbadgeNumber';
        return fetch(badgeFetchUrl,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer '+val
            }
        });
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.result === "success") {
        if(SingleTon.push) {
          SingleTon.push.setState({
            isBadge: true,
            badgeNumber: responseJson.number,
          });
        }

        if(SingleTon.isShowTab) {
          SingleTon.isShowTab.setState({
              isBadge: true,
              badgeNumber: responseJson.number,
          });
        }
      }
    })
    .catch((error) => {
        console.log(error);
    });
  }

  loadAllComponent() {
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
      console.log(notification);

      if(SingleTon.push) {
        SingleTon.push.setState({
          isBadge: true,
          badgeNumber: notification._ios._badge,
        })
      }

      if(SingleTon.isShowTab) {
        SingleTon.isShowTab.setState({
            isBadge: true,
            badgeNumber: notification._ios._badge,
        });
      }

      Alert.alert(
        notify_title,
        notify_body,
        [
          {text: 'Ok', onPress: () => {
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

  componentDidMount() {

    setTimeout(function(){
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }.bind(this), 500);

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);

    this.notificationListener();
    this.notificationOpenedListener();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  reloadApp() {
    // this.setState({isConnected: true});
    this.componentDidMount();
  }

  render() {
    if(this.state.isloading){
      return (
        <View style={styles.splashView} >
        <Text style={{color: '#fff', fontSize: 24, fontWeight: 'bold'}} >FOOD DELIVER</Text>
        <Modal
          animationType="fade"
          transparent={true}
          visible={!this.state.isConnected}>
          <View style={styles.networkModal}>
            <View style={styles.networkErrorView} >
              <Text style={{marginTop: 10, fontWeight: 'bold', fontSize: 16}} >Connection Failed</Text>
              <TouchableOpacity
                style={{
                  padding: 10,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  backgroundColor: '#0CA2E9',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 1,},
                  shadowOpacity: 0.5,
                  elevation: 3,}}
                  onPress={() => this.reloadApp()} ><Text style={{color: '#fff', fontSize: 15,fontWeight: 'bold'}} >Try Again</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      )
    }

    return (
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
  },
  networkModal: {
    flex:1,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(255,255,255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  networkErrorView: {
    width: 250,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.5,
    elevation: 3,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
});
