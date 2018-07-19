import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from 'react-native';
import {
  BASE_API_URL,
  HEADER_EXPANDED_HEIGHT,
  HEADER_COLLAPSED_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT}  from '../components/StaticValues';
import SingleTon from "../components/SingleTon"
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Triangle from 'react-native-triangle';
import firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image';
import NavigationMain from "../components/NavigationMain";

export default class ForgetPass extends Component {
    constructor() {
        super();
        this.state = {
            scrollY: new Animated.Value(0),
            for_email: null,
            for_code: null,
            isSendMail: false,
            loginLoading: false,
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('loginEmail')
        .then((val) => {
            if(val != null) {
                this.setState({
                    lo_email: val,
                })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    goLogin (){
        NavigationMain.back();
    }

    handleSendEmail() {
        console.log(this.state.for_email);
        if(this.state.for_email === null) {
            Alert.alert(
                'Alert',
                'Please Input Email',
                [
                  {text: 'OK', onPress: () => {
                    console.log("delete");
                  }},
                ],
                { cancelable: false }
            );
        } else {
            this.setState({
                loginLoading: true,
            });

            var sendResetEmailUrl = BASE_API_URL+"/api/sendResetEmail";
            fetch(sendResetEmailUrl, { 
                method: 'POST', 
                headers: { 
                    Accept: 'application/json', 
                    'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify({ 
                    resetEmail: this.state.for_email,
                }), 
            }) 
            .then((response) => response.json()) 
            .then((responseJson) => {
                this.setState({
                    loginLoading: false,
                });
                console.log(responseJson);
                if(responseJson.result === "success") {
                    SingleTon.resetUser = responseJson.user_id;
                    SingleTon.resetCode = responseJson.confirmCode;
                    this.setState({
                        isSendMail: true,
                    });
                } else {
                    Alert.alert(
                        'Error',
                        responseJson.msg,
                        [
                          {text: 'OK', onPress: () => {
                            console.log("delete");
                          }},
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch((error) => { 
                console.error(error); 
            });
        }
    }

    handleCheckCode() {
        if(this.state.for_code === null) {
            Alert.alert(
                'Alert',
                'Please Input Code',
                [
                  {text: 'OK', onPress: () => {
                    console.log("delete");
                  }},
                ],
                { cancelable: false }
            );
        } else {
            if(this.state.for_code == SingleTon.resetCode) {
                NavigationMain.navigate("ResetPass");
            } else {
                Alert.alert(
                    'Alert',
                    "Code don't match",
                    [
                      {text: 'OK', onPress: () => {
                        console.log("delete");
                      }},
                    ],
                    { cancelable: false }
                );
            }
        }
    }

  render() {
    const headerColor = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    return (
      <View style={styles.container}>
        <View style={{
          ...ifIphoneX({
            height: 35,
          }, {
            height: 25,
          }),
          width: SCREEN_WIDTH
        }} />
        <Animated.View style={[styles.header, { height: HEADER_EXPANDED_HEIGHT }]}>
            <Animated.View style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                backgroundColor: '#fff',
                zIndex: 5,
                opacity: headerColor,}} />
            <View style={styles.headerImageView} >
                <FastImage
                    style={styles.headerImage}
                    source={{
                        uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.header_img,
                        headers:{ Authorization: 'backgroundImage' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover} />
                <FastImage
                    style={styles.headerLogoImg}
                    source={{
                        uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.logo_img,
                        headers:{ Authorization: 'backgroundImage' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain} />
            </View>
        </Animated.View>
        <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContainer}
            style={{overflow: 'visible',}}>
            <Triangle 
                style={styles.diagonal} 
                width={SCREEN_WIDTH} 
                height={50} 
                color={'#fff'} 
                direction={'down-left'} 
            />
            <View style={{width: '100%', backgroundColor: '#fff'}}>
                <View style={styles.loginInputContainer} >
                    <Text style={{textAlign: 'center', marginTop: 30, fontSize: 30,color: '#4AA0FA'}} >Forget Password</Text>
                    {this.state.isSendMail?
                        <View>
                            <TextInput
                                placeholder='Input 6 digit code'
                                placeholderTextColor='#969696'
                                underlineColorAndroid={'transparent'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={this.state.for_code}
                                keyboardType="number-pad"
                                onChangeText={(text) => this.setState({ for_code: text })}
                                style={[styles.loginInputBox, {marginTop: 50}]}
                                />
                            <TouchableOpacity
                                disabled={this.state.loginLoading}
                                onPress={() => this.handleCheckCode()}
                                style={[styles.loginBtn, {backgroundColor: this.state.loginLoading? '#a7a7a7': '#4AA0FA', marginTop: 50,}]} >
                                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 19}} >CONFIRM</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.handleSendEmail()} style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                                <Text style={{color: '#5e5e5e', fontSize: 16, marginTop: 3}} >Resend Email</Text>
                            </TouchableOpacity>
                        </View>
                    :
                        <View>
                            <TextInput
                                placeholder='EMAIL'
                                placeholderTextColor='#969696'
                                underlineColorAndroid={'transparent'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={this.state.for_email}
                                keyboardType="email-address"
                                onChangeText={(text) => this.setState({ for_email: text })}
                                style={[styles.loginInputBox, {marginTop: 50}]}
                                />
                            <TouchableOpacity
                                disabled={this.state.loginLoading}
                                onPress={() => this.handleSendEmail()}
                                style={[styles.loginBtn, {backgroundColor: this.state.loginLoading? '#a7a7a7': '#4AA0FA', marginTop: 50,}]} >
                                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 19}} >SEND EMAIL</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                <View style={{width: SCREEN_WIDTH, paddingTop: 30,alignItems: 'center', position: 'relative'}}>
                    <TouchableOpacity onPress={() => this.goLogin()} style={{flexDirection: 'row', justifyContent: 'center', marginTop: 30}}>
                        <Text style={{color: '#5e5e5e', fontSize: 16, marginTop: 3}} >Back To </Text>
                        <Text style={{color: '#4AA0FA', fontWeight: 'bold', fontSize: 19}} >LOGIN</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingTop: HEADER_EXPANDED_HEIGHT-40,
        width: SCREEN_WIDTH,
        elevation: 3,
        paddingBottom: 70,
    },
    header: {
        backgroundColor: '#fff',
        width: SCREEN_WIDTH,
        position: 'absolute',
        top: 0,
        left: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2,},
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    headerImageView: {
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
        zIndex: 3,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    headerLogoImg: {
        position: 'absolute',
        width: 160,
        height: 100,
        top: 20,
    },
    diagonal: {
        marginTop: -50,
    },
    loginInputContainer: {
        marginTop: 10,
        width: SCREEN_WIDTH,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
    },
    loginInputBox: {
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#999',
        fontSize: 18,
        color: '#5e5e5e',
    },
    loginBtn: {
        width: SCREEN_WIDTH-60,
        padding: 20,
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#fff',
        shadowColor: '#4AA0FA',
        shadowOffset: {width: 0, height: 1,},
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 3,
    },
});
