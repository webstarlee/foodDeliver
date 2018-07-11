import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Math,
} from 'react-native';
import {
    BASE_API_URL,
    HEADER_EXPANDED_HEIGHT,
    HEADER_COLLAPSED_HEIGHT,
    SCREEN_WIDTH,
    SCREEN_HEIGHT
}  from '../components/StaticValues';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import SingleTon from "../components/SingleTon";
import NavigationMain from "../components/NavigationMain";
import Triangle from 'react-native-triangle';

export default class Welcome extends Component {
    constructor() {
        super();
    }

    login (){
        NavigationMain.navigate("Home");
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerImgContainer} >
                    <Image style={styles.headerImg} source={{uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.header_img}} />
                    <View style={styles.imageEffect} >
                        <Triangle
                            style={styles.diagonal}
                            width={2*SCREEN_WIDTH}
                            height={60}
                            color={'#fff'}
                            direction={'up'}
                        />
                        <View style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff', opacity: 0.2}} ></View>
                    </View>
                </View>
                <View style={{flex: 1,zIndex: 3,width: SCREEN_WIDTH,height: SCREEN_HEIGHT,}} >
                    <View style={styles.logoContainer}>
                        <Image style={styles.sideMenuLogo} source={{uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.logo_img}} />
                    </View>
                    <View style={styles.loginBtnContainer} >
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    sideMenuLogo: {
        width: 170,
        height: 100,
        resizeMode: 'contain',
    },
    logoContainer: {
        width: '100%',
        alignItems:'center',
        ...ifIphoneX({
            marginTop: 50,
        }, {
            marginTop: 40,
        }),
        paddingVertical: 20,
    },
    loginBtnContainer: {
        flex:1,
        marginTop: 30,
        width: '100%',
        paddingTop: 20,
        alignItems: 'center',
    },
    loginBtn: {
        width: '70%',
        backgroundColor: '#00e6c8',
        padding: 20,
        alignItems: 'center',
        borderRadius: 50,
    },
    signupBtn: {
        marginTop: 20,
        width: '70%',
        borderWidth: 2,
        borderColor: '#00e6c8',
        padding: 20,
        alignItems: 'center',
        borderRadius: 50,
    },
    headerImgContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH*4/5,
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        justifyContent: 'flex-start',
        zIndex: 1,
    },
    headerImg: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH*4/5,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageEffect: {
        position: 'absolute',
        top: 0,
        left:0,
        width: '100%',
        height: '100%',
        // backgroundColor: '#fff',
        // opacity: 0.4,
    },
    diagonal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    }
})