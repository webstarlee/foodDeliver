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
import {BASE_API_URL, ITEM_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT}  from './StaticValues';

export default class SideMenu extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sideMenuContentContainer} >
          <View style={{position: 'relative', justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.backgroundBlurBehind}/>
            <View style={styles.backgroundBlur}/>
            <View style={{width: '100%',}}>
              <Image style={styles.sideMenuLogo} source={{uri: BASE_API_URL+'/storage/main_images/logo.png'}} />
              <View
                style={{
                  paddingVertical: 10,
                  paddingLeft: 20,
                  borderBottomColor: '#01917c',
                  borderBottomWidth: 1,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 1,},
                  shadowOpacity: 0.3,
                  shadowRadius: 1,}}>
                <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>User account</Text>
              </View>
              <View style={{paddingTop: 20, paddingHorizontal: 20, paddingBottom: 10}}>
                <TextInput placeholder='Email' underlineColorAndroid={'transparent'} placeholderTextColor='#6f6f6f' style={styles.sideMenuTextInput} />
                <TextInput placeholder='Password' secureTextEntry={true} underlineColorAndroid={'transparent'} placeholderTextColor='#6f6f6f' style={styles.sideMenuTextInput} />
                <TouchableOpacity style={styles.sidemenuLoginButton}><Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>LOGIN</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 20, paddingVertical: 5,}}><Text style={{color: '#fff'}}>>Register your account here.</Text></TouchableOpacity>
                <TouchableOpacity style={{paddingVertical: 5,}}><Text style={{color: '#fff'}}>>Foget your password?</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a9c86',
    position: 'relative',
  },
  sideMenuContentContainer: {
    width: SCREEN_WIDTH*0.7,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    padding: 10,
    flex: 1,
  },
  sideMenuLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    top: -110,
    left: 0,
  },
  backgroundBlurBehind: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#01917c',
  },
  backgroundBlur: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderColor: '#01917c',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    overflow: 'hidden',
  },
  sidemenuLoginButton: {
    backgroundColor: '#0aa0ff',
    padding: 10,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignItems: 'center'
  },
  sideMenuTextInput: {
    backgroundColor: '#fff',
    marginBottom: 10,
    fontSize: 17,
    paddingVertical: 13,
    paddingHorizontal: 10,
    color: '#3d3d3d',
    borderRadius: 2,
  },
});