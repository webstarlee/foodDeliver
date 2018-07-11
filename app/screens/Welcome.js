import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {
    BASE_API_URL,
    HEADER_EXPANDED_HEIGHT,
    HEADER_COLLAPSED_HEIGHT,
    SCREEN_WIDTH,
    SCREEN_HEIGHT
}  from '../components/StaticValues';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
  } from 'react-native-indicators';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import SingleTon from "../components/SingleTon";
import NavigationMain from "../components/NavigationMain";

export default class Welcome extends Component {
    constructor() {
        super();
        this.state=({
            islogin: false,
            isloading: true,
        })
    }

    componentDidMount() {
        AsyncStorage.getItem('loginToken')
        .then((val) => {
            if(val != null) {
                const userCheckurl = BASE_API_URL+'/api/details';
                return fetch(userCheckurl,{
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer '+val
                    }
                });
            }
        })
        .then((response) => {
            if(response != null)
            {
                return response.json();
            } else {
                return {"result": 'null'};
            }
        })
        .then((responseJson) => {
            if(responseJson.result == "success") {
                SingleTon.currentUser = responseJson.user;
                this.setState({
                    islogin: true,
                    isloading: false,
                });
            } else {
                AsyncStorage.removeItem('loginToken');
                SingleTon.currentUser = null;
                this.setState({
                  isLogin: false,
                  isloading: false,
                });
            }
            setTimeout(function() {
                this.handleNext();
            }.bind(this), 3000);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    handleNext() {
        console.log("hello");
        if(this.state.isloading == false) {
            if(this.state.islogin) {
                NavigationMain.navigate('Home');
            } else {
                NavigationMain.navigate('Before');
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1,zIndex: 2, alignItems: 'center', justifyContent: 'center'}} >
                    <View style={{width: '100%', height: 70}}>
                        <SkypeIndicator count={5} size={50} color='#00e6c8' />
                    </View>
                    <Text style={{color: '#00e6c8', fontSize: 17,fontWeight: 'normal'}}>Loading Data ...</Text>
                </View>
                <View style={styles.backgroundImgContainer} >
                    <Image style={styles.backgroundImg} source={{uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.bg_img}} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    backgroundImgContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        position: 'absolute',
        bottom: 0,
        left: 0,
        overflow: 'visible',
        justifyContent: 'flex-end',
        zIndex: 1,
    },
    backgroundImg: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH*2/3,
        resizeMode: 'cover',
    },
})