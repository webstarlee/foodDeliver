import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import firebase from 'react-native-firebase';
import {
  BASE_API_URL,
  HEADER_EXPANDED_HEIGHT,
  HEADER_COLLAPSED_HEIGHT,
  ITEM_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT}  from './components/StaticValues';
import Loaing from './components/Loading';
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

import ScalingDrawer from './components/ScalingDrawer';
import TabBar from './components/Tabbar';
import HomeStack from './components/Router';
import SideMenu from './components/SideMenu';
import NavigationService from "./components/NavigationService";
import SingleTon from "./components/SingleTon";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isopenSidebar: false,
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

    // notification badge reset
    firebaseNotifications.setBadge(0)
    .then(() => {
    })
    .catch((error) => {
    })

    fetch(restaurantInfourl)
    .then((response) => response.json())
    .then((responseJson) => {
      SingleTon.restaurantInfo = responseJson.data;
      console.log(SingleTon.restaurantInfo);
      this.setState({isloading: false});
    })
    .catch((error) => {
      console.log(error);
    });
  }

  openSideBar() {
    this._drawer.open();
    this.setState({isopenSidebar: true})
  }

  render() {
    return (
      this.state.isloading?
      <View style={{
        flex: 1,
        backgroundColor: '#fff',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
      }} ><Loaing color={'#000'}/></View>
      :
      <ScalingDrawer
        ref={ref => {
          this._drawer = ref
          SingleTon.sideMenu = ref
        }}
        style={{flex: 1}}
        content={<SideMenu />}
        swipeOffset={20}
        scalingFactor={0.78}
        minimizeFactor={0.6}
        onClose={() => this.setState({isopenSidebar: false})} >
        <View style={this.state.isopenSidebar? styles.containerOpen : styles.container}>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <HomeStack ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef)
          }}/>
          <TabBar onItemClick={this.openSideBar.bind(this)} />
        </View>
      </ScalingDrawer>
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
});
