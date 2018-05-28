import React, { Component } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
const {width} = Dimensions.get('window');
import {NavigationActions} from "react-navigation";
import SingleTon from "../components/SingleTon";
import NavigationService from "./NavigationService";

export default class Footerbar extends Component{
    constructor(props) {
        super(props);
        this.state={
            selected: 'home',
            sidemenu: false,
            isShowTabbar: true,
        }
        SingleTon.isShowTab = this;
    }

    onpressTabbar(footer_id){
        if(footer_id != this.state.selected) {
            this.setState({ selected: footer_id});
            if(footer_id == "info"){
                NavigationService.navigate("Info")
            }else{
                NavigationService.back()
            }
        }
    }

    toggleSidebar() {
        this.props.onItemClick();
    }
    render() {
        const tabarabsoluteLeft = width/2-30;
        return(
            this.state.isShowTabbar == true &&
            <View style={styles.toptabbarContainer}>
                <TouchableOpacity
                    onPress = {() => this.onpressTabbar("home")}
                    style={{
                        position: 'absolute',
                        elevation: 10,
                        zIndex: 10,
                        ...ifIphoneX({
                            bottom: 16,
                        }, {
                            bottom: 4,
                        }),
                        left: tabarabsoluteLeft
                    }}>
                    <View style={styles.itemcontainerHomeButton}><Icon name="ios-home-outline" style={styles.footericon1} /></View>
                </TouchableOpacity>
                <Animatable.View transition="left" style={this.state.selected == "home"? styles.menuSelectorHome: styles.menuSelectorInfo}></Animatable.View>
                <View style={styles.footerview}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress = {this.toggleSidebar.bind(this)} style={styles.touchable}>
                            <View style={styles.itemcontainer}><Icon name="ios-menu-outline" style={styles.footericon} /></View>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 25,width:0.5,backgroundColor: '#0aa0ff'}} />
                    <View style={{flex: 1, position: 'relative'}}>
                        <View style={styles.homebehind}></View>
                        <TouchableOpacity onPress = {() => this.onpressTabbar("home")} style={styles.touchable}>

                        </TouchableOpacity>
                    </View>
                    <View style={{height: 25,width:0.5,backgroundColor: '#0aa0ff'}} />
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress = {() => this.onpressTabbar("info")} style={styles.touchable}>
                            <View style={styles.itemcontainer}><Icon name="ios-information-circle-outline" style={styles.footericon} /></View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    toptabbarContainer: {
        // backgroundColor: '#fff',
        ...ifIphoneX({
            height: 65,
        }, {
            height: 50,
        }),
    },
    footerview: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        position: 'absolute',
        // zIndex: 9,
        borderTopColor: '#0aa0ff',
        borderTopWidth: 1,
      },
      menuSelectorHome: {
        position: 'absolute',
        height: 4,
        width: width/3,
        top: -4,
        left: width/3,
        backgroundColor: '#0aa0ff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      },
      menuSelectorInfo: {
        position: 'absolute',
        height: 4,
        width: width/3,
        top: -4,
        left: width*2/3,
        backgroundColor: '#0aa0ff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      },
      touchable: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      homebehind: {
          width: 60,
          height: 60,
          backgroundColor: '#fff',
          position: 'absolute',
          top: -12,
          alignSelf: 'center',
          borderRadius: 100,
          shadowColor: '#666',
          shadowOffset: {width: 0, height: -2,},
          shadowOpacity: 0.3,
          shadowRadius: 3,
      },
      footericon: {
        fontSize: 30,
        color: '#0aa0ff',
        fontWeight: 'bold',
        shadowColor: '#0aa0ff',
        shadowRadius: 1,
        shadowOffset: {width: 0, height: 0,},
        shadowOpacity: 0.5,
      },
      footericon1: {
        fontSize: 35,
        color: '#0aa0ff',
        fontWeight: 'bold',
        shadowColor: '#0aa0ff',
        shadowRadius: 1,
        shadowOffset: {width: 0, height: 0,},
        shadowOpacity: 0.5,
      },
      itemcontainer: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        top: 0,
        borderRadius: 100,
      },
      itemcontainerSelected: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderColor: '#0aa0ff',
        borderWidth: 3,
        top: 0,
        borderRadius: 100,
        marginTop: -15,
        shadowColor: '#0aa0ff',
        shadowRadius: 1,
        shadowOffset: {width: 0, height: 0,},
        shadowOpacity: 0.5,
      },
      itemcontainerHomeButton: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderColor: '#0aa0ff',
        borderWidth: 3,
        top: 0,
        borderRadius: 100,
        shadowColor: '#0aa0ff',
        shadowRadius: 1,
        shadowOffset: {width: 0, height: 0,},
        shadowOpacity: 0.5,
      },
});

module.export = Footerbar;
