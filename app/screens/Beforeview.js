import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
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

export default class Welcome extends Component {
    constructor() {
        super();
    }

    goLogin (){
        NavigationMain.navigate("Login");
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1,zIndex: 2,width: SCREEN_WIDTH,height: SCREEN_HEIGHT,}} >
                    <View style={styles.logoContainer}>
                        <Image style={styles.sideMenuLogo} source={{uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.logo_img}} />
                    </View>
                    <View style={{width: '100%', marginTop: 20,}} >
                        <Text style={styles.welcomeText} >Grocery shopping has never</Text>
                        <Text style={styles.welcomeText} >been this much fun.</Text>
                    </View>
                    <View style={styles.loginBtnContainer} >
                        <TouchableOpacity onPress={() => this.goLogin()} style={styles.loginBtn} ><Text style={{color: '#fff', fontWeight: 'bold', fontSize: 19}} >LOGIN</Text></TouchableOpacity>
                        <Text style={{marginTop: 40, fontSize: 16, color: '#666', fontWeight: 'bold'}} >Don't have an account?</Text>
                        <TouchableOpacity style={styles.signupBtn} ><Text style={{color: '#00e6c8', fontWeight: 'bold', fontSize: 19}} >SIGN UP</Text></TouchableOpacity>
                    </View>
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
    welcomeText: {
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 25,
        color: '#00e6c8',
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