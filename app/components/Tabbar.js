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
        return(
            this.state.isShowTabbar == true &&
            <View style={styles.footerview}>
                <Animatable.View transition="left" style={this.state.selected == "home"? styles.menuSelectorHome: styles.menuSelectorInfo}></Animatable.View>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress = {this.toggleSidebar.bind(this)} style={this.state.sidemenu == true? styles.touchableSelected: styles.touchable}>
                        <View style={styles.itemcontainer}><Icon name="ios-menu-outline" style={styles.footericon} /></View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 25,width:0.5,backgroundColor: '#0aa0ff'}} />
                <View style={{flex: 1, position: 'relative'}}>
                    <View style={styles.homebehind}></View>
                    <TouchableOpacity onPress = {() => this.onpressTabbar("home")} style={this.state.selected == "home"? styles.touchableSelected: styles.touchable}>
                        <View style={styles.itemcontainerSelected}><Icon name="ios-home-outline" style={styles.footericon1} /></View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 25,width:0.5,backgroundColor: '#0aa0ff'}} />
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress = {() => this.onpressTabbar("info")} style={this.state.selected == "info"? styles.touchableSelected: styles.touchable}>
                        <View style={styles.itemcontainer}><Icon name="ios-information-circle-outline" style={styles.footericon} /></View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    footerview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        borderTopColor: '#48c8f7',
        borderTopWidth: 1,
        ...ifIphoneX({
            height: 65,
            paddingBottom: 15,
        }, {
            height: 50,
        }),
        position: 'relative',
        shadowColor: '#666',
        shadowOffset: {width: 0, height: -2,},
        shadowOpacity: 0.3,
        shadowRadius: 1,
        position: 'relative',
        borderBottomLeftRadius: 5,
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
      touchableSelected: {
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
});

module.export = Footerbar;
