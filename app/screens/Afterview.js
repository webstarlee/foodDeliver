import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT}  from '../components/StaticValues';

import ScalingDrawer from '../components/ScalingDrawer';
import TabBar from '../components/Tabbar';
import HomeStack from '../components/Router';
import SideMenu from '../components/SideMenu';
import NavigationService from "../components/NavigationService";
import SingleTon from "../components/SingleTon";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isopenSidebar: false,
      isloading: true,
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
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
