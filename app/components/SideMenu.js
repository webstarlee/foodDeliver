import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {BASE_API_URL, ITEM_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT}  from './StaticValues';
import Loaing from './Loading';
import LinearGradient from 'react-native-linear-gradient';
import SingleTon from "./SingleTon";
import firebase from 'react-native-firebase';

export default class SideMenu extends Component {
  constructor() {
    super();
    this.state={
      isLogin: false,
      isLoginView: true,
      email: "",
      password: "",
      authToken: null,
      currentUser: [],
      isLoading: false,
      reg_name: "",
      reg_email: "",
      reg_pass: "",
      reg_c_pass: "",
    }
  }

  handleEmail = (text) => {
    this.setState({ email: text })
  }

  handlePassword = (text) => {
    this.setState({ password: text })
  }

  handleRegEmail = (text) => {
    this.setState({ reg_email: text })
  }

  handleRegName = (text) => {
    this.setState({ reg_name: text })
  }

  handleRegPass = (text) => {
    this.setState({ reg_pass: text })
  }

  handleRegCPass = (text) => {
    this.setState({ reg_c_pass: text })
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
    .then((response) => {
      if(response != null)
      {
        return response.json()
      } else {
        return {"result": 'error'};
      }
    })
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
    if(SingleTon.devicefcm == null) {
      firebase.messaging().getToken()
      .then((token) => {
        SingleTon.devicefcm = token;
      }).catch((error) => {
      });
    }

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
            device_fcm: SingleTon.devicefcm,
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

  handleRegister() {
    if(SingleTon.devicefcm == null) {
      firebase.messaging().getToken()
      .then((token) => {
        SingleTon.devicefcm = token;
      }).catch((error) => {
      });
    }

    if(this.state.reg_name != "" && this.state.reg_email != "" && this.state.reg_pass != "" && this.state.reg_c_pass != "") {
      if(this.state.reg_pass == this.state.reg_c_pass) {
        this.setState({isLoading: true});
        const registerUrl = BASE_API_URL+"/api/register";

        fetch(registerUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.state.reg_name,
            email: this.state.reg_email,
            password: this.state.reg_pass,
            c_password: this.state.reg_c_pass,
            device_fcm: SingleTon.devicefcm,
          }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
              isLoading: false,
            });
            if(responseJson.result == "success") {
              AsyncStorage.setItem("loginToken", responseJson.token);
              this.setState({
                authToken: responseJson.token,
                currentUser: responseJson.user,
                isLogin: true,
                isLoading: false,
                reg_name: "",
                reg_email: "",
                reg_pass: "",
                reg_c_pass: "",
              });
            } else if(responseJson.result == "error") {
              if(responseJson.message.email[0]){
                alert(responseJson.message.email[0]);
              } else {
                alert('something went Wrong');
              }
            } else {
              alert('something went Wrong');
            }
        })
        .catch((error) => {
          console.error(error);
        });
      } else {
        alert('Password Confirm not match');
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
      isLogin: false,
      isLoginView: true,
    });
  }

  changeToLoinView() {
    this.setState({isLoginView: true})
  }

  changeToRegisterView() {
    this.setState({isLoginView: false})
  }

  renderLogin = () => {
      return (
        this.state.isLoginView?
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
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address" />
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
            <TouchableOpacity onPress={() => this.changeToRegisterView()} style={{marginTop: 20, paddingVertical: 5,}}><Text style={{color: '#fff'}}>>Register your account here.</Text></TouchableOpacity>
            <TouchableOpacity style={{paddingVertical: 5,}}><Text style={{color: '#fff'}}>>Foget your password?</Text></TouchableOpacity>
          </View>
        </View>
        :
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
            <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>Register account</Text>
          </View>
          <View style={{paddingTop: 20, paddingHorizontal: 20, paddingBottom: 10}}>
            <TextInput
              placeholder='Name'
              underlineColorAndroid={'transparent'}
              placeholderTextColor='#6f6f6f'
              style={styles.sideMenuTextInput}
              onChangeText={this.handleRegName}
              autoCapitalize="none"
              autoCorrect={false} />
            <TextInput
              placeholder='Email'
              secureTextEntry={false}
              underlineColorAndroid={'transparent'}
              placeholderTextColor='#6f6f6f'
              style={styles.sideMenuTextInput}
              onChangeText={this.handleRegEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address" />
            <TextInput
              placeholder='Password'
              secureTextEntry={true}
              underlineColorAndroid={'transparent'}
              placeholderTextColor='#6f6f6f'
              style={styles.sideMenuTextInput}
              onChangeText={this.handleRegPass}
              autoCapitalize="none" />
            <TextInput
              placeholder='Confirm Password'
              secureTextEntry={true}
              underlineColorAndroid={'transparent'}
              placeholderTextColor='#6f6f6f'
              style={styles.sideMenuTextInput}
              onChangeText={this.handleRegCPass}
              autoCapitalize="none" />
            <TouchableOpacity
              style={styles.sidemenuLoginButton}
              onPress={() => this.handleRegister()}>
              <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>REGISTER</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.changeToLoinView()} style={{marginTop: 20, paddingVertical: 5,}}><Text style={{color: '#fff'}}>>Login your account here.</Text></TouchableOpacity>
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
      <LinearGradient colors={['#33a39f', '#146c69']} style={styles.container}>
        <View style={styles.sideMenuContentContainer} >
          <View style={{position: 'relative', justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.backgroundBlurBehind}/>
            <View style={styles.backgroundBlur}/>
            <View style={{width: '100%',}}>
              <Image style={styles.sideMenuLogo} source={{uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.logo_img}} />
              {this.state.isLogin ? this.renderUser(): this.renderLogin()}
              {this.state.isLoading && this.renderLoading()}
            </View>
          </View>
        </View >
      </LinearGradient>
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
    paddingTop: 50,
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
    elevation: 3,
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
    elevation: 3,
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
    elevation: 3,
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
