import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  SectionList,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationActions} from "react-navigation";
import NavigationService from "../components/NavigationService";
import Singleton from "../components/SingleTon";

export default class SideMenu extends Component {
  constructor() {
    super();
  }

  componentWillmount() {
    Singleton.isfooter.setState({isfooter: false});
  }

  onpressTabbar(){
    NavigationService.navigate("Info")
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.onpressTabbar()} ><Text style={{fontSize: 30}} >Side Menu</Text></TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});