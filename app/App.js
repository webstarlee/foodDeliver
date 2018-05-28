import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager'
//
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
      isopenSidebar: false
    }
  }

  openSideBar() {
    this._drawer.open();
    this.setState({isopenSidebar: true})
  }

  render() {
    return (
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
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
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
    backgroundColor: '#F5FCFF',
    overflow: 'hidden',
  },
  containerOpen: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    overflow: 'visible',
    borderRadius: 10,
  },
});
