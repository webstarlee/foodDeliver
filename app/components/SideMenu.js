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
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BASE_API_URL, ITEM_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT}  from './StaticValues';
import Loaing from '../components/Loading';

export default class SideMenu extends Component {
  constructor() {
    super();
    this.state={
      isLogin: false,
      email: "",
      password: "",
      authToken: null,
      currentUser: [],
      isLoading: false,
    }
  }

  handleEmail = (text) => {
    this.setState({ email: text })
  }

  handlePassword = (text) => {
    this.setState({ password: text })
  }

  componentDidMount() {
    AsyncStorage.getItem('loginToken') 
    .then((val) => {
      if(val != null) {
        this.setState({authToken: val});
        const userCheckurl = BASE_API_URL+'/api/details';
        return fetch(userCheckurl,{
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer '+this.state.authToken
          }});
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.result == "success") {
        this.setState({currentUser: responseJson.user, isLogin: true});
      } else {
        this.handleLogout();
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  handleLogin() {
    if(this.state.email != "") {
      if(this.state.password != "") {
        this.setState({isLoading: true});
        const loginUrl = BASE_API_URL+"/api/login";

        fetch(loginUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if(responseJson.result == "success") {
              AsyncStorage.setItem("loginToken", responseJson.token);
              this.setState({
                authToken: responseJson.token,
                currentUser: responseJson.user,
                isLogin: true,
                isLoading: false,
                email: "",
                password: "",
              });
            } else if(responseJson.result == "error") {
              alert(responseJson.message);
            } else {
              alert('something went Wrong');
            }
            this.setState({
              isLoading: false,
            });
        })
        .catch((error) => {
          console.error(error);
        });
      } else {
        alert('Input Password');
      }
    } else {
      alert('Input Email');
    }
  }

  handleLogout() {
    AsyncStorage.removeItem('loginToken');
    this.setState({
      authToken: null,
      currentUser: [],
      isLogin: false
    });
  }

  renderLogin = () => {
    return (
      <View>
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
          <TextInput
            placeholder='Email'
            underlineColorAndroid={'transparent'}
            placeholderTextColor='#6f6f6f'
            style={styles.sideMenuTextInput}
            onChangeText={this.handleEmail}
            autoCapitalize="none" />
          <TextInput
            placeholder='Password'
            secureTextEntry={true}
            underlineColorAndroid={'transparent'}
            placeholderTextColor='#6f6f6f'
            style={styles.sideMenuTextInput}
            onChangeText={this.handlePassword}
            autoCapitalize="none" />
          <TouchableOpacity
            style={styles.sidemenuLoginButton}
            onPress={() => this.handleLogin()}>
            <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 20, paddingVertical: 5,}}><Text style={{color: '#fff'}}>>Register your account here.</Text></TouchableOpacity>
          <TouchableOpacity style={{paddingVertical: 5,}}><Text style={{color: '#fff'}}>>Foget your password?</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

  renderUser = () => {
    return (
      this.state.currentUser != null &&
      <View>
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
          <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>{this.state.currentUser.email}</Text>
        </View>
        <View style={{paddingTop: 20, paddingHorizontal: 20, paddingBottom: 10}}>
          <TouchableOpacity style={styles.sidemenuLogoutButton} onPress={() => this.handleLogout()}><Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>SIGN OUT</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

  renderLoading = () => {
    return (
      <View style={{flex: 1, position: 'absolute', top:0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex: 1,backgroundColor: '#000', position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, opacity: 0.5}}></View>
        <Loaing color={'#fff'} />
      </View>
    )
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
              {this.state.isLogin ? this.renderUser(): this.renderLogin()}
              {this.state.isLoading && this.renderLoading()}
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
  sidemenuLogoutButton: {
    backgroundColor: '#ff4a08',
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